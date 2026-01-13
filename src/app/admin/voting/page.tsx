'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Filter, Loader2, ShieldCheck, Table } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';

import { Button } from '@/app/voting/components/ui/Button';
import { getQuestions } from '@/app/voting/services/storageService';
import type { Question } from '@/app/voting/types';
import { useAuth } from '@/context/AuthContext';
import { useAdminVotes } from '@/hooks/useAdminVotes';
import { db } from '@/lib/firebase';

type SortKey = 'createdAt' | 'flat' | 'option';

const formatDateTime = (value: number) =>
  new Date(value).toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export default function AdminVotingAuditPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [questionError, setQuestionError] = useState<string | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('');

  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [optionFilter, setOptionFilter] = useState<string>('all');

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace('/');
      setCheckingAdmin(false);
      return;
    }

    let isMounted = true;
    const verify = async () => {
      try {
        const [snap, tokenResult] = await Promise.all([getDoc(doc(db, 'users', user.uid)), user.getIdTokenResult(true)]);
        const hasClaim = Boolean(tokenResult.claims.admin || tokenResult.claims.isAdmin);
        const hasFlag = snap.exists() && snap.data().isAdmin === true;
        const allowed = hasClaim || hasFlag;
        if (isMounted) {
          setIsAdmin(allowed);
          if (!allowed) router.replace('/');
        }
      } catch (error) {
        console.error('Failed to verify admin role', error);
        if (isMounted) router.replace('/');
      } finally {
        if (isMounted) setCheckingAdmin(false);
      }
    };

    verify();
    return () => {
      isMounted = false;
    };
  }, [authLoading, router, user]);

  useEffect(() => {
    if (!isAdmin) return;

    let active = true;
    const loadQuestions = async () => {
      setLoadingQuestions(true);
      setQuestionError(null);
      try {
        const list = await getQuestions();
        if (!active) return;
        setQuestions(list);
        setSelectedQuestionId((current) => current || list[0]?.id || '');
      } catch (error) {
        console.error('Failed to load questions', error);
        if (active) setQuestionError('Unable to load voting questions.');
      } finally {
        if (active) setLoadingQuestions(false);
      }
    };

    loadQuestions();
    return () => {
      active = false;
    };
  }, [isAdmin]);

  const selectedQuestion = useMemo(
    () => questions.find((q) => q.id === selectedQuestionId) ?? null,
    [questions, selectedQuestionId],
  );

  const { votes, totalsByOption, loading: votesLoading, error: votesError } = useAdminVotes(
    selectedQuestionId,
  );

  useEffect(() => {
    setOptionFilter('all');
    setSortKey('createdAt');
    setSortDirection('desc');
  }, [selectedQuestionId]);

  const optionLabelMap = useMemo(() => {
    if (!selectedQuestion) return {};
    return selectedQuestion.options.reduce<Record<string, string>>((acc, opt) => {
      acc[opt.id] = opt.label;
      return acc;
    }, {});
  }, [selectedQuestion]);

  const totals = useMemo(() => {
    const baseTotals = { ...(selectedQuestion?.voteTotals ?? {}) };
    Object.entries(totalsByOption).forEach(([optionId, count]) => {
      baseTotals[optionId] = count;
    });
    return baseTotals;
  }, [selectedQuestion?.voteTotals, totalsByOption]);

  const totalVotes = useMemo(
    () => Object.values(totals).reduce((sum, count) => sum + count, 0),
    [totals],
  );

  const filteredVotes = useMemo(() => {
    const filtered = optionFilter === 'all' ? votes : votes.filter((v) => v.optionId === optionFilter);
    const withLabels = filtered.map((vote) => ({
      ...vote,
      optionLabel: optionLabelMap[vote.optionId] ?? vote.optionId,
    }));

    return withLabels.sort((a, b) => {
      if (sortKey === 'flat') {
        const result = a.flat.localeCompare(b.flat, undefined, { sensitivity: 'base' });
        return sortDirection === 'asc' ? result : -result;
      }
      if (sortKey === 'option') {
        const result = a.optionLabel.localeCompare(b.optionLabel, undefined, { sensitivity: 'base' });
        return sortDirection === 'asc' ? result : -result;
      }
      const result = (a.createdAt ?? 0) - (b.createdAt ?? 0);
      return sortDirection === 'asc' ? result : -result;
    });
  }, [optionFilter, optionLabelMap, sortDirection, sortKey, votes]);

  const handleExportCsv = () => {
    if (!selectedQuestion || filteredVotes.length === 0) return;

    const header = ['Voter name', 'Flat', 'Option', 'Cast at'];
    const rows = filteredVotes.map((vote) => [
      vote.userName,
      vote.flat,
      optionLabelMap[vote.optionId] ?? vote.optionId,
      formatDateTime(vote.createdAt),
    ]);

    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedQuestion.title.replace(/\s+/g, '-').toLowerCase()}-votes.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (checkingAdmin || authLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-cyan-600 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-700 font-semibold">
          Admin view – voting audit
        </p>
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-cyan-600" size={20} />
          <h1 className="text-3xl font-bold text-slate-900">Voting dashboard</h1>
        </div>
        <p className="text-slate-600">
          Review ballot totals and the full audit trail. Only administrators can access voter details.
        </p>
      </header>

      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Select a question</h2>
            <p className="text-sm text-slate-600">
              Switch between open and closed polls to audit their ballots.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {loadingQuestions && <Loader2 className="w-4 h-4 animate-spin text-cyan-600" />}
            <select
              value={selectedQuestionId}
              onChange={(e) => setSelectedQuestionId(e.target.value)}
              className="border border-slate-300 rounded-xl px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-cyan-500"
            >
              {questions.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.title}
                </option>
              ))}
            </select>
          </div>
        </div>
        {questionError && <p className="text-sm text-red-600">{questionError}</p>}
        {!loadingQuestions && questions.length === 0 && (
          <p className="text-sm text-slate-600">No voting questions available yet.</p>
        )}
      </section>

      {selectedQuestion && (
        <>
          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <BarDividerIcon />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-600 font-semibold">Results summary</p>
                <h3 className="text-lg font-semibold text-slate-900">{selectedQuestion.title}</h3>
              </div>
            </div>

            <div className="space-y-3">
              {selectedQuestion.options.map((opt) => {
                const count = totals[opt.id] ?? 0;
                const percentage = totalVotes === 0 ? 0 : Math.round((count / Math.max(totalVotes, 1)) * 100);
                return (
                  <div key={opt.id} className="space-y-2">
                    <div className="flex justify-between text-sm text-slate-700">
                      <span className="font-medium">{opt.label}</span>
                      <span className="font-semibold text-slate-900">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-sm text-slate-600 font-medium">
              Total ballots recorded: <span className="text-slate-900">{totalVotes}</span>
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <Table className="text-cyan-600" size={18} />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-600 font-semibold">
                    Voting audit table
                  </p>
                  <h3 className="text-lg font-semibold text-slate-900">Ballots for this question</h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 text-sm">
                  <Filter size={14} className="text-slate-500" />
                  <select
                    value={optionFilter}
                    onChange={(e) => setOptionFilter(e.target.value)}
                    className="bg-transparent focus:outline-none"
                  >
                    <option value="all">All options</option>
                    {selectedQuestion.options.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (sortKey === 'createdAt') {
                      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
                    } else {
                      setSortKey('createdAt');
                      setSortDirection('desc');
                    }
                  }}
                  className="flex items-center gap-2"
                  title="Toggle date sort"
                >
                  Sort by date ({sortDirection === 'asc' ? 'oldest' : 'newest'})
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleExportCsv}
                  disabled={filteredVotes.length === 0}
                  className="flex items-center gap-2"
                >
                  <Download size={16} />
                  Export CSV
                </Button>
              </div>
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Voter</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">
                      <button
                        type="button"
                        className="flex items-center gap-1"
                        onClick={() => {
                          setSortKey('flat');
                          setSortDirection((prev) => (sortKey === 'flat' && prev === 'asc' ? 'desc' : 'asc'));
                        }}
                      >
                        Flat
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">
                      <button
                        type="button"
                        className="flex items-center gap-1"
                        onClick={() => {
                          setSortKey('option');
                          setSortDirection((prev) => (sortKey === 'option' && prev === 'asc' ? 'desc' : 'asc'));
                        }}
                      >
                        Option
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Cast at</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {votesLoading ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-slate-600">
                        <span className="inline-flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-cyan-600" /> Loading ballots…
                        </span>
                      </td>
                    </tr>
                  ) : votesError ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-red-600">
                        {votesError}
                      </td>
                    </tr>
                  ) : filteredVotes.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-slate-600">
                        No ballots recorded yet.
                      </td>
                    </tr>
                  ) : (
                    filteredVotes.map((vote) => (
                      <tr key={vote.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-900 font-medium">{vote.userName}</td>
                        <td className="px-4 py-3 text-slate-700">{vote.flat}</td>
                        <td className="px-4 py-3 text-slate-700">
                          {optionLabelMap[vote.optionId] ?? vote.optionId}
                        </td>
                        <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                          {formatDateTime(vote.createdAt)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-3">
              {votesLoading ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-600" /> Loading ballots…
                  </span>
                </div>
              ) : votesError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {votesError}
                </div>
              ) : filteredVotes.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  No ballots recorded yet.
                </div>
              ) : (
                filteredVotes.map((vote) => (
                  <div key={vote.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="font-semibold text-slate-900">{vote.userName}</div>
                      <div className="text-sm text-slate-600">Flat {vote.flat}</div>
                    </div>
                    <div className="mt-2 text-sm text-slate-700">
                      <span className="font-medium">Option:</span>{' '}
                      {optionLabelMap[vote.optionId] ?? vote.optionId}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      Cast at {formatDateTime(vote.createdAt)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

const BarDividerIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="6" height="16" rx="1.5" fill="#0891b2" opacity="0.9" />
    <rect x="14" y="8" width="6" height="12" rx="1.5" fill="#6366f1" opacity="0.9" />
  </svg>
);
