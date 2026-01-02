"use client";

import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { NameType, ValueType, Payload } from "recharts/types/component/DefaultTooltipContent";
import { db } from "@/lib/firebase";
import { getQuestions } from "../services/storageService";
import Results3DPie from "@/app/voting/components/Results3DPie";

type VoteDoc = {
  id: string;
  questionId: string;
  optionId: string;
  voterFlat?: string;
};

type QuestionOption = {
  id: string;
  label: string;
};

type QuestionRecord = {
  id: string;
  title: string;
  description?: string;
  createdAt: number;
  options: QuestionOption[];
};

type QuestionStat = {
  question: QuestionRecord;
  results: { option: QuestionOption; count: number; percentage: number }[];
  totalVotes: number;
};

const COLORS = ["#22d3ee", "#6366f1", "#a78bfa", "#06b6d4", "#818cf8"];

export default function Results() {
  const [stats, setStats] = useState<QuestionStat[]>([]);
  const [votesByQuestion, setVotesByQuestion] = useState<Record<string, VoteDoc[]>>({});
  const [openQuestionId, setOpenQuestionId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    let unsubscribers: (() => void)[] = [];

    const load = async () => {
      const questions = (await getQuestions()) as QuestionRecord[];

      unsubscribers = questions.map((question) => {
        const q = query(collection(db, "voting_votes"), where("questionId", "==", question.id));

        return onSnapshot(q, (snap) => {
          const votes: VoteDoc[] = snap.docs.map((d) => {
            const data = d.data() as Record<string, unknown>;
            return {
              id: d.id,
              questionId: typeof data.questionId === "string" ? data.questionId : question.id,
              optionId: typeof data.optionId === "string" ? data.optionId : "",
              voterFlat: typeof data.voterFlat === "string" ? data.voterFlat : undefined,
            };
          });

          setVotesByQuestion((prev) => ({
            ...prev,
            [question.id]: votes,
          }));

          const optionCounts: Record<string, number> = {};
          votes.forEach((v) => {
            optionCounts[v.optionId] = (optionCounts[v.optionId] || 0) + 1;
          });

          const totalVotes = votes.length;

          const results = question.options.map((opt) => {
            const count = optionCounts[opt.id] || 0;
            const percentage = totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 100);
            return { option: opt, count, percentage };
          });

          setStats((prev) => {
            const filtered = prev.filter((p) => p.question.id !== question.id);
            return [...filtered, { question, results, totalVotes }];
          });
        });
      });
    };

    void load();
    return () => unsubscribers.forEach((u) => u());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkTheme = () => setIsDarkMode(document.documentElement.classList.contains("dark"));
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="space-y-6">
      {stats.map(({ question, results, totalVotes }) => {
        const chartData = results.map((r) => ({
          name: r.option.label,
          value: r.count,
          percentage: r.percentage,
        }));

        return (
          <div key={question.id} className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold">{question.title}</h2>

            {totalVotes === 0 ? (
              <p className="text-sm text-slate-500">No votes yet</p>
            ) : (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={2}>
                      {chartData.map((_, i: number) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v: ValueType, n: NameType, p?: Payload<ValueType, NameType>) => {
                        const pct = typeof p?.payload?.percentage === "number" ? p.payload.percentage : 0;
                        const votes = Number(v ?? 0);
                        return [`${votes} votes (${pct}%)`, String(n ?? "")];
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            <button
              type="button"
              onClick={() => setOpenQuestionId((prev) => (prev === question.id ? null : question.id))}
              aria-expanded={openQuestionId === question.id}
              className="text-sm text-blue-600 underline"
            >
              {openQuestionId === question.id ? "Hide details" : "More info"}
            </button>

            {openQuestionId === question.id && (
              <MoreInfoPanel
                votes={votesByQuestion[question.id] ?? []}
                results={results}
                theme={isDarkMode ? "dark" : "light"}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function MoreInfoPanel({
  votes,
  results,
  theme,
}: {
  votes: VoteDoc[];
  results: QuestionStat["results"];
  theme: "light" | "dark";
}) {
  const uniqueFlats = Array.from(new Set(votes.map((v) => v.voterFlat).filter(Boolean)));
  const pieData = results.map((r) => ({
    name: r.option.label,
    value: r.count,
    percentage: r.percentage,
  }));

  return (
    <div className="mt-4 space-y-4">
      <div className="text-sm">
        Turnout: <strong>{uniqueFlats.length}</strong> flats
      </div>

      <div className="mt-6">
        <Results3DPie data={pieData} theme={theme} />
      </div>

      {results.map(({ option }) => {
        const flats = votes
          .filter((v) => v.optionId === option.id)
          .map((v) => v.voterFlat)
          .filter(Boolean);

        return (
          <div key={option.id} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{option.label}</span>
              <span>{flats.length}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {flats.map((f) => (
                <span key={f} className="text-xs px-2 py-1 rounded-full bg-slate-100">
                  {f}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
