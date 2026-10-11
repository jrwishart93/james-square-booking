"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Send, CheckCircle2 } from "lucide-react";
import {
  meetingLabel,
  type Attendance,
  type Meeting,
} from "@/lib/committeeMeetings";
import { input, muted, primary } from "./styles";
type Props = {
  kind: "rsvp" | "membership";
  meetings: Meeting[];
  selectedId?: string;
  onMeetingChange?: (id: string) => void;
  attendance?: Attendance;
  onAttendanceChange?: (value: Attendance) => void;
};
export default function RequestForm({
  kind,
  meetings,
  selectedId,
  onMeetingChange,
  attendance,
  onAttendanceChange,
}: Props) {
  const [whatsapp, setWhatsapp] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    message: string;
    requestId: string;
  } | null>(null);
  const prefix = kind === "rsvp" ? "attendance" : "membership";
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
    const form = new FormData(event.currentTarget);
    setSending(true);
    setError("");
    try {
      const response = await fetch("/api/committee-meetings/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          name: form.get("name"),
          email: form.get("email"),
          property: form.get("property"),
          message: form.get("message"),
          meetingId: selectedId ?? "",
          attendance: attendance ?? "",
          whatsapp,
          phone: form.get("phone") ?? "",
          privacy: form.get("privacy") === "on",
          website: form.get("website"),
        }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error ?? "We could not submit your request.");
      setResult(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Please try again later.",
      );
    } finally {
      setSending(false);
    }
  };
  if (result)
    return (
      <div
        role="status"
        className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100"
      >
        <CheckCircle2 aria-hidden="true" className="mb-3 h-6 w-6" />
        <p>{result.message}</p>
        <p className="mt-3 break-all text-xs">
          Your reference: {result.requestId}
        </p>
        <button
          type="button"
          className="mt-4 min-h-11 underline"
          onClick={() => setResult(null)}
        >
          Submit another request
        </button>
      </div>
    );
  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label htmlFor={`${prefix}-name`} className="text-sm font-medium">
          Full name (required)
          <input
            id={`${prefix}-name`}
            name="name"
            autoComplete="name"
            required
            maxLength={120}
            className={input}
          />
        </label>
        <label htmlFor={`${prefix}-email`} className="text-sm font-medium">
          Email address (required)
          <input
            id={`${prefix}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            className={input}
          />
        </label>
      </div>
      <label
        htmlFor={`${prefix}-property`}
        className="block text-sm font-medium"
      >
        Flat / Property Address (required)
        <input
          id={`${prefix}-property`}
          name="property"
          autoComplete="street-address"
          placeholder="Your flat and address at James Square, Caledonian Crescent, Edinburgh"
          aria-describedby={`${prefix}-property-help`}
          required
          maxLength={300}
          className={input}
        />
      </label>
      <p id={`${prefix}-property-help`} className={muted}>
        Enter your property details in the format you normally use. Flat numbers
        and free-text addresses are welcome.
      </p>
      {kind === "rsvp" && (
        <div className="grid gap-5 sm:grid-cols-2">
          <label htmlFor="attendance-meeting" className="text-sm font-medium">
            Which meeting would you like to attend? (required)
            <select
              id="attendance-meeting"
              required
              value={selectedId}
              onChange={(e) => onMeetingChange?.(e.target.value)}
              className={input}
            >
              <option value="" disabled>
                Select a meeting
              </option>
              {meetings.map((m) => (
                <option key={m.id} value={m.id}>
                  {meetingLabel(m)}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor="attendance-method" className="text-sm font-medium">
            How would you like to attend? (required)
            <select
              id="attendance-method"
              required
              value={attendance}
              onChange={(e) =>
                onAttendanceChange?.(e.target.value as Attendance)
              }
              className={input}
            >
              <option value="unsure">Not sure yet</option>
              <option value="online">Online via Microsoft Teams</option>
              <option value="in-person">In person at the Conservatory</option>
            </select>
          </label>
        </div>
      )}
      <label
        htmlFor={`${prefix}-message`}
        className="block text-sm font-medium"
      >
        {kind === "rsvp"
          ? "Anything you would like to raise?"
          : "Tell us a little about your interest in joining the committee."}{" "}
        (optional)
        <textarea
          id={`${prefix}-message`}
          name="message"
          rows={4}
          maxLength={4000}
          className={input}
          placeholder={
            kind === "rsvp"
              ? "If there are any points you would like the committee to be aware of ahead of the meeting, please include them here."
              : "Your interests, experience or ideas for James Square"
          }
        />
      </label>
      {kind === "rsvp" ? (
        <p className={muted}>
          Submitting a discussion point does not guarantee that it will be
          included in the meeting agenda.
        </p>
      ) : (
        <>
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={whatsapp}
              onChange={(e) => setWhatsapp(e.target.checked)}
              className="mt-1 h-5 w-5 shrink-0 accent-blue-700"
            />
            I would also like to be added to the Committee WhatsApp group.
          </label>
          {whatsapp && (
            <label
              htmlFor="membership-phone"
              className="block text-sm font-medium"
            >
              Mobile / WhatsApp Number (required)
              <input
                id="membership-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="Include your international prefix, e.g. +44"
                required
                maxLength={40}
                className={input}
              />
            </label>
          )}
          <p className={muted}>
            The private Committee WhatsApp group is separate from the Community
            group. Providing a number does not automatically add you. Membership
            and eligibility will be reviewed in accordance with the
            constitution.
          </p>
        </>
      )}
      <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            name="privacy"
            required
            className="mt-1 h-5 w-5 shrink-0 accent-blue-700"
          />
          <span>
            I understand that my details will be securely stored and shared with
            authorised committee members to review and respond to this request.
            Requests are retained for up to 180 days. Read the{" "}
            <Link
              href="/privacy"
              className="text-blue-700 underline dark:text-blue-300"
            >
              privacy notice
            </Link>
            .
          </span>
        </label>
      </div>
      <div aria-hidden="true" className="hidden">
        <label>
          Leave this field empty
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={sending || (kind === "rsvp" && !meetings.length)}
        className={primary}
      >
        <Send size={17} aria-hidden="true" />
        {sending
          ? "Submitting…"
          : kind === "rsvp"
            ? "Send attendance request"
            : "Send membership enquiry"}
      </button>
      <p className={muted}>
        All requests are reviewed by the committee. Access codes, committee
        membership and website permissions are never granted automatically.
      </p>
    </form>
  );
}
