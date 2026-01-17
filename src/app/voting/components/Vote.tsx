import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDoc, onSnapshot, query, where } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import { getExistingVoteForUser, getQuestions, normalizeFlat, submitVote } from '../services/storageService';
import { auth, db } from '@/lib/firebase';
import { Question, Vote, VotingAudience } from '../types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { ArrowRight, AlertCircle, BarChart3, CalendarCheck2, CalendarClock, Check, Clock, Loader2 } from 'lucide-react';
import { getVoteStatus } from '@/lib/voteExpiry';
import { lightHaptic } from '@/lib/haptics';

const deriveFirstName = (user: User | null): string => {
  if (!user) return '';
  const base = user.displayName?.trim() || user.email?.split('@')[0] || '';
  const first = base.split(/[\s._-]+/).find(Boolean) || '';
  return first ? first.charAt(0).toUpperCase() + first.slice(1) : '';
};

type VotePageProps = {
  audienceFilter?: VotingAudience;
};

const VotePage: React.FC<VotePageProps> = ({ audienceFilter }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Form State
  const [userName, setUserName] = useState('');
  const [flat, setFlat] = useState('');
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingExistingVote, setIsCheckingExistingVote] = useState(false);
  const [existingVote, setExistingVote] = useState<Vote | null>(null);
  const [duplicateMessage, setDuplicateMessage] = useState<string | null>(null);
  const [now, setNow] = useState<number>(() => Date.now());
  const [liveTotals, setLiveTotals] = useState<Record<string, number>>({});
  const [liveTotalVotes, setLiveTotalVotes] = useState(0);
  const [isLoadingResults, setIsLoadingResults] = useState(false);

  // Load username from session storage if available (UX convenience)
  useEffect(() => {
    const storedName = sessionStorage.getItem('ovh_username');
    if (storedName) setUserName(storedName);
    const storedFlat = sessionStorage.getItem('ovh_flat');
    if (storedFlat) setFlat(normalizeFlat(storedFlat));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const toDate = useCallback((value?: Date | string | number | null) => {
    if (!value) return null;
    if (value instanceof Date) return value;
    return new Date(value);
  }, []);

  // Keep auth state in sync and prefill the name from the signed-in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setCurrentUser(firebaseUser);
      if (firebaseUser) {
        const defaultName = deriveFirstName(firebaseUser);
        if (defaultName) {
          setUserName(defaultName);
          sessionStorage.setItem('ovh_username', defaultName);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadPropertyNumber = async () => {
      if (!currentUser) return;
      try {
        const profileRef = doc(db, 'users', currentUser.uid);
        const profileSnap = await getDoc(profileRef);
        if (!profileSnap.exists()) return;
        const data = profileSnap.data() as Record<string, unknown>;
        const propertyNumber =
          typeof data.property === 'string'
            ? data.property
            : typeof data.flat === 'string'
              ? data.flat
              : '';
        if (propertyNumber) {
          const normalizedProperty = normalizeFlat(propertyNumber);
          setFlat(normalizedProperty);
          sessionStorage.setItem('ovh_flat', normalizedProperty);
        }
      } catch (profileError) {
        console.error('Failed to load property number for voting', profileError);
      }
    };

    void loadPropertyNumber();
  }, [currentUser]);

  const loadNextQuestion = useCallback(async () => {
    setIsLoading(true);
    try {
      const questions = await getQuestions();
      const nowDate = new Date();
      const getStatusForQuestion = (question: Question) => {
        const startsAt = toDate(question.startsAt);
        const expiresAt = toDate(question.expiresAt);
        return getVoteStatus(nowDate, startsAt, expiresAt);
      };
      const filtered = questions.filter((q) => {
        const audience = q.audience ?? 'residents';
        if (audienceFilter && audience !== audienceFilter) return false;
        if (q.status === 'closed') return false;
        const status = getStatusForQuestion(q);
        return status.phase !== 'closed';
      });
      const openQuestion = filtered.find((q) => getStatusForQuestion(q).phase === 'open');
      const scheduledQuestion = filtered.find((q) => getStatusForQuestion(q).phase === 'scheduled');
      const nextQ = openQuestion ?? scheduledQuestion ?? null;

      if (nextQ) {
        setCurrentQuestion(nextQ);
        setSelectedOptionId(null); // Reset selection
        setError(null);
        setExistingVote(null);
        setDuplicateMessage(null);
      } else {
        // No more questions to vote on
        navigate('/results');
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load questions.");
    } finally {
      setIsLoading(false);
    }
  }, [audienceFilter, navigate, toDate]);

  useEffect(() => {
    loadNextQuestion();
  }, [loadNextQuestion]);

  const handleNameBlur = () => {
    if (userName.trim()) {
      sessionStorage.setItem('ovh_username', userName.trim());
    }
  };

  const handleFlatBlur = () => {
    if (flat.trim()) {
      const normalized = normalizeFlat(flat);
      setFlat(normalized);
      sessionStorage.setItem('ovh_flat', normalized);
    }
  };

  useEffect(() => {
    if (!currentQuestion) return;

    if (!currentUser && !flat.trim()) {
      setExistingVote(null);
      setIsCheckingExistingVote(false);
      return;
    }

    let isActive = true;
    setIsCheckingExistingVote(true);
    setDuplicateMessage(null);

    const loadExisting = async () => {
      try {
        const vote = await getExistingVoteForUser(currentQuestion.id, currentUser?.uid, normalizeFlat(flat));
        if (!isActive) return;
        setExistingVote(vote);
        setSelectedOptionId((prev) => prev ?? vote?.optionId ?? null);
      } catch (checkError) {
        if (!isActive) return;
        console.error('Failed to load existing vote', checkError);
        setDuplicateMessage('Please confirm your flat number before submitting your vote.');
      } finally {
        if (isActive) setIsCheckingExistingVote(false);
      }
    };

    void loadExisting();

    return () => {
      isActive = false;
    };
  }, [currentQuestion, flat, currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuestion) return;

    const trimmedName = userName.trim();
    const normalizedFlat = normalizeFlat(flat);

    setError(null);

    const startsAt = toDate(currentQuestion.startsAt);
    const expiresAt = toDate(currentQuestion.expiresAt);
    const voteStatus = getVoteStatus(new Date(), startsAt, expiresAt);
    if (!voteStatus.isOpen || currentQuestion.status === 'closed') {
      setError(voteStatus.phase === 'scheduled' ? 'Voting has not yet opened.' : 'Voting is closed for this question.');
      return;
    }

    if (!currentUser) {
      setError('Please log in to vote.');
      return;
    }

    if (!trimmedName) {
      setError("Please enter your name to vote.");
      return;
    }
    if (!selectedOptionId) {
      setError("Please select an option.");
      return;
    }
    if (!normalizedFlat) {
      setError("Please enter your flat number to vote.");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Submitting vote:', {
        questionId: currentQuestion.id,
        optionId: selectedOptionId,
        flat: normalizedFlat,
      });

      await submitVote(currentQuestion.id, selectedOptionId, trimmedName, normalizedFlat, currentUser.uid);
      lightHaptic();
      sessionStorage.setItem('ovh_username', trimmedName);
      sessionStorage.setItem('ovh_flat', normalizedFlat);
      await loadNextQuestion();
    } catch (err: unknown) {
      let message = 'Unable to submit your vote right now. Please try again.';

      if (err instanceof FirebaseError) {
        if (err.code === 'permission-denied') {
          message = 'Please confirm your flat number before submitting your vote.';
        } else {
          message = err.message;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }

      if (message.toLowerCase().includes('already voted')) {
        message = 'This flat has already submitted a vote for this question.';
        setDuplicateMessage(message);
      }

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const normalizedFlat = normalizeFlat(flat);
  const trimmedName = userName.trim();
  const startsAtDate = toDate(currentQuestion?.startsAt);
  const expiresAtDate = toDate(currentQuestion?.expiresAt);
  const voteStatus = getVoteStatus(new Date(now), startsAtDate, expiresAtDate);
  const isScheduled = voteStatus.phase === 'scheduled';
  const canSubmit = Boolean(
    selectedOptionId &&
    trimmedName &&
    normalizedFlat &&
    normalizedFlat.length > 0 &&
    currentUser &&
    !isSubmitting &&
    !isCheckingExistingVote,
  ) && voteStatus.isOpen;
  const isClosed = voteStatus.phase === 'closed' || currentQuestion?.status === 'closed';
  const hasExistingVote = Boolean(existingVote);
  const hasChangedVote = hasExistingVote && selectedOptionId !== existingVote?.optionId;
  const canViewResults =
    voteStatus.phase === 'closed' ||
    (currentQuestion?.showLiveResults && Boolean(existingVote));
  const isFactorVote = currentQuestion?.specialType === 'factor_vote_2026';
  const showScheduledNotice =
    isScheduled && (isFactorVote || Boolean(currentQuestion?.startsAt));
  const showDocuments = isFactorVote || Boolean(currentQuestion?.documents);
  const documents = currentQuestion?.documents ?? {
    myreside: [
      { label: 'View proposal (PDF)', href: '/documents/factor-vote-2026/myreside-proposal.pdf' },
      { label: 'View cost summary (PDF)', href: '/documents/factor-vote-2026/myreside-costs.pdf' },
    ],
    newton: [
      { label: 'View proposal (PDF)', href: '/documents/factor-vote-2026/newton-proposal.pdf' },
      { label: 'View cost summary (PDF)', href: '/documents/factor-vote-2026/newton-costs.pdf' },
    ],
  };
  const myresideDocs = documents.myreside ?? [];
  const newtonDocs = documents.newton ?? [];
  const questionId = currentQuestion?.id ?? null;

  useEffect(() => {
    if (!questionId || !canViewResults) {
      setLiveTotals({});
      setLiveTotalVotes(0);
      setIsLoadingResults(false);
      return;
    }

    setIsLoadingResults(true);
    const votesQuery = query(
      collection(db, 'voting_votes'),
      where('questionId', '==', questionId),
    );
    const unsubscribe = onSnapshot(
      votesQuery,
      (snapshot) => {
        const counts = snapshot.docs.reduce<Record<string, number>>((acc, docSnap) => {
          const data = docSnap.data() as Record<string, unknown>;
          const optionId = typeof data.optionId === 'string' ? data.optionId : null;
          if (!optionId) return acc;
          acc[optionId] = (acc[optionId] ?? 0) + 1;
          return acc;
        }, {});
        const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
        setLiveTotals(counts);
        setLiveTotalVotes(total);
        setIsLoadingResults(false);
      },
      (snapshotError) => {
        console.error('Failed to load live results', snapshotError);
        setIsLoadingResults(false);
      },
    );

    return () => unsubscribe();
  }, [canViewResults, questionId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
      </div>
    );
  }

  if (!currentQuestion) {
    return null; // Redirect handled in useEffect
  }

  const displayMessage = error ?? duplicateMessage;
  const flatLocked = Boolean(selectedOptionId);

  return (
    <div className="max-w-xl mx-auto py-8 px-6">

          <div className="
        rounded-[32px]
        bg-white
        border border-slate-200
        overflow-hidden
        shadow-[0_24px_70px_rgba(15,23,42,0.14)]
      ">
        {/* Header */}
        <div className="p-8 border-b border-slate-200 bg-gradient-to-r from-cyan-50 to-indigo-50">
          <div className="flex justify-between items-start mb-4">
            <span
              className={`inline-flex px-3 py-1 text-xs font-bold tracking-wider uppercase rounded-full border shadow-[0_6px_20px_rgba(16,185,129,0.15)] ${
                voteStatus.phase === 'open'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-100 dark:border-emerald-300/60'
                  : voteStatus.phase === 'scheduled'
                    ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-100 dark:border-amber-300/60'
                    : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-white/10 dark:text-white/80 dark:border-white/20'
              }`}
            >
              {voteStatus.label}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2 leading-tight">
            {currentQuestion.title}
          </h2>
          {currentQuestion.description && (
            <p className="text-slate-600 text-sm leading-relaxed">
              {currentQuestion.description}
            </p>
          )}
          {isFactorVote && (
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <CalendarClock size={16} className="text-slate-500" />
                <span>Presentations: Wed 21 Jan 2026, 18:00–20:00</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-slate-500" />
                <span>Voting opens: Wed 21 Jan 2026, 20:00</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarCheck2 size={16} className="text-slate-500" />
                <span>Voting closes: Fri 23 Jan 2026, 17:00</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 size={16} className="text-slate-500" />
                <span>Live results available after you vote</span>
              </div>
            </div>
          )}
          {hasExistingVote && (
            <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-full shadow-[0_6px_20px_rgba(16,185,129,0.12)]">
              <Check size={14} />
              <span>
                You voted: <span className="text-emerald-900">{currentQuestion.options.find(o => o.id === existingVote?.optionId)?.label ?? existingVote?.optionId}</span>
              </span>
              {!isClosed && <span className="text-emerald-700 font-medium">• Change your answer anytime</span>}
            </div>
          )}
          {canViewResults && (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-3">
                <BarChart3 size={16} className="text-cyan-600" />
                Live results so far
              </div>
              {isLoadingResults ? (
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-500" />
                  Loading results...
                </div>
              ) : liveTotalVotes === 0 ? (
                <p className="text-sm text-slate-500">No votes recorded yet.</p>
              ) : (
                <div className="space-y-3">
                  {currentQuestion.options.map((option) => {
                    const count = liveTotals[option.id] ?? 0;
                    const percentage = liveTotalVotes > 0
                      ? Math.round((count / liveTotalVotes) * 100)
                      : 0;
                    return (
                      <div key={option.id} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-slate-600">
                          <span className="font-medium text-slate-700">{option.label}</span>
                          <span>{percentage}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden ring-1 ring-slate-200">
                          <div
                            className="h-full rounded-full transition-all duration-700 ease-out"
                            style={{
                              width: `${percentage}%`,
                              background: 'linear-gradient(90deg, #22d3ee 0%, #6366f1 100%)',
                            }}
                          />
                        </div>
                        <div className="text-[11px] text-slate-500 text-right">
                          {count} vote{count !== 1 ? 's' : ''}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Voting Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">

          {/* Identity Section */}
          <div className="bg-sky-50 p-5 rounded-2xl border border-sky-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none text-cyan-400">
              <VotePageIcon />
            </div>
            <Input
              label="Who is voting?"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onBlur={handleNameBlur}
              readOnly={Boolean(currentUser)}
              className="bg-white border-slate-200 focus:ring-cyan-500"
            />
            <div className="mt-4">
              <Input
                label="Flat number"
                placeholder="e.g. 3F2"
                value={flat}
                onChange={(e) => {
                  if (flatLocked) return;
                  const normalizedValue = normalizeFlat(e.target.value);
                  setFlat(normalizedValue);
                  setDuplicateMessage(null);
                  if (error) setError(null);
                }}
                onBlur={handleFlatBlur}
                readOnly={flatLocked}
                className="bg-white border-slate-200 focus:ring-cyan-500"
              />
            </div>
            {flatLocked && normalizedFlat && (
              <div className="flex items-center justify-between text-xs text-slate-600 mt-2 ml-1">
                <span>You are voting on behalf of Flat {normalizedFlat}.</span>
                <button
                  type="button"
                  className="text-cyan-700 font-semibold hover:underline"
                  onClick={() => {
                    setSelectedOptionId(null);
                    setDuplicateMessage(null);
                    setExistingVote(null);
                  }}
                >
                  Change flat
                </button>
              </div>
            )}
            <p className="text-xs text-slate-600 mt-2 ml-1">
              {currentUser
                ? 'Using your account name so each ballot is tied to your login.'
                : 'Your name and flat are stored so the committee can audit the ballots.'}
            </p>
          </div>

          {showScheduledNotice && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
              <p className="text-sm font-semibold">Voting has not yet opened</p>
              <p className="text-xs text-amber-800 mt-1">
                Voting will open at <span className="font-semibold">20:00 on Wednesday 21 January 2026</span>, once the
                factor presentations have concluded.
              </p>
            </div>
          )}

          {showDocuments && (
            <details className="rounded-2xl border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
              <summary className="cursor-pointer list-none px-5 py-4 text-sm font-semibold text-slate-800 flex items-center justify-between">
                <span>Review factor documents</span>
                <span className="text-xs text-slate-500">View PDFs</span>
              </summary>
              <div className="px-5 pb-5 pt-1 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
                  <p className="text-sm font-semibold text-slate-900 mb-3">Myreside</p>
                  <div className="flex flex-col gap-2">
                    {myresideDocs.map((doc) => (
                      <a
                        key={doc.href}
                        href={doc.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-full border border-cyan-200 bg-white px-4 py-2 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-50"
                      >
                        {doc.label}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
                  <p className="text-sm font-semibold text-slate-900 mb-3">Newton</p>
                  <div className="flex flex-col gap-2">
                    {newtonDocs.map((doc) => (
                      <a
                        key={doc.href}
                        href={doc.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-full border border-cyan-200 bg-white px-4 py-2 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-50"
                      >
                        {doc.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </details>
          )}

          {/* Options */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-800 ml-1">Select your choice:</label>
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              const isPrevSelection = existingVote?.optionId === option.id;
              const isDisabled = !voteStatus.isOpen;
              return (
                <label
                  key={option.id}
                  className={`
                    relative flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-200 group
                    ${isSelected
                      ? 'border-cyan-400/70 bg-cyan-50 shadow-[0_15px_40px_rgba(6,182,212,0.18)]'
                      : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-cyan-100'
                    }
                    ${isDisabled ? 'cursor-not-allowed opacity-70' : ''}
                  `}
                >
                  <input
                    type="radio"
                    name="voteOption"
                    value={option.id}
                    checked={isSelected}
                    onChange={() => setSelectedOptionId(option.id)}
                    className="sr-only" 
                    disabled={isDisabled}
                  />
                  <div className={`
                    flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center mr-4 transition-colors
                    ${isSelected ? 'border-cyan-500 bg-cyan-500 text-white' : 'border-slate-300 group-hover:border-cyan-400'}
                  `}>
                    {isSelected && <Check size={12} className="text-white" />}
                  </div>
                  <span className={`font-medium text-sm ${isSelected ? 'text-slate-900' : 'text-slate-700 group-hover:text-slate-900'}`}>
                    {option.label}
                  </span>
                  {isPrevSelection && (
                    <span className="ml-auto text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
                      You chose this
                    </span>
                  )}
                </label>
              );
            })}
          </div>

          {hasExistingVote && hasChangedVote && !isClosed && (
            <div className="flex items-center gap-3 text-sm text-amber-700 bg-amber-50 p-4 rounded-xl border border-amber-200">
              <AlertCircle size={18} className="shrink-0" />
              Your vote will be updated.
            </div>
          )}

          {displayMessage && (
            <div className="flex items-center gap-3 text-red-700 text-sm bg-red-50 p-4 rounded-xl border border-red-200">
              <AlertCircle size={18} className="shrink-0" />
              {displayMessage}
            </div>
          )}
          {isClosed && (
            <div className="flex items-center gap-3 text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200 dark:bg-white/10 dark:text-white/80 dark:border-white/15">
              <AlertCircle size={18} className="shrink-0 text-slate-500 dark:text-white/70" />
              {hasExistingVote
                ? 'Voting is closed for this question. Your recorded answer is shown above.'
                : 'Voting is closed for this question.'}
            </div>
          )}

          <Button
            type="submit"
            fullWidth
            isLoading={isSubmitting}
            disabled={!canSubmit}
          >
            {hasExistingVote ? 'Update Vote' : 'Submit Vote'} <ArrowRight size={16} className="ml-2" />
          </Button>
        </form>
      </div>

      <div className="text-center mt-8">
        <button
          onClick={() => navigate('/results')}
          className="text-sm text-slate-600 hover:text-cyan-700 transition-colors underline decoration-slate-300 underline-offset-4"
        >
          Skip to Results
        </button>
      </div>
    </div>
  );
};

const VotePageIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
  </svg>
);

export default VotePage;
