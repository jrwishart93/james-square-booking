import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { getQuestions } from '../services/storageService';
import { QuestionStats } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
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
  const [questionVotes, setQuestionVotes] = useState<Record<string, VoteDoc[]>>({});
  const [openQuestionId, setOpenQuestionId] = useState<string | null>(null);

  const toggleMoreInfo = (questionId: string) => {
    setOpenQuestionId((prev) => (prev === questionId ? null : questionId));
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
            </div>

            <div className="p-6 space-y-5">
                  {stat.totalVotes === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-sm italic">
                      No votes recorded yet.
                    </div>
                  ) : (
                <>
                 {stat.totalVotes === 0 ? (
                   <div className="text-center py-6 text-slate-500 text-sm italic">
                     No votes recorded yet.
                   </div>
                 ) : (
                   <DonutResultsChart
                     data={stat.results.map((res) => ({
                       name: res.option.label,
                       value: res.count,
                       percentage: res.percentage,
                      }))}
                    />
                  )}

                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => toggleMoreInfo(stat.question.id)}
                      aria-expanded={openQuestionId === stat.question.id}
                      className="
                        text-sm font-medium
                        text-slate-600
                        hover:text-slate-900
                        underline-offset-4 hover:underline
                        dark:text-slate-300
                        dark:hover:text-white
                      "
                    >
                      {openQuestionId === stat.question.id ? 'Hide details' : 'More info'}
                    </button>
                  </div>

                  {openQuestionId === stat.question.id && (
                    <div className="mt-4">
                      <div className="h-px bg-slate-200 dark:bg-white/10 mb-4" />

                      <MoreInfoPanel
                        question={stat.question}
                        results={stat.results}
                        votes={questionVotes[stat.question.id] ?? []}
                      />
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

function DonutResultsChart({
  data,
}: {
  data: { name: string; value: number; percentage: number }[];
}) {
  const COLORS = ["#22d3ee", "#6366f1", "#a78bfa", "#06b6d4", "#818cf8", "#94a3b8"];

  if (data.length === 0) return null;

  return (
    <div className="w-full">
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="52%"
              innerRadius={52}
              outerRadius={78}
              startAngle={90}
              endAngle={-270}
              isAnimationActive={false}
            >
              {data.map((_, i) => (
                <Cell key={i} fill="rgba(15,23,42,0.18)" />
              ))}
            </Pie>

            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="48%"
              innerRadius={52}
              outerRadius={78}
              paddingAngle={2}
              startAngle={90}
              endAngle={-270}
              animationDuration={900}
              animationEasing="ease-out"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip
              cursor={false}
              contentStyle={{
                background: "rgba(255,255,255,0.95)",
                borderRadius: "14px",
                border: "1px solid rgba(15,23,42,0.1)",
                boxShadow: "0 20px 60px rgba(15,23,42,0.15)",
              }}
              formatter={(value: unknown, name: unknown, props: { payload?: { percentage?: number } }) => {
                const v = Number(value ?? 0);
                const pct = props?.payload?.percentage ?? 0;
                return [`${v} vote${v === 1 ? "" : "s"} • ${pct}%`, name as string];
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 space-y-2">
        {data
          .slice()
          .sort((a, b) => b.value - a.value)
          .map((item, i) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="text-slate-700 dark:text-slate-200">{item.name}</span>
              </div>
              <span className="text-slate-500 dark:text-slate-300">
                {item.value} • {item.percentage}%
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

function MoreInfoPanel({
  question,
  results,
  votes,
}: {
  question: QuestionStats['question'];
  results: QuestionStats['results'];
  votes: VoteDoc[];
}) {
  const uniqueFlats = Array.from(new Set(votes.map((v) => v.voterFlat).filter(Boolean))).sort();

  return (
    <div className="mt-4 space-y-4">
      <div className="text-sm text-slate-700 dark:text-slate-200">
        Turnout: <span className="font-semibold">{uniqueFlats.length}</span> flat{uniqueFlats.length === 1 ? "" : "s"}
      </div>

      <div className="space-y-4">
        {results.map(({ option }) => {
          const flats = votes
            .filter((v) => v.optionId === option.id)
            .map((v) => v.voterFlat)
            .filter(Boolean)
            .sort() as string[];

          return (
            <div key={option.id} className="space-y-2">
              <div className="flex justify-between text-sm font-medium text-slate-700 dark:text-slate-200">
                <span>{option.label}</span>
                <span>{flats.length}</span>
              </div>

              {flats.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {flats.map((flat) => (
                    <span
                      key={`${question.id}-${option.id}-${flat}`}
                      className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-white/80"
                    >
                      {flat}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
