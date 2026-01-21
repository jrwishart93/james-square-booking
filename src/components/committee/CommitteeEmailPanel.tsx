"use client";

import { useMemo, useState } from "react";

import { auth } from "@/lib/firebase";
import { sendCommitteeEmailRequest } from "@/lib/client/sendCommitteeEmailRequest";

const FROM_EMAIL = "committee@james-square.com";

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const parseRecipients = (value: string) => {
  const parts = value
    .split(/[\n,]+/)
    .map((entry) => entry.trim())
    .filter(Boolean);
  return Array.from(new Set(parts));
};

type StatusTone = "idle" | "loading" | "success" | "error";

type StatusState = {
  tone: StatusTone;
  message: string;
};

export default function CommitteeEmailPanel() {
  const [recipientsText, setRecipientsText] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<StatusState>({ tone: "idle", message: "" });

  // TODO: Recipient selection from the registered user list (owners, tenants, holiday lets) will
  // be added once committee access is role-based and this section is further secured.

  const recipients = useMemo(() => parseRecipients(recipientsText), [recipientsText]);
  const invalidRecipients = useMemo(
    () => recipients.filter((recipient) => !isValidEmail(recipient)),
    [recipients],
  );
  const recipientCount = recipients.length;
  const isBulkSend = recipientCount > 1;

  const handleSend = async () => {
    setStatus({ tone: "idle", message: "" });

    if (recipients.length === 0) {
      setStatus({ tone: "error", message: "Enter at least one recipient email." });
      return;
    }

    if (invalidRecipients.length > 0) {
      setStatus({
        tone: "error",
        message: "One or more recipient emails are invalid. Please review the list.",
      });
      return;
    }

    if (!subject.trim() || !message.trim()) {
      setStatus({ tone: "error", message: "Subject and message are required." });
      return;
    }

    try {
      setStatus({ tone: "loading", message: "Sending email…" });
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : undefined;

      const response = await sendCommitteeEmailRequest(
        {
          subject: subject.trim(),
          message: message.trim(),
          recipients,
        },
        token,
      );

      setStatus({
        tone: "success",
        message: `Email sent to ${response?.recipients ?? recipientCount} recipient(s).`,
      });
      setRecipientsText("");
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error("Committee email send failed", error);
      setStatus({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to send email. Please try again.",
      });
    }
  };

  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Send Committee Email</h2>
        <p className="text-sm text-[color:var(--text-muted)]">
          Send a live committee message from the official committee address. Recipients must
          be entered manually.
        </p>
      </div>

      <div className="rounded-2xl border border-amber-200/70 bg-amber-50 px-4 py-4 text-sm text-amber-900 dark:border-amber-400/30 dark:bg-amber-900/20 dark:text-amber-100">
        <p className="font-semibold">This is a live email tool.</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>The platform is limited to approximately 3,000 emails per month.</li>
          <li>Daily sending is capped at around 100 emails.</li>
          <li>Please use this sparingly and only for essential committee communications.</li>
        </ul>
      </div>

      <div className="rounded-2xl border border-white/20 bg-white/60 p-4 text-xs text-[color:var(--text-muted)] dark:bg-white/10">
        Access to the resident user list will be added in a future update once this section is
        more secure.
      </div>

      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium" htmlFor="committee-email-from">
            From
          </label>
          <input
            id="committee-email-from"
            value={FROM_EMAIL}
            readOnly
            className="mt-1 w-full rounded-xl border border-[color:var(--glass-border)] bg-white/70 px-3 py-2 text-sm text-[color:var(--text-primary)] shadow-inner focus:outline-none dark:bg-white/10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium" htmlFor="committee-email-to">
            To (manual entry)
          </label>
          <textarea
            id="committee-email-to"
            value={recipientsText}
            onChange={(event) => setRecipientsText(event.target.value)}
            rows={3}
            placeholder="e.g. resident1@email.com, resident2@email.com"
            className="mt-1 w-full rounded-xl border border-[color:var(--glass-border)] bg-white/70 px-3 py-2 text-sm text-[color:var(--text-primary)] shadow-inner focus:outline-none dark:bg-white/10"
          />
          <p className="mt-1 text-xs text-[color:var(--text-muted)]">
            Separate multiple addresses with commas or new lines. Recipient emails are not saved.
          </p>
          {invalidRecipients.length > 0 && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              Invalid emails detected: {invalidRecipients.join(", ")}.
            </p>
          )}
          {isBulkSend && (
            <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
              Multiple recipients will be sent via BCC. The visible To address will be{" "}
              {FROM_EMAIL}.
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium" htmlFor="committee-email-subject">
            Subject
          </label>
          <input
            id="committee-email-subject"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Enter subject"
            className="mt-1 w-full rounded-xl border border-[color:var(--glass-border)] bg-white/70 px-3 py-2 text-sm text-[color:var(--text-primary)] shadow-inner focus:outline-none dark:bg-white/10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium" htmlFor="committee-email-message">
            Message
          </label>
          <textarea
            id="committee-email-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={6}
            placeholder="Write a clear, respectful message."
            className="mt-1 w-full rounded-xl border border-[color:var(--glass-border)] bg-white/70 px-3 py-2 text-sm text-[color:var(--text-primary)] shadow-inner focus:outline-none dark:bg-white/10"
          />
        </div>

        <div className="rounded-xl border border-white/20 bg-white/60 px-4 py-3 text-sm text-[color:var(--text-muted)] dark:bg-white/10">
          Recipients: <strong>{recipientCount}</strong>. Messages to multiple recipients are
          delivered via BCC to protect privacy.
        </div>

        {status.message && (
          <p
            className={
              status.tone === "error"
                ? "text-sm text-red-600 dark:text-red-400"
                : status.tone === "success"
                  ? "text-sm text-emerald-600 dark:text-emerald-400"
                  : status.tone === "loading"
                    ? "text-sm text-[color:var(--text-muted)]"
                    : "text-sm text-[color:var(--text-muted)]"
            }
            aria-live="polite"
          >
            {status.message}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSend}
            disabled={status.tone === "loading"}
            className="rounded-full px-4 py-2 text-sm font-semibold jqs-glass hover:brightness-[1.05] transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status.tone === "loading" ? "Sending…" : "Send email"}
          </button>
          <span className="text-xs text-[color:var(--text-muted)]">
            Messages are sent immediately and cannot be recalled.
          </span>
        </div>
      </div>
    </section>
  );
}
