"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { meetingLabel, type AgendaItem } from "@/lib/committeeMeetings";
import type {
  PrivateMeeting,
  SavedCommitteeRequest,
} from "@/lib/committeeMeetings.server";
import {
  card,
  input,
  muted,
  primary,
  secondary,
} from "@/app/committee-meeting/styles";

type Config = {
  meetings: PrivateMeeting[];
  accessCode: string;
  whatsappUrl: string;
  revision: string;
};
export default function MeetingManagement() {
  const [config, setConfig] = useState<Config | null>(null);
  const [requests, setRequests] = useState<SavedCommitteeRequest[]>([]);
  const [selectedId, setSelectedId] = useState("october-2026");
  const [filter, setFilter] = useState("pending");
  const [kind, setKind] = useState("rsvp");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const api = async (body?: object) => {
    if (!auth.currentUser)
      throw new Error(
        "Sign in with your committee or administrator account to manage meetings.",
      );
    const token = await auth.currentUser.getIdToken();
    const response = await fetch("/api/committee-meetings/admin", {
      method: body ? "POST" : "GET",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const result = await response.json();
    if (!response.ok)
      throw new Error(result.error ?? "Unable to complete the action.");
    return result;
  };
  const load = useCallback(async () => {
    setError("");
    setBusy(true);
    try {
      const data = await api();
      setConfig(data.config);
      setRequests(data.requests);
    } catch (error) {
      setConfig(null);
      setRequests([]);
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load the workspace.",
      );
    } finally {
      setBusy(false);
    }
  }, []);
  useEffect(
    () =>
      onAuthStateChanged(auth, (user) => {
        setSignedIn(Boolean(user));
        if (user) void load();
        else {
          setConfig(null);
          setRequests([]);
        }
      }),
    [load],
  );
  const action = async (body: object, resetConfig = false) => {
    setError("");
    setMessage("");
    setBusy(true);
    try {
      const result = await api(body);
      const data = await api();
      if (resetConfig) setConfig(data.config);
      setRequests(data.requests);
      setMessage(
        typeof result.deleted === "number"
          ? `${result.deleted} expired requests deleted. Repeat if more remain.`
          : "Saved.",
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to complete the action.",
      );
    } finally {
      setBusy(false);
    }
  };
  const selected = config?.meetings.find((m) => m.id === selectedId);
  const editMeeting = (patch: Partial<PrivateMeeting>) =>
    setConfig(
      (c) =>
        c && {
          ...c,
          meetings: c.meetings.map((m) =>
            m.id === selectedId ? { ...m, ...patch } : m,
          ),
        },
    );
  const editAgenda = (index: number, patch: Partial<AgendaItem>) =>
    selected &&
    editMeeting({
      agenda: selected.agenda.map((a, i) =>
        i === index ? { ...a, ...patch } : a,
      ),
    });
  const reorder = (index: number, delta: number) => {
    if (!selected) return;
    const agenda = [...selected.agenda];
    [agenda[index], agenda[index + delta]] = [
      agenda[index + delta],
      agenda[index],
    ];
    editMeeting({ agenda });
  };

  return (
    <section aria-labelledby="management-heading" className={card}>
      <h2 id="management-heading" className="text-2xl font-semibold">
        Meetings &amp; Community Management
      </h2>
      <p className={`mt-2 ${muted}`}>
        Manage public agendas, private meeting access, attendance requests and
        membership enquiries. The Committee Area passcode does not grant these
        permissions; a verified committee or administrator account is required.
      </p>
      {!signedIn && (
        <Link href="/login" className={`mt-5 ${secondary}`}>
          Sign in to manage meetings
        </Link>
      )}
      {error && (
        <p role="alert" className="mt-5 text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      )}
      <p
        role="status"
        className="mt-3 text-sm text-emerald-800 dark:text-emerald-200"
      >
        {busy ? "Working…" : message}
      </p>
      {signedIn && !config && (
        <button
          disabled={busy}
          onClick={() => void load()}
          className={`mt-3 ${secondary}`}
        >
          Reload workspace
        </button>
      )}
      {config && (
        <>
          <details className="mt-5 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <summary className="min-h-10 cursor-pointer font-semibold">
              Meeting dates, agendas &amp; private access settings
            </summary>
            <form
              className="mt-5 space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                void action(
                  { action: "saveConfig", config, revision: config.revision },
                  true,
                );
              }}
            >
              <label
                htmlFor="manage-meeting"
                className="block text-sm font-medium"
              >
                Edit a meeting
                <select
                  id="manage-meeting"
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className={input}
                >
                  {config.meetings.map((m) => (
                    <option key={m.id} value={m.id}>
                      {meetingLabel(m)}
                    </option>
                  ))}
                </select>
              </label>
              {selected && (
                <>
                  <label
                    htmlFor="manage-title"
                    className="block text-sm font-medium"
                  >
                    Meeting title
                    <input
                      id="manage-title"
                      required
                      maxLength={150}
                      className={input}
                      value={selected.title}
                      onChange={(e) => editMeeting({ title: e.target.value })}
                    />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <label
                      htmlFor="manage-month"
                      className="text-sm font-medium"
                    >
                      Meeting month
                      <input
                        id="manage-month"
                        type="month"
                        required
                        className={input}
                        value={selected.month}
                        onChange={(e) =>
                          editMeeting({
                            month: e.target.value,
                            date: null,
                            time: null,
                          })
                        }
                      />
                    </label>
                    <label
                      htmlFor="manage-date"
                      className="text-sm font-medium"
                    >
                      Confirmed date
                      <input
                        id="manage-date"
                        type="date"
                        className={input}
                        value={selected.date ?? ""}
                        onChange={(e) =>
                          editMeeting({
                            date: e.target.value || null,
                            ...(e.target.value
                              ? { month: e.target.value.slice(0, 7) }
                              : { time: null }),
                          })
                        }
                      />
                    </label>
                    <label
                      htmlFor="manage-time"
                      className="text-sm font-medium"
                    >
                      Confirmed time (UK)
                      <input
                        id="manage-time"
                        type="time"
                        className={input}
                        disabled={!selected.date}
                        value={selected.time ?? ""}
                        onChange={(e) =>
                          editMeeting({ time: e.target.value || null })
                        }
                      />
                    </label>
                  </div>
                  <p className={muted}>
                    Leave unconfirmed dates and times blank. Dated meetings move
                    into the archive the following day in UK time; month-only
                    meetings move after that month ends.
                  </p>
                  <label
                    htmlFor="manage-location"
                    className="block text-sm font-medium"
                  >
                    Location
                    <input
                      id="manage-location"
                      required
                      maxLength={300}
                      className={input}
                      value={selected.location}
                      onChange={(e) =>
                        editMeeting({ location: e.target.value })
                      }
                    />
                  </label>
                  <label
                    htmlFor="manage-teams"
                    className="block text-sm font-medium"
                  >
                    Private Microsoft Teams URL
                    <input
                      id="manage-teams"
                      type="url"
                      maxLength={2000}
                      className={input}
                      value={selected.teamsUrl}
                      onChange={(e) =>
                        editMeeting({ teamsUrl: e.target.value })
                      }
                    />
                  </label>
                  <fieldset className="space-y-4">
                    <legend className="mb-3 font-semibold">Agenda</legend>
                    {selected.agenda.map((a, i) => (
                      <div
                        key={i}
                        className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800"
                      >
                        <label
                          htmlFor={`agenda-title-${i}`}
                          className="block text-sm font-medium"
                        >
                          Item {i + 1} title
                          <input
                            id={`agenda-title-${i}`}
                            required
                            maxLength={200}
                            value={a.title}
                            onChange={(e) =>
                              editAgenda(i, { title: e.target.value })
                            }
                            className={input}
                          />
                        </label>
                        <label
                          htmlFor={`agenda-description-${i}`}
                          className="mt-3 block text-sm font-medium"
                        >
                          Description
                          <textarea
                            id={`agenda-description-${i}`}
                            rows={2}
                            maxLength={1500}
                            value={a.description ?? ""}
                            onChange={(e) =>
                              editAgenda(i, { description: e.target.value })
                            }
                            className={input}
                          />
                        </label>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={i === 0}
                            className={secondary}
                            onClick={() => reorder(i, -1)}
                            aria-label={`Move agenda item ${i + 1} up`}
                          >
                            Move up
                          </button>
                          <button
                            type="button"
                            disabled={i === selected.agenda.length - 1}
                            className={secondary}
                            onClick={() => reorder(i, 1)}
                            aria-label={`Move agenda item ${i + 1} down`}
                          >
                            Move down
                          </button>
                          <button
                            type="button"
                            className={secondary}
                            onClick={() =>
                              editMeeting({
                                agenda: selected.agenda.filter(
                                  (_, n) => n !== i,
                                ),
                              })
                            }
                            aria-label={`Remove agenda item ${i + 1}`}
                          >
                            Remove item
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      className={secondary}
                      onClick={() =>
                        editMeeting({
                          agenda: [
                            ...selected.agenda,
                            { title: "", description: "" },
                          ],
                        })
                      }
                    >
                      Add agenda item
                    </button>
                  </fieldset>
                  <label
                    htmlFor="manage-minutes"
                    className="block text-sm font-medium"
                  >
                    Approved minutes (public, optional)
                    <textarea
                      id="manage-minutes"
                      rows={4}
                      maxLength={12000}
                      className={input}
                      value={selected.approvedMinutes}
                      onChange={(e) =>
                        editMeeting({ approvedMinutes: e.target.value })
                      }
                    />
                  </label>
                  <p className={muted}>
                    Only publish minutes approved for public viewing. Remove
                    personal information and private links. An agenda is not a
                    set of approved minutes.
                  </p>
                </>
              )}
              <button
                type="button"
                className={secondary}
                onClick={() => {
                  const id = `meeting-${crypto.randomUUID()}`;
                  setConfig({
                    ...config,
                    meetings: [
                      ...config.meetings,
                      {
                        id,
                        title: "James Square Committee Meeting",
                        month: new Date().toISOString().slice(0, 7),
                        date: null,
                        time: null,
                        location: "The Conservatory, James Square",
                        teamsUrl: "",
                        agenda: [],
                        approvedMinutes: "",
                      },
                    ],
                  });
                  setSelectedId(id);
                }}
              >
                Add another meeting
              </button>
              <label
                htmlFor="manage-code"
                className="block text-sm font-medium"
              >
                Shared meeting access code
                <input
                  id="manage-code"
                  type="password"
                  inputMode="numeric"
                  autoComplete="new-password"
                  required
                  minLength={5}
                  maxLength={23}
                  className={input}
                  value={config.accessCode}
                  onChange={(e) =>
                    setConfig({ ...config, accessCode: e.target.value })
                  }
                />
              </label>
              <p className={muted}>
                Use 5–12 digits. Changing the code applies to all future unlock
                attempts. Send the new code privately to approved attendees.
              </p>
              <label
                htmlFor="manage-whatsapp"
                className="block text-sm font-medium"
              >
                Public Community WhatsApp invite
                <input
                  id="manage-whatsapp"
                  required
                  type="url"
                  maxLength={500}
                  className={input}
                  value={config.whatsappUrl}
                  onChange={(e) =>
                    setConfig({ ...config, whatsappUrl: e.target.value })
                  }
                />
              </label>
              <button disabled={busy} className={primary} type="submit">
                Save meeting &amp; community settings
              </button>
            </form>
          </details>
          <div className="mt-7 flex flex-wrap gap-4">
            <label htmlFor="request-kind" className="text-sm font-medium">
              Request type
              <select
                id="request-kind"
                className={input}
                value={kind}
                onChange={(e) => setKind(e.target.value)}
              >
                <option value="rsvp">Meeting RSVPs</option>
                <option value="membership">
                  Committee membership enquiries
                </option>
              </select>
            </label>
            <label htmlFor="request-status" className="text-sm font-medium">
              Status
              <select
                id="request-status"
                className={input}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="declined">Declined</option>
                <option value="all">All statuses</option>
              </select>
            </label>
          </div>
          <p className={`mt-3 ${muted}`}>
            The latest 100 requests are shown. Approving a membership enquiry
            records your review; it does not grant membership, website
            permissions or WhatsApp access.
          </p>
          <div className="mt-5 space-y-4">
            {requests
              .filter(
                (r) =>
                  r.kind === kind && (filter === "all" || r.status === filter),
              )
              .map((r) => (
                <article
                  key={r.id}
                  className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"
                >
                  <div className="flex flex-wrap justify-between gap-2">
                    <h3 className="font-semibold">{r.name}</h3>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs capitalize text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                      {r.status}
                    </span>
                  </div>
                  <dl className="mt-3 space-y-2 break-words text-sm">
                    <div>
                      <dt className="inline font-medium">Email: </dt>
                      <dd className="inline">{r.email}</dd>
                    </div>
                    <div>
                      <dt className="inline font-medium">Property: </dt>
                      <dd className="inline">{r.property}</dd>
                    </div>
                    {r.kind === "rsvp" ? (
                      <>
                        <div>
                          <dt className="inline font-medium">Meeting: </dt>
                          <dd className="inline">
                            {config.meetings.find((m) => m.id === r.meetingId)
                              ? meetingLabel(
                                  config.meetings.find(
                                    (m) => m.id === r.meetingId,
                                  )!,
                                )
                              : r.meetingId}
                          </dd>
                        </div>
                        <div>
                          <dt className="inline font-medium">Attendance: </dt>
                          <dd className="inline">{r.attendance}</dd>
                        </div>
                      </>
                    ) : (
                      <div>
                        <dt className="inline font-medium">
                          Committee WhatsApp:{" "}
                        </dt>
                        <dd className="inline">
                          {r.whatsapp
                            ? `Interested — ${r.phone}`
                            : "Not requested"}
                        </dd>
                      </div>
                    )}
                    <div>
                      <dt className="font-medium">Message</dt>
                      <dd className="whitespace-pre-wrap">
                        {r.message || "None supplied"}
                      </dd>
                    </div>
                  </dl>
                  <p className={`mt-3 ${muted}`}>
                    Received {new Date(r.createdAt).toLocaleDateString("en-GB")}{" "}
                    · Expires{" "}
                    {new Date(r.expiresAt).toLocaleDateString("en-GB")} ·
                    Committee notification: {r.notificationStatus}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(["pending", "approved", "declined"] as const)
                      .filter((s) => s !== r.status)
                      .map((status) => (
                        <button
                          key={status}
                          disabled={busy}
                          className={secondary}
                          onClick={() =>
                            void action({ action: "status", id: r.id, status })
                          }
                        >
                          Mark {status}
                        </button>
                      ))}
                    {r.kind === "rsvp" && r.status === "approved" && (
                      <button
                        disabled={busy || Boolean(r.approvalEmailSentAt)}
                        className={primary}
                        onClick={() =>
                          void action({ action: "sendApproval", id: r.id })
                        }
                      >
                        {r.approvalEmailSentAt
                          ? "Approval email sent"
                          : "Send approval email with access code"}
                      </button>
                    )}
                    {r.notificationStatus !== "sent" && (
                      <button
                        disabled={busy}
                        className={secondary}
                        onClick={() =>
                          void action({ action: "retryNotification", id: r.id })
                        }
                      >
                        Retry committee notification
                      </button>
                    )}
                    <button
                      disabled={busy}
                      className={`${secondary} !text-red-700 dark:!text-red-300`}
                      onClick={() => {
                        if (
                          window.confirm(
                            "Permanently delete this request and its personal information?",
                          )
                        )
                          void action({ action: "deleteRequest", id: r.id });
                      }}
                    >
                      Delete request
                    </button>
                  </div>
                  {r.kind === "rsvp" &&
                    r.status === "approved" &&
                    !r.approvalEmailSentAt && (
                      <details className="mt-4 text-sm">
                        <summary className="min-h-10 cursor-pointer font-medium">
                          Preview approval instructions
                        </summary>
                        <p className="mt-2">
                          The email will confirm the selected meeting and ask{" "}
                          {r.name} to return to
                          https://www.james-square.com/committee-meeting and
                          enter the saved meeting access code. No email is sent
                          until you click “Send approval email with access
                          code”.
                        </p>
                      </details>
                    )}
                </article>
              ))}
          </div>
          {!requests.some(
            (r) => r.kind === kind && (filter === "all" || r.status === filter),
          ) && <p className={`mt-5 ${muted}`}>No requests match this view.</p>}
          <div className="mt-7 border-t border-slate-200 pt-5 dark:border-slate-700">
            <h3 className="font-semibold">Retention &amp; deletion</h3>
            <p className={`my-3 ${muted}`}>
              Requests expire after 180 days. Delete individual requests above
              or purge expired records below. Automatic deletion requires the
              Firestore TTL policy documented in the setup guide.
            </p>
            <button
              disabled={busy}
              className={secondary}
              onClick={() => void action({ action: "purgeExpired" })}
            >
              Delete expired requests
            </button>
          </div>
        </>
      )}
    </section>
  );
}
