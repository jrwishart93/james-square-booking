import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { getQuestions } from '../services/storageService';
import { QuestionStats } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase';

type VoteDoc = {
  id: string;
  questionId: string;
  optionId: string;
  voterFlat?: string;
  createdAt?: unknown;
};

const Results: React.FC = () => {
  const [stats, setStats] = useState<QuestionStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [animateKey, setAnimateKey] = useState<Record<string, number>>({});
  const [questionVotes, setQuestionVotes] = useState<Record<string, VoteDoc[]>>({});
  const [expandedBreakdown, setExpandedBreakdown] = useState<Record<string, boolean>>({});

  const toggleExpanded = (questionId: string) => {
    setExpanded((prev) => {
      const nextOpen = !prev[questionId];
      if (nextOpen) {
        setAnimateKey((k) => ({ ...k, [questionId]: (k[questionId] ?? 0) + 1 }));
      }
      return { ...prev, [questionId]: nextOpen };
    });
  };

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

              const votes: VoteDoc[] = snapshot.docs.map((d) => {
                const data = d.data() as Record<string, unknown>;
                return {
                  id: d.id,
                  questionId: typeof data.questionId === 'string' ? data.questionId : question.id,
                  optionId: typeof data.optionId === 'string' ? data.optionId : '',
                  voterFlat: typeof data.voterFlat === 'string' ? data.voterFlat : undefined,
                  createdAt: data.createdAt,
                };
              });

              setQuestionVotes((prev) => ({ ...prev, [question.id]: votes }));

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
        {stats.map((stat) => (
          <div key={stat.question.id} className="
            rounded-[28px]
            bg-white
            border border-slate-200
            overflow-hidden
            shadow-[0_20px_60px_rgba(15,23,42,0.12)] transition-transform hover:-translate-y-1
          ">
            <div className="p-6 border-b border-slate-200 bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900 leading-snug">{stat.question.title}</h2>
              {stat.question.description && (
                 <p className="text-slate-600 text-sm mt-2 leading-relaxed">{stat.question.description}</p>
              )}
              <div className="mt-4 flex items-center text-xs text-slate-600 font-medium">
                 <span className="text-cyan-700">{stat.totalVotes}</span> <span className="ml-1 mr-1">votes</span>
                 <span className="mx-2 text-slate-300">•</span>
                 <span>{new Date(stat.question.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => toggleExpanded(stat.question.id)}
                  className="
                    inline-flex items-center gap-2
                    rounded-full px-4 py-2
                    text-sm font-semibold
                    bg-slate-900 text-white
                    shadow-[0_16px_40px_rgba(2,6,23,0.35)]
                    hover:shadow-[0_20px_55px_rgba(34,211,238,0.35)]
                    transition-all
                    active:scale-[0.99]
                  "
                  aria-expanded={!!expanded[stat.question.id]}
                >
                  <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.9)]" />
                  {expanded[stat.question.id] ? 'Hide insights' : 'Advanced insights'}
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {stat.totalVotes === 0 ? (
                <div className="text-center py-6 text-slate-500 text-sm italic">
                  No votes recorded yet.
                </div>
              ) : (
                <>
                  {stat.results.map((res) => (
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
                  ))}

                  <button
                    onClick={() =>
                      setExpandedBreakdown((p) => ({
                        ...p,
                        [stat.question.id]: !p[stat.question.id],
                      }))
                    }
                    className="mt-2 inline-flex rounded-full px-4 py-2 text-sm font-semibold bg-slate-900 text-white hover:opacity-90"
                  >
                    {expandedBreakdown[stat.question.id] ? 'Hide more info' : 'More info'}
                  </button>

                  {expandedBreakdown[stat.question.id] && (
                    <div className="mt-4 rounded-xl bg-slate-50 p-4 space-y-3">
                      <p className="text-sm font-semibold">
                        Turnout:{' '}
                        {
                          new Set(
                            (questionVotes[stat.question.id] ?? [])
                              .map((v) => v.voterFlat)
                              .filter(Boolean),
                          ).size
                        }{' '}
                        flats
                      </p>

                      {stat.results.map((res) => {
                        const flats = (questionVotes[stat.question.id] ?? [])
                          .filter((v) => v.optionId === res.option.id)
                          .map((v) => v.voterFlat)
                          .filter(Boolean)
                          .sort();

                        return (
                          <div key={res.option.id}>
                            <div className="font-medium">
                              {res.option.label} ({flats.length})
                            </div>
                            {flats.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-1">
                                {flats.map((f) => (
                                  <span key={f} className="text-xs px-2 py-1 rounded bg-white border">
                                    {f}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {expanded[stat.question.id] && stat.totalVotes > 0 && (
                    <div className="px-6 pb-6">
                      <div
                        className="
                          relative overflow-hidden rounded-[26px]
                          border border-slate-200
                          bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,0.18),transparent_45%),radial-gradient(circle_at_90%_30%,rgba(99,102,241,0.18),transparent_45%),linear-gradient(180deg,#0b1220, #070b13)]
                          shadow-[0_28px_90px_rgba(15,23,42,0.45)]
                        "
                      >
                        {/* Ambient glow lines */}
                        <div className="pointer-events-none absolute inset-0 opacity-70">
                          <div className="absolute -top-24 left-10 h-60 w-60 rounded-full bg-cyan-400/20 blur-3xl" />
                          <div className="absolute -bottom-24 right-6 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
                          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(180deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:28px_28px]" />
                        </div>

                        <div className="relative p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="text-sm font-bold tracking-wide text-white">
                                Advanced Insights
                              </h3>
                              <p className="mt-1 text-xs text-slate-300">
                                3D breakdown of votes by option
                              </p>
                            </div>

                            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                              Total votes: <span className="text-cyan-200">{stat.totalVotes}</span>
                            </div>
                          </div>

                          {/* 3D chart stage */}
                          <div className="mt-6">
                            <div
                              className="
                                rounded-2xl border border-white/10
                                bg-white/5
                                shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_22px_60px_rgba(0,0,0,0.35)]
                                p-4
                                [perspective:1200px]
                              "
                            >
                              <div
                                className="
                                  h-64 w-full
                                  transform-gpu
                                  [transform:rotateX(10deg)]
                                "
                              >
                                <ResponsiveContainer width="100%" height="100%">
                                  <BarChart
                                    key={`${stat.question.id}-${animateKey[stat.question.id] ?? 0}`}
                                    data={stat.results.map(r => ({
                                      name: r.option.label,
                                      votes: r.count,
                                    }))}
                                    margin={{ top: 12, right: 12, left: 0, bottom: 12 }}
                                  >
                                    <defs>
                                      <linearGradient id={`front-${stat.question.id}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#22d3ee" stopOpacity={1} />
                                        <stop offset="55%" stopColor="#6366f1" stopOpacity={0.95} />
                                        <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.75} />
                                      </linearGradient>

                                      {/* “side face” gradient for faux depth */}
                                      <linearGradient id={`side-${stat.question.id}`} x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.45} />
                                        <stop offset="100%" stopColor="#312e81" stopOpacity={0.35} />
                                      </linearGradient>
                                    </defs>

                                    <XAxis
                                      dataKey="name"
                                      tickLine={false}
                                      axisLine={false}
                                      stroke="rgba(226,232,240,0.55)"
                                      fontSize={11}
                                      interval={0}
                                      height={42}
                                      tick={{ fill: 'rgba(226,232,240,0.75)' }}
                                    />
                                    <YAxis
                                      allowDecimals={false}
                                      tickLine={false}
                                      axisLine={false}
                                      stroke="rgba(226,232,240,0.55)"
                                      fontSize={11}
                                      tick={{ fill: 'rgba(226,232,240,0.65)' }}
                                    />
                                    <Tooltip
                                      cursor={{ fill: 'rgba(148,163,184,0.10)' }}
                                      contentStyle={{
                                        background: 'rgba(2, 6, 23, 0.92)',
                                        border: '1px solid rgba(148,163,184,0.25)',
                                        borderRadius: '14px',
                                        boxShadow: '0 28px 70px rgba(0,0,0,0.45)',
                                        color: '#fff',
                                        backdropFilter: 'blur(10px)',
                                      }}
                                      itemStyle={{ color: '#67e8f9' }}
                                      labelStyle={{ color: 'rgba(226,232,240,0.8)' }}
                                    />

                                    {/* Base bars (front face) */}
                                    <Bar
                                      dataKey="votes"
                                      radius={[10, 10, 6, 6]}
                                      animationDuration={900}
                                      animationEasing="ease-out"
                                    >
                                      {stat.results.map((_, i) => (
                                        <Cell
                                          key={i}
                                          fill={`url(#front-${stat.question.id})`}
                                          style={{
                                            filter: 'drop-shadow(0 18px 26px rgba(34,211,238,0.25))',
                                          }}
                                        />
                                      ))}
                                      <LabelList
                                        dataKey="votes"
                                        position="top"
                                        style={{
                                          fill: 'rgba(255,255,255,0.90)',
                                          fontSize: 12,
                                          fontWeight: 700,
                                          textShadow: '0 10px 18px rgba(0,0,0,0.55)',
                                        }}
                                      />
                                    </Bar>

                                    {/* Faux “depth overlay”: second bar set slightly offset */}
                                    <Bar
                                      dataKey="votes"
                                      radius={[10, 10, 6, 6]}
                                      animationDuration={900}
                                      animationEasing="ease-out"
                                      barSize={18}
                                    >
                                      {stat.results.map((_, i) => (
                                        <Cell
                                          key={i}
                                          fill={`url(#side-${stat.question.id})`}
                                          style={{
                                            transform: 'translate(6px, -6px)',
                                            opacity: 0.8,
                                          }}
                                        />
                                      ))}
                                    </Bar>
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>
                            </div>

                            {/* Option summary chips */}
                            <div className="mt-4 flex flex-wrap gap-2">
                              {stat.results.map(r => (
                                <div
                                  key={r.option.id}
                                  className="
                                    rounded-full
                                    border border-white/10
                                    bg-white/5
                                    px-3 py-1
                                    text-xs font-semibold
                                    text-slate-200
                                    shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]
                                  "
                                >
                                  <span className="text-cyan-200">{r.count}</span>
                                  <span className="mx-1 text-slate-400">•</span>
                                  {r.option.label}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Results;
