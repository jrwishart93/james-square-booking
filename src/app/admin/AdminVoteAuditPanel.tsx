'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

const UK_DATE_TIME = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

type VotingQuestion = {
  id: string;
  title: string;
  createdAt?: number | { toDate: () => Date };
  options: Array<{ id: string; label: string }>;
};

type VotingVote = {
  id: string;
  questionId: string;
  optionId: string;
  userName?: string;
  userEmail?: string;
  flat?: string;
  createdAt?: { toDate: () => Date } | number;
};

type AuditState =
  | { status: 'loading-auth' }
  | { status: 'no-access' }
  | { status: 'signed-out' }
  | { status: 'loading-data' }
  | { status: 'ready' }
  | { status: 'error'; message: string };

const getEpochValue = (value?: number | { toDate: () => Date }) => {
  if (!value) {
    return null;
  }
  if (typeof value === 'number') {
    return value;
  }
  if ('toDate' in value) {
    return value.toDate().getTime();
  }
  return null;
};

const formatTimestamp = (value?: { toDate: () => Date } | number) => {
  if (!value) {
    return '—';
  }
  if (typeof value === 'number') {
    return UK_DATE_TIME.format(new Date(value));
  }
  if ('toDate' in value) {
    return UK_DATE_TIME.format(value.toDate());
  }
  return '—';
};

const AdminVoteAuditPanel = () => {
  const [state, setState] = useState<AuditState>({ status: 'loading-auth' });
  const [questions, setQuestions] = useState<VotingQuestion[]>([]);
  const [votesByQuestion, setVotesByQuestion] = useState<
    Record<string, VotingVote[]>
  >({});
  const [expandedQuestions, setExpandedQuestions] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setState({ status: 'signed-out' });
      return;
    }

    const loadAdminState = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const isAdmin = Boolean(userDoc.data()?.isAdmin);
        if (!isAdmin) {
          setState({ status: 'no-access' });
          return;
        }
        setState({ status: 'loading-data' });
      } catch (error) {
        setState({
          status: 'error',
          message: error instanceof Error ? error.message : 'Unable to load user profile.',
        });
      }
    };

    void loadAdminState();
  }, []);

  useEffect(() => {
    if (state.status !== 'loading-data') {
      return;
    }

    const loadVotingAudit = async () => {
      try {
        const questionsSnapshot = await getDocs(
          collection(db, 'voting_questions')
        );
        const fetchedQuestions = questionsSnapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            title: data.title ?? 'Untitled question',
            createdAt: data.createdAt,
            options: Array.isArray(data.options) ? data.options : [],
          } as VotingQuestion;
        });

        fetchedQuestions.sort((a, b) => {
          const aValue = getEpochValue(a.createdAt) ?? 0;
          const bValue = getEpochValue(b.createdAt) ?? 0;
          return bValue - aValue;
        });

        const votesEntries = await Promise.all(
          fetchedQuestions.map(async (question) => {
            const votesQuery = query(
              collection(db, 'voting_votes'),
              where('questionId', '==', question.id)
            );
            const votesSnapshot = await getDocs(votesQuery);
            const votes = votesSnapshot.docs.map((voteSnap) => {
              const data = voteSnap.data();
              return {
                id: voteSnap.id,
                questionId: data.questionId ?? question.id,
                optionId: data.optionId ?? 'unknown',
                userName: data.userName,
                userEmail: data.userEmail,
                flat: data.flat,
                createdAt: data.createdAt,
              } as VotingVote;
            });
            return [question.id, votes] as const;
          })
        );

        setQuestions(fetchedQuestions);
        setVotesByQuestion(Object.fromEntries(votesEntries));
        setExpandedQuestions((prev) => {
          const next = { ...prev };
          fetchedQuestions.forEach((question) => {
            if (!(question.id in next)) {
              next[question.id] = false;
            }
          });
          return next;
        });
        setState({ status: 'ready' });
      } catch (error) {
        setState({
          status: 'error',
          message: error instanceof Error ? error.message : 'Unable to load voting data.',
        });
      }
    };

    void loadVotingAudit();
  }, [state.status]);

  const optionLabelMap = useMemo(() => {
    const map = new Map<string, Map<string, string>>();
    questions.forEach((question) => {
      const optionMap = new Map<string, string>();
      question.options?.forEach((option) => {
        if (option?.id) {
          optionMap.set(option.id, option.label ?? '—');
        }
      });
      map.set(question.id, optionMap);
    });
    return map;
  }, [questions]);

  const totalVotes = Object.values(votesByQuestion).reduce(
    (sum, votes) => sum + votes.length,
    0
  );

  if (state.status === 'signed-out' || state.status === 'no-access') {
    return (
      <div className="jqs-glass rounded-2xl p-4 text-sm opacity-80">
        You do not have access to voting audit data.
      </div>
    );
  }

  if (state.status === 'loading-auth' || state.status === 'loading-data') {
    return (
      <div className="jqs-glass rounded-2xl p-4 text-sm opacity-80">
        Loading voting audit...
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className="jqs-glass rounded-2xl p-4 text-sm text-red-600 dark:text-red-400">
        {state.message}
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="jqs-glass rounded-2xl p-4 text-sm opacity-80">
        No questions created yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <div>
          <h3 className="text-base font-semibold">Voting Audit</h3>
          <p className="text-xs opacity-75">
            Review who voted for each option and when.
          </p>
        </div>
        <div className="text-xs opacity-70">{totalVotes} total votes</div>
      </div>

      <div className="space-y-4 divide-y divide-white/10">
        {questions.map((question) => {
          const votes = votesByQuestion[question.id] ?? [];
          const isExpanded = expandedQuestions[question.id] ?? false;
          const optionMap = optionLabelMap.get(question.id);
          return (
            <div key={question.id} className="pt-4 first:pt-0">
              <button
                className="w-full flex flex-wrap items-start justify-between gap-3 text-left"
                onClick={() =>
                  setExpandedQuestions((prev) => ({
                    ...prev,
                    [question.id]: !isExpanded,
                  }))
                }
                aria-expanded={isExpanded}
              >
                <div>
                  <h4 className="text-base font-semibold">{question.title}</h4>
                  <p className="text-xs opacity-70">{votes.length} votes</p>
                </div>
                <span
                  className={`inline-block transition-transform ${
                    isExpanded ? 'rotate-180' : 'rotate-0'
                  }`}
                  aria-hidden
                >
                  ▾
                </span>
              </button>

              {isExpanded && (
                <div className="mt-4 space-y-3 text-sm">
                  {votes.length === 0 ? (
                    <div className="text-xs opacity-70">No votes recorded yet.</div>
                  ) : (
                    <div className="space-y-2">
                      {votes.map((vote) => (
                        <div
                          key={vote.id}
                          className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-900 dark:bg-white/5 dark:text-slate-100"
                        >
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2 text-sm">
                                <span className="font-medium">
                                  {vote.userName ?? '—'}
                                </span>
                                <span className="text-slate-500 dark:text-slate-400">
                                  {vote.flat ?? '—'}
                                </span>
                              </div>
                              <div className="text-sm">
                                {optionMap?.get(vote.optionId) ?? '—'}
                              </div>
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {formatTimestamp(vote.createdAt)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminVoteAuditPanel;
