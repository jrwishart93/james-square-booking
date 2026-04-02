"use client";

import { motion } from "framer-motion";
import {
  CalendarDays,
  Clock3,
  FileText,
  MapPin,
  Sparkles,
  Users,
  ChevronRight,
  Download,
  ExternalLink,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const AGM_EVENT = {
  title: "James Square Annual General Meeting 2026",
  dateLabel: "Thursday, 4 June 2026",
  timeLabel: "7:00 PM (UK time)",
  location: "Online via Microsoft Teams",
  description:
    "Join the James Square residents AGM to review the year, discuss key estate matters, and vote on important community decisions.",
  startUtc: "2026-06-04T18:00:00.000Z",
  endUtc: "2026-06-04T19:30:00.000Z",
};

function formatDateForGoogle(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function toIcsDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function createIcsFile() {
  const uid = `agm-2026-${Date.now()}@james-square.com`;
  const createdAt = toIcsDate(new Date());
  const dtStart = toIcsDate(new Date(AGM_EVENT.startUtc));
  const dtEnd = toIcsDate(new Date(AGM_EVENT.endUtc));

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//James Square//AGM 2026//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${createdAt}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${AGM_EVENT.title}`,
    `LOCATION:${AGM_EVENT.location}`,
    `DESCRIPTION:${AGM_EVENT.description}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "james-square-agm-2026.ics";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

function useCountdown(targetIso: string) {
  const target = useMemo(() => new Date(targetIso).getTime(), [targetIso]);
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const distance = Math.max(0, target - now);
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  return { days, hours, minutes, seconds, isLive: distance <= 0 };
}

export default function AGMPage() {
  const countdown = useCountdown(AGM_EVENT.startUtc);

  const googleCalendarUrl = useMemo(() => {
    const start = formatDateForGoogle(new Date(AGM_EVENT.startUtc));
    const end = formatDateForGoogle(new Date(AGM_EVENT.endUtc));
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: AGM_EVENT.title,
      dates: `${start}/${end}`,
      details: AGM_EVENT.description,
      location: AGM_EVENT.location,
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }, []);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <motion.section
        initial="hidden"
        animate="show"
        variants={staggerContainer}
        className="overflow-hidden rounded-3xl border border-white/25 bg-gradient-to-br from-sky-950 via-slate-900 to-cyan-950 p-6 text-white shadow-2xl backdrop-blur-sm sm:p-10"
      >
        <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-cyan-100">
          <Sparkles className="h-3.5 w-3.5" />
          James Square 2026 Meeting Notice
        </motion.div>

        <motion.h1 variants={fadeUp} className="text-3xl font-semibold tracking-tight sm:text-5xl">
          AGM 2026
        </motion.h1>

        <motion.p variants={fadeUp} className="mt-4 max-w-3xl text-base text-slate-200 sm:text-lg">
          A focused, professional annual meeting for James Square residents covering governance, financial updates,
          maintenance priorities, and committee actions for the year ahead.
        </motion.p>

        <motion.div
          variants={staggerContainer}
          className="mt-8 grid gap-3 sm:grid-cols-3"
        >
          {[
            { icon: CalendarDays, label: AGM_EVENT.dateLabel },
            { icon: Clock3, label: AGM_EVENT.timeLabel },
            { icon: MapPin, label: AGM_EVENT.location },
          ].map((item) => (
            <motion.div
              key={item.label}
              variants={fadeUp}
              whileHover={{ y: -3, scale: 1.01 }}
              className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur"
            >
              <item.icon className="mb-2 h-5 w-5 text-cyan-200" />
              <p className="text-sm text-slate-100">{item.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={createIcsFile}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow hover:bg-slate-100"
          >
            <Download className="h-4 w-4" />
            Add to Apple Calendar
          </motion.button>
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/20"
          >
            <ExternalLink className="h-4 w-4" />
            Add to Google Calendar
          </motion.a>
        </motion.div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {[
          {
            icon: Users,
            title: "Attendance",
            body: "All residents are encouraged to attend. Please ensure your contact details with Myreside are up to date.",
          },
          {
            icon: FileText,
            title: "Preparation",
            body: "If you wish to propose agenda points, submit them ahead of the meeting to allow proper circulation and review.",
          },
          {
            icon: Clock3,
            title: "Countdown",
            body: countdown.isLive
              ? "The AGM has started. Please join the Teams session now."
              : `${countdown.days}d ${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s until start.`,
          },
        ].map((card) => (
          <motion.article
            key={card.title}
            variants={fadeUp}
            whileHover={{ y: -4, scale: 1.01 }}
            className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-md backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/70"
          >
            <card.icon className="h-5 w-5 text-cyan-600" />
            <h2 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">{card.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{card.body}</p>
          </motion.article>
        ))}
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
        className="mt-8 rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-md backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/70"
      >
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Agenda</h2>
        <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {[
            "Welcome and confirmation of quorum",
            "Approval of previous AGM minutes",
            "Financial overview and service charge update",
            "Building maintenance and planned works for 2026/27",
            "Committee and factor updates",
            "Resident questions and voting resolutions",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-cyan-600" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="mt-8 grid gap-4 md:grid-cols-2"
      >
        <motion.article
          variants={fadeUp}
          whileHover={{ y: -3 }}
          className="rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-md backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/70"
        >
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Documents</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
            <li>• AGM Notice 2026 (PDF)</li>
            <li>• Draft Budget Summary 2026/27 (PDF)</li>
            <li>• Previous AGM Minutes (PDF)</li>
          </ul>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Final document links will be published ahead of the meeting.
          </p>
        </motion.article>

        <motion.article
          variants={fadeUp}
          whileHover={{ y: -3 }}
          className="rounded-2xl border border-cyan-300/40 bg-cyan-50/70 p-6 shadow-md backdrop-blur dark:border-cyan-700/40 dark:bg-cyan-950/20"
        >
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">RSVP & Attend</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            Please confirm attendance with Myreside and submit any agenda requests before Friday, 22 May 2026.
            Joining details for Microsoft Teams will be circulated to registered residents.
          </p>
          <motion.a
            whileHover={{ x: 2 }}
            href="mailto:info@myreside.com?subject=James%20Square%20AGM%202026%20RSVP"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
          >
            Confirm attendance
            <ChevronRight className="h-4 w-4" />
          </motion.a>
        </motion.article>
      </motion.section>
    </main>
  );
}
