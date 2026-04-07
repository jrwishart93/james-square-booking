"use client";

import { motion } from "framer-motion";
import { CalendarDays, Clock3, Copy, ExternalLink, Mail, MapPin } from "lucide-react";
import { useMemo, useState } from "react";

const AGM_EVENT = {
  title: "James Square – AGM 2026",
  dateLabel: "04 June 2026",
  timeLabel: "19:00 – 21:00 (GMT)",
  location: "Online via Microsoft Teams",
  meetingUrl: "https://teams.live.com/meet/9324822330074?p=1OEuybKPe9fZKrF27P",
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function AGMPage() {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  const agendaMailto = useMemo(() => {
    const params = new URLSearchParams({
      cc: "committee@james-square.com",
      subject: "James Square AGM 2026 – Agenda Request",
      body: "I would like to acknowledge receipt of the information about the AGM in June 2026.\r\n\r\nCould I request the following is discussed ahead of or during the meeting:\r\n\r\n[Please enter your request here]\r\n\r\nMy details are:\r\nName:\r\nEmail:\r\nContact Number:\r\nProperty / Flat:",
    });

    return `mailto:ania@myreside-management.co.uk?${params.toString()}`;
  }, []);

  const copyMeetingLink = async () => {
    try {
      await navigator.clipboard.writeText(AGM_EVENT.meetingUrl);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }

    window.setTimeout(() => {
      setCopyState("idle");
    }, 2000);
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <motion.section
        initial="hidden"
        animate="show"
        variants={staggerContainer}
        className="rounded-3xl border border-white/25 bg-gradient-to-br from-sky-950 via-slate-900 to-cyan-950 p-6 text-white shadow-2xl backdrop-blur-sm sm:p-10"
      >
        <motion.h1 variants={fadeUp} className="text-3xl font-semibold tracking-tight sm:text-5xl">
          AGM 2026
        </motion.h1>

        <motion.p variants={fadeUp} className="mt-4 max-w-3xl text-base text-slate-200 sm:text-lg">
          This page is for Owners at James Square ahead of the AGM. Please review the details below and submit any
          items you would like raised in advance.
        </motion.p>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
        className="mt-8 rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-md backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/70"
      >
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{AGM_EVENT.title}</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            { icon: CalendarDays, label: `Date: ${AGM_EVENT.dateLabel}` },
            { icon: Clock3, label: `Time: ${AGM_EVENT.timeLabel}` },
            { icon: MapPin, label: AGM_EVENT.location },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-700/70 dark:bg-slate-800/60"
            >
              <item.icon className="mb-2 h-5 w-5 text-cyan-600" />
              <p className="text-sm text-slate-800 dark:text-slate-200">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href={AGM_EVENT.meetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-cyan-500"
          >
            Join AGM meeting
            <ExternalLink className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={copyMeetingLink}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            <Copy className="h-4 w-4" />
            {copyState === "copied" ? "Meeting link copied" : copyState === "error" ? "Copy failed" : "Copy meeting link"}
          </button>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
        className="mt-8 rounded-2xl border border-cyan-300/40 bg-cyan-50/70 p-6 shadow-md backdrop-blur dark:border-cyan-700/40 dark:bg-cyan-950/20"
      >
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Submit an agenda item</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Owners are encouraged to submit any topics, questions, or concerns in advance of the AGM.
        </p>

        <a
          href={agendaMailto}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
        >
          <Mail className="h-4 w-4" />
          Email agenda request
        </a>
      </motion.section>
    </main>
  );
}
