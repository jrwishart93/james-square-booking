"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Check, Copy, Mail, Send, X } from "lucide-react";
import {
  meetingLabel,
  type Attendance,
  type Meeting,
} from "@/lib/committeeMeetings";
import { input, muted, primary, secondary } from "./styles";
import {
  buildRequestEmail,
  gmailHref,
  mailtoHref,
  outlookHref,
  plainTextEmail,
  type RequestEmail,
} from "./requestEmail";
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
  const [email, setEmail] = useState<RequestEmail | null>(null);
  const prefix = kind === "rsvp" ? "attendance" : "membership";
  // The request is sent from the owner's own email account: the form only
  // prepares the message. Nothing is stored on, or sent by, the website.
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const text = (key: string) => String(form.get(key) ?? "");
    const meeting = meetings.find((m) => m.id === selectedId);
    setEmail(
      buildRequestEmail({
        kind,
        name: text("name"),
        email: text("email"),
        property: text("property"),
        message: text("message"),
        meeting: meeting
          ? `${meetingLabel(meeting)}${meeting.time ? `, ${meeting.time}` : ""}`
          : undefined,
        attendance: attendance ?? "",
        whatsapp,
        phone: text("phone"),
      }),
    );
  };
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
      <p className="rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 dark:bg-slate-800 dark:text-slate-200">
        When you continue, we will prepare an email to{" "}
        <strong>committee@james-square.com</strong> with these details filled in,
        for you to send from your own email account. Nothing is sent or stored
        by the website, and nothing is sent until you press send in your email.
      </p>
      <button
        type="submit"
        disabled={kind === "rsvp" && !meetings.length}
        className={primary}
      >
        <Send size={17} aria-hidden="true" />
        {kind === "rsvp"
          ? "Prepare attendance request email"
          : "Prepare membership enquiry email"}
      </button>
      <p className={muted}>
        All requests are reviewed by the committee. Access codes, committee
        membership and website permissions are never granted automatically.
      </p>
      {email && <EmailDialog email={email} onClose={() => setEmail(null)} />}
    </form>
  );
}

/** Modal with the prepared email and ways to send it. Uses the native dialog
 *  element, so focus is trapped and Escape closes it. */
function EmailDialog({
  email,
  onClose,
}: {
  email: RequestEmail;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(plainTextEmail(email));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };
  const link =
    "text-sm font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-900 dark:text-blue-300";
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close();
      }}
      aria-labelledby="request-email-title"
      className="m-auto w-[calc(100%-2rem)] max-w-xl rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
    >
      <div className="max-h-[85vh] overflow-y-auto p-5 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="request-email-title" className="text-xl font-semibold">
              Your email is ready to send
            </h2>
            <p className={`mt-1 ${muted}`}>
              Open it in your email, check the details and press send. The
              committee will reply to the address you send from.
            </p>
          </div>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label="Close"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-600 dark:hover:bg-slate-800"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>


        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <a href={mailtoHref(email)} className={`${primary} sm:flex-1`}>
            <Mail size={17} aria-hidden="true" />
            Open in my email app
          </a>
          <button type="button" onClick={copy} className={`${secondary} sm:flex-1`}>
            {copied ? (
              <Check size={17} aria-hidden="true" />
            ) : (
              <Copy size={17} aria-hidden="true" />
            )}
            {copied ? "Copied" : "Copy email text"}
          </button>
        </div>
        <p role="status" className="sr-only">
          {copied ? "Email text copied to the clipboard." : ""}
        </p>

        <p className={`mt-4 ${muted}`}>
          Use webmail?{" "}
          <a href={gmailHref(email)} target="_blank" rel="noopener noreferrer" className={link}>
            Open in Gmail
          </a>{" "}
          or{" "}
          <a href={outlookHref(email)} target="_blank" rel="noopener noreferrer" className={link}>
            Outlook.com
          </a>
          . If nothing opens, copy the text and email it to{" "}
          <span className="font-semibold">{email.to}</span>.
        </p>

        <dl className="mt-5 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex gap-2">
            <dt className="w-16 shrink-0 font-semibold">To</dt>
            <dd className="break-all">{email.to}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-16 shrink-0 font-semibold">Subject</dt>
            <dd>{email.subject}</dd>
          </div>
          <div className="border-t border-slate-200 pt-3 dark:border-slate-700">
            <dt className="sr-only">Message</dt>
            <dd className="whitespace-pre-wrap break-words text-slate-700 dark:text-slate-200">
              {email.body}
            </dd>
          </div>
        </dl>
      </div>
    </dialog>
  );
}
