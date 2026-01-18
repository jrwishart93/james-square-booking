import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import { getExistingVoteForUser, getQuestions, normalizeFlat, submitVote } from '../services/storageService';
import { auth, db } from '@/lib/firebase';
import { Question, Vote } from '../types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { ArrowRight, AlertCircle, CalendarClock, Check, ChevronDown, Info, Loader2 } from 'lucide-react';
import { getVoteStatus } from '@/lib/voteExpiry';
import { lightHaptic } from '@/lib/haptics';
import CountdownTimer from './CountdownTimer';

const deriveFirstName = (user: User | null): string => {
  if (!user) return '';
  const base = user.displayName?.trim() || user.email?.split('@')[0] || '';
  const first = base.split(/[\s._-]+/).find(Boolean) || '';
  return first ? first.charAt(0).toUpperCase() + first.slice(1) : '';
};

const formatVotingDate = (date: Date): string =>
  `${date.toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' })} (UK time)`;

const VotePage: React.FC = () => {
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
  const [isVotingInfoOpen, setIsVotingInfoOpen] = useState(false);

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
      const activeQuestions = questions.filter((q) => {
        const startsAt =
          q.startsAt instanceof Date
            ? q.startsAt
            : q.startsAt
              ? new Date(q.startsAt)
              : null;
        const expiresAt =
          q.expiresAt instanceof Date
            ? q.expiresAt
            : q.expiresAt
              ? new Date(q.expiresAt)
              : null;
        const status = getVoteStatus(nowDate, expiresAt, startsAt);
        return status.kind !== 'closed';
      });
      const nextQ = activeQuestions[0] ?? questions[0] ?? null;

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
  }, [navigate]);

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
        const vote = await getExistingVoteForUser(currentQuestion.id, currentUser?.uid);
        if (!isActive) return;
        setExistingVote(vote);
        setSelectedOptionId((prev) => prev ?? vote?.optionId ?? null);
      } catch (checkError) {
        if (!isActive) return;
        console.error('Failed to load existing vote', checkError);
        setDuplicateMessage('Please confirm your flat number before submitting your voting response.');
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

    const expiresAt =
      currentQuestion.expiresAt instanceof Date
        ? currentQuestion.expiresAt
        : currentQuestion.expiresAt
          ? new Date(currentQuestion.expiresAt)
          : null;
    const startsAt =
      currentQuestion.startsAt instanceof Date
        ? currentQuestion.startsAt
        : currentQuestion.startsAt
          ? new Date(currentQuestion.startsAt)
          : null;
    const voteStatus = getVoteStatus(new Date(), expiresAt, startsAt);
    if (!voteStatus.isOpen) {
      setError('Voting is not currently open.');
      return;
    }

    if (!currentUser) {
      setError('Please log in to take part in voting.');
      return;
    }

    if (!trimmedName) {
      setError("Please enter your name to take part in voting.");
      return;
    }
    if (!selectedOptionId) {
      setError("Please select an option.");
      return;
    }
    if (!normalizedFlat) {
      setError("Please enter your flat number to take part in voting.");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Submitting vote:', {
        questionId: currentQuestion.id,
        optionId: selectedOptionId,
        flat: normalizedFlat,
      });

      await submitVote(currentQuestion.id, selectedOptionId, trimmedName, normalizedFlat);
      lightHaptic();
      sessionStorage.setItem('ovh_username', trimmedName);
      sessionStorage.setItem('ovh_flat', normalizedFlat);
      await loadNextQuestion();
    } catch (err: unknown) {
      let message = 'Unable to submit your voting response right now. Please try again.';

      if (err instanceof FirebaseError) {
        if (err.code === 'permission-denied') {
          message = 'Please confirm your flat number before submitting your voting response.';
        } else {
          message = err.message;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }

      if (message.toLowerCase().includes('already voted')) {
        message = 'A voting response has already been recorded for this flat.';
        setDuplicateMessage(message);
      }

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const normalizedFlat = normalizeFlat(flat);
  const trimmedName = userName.trim();
  const expiresAtDate =
    currentQuestion?.expiresAt instanceof Date
      ? currentQuestion.expiresAt
      : currentQuestion?.expiresAt
        ? new Date(currentQuestion.expiresAt)
        : null;
  const startsAtDate =
    currentQuestion?.startsAt instanceof Date
      ? currentQuestion.startsAt
      : currentQuestion?.startsAt
        ? new Date(currentQuestion.startsAt)
        : null;
  const voteStatus = getVoteStatus(new Date(now), expiresAtDate, startsAtDate);
  const isScheduled = voteStatus.phase === 'scheduled';
  const isOpen = voteStatus.phase === 'open';
  const isClosed = voteStatus.phase === 'closed';
  const votingWindowVisible = Boolean(startsAtDate || expiresAtDate);
  const formattedStartsAt = startsAtDate ? formatVotingDate(startsAtDate) : null;
  const formattedExpiresAt = expiresAtDate ? formatVotingDate(expiresAtDate) : null;
  const countdownTarget = isScheduled ? startsAtDate : isOpen ? expiresAtDate : null;
  const countdownLabel = isScheduled ? 'Voting opens in' : isOpen ? 'Voting closes in' : null;
  const countdownHelperText = isOpen ? 'Voting will close automatically at the scheduled time.' : null;
  const canSubmit = Boolean(
    selectedOptionId &&
    trimmedName &&
    normalizedFlat &&
    normalizedFlat.length > 0 &&
    currentUser &&
    !isSubmitting &&
    !isCheckingExistingVote &&
    isOpen,
  );
  const isVotingLocked = isScheduled || isClosed;
  const hasExistingVote = Boolean(existingVote);
  const hasChangedVote = hasExistingVote && selectedOptionId !== existingVote?.optionId;

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
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between mb-4">
            <div className="flex">
              <span
                className={`inline-flex px-3 py-1 text-xs font-bold tracking-wider uppercase rounded-full border shadow-[0_6px_20px_rgba(16,185,129,0.15)] ${
                  isClosed
                    ? 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-white/10 dark:text-white/80 dark:border-white/20'
                    : isScheduled
                      ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-100 dark:border-amber-300/60'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-100 dark:border-emerald-300/60'
                }`}
              >
                {isScheduled ? 'Scheduled' : isClosed ? 'Voting closed' : 'Voting open'}
              </span>
            </div>
            <h2
              className="
                text-xl
                md:text-2xl
                font-bold
                text-slate-900
                leading-snug
                line-clamp-2
                md:line-clamp-none
              "
            >
              {currentQuestion.title}
            </h2>
          </div>
          {votingWindowVisible && (
            <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                <CalendarClock size={14} className="text-slate-500" />
                Voting timeline
              </div>
              <div className="mt-2 space-y-1 text-sm text-slate-700">
                {isScheduled && (
                  <>
                    {formattedStartsAt && (
                      <div>
                        Voting opens <span className="font-semibold text-slate-800">{formattedStartsAt}</span>
                      </div>
                    )}
                    {formattedExpiresAt && (
                      <div>
                        Voting closes <span className="font-semibold text-slate-800">{formattedExpiresAt}</span>
                      </div>
                    )}
                  </>
                )}
                {isOpen && (
                  <>
                    <div className="font-semibold text-slate-800">Voting is open</div>
                    {formattedExpiresAt && (
                      <div>
                        Closes <span className="font-semibold text-slate-800">{formattedExpiresAt}</span>
                      </div>
                    )}
                  </>
                )}
                {isClosed && (
                  <>
                    {formattedExpiresAt && (
                      <div>
                        Voting closed <span className="font-semibold text-slate-800">{formattedExpiresAt}</span>
                      </div>
                    )}
                    <div>Results are now available below.</div>
                  </>
                )}
              </div>
            </div>
          )}
          {!isClosed && (
            <p className="mt-3 text-xs text-slate-600">
              Results will be available once voting has closed.
            </p>
          )}
          {currentQuestion.description && (
            <p className="text-slate-600 text-sm leading-relaxed mt-1">
              {currentQuestion.description}
            </p>
          )}
          {hasExistingVote && (
            <div className="mt-4 flex flex-col gap-2 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-2xl shadow-[0_6px_20px_rgba(16,185,129,0.12)]">
              <div className="inline-flex items-center gap-2">
                <Check size={14} />
                <span>You have already submitted a vote.</span>
              </div>
              <div className="text-emerald-900">
                Your selection: <span className="font-semibold">{currentQuestion.options.find(o => o.id === existingVote?.optionId)?.label ?? existingVote?.optionId}</span>
              </div>
              {isOpen && <span className="text-emerald-700 font-medium">You can change your selection while voting is open.</span>}
            </div>
          )}
        </div>

        {/* Voting Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="space-y-3">
            <button
              type="button"
              className="w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-left shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition hover:border-cyan-200 hover:bg-white"
              onClick={() => setIsVotingInfoOpen((prev) => !prev)}
              aria-expanded={isVotingInfoOpen}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-50 text-cyan-600">
                    <Info size={16} />
                  </span>
                  <span>How voting works</span>
                </div>
                <ChevronDown
                  size={18}
                  className={`text-slate-500 transition-transform duration-200 ${isVotingInfoOpen ? 'rotate-180' : 'rotate-0'}`}
                />
              </div>
            </button>
            <div
              className={`overflow-hidden rounded-2xl text-sm text-slate-700 transition-[max-height,opacity] duration-300 ease-out ${
                isVotingInfoOpen
                  ? 'max-h-96 opacity-100 border border-cyan-100/70 bg-gradient-to-br from-cyan-50/70 via-white to-indigo-50/60 px-4 py-4 shadow-[0_10px_30px_rgba(14,116,144,0.08)]'
                  : 'max-h-0 opacity-0 border border-transparent bg-transparent px-4 py-0 shadow-none'
              }`}
            >
              <div className={`${isVotingInfoOpen ? 'translate-y-0' : '-translate-y-1'} transition-transform duration-200`}>
                <h3 className="text-sm font-semibold text-slate-900">How voting works</h3>
                <ul className="mt-3 space-y-2 text-slate-700">
                  <li>• Each property (flat) can cast one vote per question</li>
                  <li>• If more than one person from the same flat is registered, the flat still counts as a single vote</li>
                  <li>• While voting is open, you may change your selection</li>
                  <li>• The most recent choice before voting closes is the one that counts</li>
                  <li>• Once voting closes, no further changes can be made</li>
                  <li>• All votes are securely logged for audit purposes</li>
                </ul>
              </div>
            </div>
          </div>

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

          {isClosed ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center text-sm font-semibold text-slate-700">
              {hasExistingVote
                ? 'Voting is closed. Your recorded vote is shown above and can no longer be changed.'
                : 'Voting is closed. Votes can no longer be submitted.'}
            </div>
          ) : countdownTarget && countdownLabel ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 flex justify-center">
              <CountdownTimer
                expiresAt={countdownTarget}
                createdAt={isOpen ? startsAtDate ?? new Date(now) : new Date(now)}
                label={countdownLabel}
                helperText={countdownHelperText}
              />
            </div>
          ) : null}

          {/* Options */}
          <div className={`space-y-3 ${isScheduled ? 'opacity-60' : ''}`}>
            <label className="block text-sm font-semibold text-slate-800 ml-1">Select your choice:</label>
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              const isPrevSelection = existingVote?.optionId === option.id;
              const hoverStyles = isScheduled ? '' : 'hover:bg-slate-50 hover:border-cyan-100';
              const hoverText = isScheduled ? '' : 'group-hover:text-slate-900';
              const hoverRing = isScheduled ? '' : 'group-hover:border-cyan-400';
              return (
                <label
                  key={option.id}
                  className={`
                    relative flex items-center p-4 rounded-xl border transition-all duration-200 group
                    ${isScheduled ? 'cursor-not-allowed' : 'cursor-pointer'}
                    ${isSelected
                      ? 'border-cyan-400/70 bg-cyan-50 shadow-[0_15px_40px_rgba(6,182,212,0.18)]'
                      : `border-slate-200 bg-white ${hoverStyles}`
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="voteOption"
                    value={option.id}
                    checked={isSelected}
                    onChange={() => setSelectedOptionId(option.id)}
                    className="sr-only" 
                    disabled={isVotingLocked}
                  />
                  <div className={`
                    flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center mr-4 transition-colors
                    ${isSelected ? 'border-cyan-500 bg-cyan-500 text-white' : `border-slate-300 ${hoverRing}`}
                  `}>
                    {isSelected && <Check size={12} className="text-white" />}
                  </div>
                  <span className={`font-medium text-sm ${isSelected ? 'text-slate-900' : `text-slate-700 ${hoverText}`}`}>
                    {option.label}
                  </span>
                  {isPrevSelection && (
                    <span className="ml-auto text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
                      Selected
                    </span>
                  )}
                </label>
              );
            })}
          </div>

          {hasExistingVote && hasChangedVote && isOpen && (
            <div className="flex items-center gap-3 text-sm text-amber-700 bg-amber-50 p-4 rounded-xl border border-amber-200">
              <AlertCircle size={18} className="shrink-0" />
              You are changing your vote. This will update the live results.
            </div>
          )}

          {displayMessage && (
            <div className="flex items-center gap-3 text-red-700 text-sm bg-red-50 p-4 rounded-xl border border-red-200">
              <AlertCircle size={18} className="shrink-0" />
              {displayMessage}
            </div>
          )}
          {isClosed ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center space-y-4">
              <div>
                <p className="text-lg font-semibold text-slate-900">Voting is now closed</p>
                <p className="text-sm text-slate-600">Thank you for taking part.</p>
              </div>
              <Button
                type="button"
                fullWidth
                onClick={() => navigate('/results')}
              >
                View results <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          ) : (
            <Button
              type="submit"
              fullWidth
              isLoading={isSubmitting}
              disabled={!canSubmit}
            >
              {hasExistingVote && isOpen ? 'Update vote' : 'Submit vote'} <ArrowRight size={16} className="ml-2" />
            </Button>
          )}
        </form>
      </div>

      <div className="text-center mt-8">
        <button
          onClick={() => navigate('/results')}
          className="text-sm text-slate-600 hover:text-cyan-700 transition-colors underline decoration-slate-300 underline-offset-4"
        >
          View results
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
