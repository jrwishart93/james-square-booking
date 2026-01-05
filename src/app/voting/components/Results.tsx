import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { getQuestions } from '../services/storageService';
import { QuestionStats } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { getVoteStatus } from '@/lib/voteExpiry';
import CountdownTimer from './CountdownTimer';

const Results: React.FC = () => {
  const [stats, setStats] = useState<QuestionStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState<number>(() => Date.now());
  const [openDetailsId, setOpenDetailsId] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let unsubscribers: Array<() => void> = [];
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const questions = await getQuestions();
        if (!isMounted) return;

        if (questions.length === 0) {
          setStats([]);
          setLoading(false);
          return;
        }

        unsubscribers = questions.map((question) => {
          const votesQuery = query(
            collection(db, 'voting_votes'),
            where('questionId', '==', question.id),
          );

          return onSnapshot(
            votesQuery,
            (snapshot) => {
              console.log('Votes returned:', snapshot.docs.map((d) => d.data()));

              const counts = snapshot.docs.reduce<Record<string, number>>((acc, doc) => {
                const data = doc.data() as Record<string, unknown>;
                const optionId = typeof data.optionId === 'string' ? data.optionId : null;
                if (!optionId) return acc;
                acc[optionId] = (acc[optionId] ?? 0) + 1;
                return acc;
              }, {});

              const total = Object.values(counts).reduce((sum, count) => sum + count, 0);

              const results = question.options
                .map((opt) => {
                  const count = counts[opt.id] ?? 0;
                  return {
                    option: opt,
                    count,
                    percentage: total === 0 ? 0 : Math.round((count / Math.max(total, 1)) * 100),
                  };
                })
                .sort((a, b) => b.count - a.count);

              setStats((prev) => {
                const filtered = prev.filter((item) => item.question.id !== question.id);
                const next = [...filtered, { question, totalVotes: total, results }];
                next.sort((a, b) => b.question.createdAt - a.question.createdAt);
                return next;
              });
              setLoading(false);
            },
            (error) => {
              console.error(error);
              setLoading(false);
            },
          );
        });
      } catch (err) {
        console.error(err);
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      unsubscribers.forEach((unsub) => unsub());
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
      </div>
    );
  }

  const summaryData = stats.map(s => ({
    name: s.question.title.length > 15 ? s.question.title.substring(0, 15) + '...' : s.question.title,
    fullTitle: s.question.title,
    votes: s.totalVotes
  }));

  return (
    <div className="max-w-2xl mx-auto py-8 px-6 space-y-8">

      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Results & Insights</h1>
        <p className="text-slate-600">Real-time voting analytics.</p>
      </div>

      {/* Overview Chart */}
      {stats.length > 0 && stats.some(s => s.totalVotes > 0) && (
        <div className="
          p-6 rounded-3xl
          bg-white
          border border-slate-200
          shadow-[0_24px_70px_rgba(15,23,42,0.14)]
        ">
           <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Participation Overview</h3>
           <div className="h-48 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={summaryData}>
                 <XAxis 
                   dataKey="name" 
                   fontSize={11} 
                   tickLine={false} 
                   axisLine={false} 
                   stroke="#94a3b8"
                   interval={0}
                 />
                 <YAxis 
                   fontSize={11} 
                   tickLine={false} 
                   axisLine={false} 
                   allowDecimals={false} 
                   stroke="#64748b" 
                 />
                 <Tooltip
                   cursor={{fill: 'rgba(148,163,184,0.15)'}}
                   contentStyle={{
                     backgroundColor: '#ffffff',
                     borderRadius: '12px',
                     border: '1px solid #e2e8f0',
                     color: '#0f172a',
                     boxShadow: '0 18px 40px rgba(15,23,42,0.12)'
                   }}
                   itemStyle={{ color: '#0891b2' }}
                />
                 <Bar dataKey="votes" radius={[4, 4, 0, 0]}>
                    {summaryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="url(#barGradient)" />
                    ))}
                 </Bar>
                 <defs>
                   <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="#22d3ee" stopOpacity={1}/>
                     <stop offset="100%" stopColor="#6366f1" stopOpacity={0.8}/>
                   </linearGradient>
                 </defs>
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      )}

      {/* Individual Question Cards */}
      <div className="space-y-6">
        {stats.map((stat) => {
          const expiresAt =
            stat.question.expiresAt instanceof Date
              ? stat.question.expiresAt
              : stat.question.expiresAt
                ? new Date(stat.question.expiresAt)
                : null;
          const voteStatus = getVoteStatus(new Date(now), expiresAt);

          return (
          <div key={stat.question.id} className="
            rounded-[28px]
            bg-white
            border border-slate-200
            overflow-hidden
            shadow-[0_20px_60px_rgba(15,23,42,0.12)] transition-transform hover:-translate-y-1
          ">
            <div className="p-6 border-b border-slate-200 bg-slate-50">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-bold text-slate-900 leading-snug">{stat.question.title}</h2>
                <span
                  className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${
                    voteStatus.isExpired
                      ? 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-white/10 dark:text-white/70 dark:border-white/15'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-100 dark:border-emerald-300/60'
                  }`}
                >
                  {voteStatus.label}
                </span>
              </div>
              {stat.question.description && (
                 <p className="text-slate-600 text-sm mt-2 leading-relaxed">{stat.question.description}</p>
              )}
              <div className="mt-4 flex items-center text-xs text-slate-600 font-medium">
                 <span className="text-cyan-700">{stat.totalVotes}</span> <span className="ml-1 mr-1">votes</span>
                 <span className="mx-2 text-slate-300">•</span>
                 <span>{new Date(stat.question.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {stat.totalVotes === 0 ? (
                <div className="text-center py-6 text-slate-500 text-sm italic">
                  No votes recorded yet.
                </div>
              ) : (
                stat.results.map((res) => (
                  <div key={res.option.id} className="space-y-2">
                    {/* Header: Label + Percentage */}
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-medium text-slate-700">{res.option.label}</span>
                      <span className="text-sm font-bold text-slate-900">{res.percentage}%</span>
                    </div>

                    {/* Visual Bar Background */}
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden ring-1 ring-slate-200">
                      {/* Visual Bar Fill */}
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out relative shadow-[0_10px_25px_rgba(8,145,178,0.25)]"
                        style={{
                          width: `${res.percentage}%`,
                          background: 'linear-gradient(90deg, #6366f1 0%, #06b6d4 100%)'
                        }}
                      />
                    </div>
                    <div className="text-xs text-slate-500 text-right">
                      {res.count} vote{res.count !== 1 ? 's' : ''}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 pt-0">
              <button
                type="button"
                onClick={() => setOpenDetailsId((prev) => (prev === stat.question.id ? null : stat.question.id))}
                className={`
                  inline-flex items-center gap-2
                  px-4 py-2 rounded-full
                  text-sm font-medium
                  border transition-all
                  bg-white text-slate-800 border-slate-200
                  hover:bg-slate-50 hover:shadow-sm
                  dark:bg-white/10 dark:text-white/90 dark:border-white/20
                  dark:hover:bg-white/20 dark:hover:shadow-black/20
                  focus-visible:outline-none
                  focus-visible:ring-2 focus-visible:ring-cyan-400/70
                `}
              >
                {openDetailsId === stat.question.id ? 'Hide details' : 'More details'}
              </button>

              {openDetailsId === stat.question.id && (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 flex items-center justify-between gap-4 dark:border-white/15 dark:bg-white/5">
                  <div className="text-sm text-slate-700 dark:text-slate-200">
                    <p className="font-semibold text-slate-900 dark:text-white">Live countdown</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Track how long remains before voting closes.
                    </p>
                  </div>
                  {stat.question.expiresAt ? (
                    <CountdownTimer
                      expiresAt={
                        stat.question.expiresAt instanceof Date
                          ? stat.question.expiresAt
                          : new Date(stat.question.expiresAt)
                      }
                      createdAt={new Date(stat.question.createdAt)}
                    />
                  ) : null}
                </div>
              )}
            </div>
          </div>
        );
        })}
      </div>
    </div>
  );
};

export default Results;
