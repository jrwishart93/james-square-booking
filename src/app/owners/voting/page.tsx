"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Loader2,
  PenSquare,
  Vote as VoteIcon,
} from "lucide-react";

import { Button } from "@/app/voting/components/ui/Button";
import { Input } from "@/app/voting/components/ui/Input";
import {
  addQuestion,
  deleteQuestion,
  getQuestions,
  getVotes,
  submitVote,
} from "@/app/voting/services/storageService";
import type { Option, Question, Vote } from "@/app/voting/types";
import GradientBG from "@/components/GradientBG";

type Tab = "ask" | "vote" | "results";

export default function OwnersVotingPage() {
  const [activeTab, setActiveTab] = useState<Tab>("vote");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [savingVoteId, setSavingVoteId] = useState<string | null>(null);
  const [voteErrors, setVoteErrors] = useState<Record<string, string | null>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  // Ask tab state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [askErrors, setAskErrors] = useState<{ title?: string; options?: string }>({});
  const [askSuccess, setAskSuccess] = useState(false);
  const [submittingQuestion, setSubmittingQuestion] = useState(false);

  // Vote tab state
  const [voterName, setVoterName] = useState("");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? sessionStorage.getItem("ovh_username") : null;
    if (stored) setVoterName(stored);
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [qs, vs] = await Promise.all([getQuestions(), getVotes()]);
      setQuestions(qs);
      setVotes(vs);
      setLoading(false);
      if (voterName.trim()) {
        const userVotes = vs.filter(
          (v) => v.userName.toLowerCase() === voterName.trim().toLowerCase(),
        );
        const initialSelections: Record<string, string> = {};
        userVotes.forEach((v) => {
          initialSelections[v.questionId] = v.optionId;
        });
        setSelectedOptions(initialSelections);
      }
    };
    load();
  }, [voterName]);

  const validateAsk = () => {
    const errs: { title?: string; options?: string } = {};
    if (!title.trim()) errs.title = "Question title is required";
    const filled = options.filter((o) => o.trim().length > 0);
    if (filled.length < 2) errs.options = "Please provide at least 2 options";
    setAskErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddOption = () => {
    if (options.length < 6) setOptions((prev) => [...prev, ""]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return;
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateQuestion = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateAsk()) return;
    setSubmittingQuestion(true);
    try {
      const filled = options.filter((o) => o.trim().length > 0);
      await addQuestion(title.trim(), description.trim(), filled);
      const [qs, vs] = await Promise.all([getQuestions(), getVotes()]);
      setQuestions(qs);
      setVotes(vs);
      setAskSuccess(true);
      setTitle("");
      setDescription("");
      setOptions(["", ""]);
      setActiveTab("vote");
    } catch (error) {
      console.error("Failed to add question", error);
    } finally {
      setSubmittingQuestion(false);
    }
  };

  const handleSubmitVote = async (event: React.FormEvent, questionId: string) => {
    event.preventDefault();
    const name = voterName.trim();
    const optionId = selectedOptions[questionId];
    if (!name) {
      setVoteErrors((prev) => ({ ...prev, [questionId]: "Please enter your name to vote." }));
      return;
    }
    if (!optionId) {
      setVoteErrors((prev) => ({ ...prev, [questionId]: "Please select an option." }));
      return;
    }
    setSavingVoteId(questionId);
    setVoteErrors((prev) => ({ ...prev, [questionId]: null }));
    try {
      await submitVote(questionId, optionId, name);
      sessionStorage.setItem("ovh_username", name);
      const vs = await getVotes();
      setVotes(vs);
      setVoteErrors((prev) => ({ ...prev, [questionId]: "Vote recorded" }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred while submitting.";
      setVoteErrors((prev) => ({ ...prev, [questionId]: message }));
    } finally {
      setSavingVoteId(null);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    const proceed = window.confirm("This question and its votes will be deleted. Are you sure?");
    if (!proceed) return;
    setDeletingId(questionId);
    try {
      await deleteQuestion(questionId);
      const [qs, vs] = await Promise.all([getQuestions(), getVotes()]);
      setQuestions(qs);
      setVotes(vs);
    } catch (error) {
      console.error("Failed to delete question", error);
    } finally {
      setDeletingId(null);
    }
  };

  const questionResults = useMemo(() => {
    return questions.map((q) => {
      const relevant = votes.filter((v) => v.questionId === q.id);
      const total = relevant.length || 1;
      const results = q.options.map((opt) => {
        const count = relevant.filter((v) => v.optionId === opt.id).length;
        return { option: opt, count, percentage: Math.round((count / total) * 100) };
      });
      return { question: q, totalVotes: relevant.length, results };
    });
  }, [questions, votes]);

  if (loading) {
    return (
      <GradientBG className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </GradientBG>
    );
  }

  return (
    <GradientBG className="min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 md:px-6 space-y-8">
        <header className="text-center space-y-3">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-200/80">Owners • Community</p>
          <h1 className="text-3xl md:text-4xl font-semibold text-white">Voting Hub</h1>
          <p className="text-slate-200/80 max-w-3xl mx-auto">
            Ask a question, cast your vote, and review results. This section is open to all residents—
            no owners passcode required.
          </p>
        </header>

        <div className="flex justify-center gap-2 flex-wrap">
          <TabButton icon={<PenSquare size={16} />} label="Ask" active={activeTab === "ask"} onClick={() => setActiveTab("ask")} />
          <TabButton icon={<VoteIcon size={16} />} label="Vote" active={activeTab === "vote"} onClick={() => setActiveTab("vote")} />
          <TabButton icon={<BarChart3 size={16} />} label="Results" active={activeTab === "results"} onClick={() => setActiveTab("results")} />
        </div>

        <section className="rounded-3xl bg-slate-950/60 border border-white/10 backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.45)] p-6 md:p-8">
          {activeTab === "ask" && (
            <form className="space-y-8" onSubmit={handleCreateQuestion}>
              <div className="space-y-5">
                <Input
                  label="Question Title"
                  placeholder="e.g., Should we install solar panels?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  error={askErrors.title}
                />
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">
                    Description <span className="text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/70 focus:border-transparent backdrop-blur-md shadow-inner shadow-black/20 transition-all h-28 resize-none"
                    placeholder="Add more context details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-white/5 pb-2">
                  <label className="block text-sm font-medium text-slate-300 ml-1">Options</label>
                  <span className="text-xs text-slate-500 font-mono">Min 2 • Max 6</span>
                </div>
                <div className="space-y-3">
                  {options.map((option, index) => (
                    <div key={index} className="flex gap-2 group">
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) =>
                          setOptions((prev) => prev.map((opt, i) => (i === index ? e.target.value : opt)))
                        }
                        className="flex-1"
                      />
                      {options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(index)}
                          className="p-3 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                          aria-label="Remove option"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {askErrors.options && <p className="text-sm text-red-400 ml-1">{askErrors.options}</p>}
                {options.length < 6 && (
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="flex items-center text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors mt-2 px-2 py-1 rounded-lg hover:bg-cyan-500/10"
                  >
                    + Add Another Option
                  </button>
                )}
              </div>

              {askSuccess && (
                <div className="flex items-center gap-3 text-emerald-300 text-sm bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                  <CheckCircle2 size={18} className="shrink-0" />
                  Question published. You can switch to the Vote tab to cast the first vote.
                </div>
              )}

              <div className="pt-2">
                <Button type="submit" fullWidth isLoading={submittingQuestion}>
                  Publish Question
                </Button>
              </div>
            </form>
          )}

          {activeTab === "vote" && (
            <div className="space-y-6">
              <Input
                label="Who is voting?"
                placeholder="Enter your name"
                value={voterName}
                onChange={(e) => setVoterName(e.target.value)}
                className="bg-slate-900/50 border-indigo-500/30 focus:ring-indigo-400/50"
              />

              {questions.length === 0 ? (
                <div className="text-center text-slate-300 py-10">
                  <p>No open questions right now. Switch to the Ask tab to create one.</p>
                </div>
              ) : (
                questions
                  .filter((q) => q.status === "open")
                  .map((question) => {
                    const error = voteErrors[question.id];
                    const selected = selectedOptions[question.id] ?? null;
                    return (
                      <div key={question.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-5">
                        <div className="flex items-center justify-between mb-2">
                          <h2 className="text-xl font-semibold text-white">{question.title}</h2>
                          <span className="inline-flex px-3 py-1 text-xs font-bold uppercase bg-emerald-500/10 text-emerald-300 rounded-full border border-emerald-500/20">
                            Active
                          </span>
                        </div>
                        {question.description && (
                          <p className="text-slate-300 text-sm leading-relaxed">{question.description}</p>
                        )}

                        <form onSubmit={(e) => handleSubmitVote(e, question.id)} className="space-y-4">
                          <div className="space-y-3">
                            {question.options.map((opt) => {
                              const isSelected = selected === opt.id;
                              return (
                                <label
                                  key={opt.id}
                                  className={`relative flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-200 group ${
                                    isSelected
                                      ? "border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                                      : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10"
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    className="sr-only"
                                    checked={isSelected}
                                    onChange={() =>
                                      setSelectedOptions((prev) => ({ ...prev, [question.id]: opt.id }))
                                    }
                                  />
                                  <span
                                    className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center mr-4 transition-colors ${
                                      isSelected
                                        ? "border-cyan-400 bg-cyan-400"
                                        : "border-slate-500 group-hover:border-slate-400"
                                    }`}
                                  >
                                    {isSelected && <CheckCircle2 size={12} className="text-slate-900" />}
                                  </span>
                                  <span
                                    className={`font-medium text-sm ${
                                      isSelected ? "text-white" : "text-slate-300 group-hover:text-white"
                                    }`}
                                  >
                                    {opt.label}
                                  </span>
                                </label>
                              );
                            })}
                          </div>

                          {error && (
                            <div className="flex items-center gap-3 text-sm bg-red-500/10 p-4 rounded-xl border border-red-500/20 text-red-200">
                              <AlertCircle size={18} className="shrink-0" />
                              {error}
                            </div>
                          )}

                          <Button
                            type="submit"
                            fullWidth
                            isLoading={savingVoteId === question.id}
                            disabled={!selected || !voterName}
                          >
                            Submit Vote
                          </Button>
                        </form>
                      </div>
                    );
                  })
              )}
            </div>
          )}

          {activeTab === "results" && (
            <div className="space-y-6">
              {questionResults.length === 0 ? (
                <p className="text-slate-300">No questions yet.</p>
              ) : (
                questionResults.map(({ question, results, totalVotes }) => (
                  <div key={question.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{question.status}</p>
                        <h3 className="text-xl font-semibold text-white">{question.title}</h3>
                        {question.description && <p className="text-slate-300 text-sm">{question.description}</p>}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right text-sm text-slate-400">
                          <div className="font-semibold text-white">{totalVotes}</div>
                          <div>votes</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteQuestion(question.id)}
                          disabled={deletingId === question.id}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-white/20 text-slate-200 hover:bg-white/10 transition disabled:opacity-50"
                          aria-label="Delete question"
                        >
                          {deletingId === question.id ? "…" : "×"}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {results.map(({ option, count, percentage }) => (
                        <ResultRow key={option.id} option={option} count={count} percentage={percentage} />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </div>
    </GradientBG>
  );
}

function TabButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition ${
        active
          ? "bg-white/90 text-slate-900 shadow-lg"
          : "bg-white/5 text-slate-200 hover:bg-white/10 border border-white/10"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function ResultRow({ option, count, percentage }: { option: Option; count: number; percentage: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm text-slate-200">
        <span>{option.label}</span>
        <span className="text-slate-400">
          {count} vote{count === 1 ? "" : "s"} • {Number.isFinite(percentage) ? percentage : 0}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all"
          style={{ width: `${Number.isFinite(percentage) ? percentage : 0}%` }}
        />
      </div>
    </div>
  );
}
