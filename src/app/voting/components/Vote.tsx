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
import { ArrowRight, AlertCircle, Check, Loader2 } from 'lucide-react';

const deriveFirstName = (user: User | null): string => {
  if (!user) return '';
  const base = user.displayName?.trim() || user.email?.split('@')[0] || '';
  const first = base.split(/[\s._-]+/).find(Boolean) || '';
  return first ? first.charAt(0).toUpperCase() + first.slice(1) : '';
};

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

  // Load username from session storage if available (UX convenience)
  useEffect(() => {
    const storedName = sessionStorage.getItem('ovh_username');
    if (storedName) setUserName(storedName);
    const storedFlat = sessionStorage.getItem('ovh_flat');
    if (storedFlat) setFlat(normalizeFlat(storedFlat));
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
      const openQuestions = questions.filter(q => q.status === 'open');
      const nextQ = openQuestions[0] ?? questions[0] ?? null;

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
  const canSubmit = Boolean(
    selectedOptionId &&
    trimmedName &&
    normalizedFlat &&
    normalizedFlat.length > 0 &&
    currentUser &&
    !isSubmitting &&
    !isCheckingExistingVote,
  );
  const isClosed = currentQuestion?.status !== 'open';
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
          <div className="flex justify-between items-start mb-4">
            <span className="inline-flex px-3 py-1 text-xs font-bold tracking-wider uppercase bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 shadow-[0_6px_20px_rgba(16,185,129,0.15)]">
              {isClosed ? 'Closed Poll' : 'Active Poll'}
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
          {hasExistingVote && (
            <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-full shadow-[0_6px_20px_rgba(16,185,129,0.12)]">
              <Check size={14} />
              <span>
                You voted: <span className="text-emerald-900">{currentQuestion.options.find(o => o.id === existingVote?.optionId)?.label ?? existingVote?.optionId}</span>
              </span>
              {!isClosed && <span className="text-emerald-700 font-medium">• Change your answer anytime</span>}
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

          {/* Options */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-800 ml-1">Select your choice:</label>
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              const isPrevSelection = existingVote?.optionId === option.id;
              return (
                <label
                  key={option.id}
                  className={`
                    relative flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-200 group
                    ${isSelected
                      ? 'border-cyan-400/70 bg-cyan-50 shadow-[0_15px_40px_rgba(6,182,212,0.18)]'
                      : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-cyan-100'
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
                    disabled={isClosed}
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
          {isClosed && hasExistingVote && (
            <div className="flex items-center gap-3 text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <AlertCircle size={18} className="shrink-0 text-slate-500" />
              Voting is closed for this question. Your recorded answer is shown above.
            </div>
          )}

          <Button
            type="submit"
            fullWidth
            isLoading={isSubmitting}
            disabled={!canSubmit || isClosed}
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
