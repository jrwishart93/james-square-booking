"use client";

import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
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
        const isOpen = openQuestionId === question.id;
        return (
          <div key={question.id} className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold">{question.title}</h2>
            <div className="space-y-3">
              {results.map(({ option, count, percentage }) => {
                const pct = Number.isFinite(percentage) ? percentage : 0;
                const pctLabel = `${pct}%`;
                return (
                  <div key={option.id} className="space-y-1">
                    <div className="flex items-center justify-between text-sm text-slate-800 dark:text-slate-200">
                      <span className="font-medium">{option.label}</span>
                      <span className="text-slate-500 dark:text-slate-300">
                        {count} vote{count === 1 ? "" : "s"} • {pctLabel}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 overflow-hidden dark:bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-300">Total votes: {totalVotes}</div>

            <button
              type="button"
              onClick={() => setOpenQuestionId((prev) => (prev === question.id ? null : question.id))}
              aria-expanded={isOpen}
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium backdrop-blur-md border transition-all shadow-sm hover:shadow-md active:scale-[0.98] bg-white/60 border-slate-200 text-slate-700 hover:bg-white/80 dark:bg-white/10 dark:border-white/20 dark:text-white dark:hover:bg-white/15"
            >
              <span>{isOpen ? "Hide details" : "More info"}</span>
              <svg
                className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.38a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {isOpen && (
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
  const totalVotes = results.reduce((sum, r) => sum + r.count, 0);

  return (
    <div className="mt-4 space-y-3">
      <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Visual summary</h4>

      <Results3DPie
        data={pieData}
        theme={theme}
        emphasis="secondary"
        totalVotes={totalVotes}
        turnoutFlats={uniqueFlats.length}
        enableParallax={false}
      />

      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        Turnout: {uniqueFlats.length} flat{uniqueFlats.length === 1 ? "" : "s"}
      </p>
    </div>
  );
}
