'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

import { db } from '@/lib/firebase';

type AdminVotingOverviewProps = {
  legacyOverview?: unknown;
  legacyLoading?: boolean;
  legacyError?: string | null;
};

type OverviewOption = {
  id: string;
  label: string;
};

type OverviewQuestion = {
  id: string;
  title: string;
  status: 'open' | 'closed';
  createdAt: number;
  options: OverviewOption[];
};

type QuestionSummary = {
  id: string;
  title: string;
  status: 'open' | 'closed';
  createdAt: number;
  totalVotes: number;
  optionBreakdown: Array<{ id: string; label: string; count: number }>;
};

const formatDate = (value: number) =>
  new Date(value).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const normalizeOptions = (raw: unknown[], questionId: string): OverviewOption[] => {
  return raw
    .map((entry, index) => {
      if (typeof entry === 'string') {
        return { id: entry, label: entry };
      }
      if (entry && typeof entry === 'object') {
        const value = entry as { id?: unknown; label?: unknown; title?: unknown; value?: unknown };
        const id =
          typeof value.id === 'string'
            ? value.id
            : typeof value.value === 'string'
              ? value.value
              : `${questionId}-${index}`;
        const label =
          typeof value.label === 'string'
            ? value.label
            : typeof value.title === 'string'
              ? value.title
              : id;
        return { id, label };
      }
      return null;
    })
    .filter(Boolean) as OverviewOption[];
};

const parseCreatedAt = (value: unknown): number => {
  if (typeof value === 'number') return value;
  if (value && typeof value === 'object') {
    const maybeTimestamp = value as { toMillis?: () => number };
    const millis = maybeTimestamp.toMillis?.();
    if (typeof millis === 'number') return millis;
  }
  return Date.now();
};

export default function AdminVotingOverview(_props: AdminVotingOverviewProps) {
  const [questions, setQuestions] = useState<OverviewQuestion[]>([]);
  const [voteCounts, setVoteCounts] = useState<Record<string, Record<string, number>>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadOverview = async () => {
      setLoading(true);
      setError(null);
      try {
        const [questionSnap, voteSnap] = await Promise.all([
          getDocs(query(collection(db, 'voting_questions'), orderBy('createdAt', 'desc'))),
          getDocs(collection(db, 'voting_votes')),
        ]);

        const parsedQuestions = questionSnap.docs.map((docSnap) => {
          const data = docSnap.data();
          const title = typeof data.title === 'string' ? data.title : 'Untitled question';
          const status =
            typeof data.status === 'string' && data.status.toLowerCase() === 'open'
              ? 'open'
              : 'closed';
          const createdAt = parseCreatedAt(data.createdAt);
          const optionsRaw = Array.isArray(data.options) ? data.options : [];
          const options = normalizeOptions(optionsRaw, docSnap.id);

          return {
            id: docSnap.id,
            title,
            status,
            createdAt,
            options,
          } satisfies OverviewQuestion;
        });

        const counts: Record<string, Record<string, number>> = {};
        voteSnap.docs.forEach((voteDoc) => {
          const data = voteDoc.data() as { questionId?: unknown; optionId?: unknown };
          const questionId = typeof data.questionId === 'string' ? data.questionId : null;
          const optionId = typeof data.optionId === 'string' ? data.optionId : null;
          if (!questionId || !optionId) return;
          counts[questionId] = counts[questionId] ?? {};
          counts[questionId][optionId] = (counts[questionId][optionId] ?? 0) + 1;
        });

        if (!active) return;
        setQuestions(parsedQuestions);
        setVoteCounts(counts);
      } catch (err) {
        console.error('Failed to load voting overview', err);
        if (active) setError('Unable to load voting overview.');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadOverview();
    return () => {
      active = false;
    };
  }, []);

  const summaries = useMemo<QuestionSummary[]>(() => {
    return questions.map((question) => {
      const optionVotes = voteCounts[question.id] ?? {};
      const optionBreakdown = question.options.map((option) => ({
        id: option.id,
        label: option.label,
        count: optionVotes[option.id] ?? 0,
      }));
      const totalVotes = optionBreakdown.reduce((sum, option) => sum + option.count, 0);
      return {
        id: question.id,
        title: question.title,
        status: question.status,
        createdAt: question.createdAt,
        totalVotes,
        optionBreakdown,
      };
    });
  }, [questions, voteCounts]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold">Voting summary</h3>
          <p className="text-xs opacity-75">Totals shown are aggregated across all ballots.</p>
        </div>
        <Link href="/admin/voting" className="text-xs font-semibold text-indigo-600 hover:underline">
          Open detailed audit →
        </Link>
      </div>

      {loading ? (
        <div className="text-sm opacity-80">Loading voting overview...</div>
      ) : error ? (
        <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
      ) : summaries.length === 0 ? (
        <div className="text-sm opacity-80">No questions created yet.</div>
      ) : (
        <div className="space-y-3">
          {summaries.map((summary) => (
            <article
              key={summary.id}
              className="rounded-2xl bg-white/5 dark:bg-white/10 p-4 space-y-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-semibold">{summary.title}</h4>
                  <p className="text-xs opacity-70">Created {formatDate(summary.createdAt)}</p>
                </div>
                <span
                  className={`text-xs font-semibold uppercase tracking-wide ${
                    summary.status === 'open' ? 'text-emerald-400' : 'text-slate-400'
                  }`}
                >
                  {summary.status}
                </span>
              </div>
              <div className="text-sm font-semibold">{summary.totalVotes} votes</div>
              <div className="flex flex-wrap gap-2 text-xs">
                {summary.optionBreakdown.length === 0 ? (
                  <span className="opacity-70">No options available.</span>
                ) : (
                  summary.optionBreakdown.map((option) => (
                    <span
                      key={option.id}
                      className="rounded-full bg-black/10 dark:bg-white/10 px-3 py-1"
                    >
                      {option.label}: {option.count}
                    </span>
                  ))
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
