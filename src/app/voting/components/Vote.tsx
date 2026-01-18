import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import { getExistingVoteForFlat, getExistingVoteForUser, getQuestions, normalizeFlat, submitVote } from '../services/storageService';
import { auth, db } from '@/lib/firebase';
import { Question, Vote } from '../types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { ArrowRight, AlertCircle, CalendarClock, Check, Info, Loader2, ShieldAlert } from 'lucide-react';
import { getVoteStatus } from '@/lib/voteExpiry';
import { lightHaptic } from '@/lib/haptics';
import CountdownTimer from './CountdownTimer';
import VotingInfoBox from './VotingInfoBox';

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
  const [notice, setNotice] = useState<{
    tone: 'success' | 'warning' | 'info' | 'error';
    title: string;
    message: string;
    details?: string;
  } | null>(null);
  const [isCheckingExistingVote, setIsCheckingExistingVote] = useState(false);
  const [existingVote, setExistingVote] = useState<Vote | null>(null);
  const [pendingVoteChange, setPendingVoteChange] = useState(false);
  const [now, setNow] = useState<number>(() => Date.now());

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
        setExistingVote(null);
        setPendingVoteChange(false);
      } else {
        // No more questions to vote on
        navigate('/results');
      }
    } catch (err) {
      console.error(err);
      setNotice({
        tone: 'error',
        title: 'Unable to load questions',
        message: 'We could not load the current vote. Please refresh and try again.',
      });
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

    const normalizedFlatValue = normalizeFlat(flat);

    if (!currentUser && !normalizedFlatValue) {
      setExistingVote(null);
      setIsCheckingExistingVote(false);
      return;
    }

    let isActive = true;
    setIsCheckingExistingVote(true);

    const loadExisting = async () => {
      try {
        if (normalizedFlatValue) {
          const vote = await getExistingVoteForFlat(currentQuestion.id, normalizedFlatValue);
          if (!isActive) return;
          const isUserVote = Boolean(vote && currentUser && vote.userId === currentUser.uid);
          setExistingVote(vote);
          if (isUserVote) {
            setSelectedOptionId((prev) => prev ?? vote?.optionId ?? null);
          } else {
            setSelectedOptionId(null);
          }
        } else if (currentUser) {
          const vote = await getExistingVoteForUser(currentQuestion.id, currentUser?.uid);
          if (!isActive) return;
          setExistingVote(vote);
          setSelectedOptionId((prev) => prev ?? vote?.optionId ?? null);
        } else {
          setExistingVote(null);
        }
      } catch (checkError) {
        if (!isActive) return;
        console.error('Failed to load existing vote', checkError);
        setNotice({
          tone: 'warning',
          title: 'Unable to confirm existing vote',
          message: 'Please confirm your flat number before submitting your voting response.',
        });
      } finally {
        if (isActive) setIsCheckingExistingVote(false);
      }
    };

    void loadExisting();

    return () => {
      isActive = false;
    };
  }, [currentQuestion, flat, currentUser]);

  const normalizedFlat = normalizeFlat(flat);
  const trimmedName = userName.trim();
  const userVote = existingVote && existingVote.userId === currentUser?.uid ? existingVote : null;
  const hasExistingVote = Boolean(userVote);
  const hasChangedVote = hasExistingVote && selectedOptionId !== userVote?.optionId;
  const flatVoteByOther = Boolean(
    existingVote &&
      existingVote.flat === normalizedFlat &&
      existingVote.userId !== currentUser?.uid,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuestion) return;

    setNotice(null);

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
      setNotice({
        tone: 'info',
        title: 'Voting is not currently open',
        message: 'Please check the scheduled voting window below.',
      });
      return;
    }

    if (!currentUser) {
      setNotice({
        tone: 'error',
        title: 'Login required',
        message: 'Please log in to take part in voting.',
      });
      return;
    }

    if (!trimmedName) {
      setNotice({
        tone: 'error',
        title: 'Name required',
        message: 'Please enter your name to take part in voting.',
      });
      return;
    }
    if (!selectedOptionId) {
      setNotice({
        tone: 'error',
        title: 'Selection required',
        message: 'Please select an option.',
      });
      return;
    }
    if (!normalizedFlat) {
      setNotice({
        tone: 'error',
        title: 'Flat number required',
        message: 'Please enter your flat number to take part in voting.',
      });
      return;
    }

    if (flatVoteByOther) {
      return;
    }

    if (userVote && !hasChangedVote) {
      setNotice({
        tone: 'info',
        title: 'ℹ️ Nothing to submit',
        message: `Your vote for Flat ${normalizedFlat} has already been recorded.`,
      });
      return;
    }

    if (userVote && hasChangedVote && !pendingVoteChange) {
      setPendingVoteChange(true);
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
      setPendingVoteChange(false);
      setNotice(
        userVote && hasChangedVote
          ? {
              tone: 'success',
              title: '🔁 Vote updated',
              message: `Your vote for Flat ${normalizedFlat} has been updated.`,
              details: 'This is now your recorded choice.',
            }
          : {
              tone: 'success',
              title: '✅ Vote recorded',
              message: `Your vote has been successfully recorded for Flat ${normalizedFlat}.`,
              details:
                'You can change your vote while voting is open. The most recent choice will be the one that counts.',
            },
      );
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
        if (!flatVoteByOther) {
          setNotice({
            tone: 'warning',
            title: '⚠️ Vote already recorded for this property',
            message: `A vote has already been submitted on behalf of Flat ${normalizedFlat}. Each property can cast one vote per question.`,
            details: 'If you believe this is a mistake, please contact the site administrator.',
          });
        }
      } else {
        setNotice({
          tone: 'error',
          title: 'Unable to submit vote',
          message,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
  const isVotingLocked = isScheduled || isClosed;
  const isConfirmingChange = pendingVoteChange && hasChangedVote && isOpen;
  const isOptionLocked = isVotingLocked || flatVoteByOther;
  const canConfirmUpdate = Boolean(
    selectedOptionId &&
    trimmedName &&
    normalizedFlat &&
    normalizedFlat.length > 0 &&
    currentUser &&
    !isSubmitting &&
    !isCheckingExistingVote &&
    !flatVoteByOther &&
    isOpen,
  );
  const canSubmit = canConfirmUpdate && !isConfirmingChange;

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

  const flatLocked = Boolean(selectedOptionId);
  const displayFlat = normalizedFlat || existingVote?.flat || 'your property';

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
                <span>🗳️ Vote already submitted</span>
              </div>
              <div className="text-emerald-900">
                You have already voted on behalf of Flat {displayFlat}.
              </div>
              <div className="text-emerald-900">
                Your current selection is highlighted below.
              </div>
              <div className="text-emerald-900">
                Recorded choice:{' '}
                <span className="font-semibold">
                  {currentQuestion.options.find((option) => option.id === userVote?.optionId)?.label ??
                    userVote?.optionId}
                </span>
              </div>
              {isOpen ? (
                <span className="text-emerald-700 font-medium">You may update your choice while voting is open.</span>
              ) : (
                <span className="text-emerald-700 font-medium">Voting has closed. Your recorded choice is shown below.</span>
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
                  if (notice) setNotice(null);
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
                    setExistingVote(null);
                    setPendingVoteChange(false);
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
          {flatVoteByOther && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <div className="flex items-center gap-2 font-semibold">
                <AlertCircle size={16} />
                ⚠️ Vote already recorded for this property
              </div>
              <div className="mt-2">
                A vote for this property has already been submitted by{' '}
                <em>{existingVote?.userName}</em>.
              </div>
              <div className="mt-1">Only one vote per property is permitted.</div>
              <div className="mt-1">
                Please discuss your choice with <em>{existingVote?.userName}</em>.
              </div>
            </div>
          )}

          {isScheduled && formattedStartsAt && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <div className="flex items-center gap-2 font-semibold">
                <CalendarClock size={16} />
                ⏳ Voting not open yet
              </div>
              <div className="mt-1">Voting will open on {formattedStartsAt}.</div>
            </div>
          )}
          {isClosed && (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
              <div className="flex items-center gap-2 font-semibold">
                <ShieldAlert size={16} />
                🔒 Voting closed
              </div>
              {formattedExpiresAt && <div className="mt-1">Voting closed on {formattedExpiresAt}.</div>}
              <div className="mt-1">
                {hasExistingVote
                  ? `Your recorded vote for Flat ${displayFlat} is shown above.`
                  : 'No vote was recorded for this property.'}
              </div>
            </div>
          )}
          {!isClosed && countdownTarget && countdownLabel ? (
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
          <div className={`space-y-3 ${isOptionLocked ? 'opacity-60' : ''}`}>
            <label className="block text-sm font-semibold text-slate-800 ml-1">Select your choice:</label>
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              const isPrevSelection = userVote?.optionId === option.id;
              const hoverStyles = isOptionLocked ? '' : 'hover:bg-slate-50 hover:border-cyan-100';
              const hoverText = isOptionLocked ? '' : 'group-hover:text-slate-900';
              const hoverRing = isOptionLocked ? '' : 'group-hover:border-cyan-400';
              return (
                <label
                  key={option.id}
                  className={`
                    relative flex items-center p-4 rounded-xl border transition-all duration-200 group
                    ${isOptionLocked ? 'cursor-not-allowed' : 'cursor-pointer'}
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
                    disabled={isOptionLocked}
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

          {isConfirmingChange && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900 space-y-3">
              <div className="flex items-center gap-2 font-semibold">
                <AlertCircle size={16} />
                Change your vote?
              </div>
              <p>
                You have already submitted a vote on behalf of Flat {displayFlat}. Changing your selection will replace your previous vote.
              </p>
              <p className="text-amber-800">
                Please only change your vote if you are sure. Once voting closes, no further changes can be made.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="secondary"
                  fullWidth
                  onClick={() => {
                    setSelectedOptionId(userVote?.optionId ?? null);
                    setPendingVoteChange(false);
                  }}
                >
                  Keep my existing vote
                </Button>
                <Button
                  type="submit"
                  fullWidth
                  disabled={!canConfirmUpdate}
                  isLoading={isSubmitting}
                >
                  Yes, update my vote
                </Button>
              </div>
            </div>
          )}

          {notice && (
            <div
              className={`flex items-start gap-3 text-sm p-4 rounded-xl border ${
                notice.tone === 'success'
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  : notice.tone === 'warning'
                    ? 'text-amber-800 bg-amber-50 border-amber-200'
                    : notice.tone === 'info'
                      ? 'text-sky-700 bg-sky-50 border-sky-200'
                      : 'text-red-700 bg-red-50 border-red-200'
              }`}
            >
              {notice.tone === 'success' ? (
                <Check size={18} className="shrink-0 mt-0.5" />
              ) : notice.tone === 'warning' ? (
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
              ) : notice.tone === 'info' ? (
                <Info size={18} className="shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-semibold">{notice.title}</div>
                <div>{notice.message}</div>
                {notice.details && <div className="mt-1 text-xs font-medium">{notice.details}</div>}
              </div>
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
      <div className="mt-10">
        <VotingInfoBox />
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
