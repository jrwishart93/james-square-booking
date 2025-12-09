import React, { useEffect, useState } from 'react';
import { getQuestions, getVotes } from '../services/storageService';
import { QuestionStats } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Loader2 } from 'lucide-react';

const Results: React.FC = () => {
  const [stats, setStats] = useState<QuestionStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [questions, votes] = await Promise.all([
          getQuestions(),
          getVotes()
        ]);

        const computedStats = questions.map(q => {
          const qVotes = votes.filter(v => v.questionId === q.id);
          const total = qVotes.length;

          const results = q.options.map(opt => {
            const count = qVotes.filter(v => v.optionId === opt.id).length;
            return {
              option: opt,
              count,
              percentage: total === 0 ? 0 : Math.round((count / total) * 100)
            };
          }).sort((a, b) => b.count - a.count);

          return {
            question: q,
            totalVotes: total,
            results
          };
        });
        
        computedStats.sort((a, b) => b.question.createdAt - a.question.createdAt);

        setStats(computedStats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
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
        <h1 className="text-2xl font-bold text-white">Results & Insights</h1>
        <p className="text-slate-400">Real-time voting analytics.</p>
      </div>

      {/* Overview Chart */}
      {stats.length > 0 && stats.some(s => s.totalVotes > 0) && (
        <div className="
          p-6 rounded-3xl 
          bg-slate-900/40 
          border border-white/5 
          backdrop-blur-xl 
          shadow-lg
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
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{
                      backgroundColor: '#0f172a', 
                      borderRadius: '12px', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#f8fafc',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                    }}
                    itemStyle={{ color: '#38bdf8' }}
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
            bg-slate-900/40 
            border border-white/5 
            backdrop-blur-md 
            overflow-hidden
            hover:bg-slate-900/50 transition-colors
          ">
            <div className="p-6 border-b border-white/5 bg-white/[0.02]">
              <h2 className="text-lg font-bold text-white leading-snug">{stat.question.title}</h2>
              {stat.question.description && (
                 <p className="text-slate-400 text-sm mt-2 leading-relaxed">{stat.question.description}</p>
              )}
              <div className="mt-4 flex items-center text-xs text-slate-500 font-medium">
                 <span className="text-cyan-400">{stat.totalVotes}</span> <span className="ml-1 mr-1">votes</span>
                 <span className="mx-2 text-slate-700">•</span>
                 <span>{new Date(stat.question.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {stat.totalVotes === 0 ? (
                <div className="text-center py-6 text-slate-600 text-sm italic">
                  No votes recorded yet.
                </div>
              ) : (
                stat.results.map((res) => (
                  <div key={res.option.id} className="space-y-2">
                    {/* Header: Label + Percentage */}
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-medium text-slate-300">{res.option.label}</span>
                      <span className="text-sm font-bold text-white">{res.percentage}%</span>
                    </div>
                    
                    {/* Visual Bar Background */}
                    <div className="w-full bg-slate-800/50 rounded-full h-2.5 overflow-hidden ring-1 ring-white/5">
                      {/* Visual Bar Fill */}
                      <div 
                        className="h-full rounded-full transition-all duration-1000 ease-out relative shadow-[0_0_15px_rgba(56,189,248,0.5)]"
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Results;
