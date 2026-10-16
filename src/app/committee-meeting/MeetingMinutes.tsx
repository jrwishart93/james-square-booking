"use client";
import { Fragment, useRef } from "react";
import { ChevronDown, ClipboardCheck, FileText } from "lucide-react";
import { DateTime } from "luxon";
import { minutesActions, type Minutes } from "@/lib/committeeMinutes";
import { card, muted, primary, secondary } from "./styles";

const dateLabel = (date: string) =>
  DateTime.fromISO(date).setLocale("en-GB").toFormat("cccc d LLLL yyyy");

/** Turns bare URLs in the minutes text into links. */
function Linked({ text }: { text: string }) {
  return text.split(/(https?:\/\/\S+)/).map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a
        key={i}
        href={part}
        className="font-medium text-blue-700 underline underline-offset-2 dark:text-blue-300"
      >
        {part.replace(/^https?:\/\/(www\.)?/, "")}
      </a>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

export default function MeetingMinutes({
  minutes,
  latest,
  expanded,
  onToggle,
  onGetInvolved,
}: {
  minutes: Minutes;
  latest: boolean;
  expanded: boolean;
  onToggle: () => void;
  onGetInvolved: () => void;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  const bodyId = `minutes-${minutes.meetingId}-full`;
  const actions = minutesActions(minutes);
  const toggle = (fromBottom = false) => {
    onToggle();
    // Collapsing from the end of a long document would leave the reader far
    // down the page, so bring them back to the minutes heading.
    if (fromBottom) {
      heading.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "start",
      });
      heading.current?.focus({ preventScroll: true });
    }
  };
  return (
    <article
      id={`minutes-${minutes.meetingId}`}
      aria-labelledby={`minutes-${minutes.meetingId}-heading`}
      className={`${card} scroll-mt-24 border-t-4 border-t-emerald-700`}
    >
      <div className="flex flex-wrap items-center gap-2">
        {latest && (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
            Latest minutes
          </span>
        )}
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            minutes.status === "approved"
              ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
              : "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200"
          }`}
        >
          {minutes.status === "approved"
            ? "Approved"
            : "Draft · subject to approval at the next meeting"}
        </span>
      </div>
      <h3
        ref={heading}
        tabIndex={-1}
        id={`minutes-${minutes.meetingId}-heading`}
        className="mt-4 flex scroll-mt-24 items-start gap-2 text-xl font-semibold sm:text-2xl"
      >
        <FileText
          size={22}
          aria-hidden="true"
          className="mt-1 shrink-0 text-emerald-700 dark:text-emerald-300"
        />
        Owners’ Committee Meeting · {dateLabel(minutes.date)}
      </h3>
      <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[auto_1fr]">
        <dt className="font-medium">Time</dt>
        <dd className={muted}>{minutes.time}</dd>
        <dt className="font-medium">Location</dt>
        <dd className={muted}>{minutes.location}</dd>
        <dt className="font-medium">Committee present</dt>
        <dd className={muted}>{minutes.present.join(", ")}</dd>
      </dl>
      <div className="mt-5 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
        <h4 className="text-sm font-semibold">Key points</h4>
        <ul className={`mt-2 list-disc space-y-1.5 pl-5 ${muted}`}>
          {minutes.keyPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={bodyId}
          onClick={() => toggle()}
          className={primary}
        >
          {expanded ? "Hide full minutes" : "Read full minutes"}
          <ChevronDown
            size={18}
            aria-hidden="true"
            className={`transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </button>
        <button type="button" onClick={onGetInvolved} className={secondary}>
          Volunteer or join the Committee
        </button>
      </div>
      {/* Always rendered so the browser's find-in-page can reach it. */}
      <div id={bodyId} hidden={!expanded}>
        <div className="mt-7 border-t border-slate-200 pt-7 dark:border-slate-700">
          {actions.length > 0 && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/40">
              <h4 className="flex items-center gap-2 text-sm font-semibold text-emerald-950 dark:text-emerald-100">
                <ClipboardCheck size={17} aria-hidden="true" />
                Ongoing actions
              </h4>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-emerald-950 dark:text-emerald-100">
                {actions.map((a) => (
                  <li key={a.text}>
                    <span className="font-semibold">{a.section}:</span> {a.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <ol className="mt-6 space-y-8">
            {minutes.sections.map((section, i) => (
              <li key={section.title}>
                <h4 className="flex gap-3 text-lg font-semibold">
                  <span
                    aria-hidden="true"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {i + 1}
                  </span>
                  <span>
                    <span className="sr-only">{i + 1}. </span>
                    {section.title}
                  </span>
                </h4>
                <div className="mt-3 space-y-3 text-[0.95rem] leading-relaxed text-slate-700 sm:pl-10 dark:text-slate-300">
                  {section.blocks.map((block, j) => {
                    switch (block.type) {
                      case "h":
                        return (
                          <h5
                            key={j}
                            className="pt-2 font-semibold text-slate-900 dark:text-slate-100"
                          >
                            {block.text}
                          </h5>
                        );
                      case "list":
                        return (
                          <ul key={j} className="list-disc space-y-1 pl-5">
                            {block.items.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        );
                      case "action":
                        return (
                          <p
                            key={j}
                            className="rounded-lg border-l-4 border-emerald-600 bg-emerald-50 px-4 py-3 text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-100"
                          >
                            <span className="font-semibold">
                              Ongoing action:
                            </span>{" "}
                            {block.text}
                          </p>
                        );
                      default:
                        return (
                          <p key={j}>
                            <Linked text={block.text} />
                          </p>
                        );
                    }
                  })}
                </div>
              </li>
            ))}
          </ol>
          <p
            className={`mt-8 border-t border-slate-200 pt-5 dark:border-slate-700 ${muted}`}
          >
            {minutes.closing}
          </p>
          <button
            type="button"
            aria-controls={bodyId}
            aria-expanded={expanded}
            onClick={() => toggle(true)}
            className={`mt-5 ${secondary}`}
          >
            Hide full minutes
            <ChevronDown size={18} aria-hidden="true" className="rotate-180" />
          </button>
        </div>
      </div>
    </article>
  );
}
