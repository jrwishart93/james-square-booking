"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import { collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  Loader2,
  PenSquare,
  Vote as VoteIcon,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/app/voting/components/ui/Button";
import { Input } from "@/app/voting/components/ui/Input";
import {
  addQuestion,
  deleteQuestion,
  getQuestions,
  normalizeFlat,
  submitVote,
} from "@/app/voting/services/storageService";
import type { Option, Question } from "@/app/voting/types";
import GradientBG from "@/components/GradientBG";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";

const deriveFirstName = (user: User | null): string => {
  if (!user) return "";
  const base = user.displayName?.trim() || user.email?.split("@")[0] || "";
  const first = base.split(/[\s._-]+/).find(Boolean) || "";
  return first ? first.charAt(0).toUpperCase() + first.slice(1) : "";
};

type Tab = "ask" | "vote" | "results";

const VIEW_ONLY_MESSAGE = "Viewing only. Please log in or sign up to place a vote.";
const VOTE_RECORDED_MESSAGE = "Vote recorded";

type VoteTimelinePoint = { day: string; count: number; cumulative: number };

export default function OwnersVotingPage() {
  const router = useRouter();
  const { user: currentUser, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("vote");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [voteCounts, setVoteCounts] = useState<Record<string, Record<string, number>>>({});
  const [voteTimelines, setVoteTimelines] = useState<Record<string, VoteTimelinePoint[]>>({});
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [savingVoteId, setSavingVoteId] = useState<string | null>(null);
  const [voteErrors, setVoteErrors] = useState<Record<string, string | null>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Ask tab state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [askErrors, setAskErrors] = useState<{ title?: string; options?: string }>({});
  const [askSuccess, setAskSuccess] = useState(false);
  const [submittingQuestion, setSubmittingQuestion] = useState(false);

  // Vote tab state
  const [voterName, setVoterName] = useState("");
  const [flat, setFlat] = useState("");
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});
  const isAuthenticated = Boolean(currentUser);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? sessionStorage.getItem("ovh_username") : null;
    if (stored) setVoterName(stored);
    const storedFlat = typeof window !== "undefined" ? sessionStorage.getItem("ovh_flat") : null;
    if (storedFlat) setFlat(normalizeFlat(storedFlat));
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const defaultName = deriveFirstName(currentUser);
    if (defaultName) {
      setVoterName(defaultName);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("ovh_username", defaultName);
      }
    }
  }, [authLoading, currentUser]);

  useEffect(() => {
    const loadPropertyNumber = async () => {
      if (authLoading || !currentUser) return;
      try {
        const profileRef = doc(db, "users", currentUser.uid);
        const profileSnap = await getDoc(profileRef);
        if (!profileSnap.exists()) return;
        const data = profileSnap.data() as Record<string, unknown>;
        const propertyNumber =
          typeof data.property === "string"
            ? data.property
            : typeof data.flat === "string"
              ? data.flat
              : "";
        if (propertyNumber) {
          const normalizedProperty = normalizeFlat(propertyNumber);
          setFlat(normalizedProperty);
          if (typeof window !== "undefined") {
            sessionStorage.setItem("ovh_flat", normalizedProperty);
          }
        }
      } catch (profileError) {
        console.error("Failed to load property number for owners voting", profileError);
      }
    };

    void loadPropertyNumber();
  }, [authLoading, currentUser]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const qs = await getQuestions();
        setQuestions(qs);

        const storedSelections =
          typeof window !== "undefined" ? sessionStorage.getItem("ovh_vote_choices") : null;
        if (storedSelections) {
          try {
            const parsed = JSON.parse(storedSelections) as Record<string, string>;
            setSelectedOptions(parsed);
          } catch {
            // Ignore malformed cache
          }
        }
      } catch (error) {
        console.error("Failed to load voting data", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (questions.length === 0) {
      setVoteCounts({});
      setVoteTimelines({});
      return;
    }

    const votesRef = collection(db, "voting_votes");
    setVoteCounts({});
    setVoteTimelines({});
    const unsubscribers = questions.map((question) => {
      const votesQuery = query(votesRef, where("questionId", "==", question.id));
      return onSnapshot(
        votesQuery,
        (snapshot) => {
          console.log("Votes returned:", snapshot.docs.map((d) => d.data()));
          const aggregated = snapshot.docs.reduce<{
            counts: Record<string, number>;
            timelineBuckets: Record<string, { count: number; timestamp: number; label: string }>;
            hasTimestamps: boolean;
          }>(
            (acc, doc) => {
              const data = doc.data() as Record<string, unknown>;
              const optionId = typeof data.optionId === "string" ? data.optionId : null;
              const createdAtRaw = data.createdAt as { toMillis?: () => number } | undefined;
              const hasTimestamp =
                typeof createdAtRaw?.toMillis === "function" || typeof createdAtRaw === "number";
              const createdAt = hasTimestamp
                ? typeof createdAtRaw?.toMillis === "function"
                  ? createdAtRaw.toMillis()
                  : (createdAtRaw as number)
                : null;

              if (!optionId) return acc;

              acc.counts[optionId] = (acc.counts[optionId] ?? 0) + 1;
              if (createdAt) {
                const day = new Date(createdAt);
                day.setHours(0, 0, 0, 0);
                const dayKey = day.getTime().toString();
                const bucketLabel = day.toLocaleDateString(undefined, { month: "short", day: "numeric" });

                acc.timelineBuckets[dayKey] = acc.timelineBuckets[dayKey]
                  ? {
                      ...acc.timelineBuckets[dayKey],
                      count: acc.timelineBuckets[dayKey].count + 1,
                    }
                  : { count: 1, timestamp: day.getTime(), label: bucketLabel };
                acc.hasTimestamps = true;
              }

              return acc;
            },
            { counts: {}, timelineBuckets: {}, hasTimestamps: false },
          );

          const timeline = aggregated.hasTimestamps
            ? Object.values(aggregated.timelineBuckets)
                .sort((a, b) => a.timestamp - b.timestamp)
                .reduce<VoteTimelinePoint[]>((points, bucket) => {
                  const cumulative = (points[points.length - 1]?.cumulative ?? 0) + bucket.count;
                  return [...points, { day: bucket.label, count: bucket.count, cumulative }];
                }, [])
            : [];

          setVoteCounts((prev) => ({ ...prev, [question.id]: aggregated.counts }));
          setVoteTimelines((prev) => ({ ...prev, [question.id]: timeline }));
        },
        (error) => {
          console.error("Failed to load votes for question", error);
        },
      );
    });

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [questions]);

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
      const qs = await getQuestions();
      setQuestions(qs);
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
    const flatValue = normalizeFlat(flat);
    const optionId = selectedOptions[questionId];
    if (!currentUser) {
      setVoteErrors((prev) => ({ ...prev, [questionId]: VIEW_ONLY_MESSAGE }));
      setAuthModalOpen(true);
      return;
    }
    if (!name) {
      setVoteErrors((prev) => ({ ...prev, [questionId]: "Please enter your name to vote." }));
      return;
    }
    if (!flatValue) {
      setVoteErrors((prev) => ({ ...prev, [questionId]: "Flat number is required to vote." }));
      return;
    }
    if (!optionId) {
      setVoteErrors((prev) => ({ ...prev, [questionId]: "Please select an option." }));
      return;
    }
    setSavingVoteId(questionId);
    setVoteErrors((prev) => ({ ...prev, [questionId]: null }));
    try {
      await submitVote(questionId, optionId, name, flatValue, currentUser.uid);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("ovh_username", name);
        sessionStorage.setItem("ovh_flat", flatValue);
      }
      const updatedSelections = { ...selectedOptions, [questionId]: optionId };
      setSelectedOptions(updatedSelections);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("ovh_vote_choices", JSON.stringify(updatedSelections));
      }
      const refreshedQuestions = await getQuestions();
      setQuestions(refreshedQuestions);
      setVoteErrors((prev) => ({ ...prev, [questionId]: VOTE_RECORDED_MESSAGE }));
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
      const qs = await getQuestions();
      setQuestions(qs);
    } catch (error) {
      console.error("Failed to delete question", error);
    } finally {
      setDeletingId(null);
    }
  };

  const questionResults = useMemo(() => {
    return questions.map((q) => {
      const totals = voteCounts[q.id] ?? {};
      const totalVotes = Object.values(totals).reduce((sum, count) => sum + count, 0);
      const safeTotal = Math.max(totalVotes, 1);
      const results = q.options.map((opt) => {
        const count = totals[opt.id] ?? 0;
        return { option: opt, count, percentage: Math.round((count / safeTotal) * 100) };
      });
      return { question: q, totalVotes, results };
    });
  }, [questions, voteCounts]);

  if (loading) {
    return (
      <GradientBG className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </GradientBG>
    );
  }

  return (
    <>
      <GradientBG className="min-h-screen py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 mx-auto max-w-4xl h-48 bg-white/50 dark:bg-slate-900/50 blur-3xl opacity-60 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 md:px-6 space-y-10 relative">
          <header className="text-center space-y-3 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl border border-black/10 dark:border-white/10 px-6 py-8 shadow-[0_20px_80px_rgba(0,0,0,0.25)]">
            <p className="text-xs md:text-sm uppercase tracking-[0.3em] font-semibold text-slate-700 dark:text-white/80">Owners • Community</p>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">Voting Hub</h1>
            <p className="text-slate-700 dark:text-white/80 font-medium text-sm md:text-base leading-relaxed max-w-3xl mx-auto">
              Ask a question, cast your vote, and review results. This section is open to all residents—no owners passcode required.
            </p>
          </header>

          <div className="flex justify-center gap-2 flex-wrap">
            <TabButton icon={<PenSquare size={16} />} label="Ask" active={activeTab === "ask"} onClick={() => setActiveTab("ask")} />
            <TabButton icon={<VoteIcon size={16} />} label="Vote" active={activeTab === "vote"} onClick={() => setActiveTab("vote")} />
            <TabButton icon={<BarChart3 size={16} />} label="Results" active={activeTab === "results"} onClick={() => setActiveTab("results")} />
          </div>

          <section className="rounded-3xl border shadow-xl backdrop-blur-xl bg-white/70 border-black/10 text-slate-900 dark:bg-white/10 dark:border-white/15 dark:text-white p-6 md:p-10 space-y-8">
            {activeTab === "ask" && (
              <form className="space-y-10" onSubmit={handleCreateQuestion}>
                <div className="space-y-6">
                  <Input
                    label="Question Title"
                    placeholder="e.g., Should we install solar panels?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    error={askErrors.title}
                  />
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-900 dark:text-slate-200">
                      Description <span className="text-slate-500 font-normal dark:text-slate-400">(Optional)</span>
                    </label>
                    <textarea
                      className="w-full rounded-2xl bg-white/80 border border-black/10 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/70 focus:border-transparent focus:ring-offset-2 focus:ring-offset-white dark:bg-white/5 dark:border-white/15 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:ring-offset-0 backdrop-blur-md shadow-inner shadow-black/10 dark:shadow-black/20 transition-all h-32 resize-none"
                      placeholder="Add more context details..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex justify-between items-end border-b border-black/10 dark:border-white/10 pb-3">
                    <label className="block text-sm font-semibold text-slate-900 dark:text-slate-200">Options</label>
                    <span className="text-xs text-slate-500 font-mono dark:text-slate-400">Min 2 • Max 6</span>
                  </div>
                  <div className="space-y-4">
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
                            className="p-3 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors dark:text-slate-400"
                            aria-label="Remove option"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {askErrors.options && (
                    <p className="text-sm text-red-600 dark:text-red-300 ml-1">{askErrors.options}</p>
                  )}
                  {options.length < 6 && (
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="flex items-center text-sm font-medium text-cyan-700 hover:text-cyan-600 dark:text-cyan-300 dark:hover:text-cyan-200 transition-colors mt-2 px-2 py-1 rounded-lg hover:bg-cyan-500/10"
                    >
                      + Add Another Option
                    </button>
                  )}
                </div>

                {askSuccess && (
                  <div className="flex items-center gap-3 text-sm bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 shadow-inner shadow-emerald-900/20 text-emerald-800 dark:text-emerald-200">
                    <CheckCircle2 size={18} className="shrink-0" />
                    Question published. You can switch to the Vote tab to cast the first vote.
                  </div>
                )}

                <div className="pt-2">
                  <Button
                    type="submit"
                    fullWidth
                    isLoading={submittingQuestion}
                    className="py-4 text-base shadow-[0_12px_40px_rgba(56,189,248,0.35)]"
                  >
                    Publish Question
                  </Button>
                </div>
              </form>
            )}

            {activeTab === "vote" && (
              <div className="space-y-6">
                {isAuthenticated && (
                  <>
                    <Input
                      label="Who is voting?"
                      placeholder="Enter your name"
                      value={voterName}
                      onChange={(e) => setVoterName(e.target.value)}
                      readOnly={Boolean(currentUser)}
                      className="bg-white/80 border-black/10 focus:ring-indigo-400/70 focus:ring-offset-2 focus:ring-offset-white dark:bg-slate-900/50 dark:border-indigo-500/30 dark:focus:ring-offset-0 py-3"
                    />
                    <Input
                      label="Flat number"
                      placeholder="e.g., 3F2"
                      value={flat}
                      onChange={(e) => setFlat(normalizeFlat(e.target.value))}
                      onBlur={(e) => sessionStorage.setItem("ovh_flat", normalizeFlat(e.target.value))}
                      className="bg-white/80 border-black/10 focus:ring-indigo-400/70 focus:ring-offset-2 focus:ring-offset-white dark:bg-slate-900/50 dark:border-indigo-500/30 dark:focus:ring-offset-0 py-3"
                    />
                    <p className="text-xs text-slate-600 dark:text-indigo-100/80 ml-1">
                      Using your account name so each vote is attributed to your login. Your flat is captured for the audit log.
                    </p>
                  </>
                )}

                {!isAuthenticated && (
                  <div className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-white/80 p-4 shadow-sm dark:border-white/15 dark:bg-white/5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3 text-slate-800 dark:text-slate-200">
                      <AlertCircle className="text-indigo-500" size={20} />
                      <div>
                        <p className="font-semibold">Viewing only</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">Please log in or sign up to place a vote.</p>
                      </div>
                    </div>
                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                      <Button type="button" fullWidth onClick={() => setAuthModalOpen(true)}>
                        Log in to vote
                      </Button>
                      <Button
                        type="button"
                        fullWidth
                        variant="secondary"
                        onClick={() => setAuthModalOpen(true)}
                      >
                        Sign up
                      </Button>
                    </div>
                  </div>
                )}

                {questions.length === 0 ? (
                  <div className="text-center text-slate-600 dark:text-slate-300 py-10">
                    <p>No open questions right now. Switch to the Ask tab to create one.</p>
                  </div>
                ) : (
                  questions
                    .filter((q) => q.status === "open")
                    .map((question) => {
                      const error = voteErrors[question.id];
                      const selected = selectedOptions[question.id] ?? null;
                      const selectionDisabled = authLoading || !isAuthenticated;
                      const alertTone = error === VOTE_RECORDED_MESSAGE
                        ? "success"
                        : error === VIEW_ONLY_MESSAGE
                          ? "info"
                          : "error";
                      return (
                        <div
                          key={question.id}
                          className="p-6 rounded-2xl bg-white border border-black/10 shadow-[0_16px_40px_rgba(0,0,0,0.08)] space-y-6 dark:bg-white/5 dark:border-white/15 dark:shadow-[0_16px_60px_rgba(0,0,0,0.3)]"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="space-y-1">
                              <p className="text-xs uppercase tracking-[0.2em] text-slate-600 font-semibold dark:text-white/70">Active poll</p>
                              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{question.title}</h2>
                            </div>
                            <span className="inline-flex px-3 py-1 text-xs font-bold uppercase bg-emerald-500/10 text-emerald-700 rounded-full border border-emerald-500/30 dark:text-emerald-200 dark:bg-emerald-500/15">
                              Open
                            </span>
                          </div>
                          {question.description && (
                            <p className="text-slate-700 text-sm leading-relaxed dark:text-slate-200">{question.description}</p>
                          )}

                          <form onSubmit={(e) => handleSubmitVote(e, question.id)} className="space-y-4">
                            <div className="space-y-4">
                              {question.options.map((opt) => {
                                const isSelected = selected === opt.id;
                                return (
                                  <label
                                    key={opt.id}
                                    onClick={() => {
                                      if (selectionDisabled) {
                                        setAuthModalOpen(true);
                                        setVoteErrors((prev) => ({ ...prev, [question.id]: VIEW_ONLY_MESSAGE }));
                                      }
                                    }}
                                    className={`relative flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-200 group ${
                                      isSelected
                                        ? "border-cyan-500/60 bg-cyan-50 shadow-[0_0_24px_rgba(6,182,212,0.12)] dark:bg-cyan-500/10 dark:border-cyan-500/50"
                                        : "border-black/10 bg-white/80 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                                    } ${selectionDisabled ? "cursor-not-allowed opacity-80" : ""}`}
                                  >
                                    <input
                                      type="radio"
                                      className="sr-only"
                                      checked={isSelected}
                                      disabled={selectionDisabled}
                                      onChange={() => {
                                        if (selectionDisabled) return;
                                        setSelectedOptions((prev) => ({ ...prev, [question.id]: opt.id }));
                                      }}
                                    />
                                    <span
                                      className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center mr-4 transition-colors ${
                                        isSelected
                                          ? "border-cyan-500 bg-cyan-500"
                                          : "border-slate-400 group-hover:border-slate-500 dark:border-slate-500"
                                      }`}
                                    >
                                      {isSelected && <CheckCircle2 size={12} className="text-white" />}
                                    </span>
                                    <span
                                      className={`font-medium text-sm ${
                                        isSelected
                                          ? "text-slate-900 dark:text-white"
                                          : "text-slate-700 group-hover:text-slate-900 dark:text-slate-300 dark:group-hover:text-white"
                                      }`}
                                    >
                                      {opt.label}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>

                            {!isAuthenticated && (
                              <p className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                <AlertCircle size={16} className="text-indigo-500" />
                                {VIEW_ONLY_MESSAGE}
                              </p>
                            )}

                            {error && (
                              <div
                                className={`flex items-center gap-3 text-sm p-4 rounded-xl border ${
                                  alertTone === "success"
                                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-200"
                                    : alertTone === "info"
                                      ? "bg-indigo-500/10 border-indigo-500/25 text-indigo-800 dark:text-indigo-200"
                                      : "bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-200"
                                }`}
                              >
                                {alertTone === "success" ? (
                                  <CheckCircle2 size={18} className="shrink-0" />
                                ) : (
                                  <AlertCircle size={18} className="shrink-0" />
                                )}
                                {error}
                              </div>
                            )}

                            {isAuthenticated ? (
                              <Button
                                type="submit"
                                fullWidth
                                isLoading={savingVoteId === question.id}
                                disabled={!selected || !voterName || !flat || !currentUser || authLoading}
                              >
                                Submit Vote
                              </Button>
                            ) : (
                              <div className="grid gap-3 sm:grid-cols-2">
                                <Button type="button" fullWidth onClick={() => setAuthModalOpen(true)}>
                                  Log in to vote
                                </Button>
                                <Button
                                  type="button"
                                  fullWidth
                                  variant="secondary"
                                  onClick={() => setAuthModalOpen(true)}
                                >
                                  Sign up
                                </Button>
                              </div>
                            )}
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
                  <p className="text-slate-600 dark:text-slate-300">No questions yet.</p>
                ) : (
                  questionResults.map(({ question, results, totalVotes }) => {
                    const isExpanded = expandedDetails[question.id] ?? false;
                    const timeline = voteTimelines[question.id] ?? [];
                    const eligibleFromEnvRaw = process.env.NEXT_PUBLIC_ELIGIBLE_VOTERS;
                    const eligibleFromEnv = eligibleFromEnvRaw ? Number(eligibleFromEnvRaw) : NaN;
                    const eligibleVoters =
                      Number.isFinite(eligibleFromEnv) && eligibleFromEnv > 0 ? eligibleFromEnv : null;
                    const participation =
                      eligibleVoters && eligibleVoters > 0
                        ? Math.round((totalVotes / eligibleVoters) * 100)
                        : null;
                    const chartData = results.map(({ option, count, percentage }) => ({
                      name: option.label.length > 22 ? `${option.label.slice(0, 22)}…` : option.label,
                      fullLabel: option.label,
                      count,
                      percentage,
                    }));

                    return (
                      <div
                        key={question.id}
                        className="p-6 rounded-2xl bg-white border border-black/10 space-y-4 shadow-[0_12px_30px_rgba(0,0,0,0.08)] dark:bg-white/5 dark:border-white/10 dark:shadow-none"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">
                              {question.status}
                            </p>
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{question.title}</h3>
                            {question.description && (
                              <p className="text-slate-700 text-sm dark:text-slate-300">{question.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right text-sm text-slate-600 dark:text-slate-400">
                              <div className="font-semibold text-slate-900 dark:text-white">{totalVotes}</div>
                              <div>votes</div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteQuestion(question.id)}
                              disabled={deletingId === question.id}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-black/10 text-slate-700 hover:bg-slate-100 transition disabled:opacity-50 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/10"
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

                        <div className="pt-4 mt-2 border-t border-black/10 dark:border-white/10">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedDetails((prev) => ({
                                ...prev,
                                [question.id]: !isExpanded,
                              }))
                            }
                            aria-expanded={isExpanded}
                            aria-controls={`question-details-${question.id}`}
                            className="flex items-center gap-2 text-sm font-semibold text-cyan-700 hover:text-cyan-600 transition-colors dark:text-cyan-200"
                          >
                            <ChevronDown
                              size={16}
                              className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                              aria-hidden
                            />
                            {isExpanded ? "Hide details" : "More details"}
                          </button>

                          {isExpanded && (
                            <div
                              id={`question-details-${question.id}`}
                              className="mt-4 space-y-4 text-slate-700 text-sm dark:text-slate-200"
                            >
                              <p className="text-slate-600 dark:text-slate-300">
                                Visual breakdown of how neighbours voted. Percentages are based on the total responses
                                collected for this question.
                              </p>

                              <div className="grid gap-3 sm:grid-cols-3">
                                <DetailStat label="Total votes cast" value={totalVotes.toLocaleString()} />
                                <DetailStat
                                  label="Eligible voters"
                                  value={
                                    eligibleVoters && eligibleVoters > 0
                                      ? eligibleVoters.toLocaleString()
                                      : "Not provided"
                                  }
                                />
                                <DetailStat
                                  label="Participation"
                                  value={participation !== null ? `${participation}%` : "—"}
                                  helper={
                                    participation !== null
                                      ? "Share of eligible voters who participated."
                                      : "Waiting on eligible voter data."
                                  }
                                />
                              </div>

                              <div className="rounded-2xl border border-black/5 bg-white/60 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-sm font-semibold text-slate-800 dark:text-white">Votes by option</h4>
                                  <span className="text-xs text-slate-500 dark:text-slate-400">
                                    Labels show share of total responses.
                                  </span>
                                </div>
                                <div className="h-64 mt-3">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.08)" />
                                      <XAxis
                                        dataKey="name"
                                        tickLine={false}
                                        axisLine={false}
                                        interval={0}
                                        tick={{ fill: "#475569", fontSize: 12 }}
                                      />
                                      <YAxis
                                        allowDecimals={false}
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fill: "#475569", fontSize: 12 }}
                                      />
                                      <Tooltip
                                        labelFormatter={(label, payload) =>
                                          payload?.[0]?.payload?.fullLabel ?? String(label)
                                        }
                                        formatter={(value: number) => [value, "Votes"]}
                                        contentStyle={{
                                          backgroundColor: "#ffffff",
                                          borderRadius: 12,
                                          border: "1px solid rgba(15,23,42,0.12)",
                                          color: "#0f172a",
                                          boxShadow: "0 18px 40px rgba(15,23,42,0.12)",
                                        }}
                                      />
                                      <Bar
                                        dataKey="count"
                                        radius={[8, 8, 8, 8]}
                                        fill={`url(#optionBarGradient-${question.id})`}
                                      >
                                        <LabelList
                                          dataKey="percentage"
                                          position="top"
                                          formatter={(value) => (typeof value === "number" ? `${value}%` : "")}
                                          fill="#0f172a"
                                          fontSize={12}
                                        />
                                      </Bar>
                                      <defs>
                                        <linearGradient id={`optionBarGradient-${question.id}`} x1="0" y1="0" x2="1" y2="0">
                                          <stop offset="0%" stopColor="#06b6d4" />
                                          <stop offset="100%" stopColor="#6366f1" />
                                        </linearGradient>
                                      </defs>
                                    </BarChart>
                                  </ResponsiveContainer>
                                </div>
                              </div>

                              {timeline.length > 0 && (
                                <div className="rounded-2xl border border-black/5 bg-white/60 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-semibold text-slate-800 dark:text-white">Votes over time</h4>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                      Daily cumulative totals.
                                    </span>
                                  </div>
                                  <div className="h-56 mt-3">
                                    <ResponsiveContainer width="100%" height="100%">
                                      <LineChart data={timeline} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.08)" />
                                        <XAxis
                                          dataKey="day"
                                          tickLine={false}
                                          axisLine={false}
                                          tick={{ fill: "#475569", fontSize: 12 }}
                                        />
                                        <YAxis
                                          allowDecimals={false}
                                          tickLine={false}
                                          axisLine={false}
                                          tick={{ fill: "#475569", fontSize: 12 }}
                                        />
                                        <Tooltip
                                          formatter={(value: number, key: string) =>
                                            key === "cumulative" ? [value, "Cumulative votes"] : [value, "New votes"]
                                          }
                                          contentStyle={{
                                            backgroundColor: "#ffffff",
                                            borderRadius: 12,
                                            border: "1px solid rgba(15,23,42,0.12)",
                                            color: "#0f172a",
                                            boxShadow: "0 18px 40px rgba(15,23,42,0.12)",
                                          }}
                                        />
                                        <Line
                                          type="monotone"
                                          dataKey="cumulative"
                                          stroke="#06b6d4"
                                          strokeWidth={3}
                                          dot={{ r: 4, strokeWidth: 2, stroke: "#06b6d4", fill: "#ffffff" }}
                                          activeDot={{ r: 5, strokeWidth: 2, stroke: "#6366f1", fill: "#ffffff" }}
                                        />
                                        <Line
                                          type="monotone"
                                          dataKey="count"
                                          stroke="#6366f1"
                                          strokeWidth={2}
                                          strokeDasharray="5 5"
                                          dot={{ r: 3, strokeWidth: 1.5, stroke: "#6366f1", fill: "#ffffff" }}
                                        />
                                      </LineChart>
                                    </ResponsiveContainer>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </section>
        </div>
      </GradientBG>

      <AuthPromptModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={() => {
          setAuthModalOpen(false);
          router.push("/login");
        }}
        onSignup={() => {
          setAuthModalOpen(false);
          router.push("/login?register=1");
        }}
      />
    </>
  );
}

function AuthPromptModal({
  open,
  onClose,
  onLogin,
  onSignup,
}: {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
  onSignup: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur">
      <div className="w-full max-w-md mx-4 rounded-2xl border border-black/10 bg-white p-6 shadow-2xl dark:border-white/15 dark:bg-slate-900">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Sign in to vote</h3>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            You need to be logged in to cast a vote in the owners’ voting portal.
          </p>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Button type="button" fullWidth onClick={onLogin}>
            Log in
          </Button>
          <Button type="button" fullWidth variant="secondary" onClick={onSignup}>
            Sign up
          </Button>
        </div>
        <div className="mt-3">
          <Button type="button" variant="ghost" fullWidth onClick={onClose} className="!justify-center">
            Cancel
          </Button>
        </div>
      </div>
    </div>
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
  const base =
    "inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition border backdrop-blur";
  const inactive = "bg-white/50 border-black/10 text-slate-700 hover:bg-white/70";
  const activeStyles = "bg-white border-black/15 text-slate-900 shadow-md";
  const darkInactive = "dark:bg-white/10 dark:border-white/15 dark:text-white/80 dark:hover:bg-white/15";
  const darkActive = "dark:bg-white/20 dark:border-white/20 dark:text-white dark:shadow-none";

  return (
    <button
      onClick={onClick}
      className={`${base} ${active ? activeStyles : inactive} ${active ? darkActive : darkInactive}`}
    >
      {icon}
      {label}
    </button>
  );
}

function DetailStat({ label, value, helper }: { label: string; value: string | number; helper?: string }) {
  return (
    <div className="rounded-xl border border-black/5 bg-white/50 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:border-white/10 dark:bg-white/5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">{label}</p>
      <p className="text-lg font-bold text-slate-900 dark:text-white mt-1 leading-tight">{value}</p>
      {helper && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">{helper}</p>}
    </div>
  );
}

function ResultRow({ option, count, percentage }: { option: Option; count: number; percentage: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm text-slate-800 dark:text-slate-200">
        <span>{option.label}</span>
        <span className="text-slate-500 dark:text-slate-400">
          {count} vote{count === 1 ? "" : "s"} • {Number.isFinite(percentage) ? percentage : 0}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-200 overflow-hidden dark:bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all"
          style={{ width: `${Number.isFinite(percentage) ? percentage : 0}%` }}
        />
      </div>
    </div>
  );
}
