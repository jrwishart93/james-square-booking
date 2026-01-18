"use client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import { collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
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
  normalizeFlat,
  submitVote,
} from "@/app/voting/services/storageService";
import type { Option, Question } from "@/app/voting/types";
import ResultsDonutChart from "@/app/voting/components/ResultsDonutChart";
import GradientBG from "@/components/GradientBG";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { DURATION_PRESETS, DurationPreset, getVoteStatus } from "@/lib/voteExpiry";

const deriveFirstName = (user: User | null): string => {
  if (!user) return "";
  const base = user.displayName?.trim() || user.email?.split("@")[0] || "";
  const first = base.split(/[\s._-]+/).find(Boolean) || "";
  return first ? first.charAt(0).toUpperCase() + first.slice(1) : "";
};

const formatVotingDate = (date: Date): string =>
  `${date.toLocaleString("en-GB", { dateStyle: "full", timeStyle: "short" })} (UK time)`;

type Tab = "ask" | "vote" | "results";

const VIEW_ONLY_MESSAGE = "Viewing only. Please log in or sign up to place a vote.";
const VOTE_RECORDED_MESSAGE = "Vote recorded";
const OWNERS_ACCESS_KEY = "owners_secure_access";

export default function OwnersVotingPage() {
  const router = useRouter();
  const { user: currentUser, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("vote");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [voteCounts, setVoteCounts] = useState<Record<string, Record<string, number>>>({});
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [savingVoteId, setSavingVoteId] = useState<string | null>(null);
  const [openDetailsId, setOpenDetailsId] = useState<string | null>(null);
  const [voteErrors, setVoteErrors] = useState<Record<string, string | null>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Ask tab state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [askErrors, setAskErrors] = useState<{
    title?: string;
    options?: string;
    startsAt?: string;
    endsAt?: string;
  }>({});
  const [askSuccess, setAskSuccess] = useState(false);
  const [submittingQuestion, setSubmittingQuestion] = useState(false);
  const [askSubmitError, setAskSubmitError] = useState<string | null>(null);
  const [durationPreset, setDurationPreset] = useState<DurationPreset>("1m");
  const [useCustomWindow, setUseCustomWindow] = useState(false);
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");

  // Vote tab state
  const [voterName, setVoterName] = useState("");
  const [flat, setFlat] = useState("");
  const isAuthenticated = Boolean(currentUser);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasAccess = sessionStorage.getItem(OWNERS_ACCESS_KEY) === "true";

    if (!hasAccess) {
      router.replace("/owners");
    }
  }, [router]);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? sessionStorage.getItem("ovh_username") : null;
    if (stored) setVoterName(stored);
    const storedFlat = typeof window !== "undefined" ? sessionStorage.getItem("ovh_flat") : null;
    if (storedFlat) setFlat(normalizeFlat(storedFlat));
  }, []);
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
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
      return;
    }

    const votesRef = collection(db, "voting_votes");
    setVoteCounts({});
    const unsubscribers = questions.map((question) => {
      const votesQuery = query(votesRef, where("questionId", "==", question.id));
      return onSnapshot(
        votesQuery,
        (snapshot) => {
          console.log("Votes returned:", snapshot.docs.map((d) => d.data()));
          const counts = snapshot.docs.reduce<Record<string, number>>((acc, doc) => {
            const data = doc.data() as Record<string, unknown>;
            const optionId = typeof data.optionId === "string" ? data.optionId : null;
            if (!optionId) return acc;
            acc[optionId] = (acc[optionId] ?? 0) + 1;
            return acc;
          }, {});

          setVoteCounts((prev) => ({ ...prev, [question.id]: counts }));
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
    const errs: {
      title?: string;
      options?: string;
      startsAt?: string;
      endsAt?: string;
    } = {};
    if (!title.trim()) errs.title = "Question title is required";
    const filled = options.filter((o) => o.trim().length > 0);
    if (filled.length < 2) errs.options = "Please provide at least 2 options";
    if (useCustomWindow) {
      if (!startsAt) errs.startsAt = "Please choose a start date and time";
      if (!endsAt) errs.endsAt = "Please choose an end date and time";

      if (startsAt && endsAt) {
        const startDate = new Date(startsAt);
        const endDate = new Date(endsAt);
        const now = new Date();

        if (Number.isNaN(startDate.getTime())) {
          errs.startsAt = "Start time is invalid";
        }

        if (Number.isNaN(endDate.getTime())) {
          errs.endsAt = "End time is invalid";
        }

        if (endDate <= startDate) {
          errs.endsAt = "End time must be after the start time";
        }

        if (startDate <= now) {
          errs.startsAt = "Start time must be in the future";
        }
      }
    }
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
    setAskSubmitError(null);
    if (!validateAsk()) {
      setAskSubmitError("Please fix the highlighted fields before publishing.");
      return;
    }
    setSubmittingQuestion(true);
    try {
      const filled = options.filter((o) => o.trim().length > 0);
      const customWindow = useCustomWindow
        ? { startsAt: new Date(startsAt), expiresAt: new Date(endsAt) }
        : undefined;
      await addQuestion(
        title.trim(),
        description.trim(),
        filled,
        useCustomWindow ? undefined : durationPreset,
        customWindow,
      );
      const qs = await getQuestions();
      setQuestions(qs);
      setAskSuccess(true);
      setAskSubmitError(null);
      setTitle("");
      setDescription("");
      setOptions(["", ""]);
      setDurationPreset("1m");
      setUseCustomWindow(false);
      setStartsAt("");
      setEndsAt("");
      setActiveTab("vote");
    } catch (error) {
      console.error("Failed to add question", error);
      setAskSubmitError("Failed to publish question. Please try again.");
    } finally {
      setSubmittingQuestion(false);
    }
  };

  const handleSubmitVote = async (event: React.FormEvent, question: Question) => {
    event.preventDefault();
    const startsAt =
      question.startsAt instanceof Date
        ? question.startsAt
        : question.startsAt
          ? new Date(question.startsAt)
          : null;
    const expiresAt =
      question.expiresAt instanceof Date
        ? question.expiresAt
        : question.expiresAt
          ? new Date(question.expiresAt)
          : null;
    const voteStatus = getVoteStatus(new Date(), expiresAt, startsAt);
    if (!voteStatus.isOpen) {
      setVoteErrors((prev) => ({
        ...prev,
        [question.id]: "Voting is not currently open.",
      }));
      return;
    }
    const name = voterName.trim();
    const flatValue = normalizeFlat(flat);
    const optionId = selectedOptions[question.id];
    if (!currentUser) {
      setVoteErrors((prev) => ({ ...prev, [question.id]: VIEW_ONLY_MESSAGE }));
      setAuthModalOpen(true);
      return;
    }
    if (!name) {
      setVoteErrors((prev) => ({ ...prev, [question.id]: "Please enter your name to vote." }));
      return;
    }
    if (!flatValue) {
      setVoteErrors((prev) => ({ ...prev, [question.id]: "Flat number is required to vote." }));
      return;
    }
    if (!optionId) {
      setVoteErrors((prev) => ({ ...prev, [question.id]: "Please select an option." }));
      return;
    }
    setSavingVoteId(question.id);
    setVoteErrors((prev) => ({ ...prev, [question.id]: null }));
    try {
      await submitVote(question.id, optionId, name, flatValue);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("ovh_username", name);
        sessionStorage.setItem("ovh_flat", flatValue);
      }
      const updatedSelections = { ...selectedOptions, [question.id]: optionId };
      setSelectedOptions(updatedSelections);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("ovh_vote_choices", JSON.stringify(updatedSelections));
      }
      const refreshedQuestions = await getQuestions();
      setQuestions(refreshedQuestions);
      setVoteErrors((prev) => ({ ...prev, [question.id]: VOTE_RECORDED_MESSAGE }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred while submitting.";
    setVoteErrors((prev) => ({ ...prev, [question.id]: message }));
    } finally {
      setSavingVoteId(null);
    }
  };

  const quickDurations: DurationPreset[] = ["3m", "1h", "1d"];
  const longDurations: DurationPreset[] = ["1w", "1m", "1y"];

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
          <header className="text-center space-y-3 bg-white/60 dark:bg-slate-900/30 backdrop-blur-md rounded-3xl px-6 py-8 shadow-[0_16px_60px_rgba(0,0,0,0.18)] dark:shadow-[0_14px_50px_rgba(0,0,0,0.3)]">
            <p className="text-xs md:text-sm uppercase tracking-[0.3em] font-semibold text-slate-700 dark:text-white/80">Owners • Community</p>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">Voting Hub</h1>
            <p className="text-slate-700 dark:text-white/80 font-medium text-sm md:text-base leading-relaxed max-w-3xl mx-auto">
              Ask a question, cast your vote, and review results. This voting section is available to owners only and requires secure access.
            </p>
          </header>

          <div className="flex justify-center gap-2 flex-wrap">
            <TabButton icon={<PenSquare size={16} />} label="Ask" active={activeTab === "ask"} onClick={() => setActiveTab("ask")} />
            <TabButton icon={<VoteIcon size={16} />} label="Vote" active={activeTab === "vote"} onClick={() => setActiveTab("vote")} />
            <TabButton icon={<BarChart3 size={16} />} label="Results" active={activeTab === "results"} onClick={() => setActiveTab("results")} />
          </div>

          <section className="p-6 md:p-10 space-y-8 text-slate-900 dark:text-white">
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
                {askSubmitError && (
                  <div className="flex items-center gap-3 text-sm bg-red-500/10 p-4 rounded-xl border border-red-500/20 text-red-700 dark:text-red-200">
                    <AlertCircle size={18} className="shrink-0" />
                    {askSubmitError}
                  </div>
                )}

                <div className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Voting window
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <input
                          type="radio"
                          name="voting-window"
                          checked={!useCustomWindow}
                          onChange={() => setUseCustomWindow(false)}
                          className="h-4 w-4 text-cyan-600 border-slate-300 focus:ring-cyan-500"
                        />
                        Use duration preset
                      </label>
                      <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <input
                          type="radio"
                          name="voting-window"
                          checked={useCustomWindow}
                          onChange={() => setUseCustomWindow(true)}
                          className="h-4 w-4 text-cyan-600 border-slate-300 focus:ring-cyan-500"
                        />
                        Set custom start &amp; end time
                      </label>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {DURATION_PRESETS.filter((preset) => quickDurations.includes(preset.value)).map((preset) => (
                        <button
                          key={preset.value}
                          type="button"
                          onClick={() => setDurationPreset(preset.value)}
                          disabled={useCustomWindow}
                          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70
          ${
            durationPreset === preset.value
              ? "bg-slate-900 text-white shadow-md shadow-black/10 dark:bg-white dark:text-slate-900 scale-[1.03]"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/10 dark:text-white/80 dark:hover:bg-white/20"
          } ${useCustomWindow ? "opacity-50 cursor-not-allowed" : ""}
        `}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {DURATION_PRESETS.filter((preset) => longDurations.includes(preset.value)).map((preset) => (
                        <button
                          key={preset.value}
                          type="button"
                          onClick={() => setDurationPreset(preset.value)}
                          disabled={useCustomWindow}
                          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70
          ${
            durationPreset === preset.value
              ? "bg-slate-900 text-white shadow-md shadow-black/10 dark:bg-white dark:text-slate-900 scale-[1.03]"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/10 dark:text-white/80 dark:hover:bg-white/20"
          } ${useCustomWindow ? "opacity-50 cursor-not-allowed" : ""}
        `}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {useCustomWindow && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <Input
                        type="datetime-local"
                        label="Voting starts (UK time)"
                        value={startsAt}
                        onChange={(e) => setStartsAt(e.target.value)}
                        error={askErrors.startsAt}
                      />
                      <Input
                        type="datetime-local"
                        label="Voting ends (UK time)"
                        value={endsAt}
                        onChange={(e) => setEndsAt(e.target.value)}
                        error={askErrors.endsAt}
                      />
                    </div>
                  )}

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {useCustomWindow
                      ? "Voting will open and close automatically based on the schedule above."
                      : `Voting will close ${DURATION_PRESETS.find((p) => p.value === durationPreset)?.label?.toLowerCase() ?? ""} after publishing.`}
                  </p>
                </div>

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
                    .filter((question) => {
                      const startsAt =
                        question.startsAt instanceof Date
                          ? question.startsAt
                          : question.startsAt
                            ? new Date(question.startsAt)
                            : null;
                      const expiresAt =
                        question.expiresAt instanceof Date
                          ? question.expiresAt
                          : question.expiresAt
                            ? new Date(question.expiresAt)
                            : null;
                      return getVoteStatus(new Date(now), expiresAt, startsAt).kind !== "closed";
                    })
                    .map((question) => {
                      const startsAt =
                        question.startsAt instanceof Date
                          ? question.startsAt
                          : question.startsAt
                            ? new Date(question.startsAt)
                            : null;
                      const expiresAt =
                        question.expiresAt instanceof Date
                          ? question.expiresAt
                          : question.expiresAt
                            ? new Date(question.expiresAt)
                            : null;
                      const voteStatus = getVoteStatus(new Date(now), expiresAt, startsAt);
                      const error = voteErrors[question.id];
                      const selected = selectedOptions[question.id] ?? null;
                      const selectionDisabled = authLoading || !isAuthenticated || !voteStatus.isOpen;
                      const isClosed = !voteStatus.isOpen;
                      const formattedStartsAt = startsAt ? formatVotingDate(startsAt) : null;
                      const formattedExpiresAt = expiresAt ? formatVotingDate(expiresAt) : null;
                      const alertTone = error === VOTE_RECORDED_MESSAGE
                        ? "success"
                        : error === VIEW_ONLY_MESSAGE
                          ? "info"
                          : "error";
                      return (
                        <div
                          key={question.id}
                          className="p-6 rounded-2xl bg-white border border-black/10 shadow-[0_16px_40px_rgba(0,0,0,0.08)] space-y-6 dark:bg-slate-900/60 dark:border-white/10 dark:shadow-[0_14px_40px_rgba(0,0,0,0.35)]"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="space-y-1">
                              <p className="text-xs uppercase tracking-[0.2em] text-slate-600 font-semibold dark:text-white/70">
                                Active poll
                              </p>
                              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{question.title}</h2>
                            </div>
                            <span
                              className={`inline-flex px-3 py-1 text-xs font-bold uppercase rounded-full border ${
                                voteStatus.kind === "closed"
                                  ? "bg-slate-100 text-slate-600 border-slate-200 dark:bg-white/10 dark:text-white/70 dark:border-white/15"
                                  : voteStatus.kind === "scheduled"
                                    ? "bg-amber-500/10 text-amber-700 border-amber-500/30 dark:text-amber-200 dark:bg-amber-500/15"
                                    : "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:text-emerald-200 dark:bg-emerald-500/15"
                              }`}
                            >
                              {voteStatus.label}
                            </span>
                          </div>
                          {question.description && (
                            <p className="text-slate-700 text-sm leading-relaxed dark:text-slate-200">{question.description}</p>
                          )}
                          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-white/15 dark:bg-white/10 dark:text-white/80">
                            {voteStatus.kind === "scheduled" && (
                              <div className="space-y-1">
                                {formattedStartsAt && (
                                  <div>
                                    Voting opens <span className="font-semibold text-slate-800 dark:text-white">{formattedStartsAt}</span>
                                  </div>
                                )}
                                {formattedExpiresAt && (
                                  <div>
                                    Voting closes <span className="font-semibold text-slate-800 dark:text-white">{formattedExpiresAt}</span>
                                  </div>
                                )}
                              </div>
                            )}
                            {voteStatus.kind === "open" && (
                              <div className="space-y-1">
                                <div className="font-semibold text-slate-800 dark:text-white">Voting is open</div>
                                {formattedExpiresAt && (
                                  <div>
                                    Closes <span className="font-semibold text-slate-800 dark:text-white">{formattedExpiresAt}</span>
                                  </div>
                                )}
                              </div>
                            )}
                            {voteStatus.kind === "closed" && (
                              <div className="space-y-1">
                                {formattedExpiresAt && (
                                  <div>
                                    Voting closed <span className="font-semibold text-slate-800 dark:text-white">{formattedExpiresAt}</span>
                                  </div>
                                )}
                                <div>Results are now available below.</div>
                              </div>
                            )}
                          </div>

                          <form onSubmit={(e) => handleSubmitVote(e, question)} className="space-y-4">
                            <div className="space-y-4">
                              {question.options.map((opt) => {
                                const isSelected = selected === opt.id;
                                return (
                                  <label
                                    key={opt.id}
                                    onClick={() => {
                                      if (!voteStatus.isOpen) return;
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
                                disabled={
                                  !selected ||
                                  !voterName ||
                                  !flat ||
                                  !currentUser ||
                                  authLoading ||
                                  !voteStatus.isOpen
                                }
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
                    const startsAt =
                      question.startsAt instanceof Date
                        ? question.startsAt
                        : question.startsAt
                          ? new Date(question.startsAt)
                          : null;
                    const expiresAt =
                      question.expiresAt instanceof Date
                        ? question.expiresAt
                        : question.expiresAt
                          ? new Date(question.expiresAt)
                          : null;
                    const voteStatus = getVoteStatus(new Date(now), expiresAt, startsAt);
                    const chartData = results.map(({ option, count }) => ({
                      name: option.label,
                      value: count,
                    }));

                    return (
                      <div
                        key={question.id}
                        className="p-6 rounded-2xl bg-white border border-black/10 space-y-4 shadow-[0_12px_30px_rgba(0,0,0,0.08)] dark:bg-slate-900/60 dark:border-white/10 dark:shadow-[0_10px_30px_rgba(0,0,0,0.28)]"
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
                            <span
                              className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${
                                voteStatus.kind === "closed"
                                  ? "bg-slate-100 text-slate-600 border-slate-200 dark:bg-white/10 dark:text-white/70 dark:border-white/15"
                                  : voteStatus.kind === "scheduled"
                                    ? "bg-amber-500/10 text-amber-700 border-amber-500/30 dark:text-amber-200 dark:bg-amber-500/15"
                                    : "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:text-emerald-200 dark:bg-emerald-500/15"
                              }`}
                            >
                              {voteStatus.label}
                            </span>
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

                        <button
                          onClick={() =>
                            setOpenDetailsId((prev) => (prev === question.id ? null : question.id))
                          }
                          className="mt-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium bg-white/70 backdrop-blur border border-slate-200 text-slate-800 shadow-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900/15 dark:bg-slate-800/80 dark:border-slate-500 dark:text-white dark:hover:bg-slate-700 dark:focus-visible:ring-2 dark:focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 dark:focus-visible:ring-white/35"
                        >
                          {openDetailsId === question.id ? "Hide details" : "More details"}
                        </button>

                        {openDetailsId === question.id && (
                          <div className="mt-4 space-y-4">
                            <ResultsDetails data={chartData} />
                          </div>
                        )}
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

function ResultsDetails({ data }: { data: { name: string; value: number }[] }) {
  if (!data.length) {
    return (
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Detailed visual summary will appear here.
      </p>
    );
  }

  return (
    <div className="rounded-2xl bg-slate-100/60 p-6 dark:bg-white/8">
      <ResultsDonutChart data={data} />
    </div>
  );
}
