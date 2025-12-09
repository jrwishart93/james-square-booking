import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuestions, getVotes, submitVote } from '../services/storageService';
import { Question } from '../types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { ArrowRight, AlertCircle, Check, Loader2 } from 'lucide-react';

const VotePage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  
  // Form State
  const [userName, setUserName] = useState('');
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load username from session storage if available (UX convenience)
  useEffect(() => {
    const storedName = sessionStorage.getItem('ovh_username');
    if (storedName) setUserName(storedName);
  }, []);

  const loadNextQuestion = useCallback(async () => {
    setIsLoading(true);
    try {
      const [questions, allVotes] = await Promise.all([
        getQuestions(),
        getVotes()
      ]);

      const openQuestions = questions.filter(q => q.status === 'open');
      
      let nextQ: Question | null = null;

      if (!userName) {
        if (openQuestions.length > 0) nextQ = openQuestions[0];
      } else {
        const userVotes = allVotes.filter(v => v.userName.toLowerCase() === userName.toLowerCase());
        const votedQuestionIds = new Set(userVotes.map(v => v.questionId));
        
        nextQ = openQuestions.find(q => !votedQuestionIds.has(q.id)) || null;
      }

      if (nextQ) {
        setCurrentQuestion(nextQ);
        setSelectedOptionId(null); // Reset selection
        setError(null);
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
  }, [userName, navigate]);

  useEffect(() => {
    loadNextQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const handleNameBlur = () => {
    if (userName.trim()) {
      sessionStorage.setItem('ovh_username', userName.trim());
      loadNextQuestion(); 
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuestion) return;

    setError(null);

    if (!userName.trim()) {
      setError("Please enter your name to vote.");
      return;
    }
    if (!selectedOptionId) {
      setError("Please select an option.");
      return;
    }

    setIsSubmitting(true);

    try {
      await submitVote(currentQuestion.id, selectedOptionId, userName.trim());
      sessionStorage.setItem('ovh_username', userName.trim());
      await loadNextQuestion();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred while submitting.";
      if (message.toLowerCase().includes('already voted')) {
        setError(message);
        setTimeout(() => loadNextQuestion(), 1500);
      } else {
        setError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (!currentQuestion) {
    return null; // Redirect handled in useEffect
  }

  return (
    <div className="max-w-xl mx-auto py-8 px-6">
      
      <div className="
        rounded-[32px] 
        bg-slate-900/40 
        border border-white/5 
        backdrop-blur-xl 
        overflow-hidden
        shadow-[0_20px_50px_rgba(0,0,0,0.3)]
      ">
        {/* Header */}
        <div className="p-8 border-b border-white/5 bg-white/5">
          <div className="flex justify-between items-start mb-4">
            <span className="inline-flex px-3 py-1 text-xs font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              Active Poll
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
            {currentQuestion.title}
          </h2>
          {currentQuestion.description && (
            <p className="text-slate-400 text-sm leading-relaxed">
              {currentQuestion.description}
            </p>
          )}
        </div>

        {/* Voting Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* Identity Section */}
          <div className="bg-indigo-500/10 p-5 rounded-2xl border border-indigo-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <VotePageIcon />
            </div>
            <Input
              label="Who is voting?"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onBlur={handleNameBlur}
              className="bg-slate-900/50 border-indigo-500/30 focus:ring-indigo-400/50"
            />
            <p className="text-xs text-indigo-300/60 mt-2 ml-1">
              Required to check for duplicate votes.
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-300 ml-1">Select your choice:</label>
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              return (
                <label 
                  key={option.id}
                  className={`
                    relative flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-200 group
                    ${isSelected 
                      ? 'border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.15)]' 
                      : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10'
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
                  />
                  <div className={`
                    flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center mr-4 transition-colors
                    ${isSelected ? 'border-cyan-400 bg-cyan-400' : 'border-slate-500 group-hover:border-slate-400'}
                  `}>
                    {isSelected && <Check size={12} className="text-slate-900" />}
                  </div>
                  <span className={`font-medium text-sm ${isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                    {option.label}
                  </span>
                </label>
              );
            })}
          </div>

          {error && (
            <div className="flex items-center gap-3 text-red-300 text-sm bg-red-500/10 p-4 rounded-xl border border-red-500/20">
              <AlertCircle size={18} className="shrink-0" />
              {error}
            </div>
          )}

          <Button type="submit" fullWidth isLoading={isSubmitting} disabled={!selectedOptionId || !userName}>
            Submit Vote <ArrowRight size={16} className="ml-2" />
          </Button>
        </form>
      </div>

      <div className="text-center mt-8">
        <button 
          onClick={() => navigate('/results')} 
          className="text-sm text-slate-500 hover:text-slate-300 transition-colors underline decoration-slate-700 underline-offset-4"
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
