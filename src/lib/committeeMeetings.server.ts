import "server-only";

import { createHash, randomUUID, timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";
import { DateTime } from "luxon";
import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebaseAdmin";
import { sendWithResend } from "@/lib/email/sendWithResend";
import {
  clientKey,
  rateLimit,
  tooManyRequests,
} from "@/lib/security/rateLimit";
import { requireCommittee } from "@/lib/security/requireAuth";
import {
  DEFAULT_MEETINGS,
  DEFAULT_WHATSAPP_URL,
  isPastMeeting,
  meetingLabel,
  normalizeMeetingCode,
  validateCommitteeRequest,
  type CommitteeRequest,
  type Meeting,
  type MeetingHub,
} from "@/lib/committeeMeetings";

export type PrivateMeeting = Meeting & { teamsUrl: string };
export type PrivateHub = {
  meetings: PrivateMeeting[];
  whatsappUrl: string;
  accessCode: string;
  accessCodeHash: string;
  revision: string;
};
export type SavedCommitteeRequest = CommitteeRequest & {
  id: string;
  status: "pending" | "approved" | "declined";
  createdAt: string;
  expiresAt: string;
  notificationStatus: string;
  acknowledgementStatus?: string;
  approvalEmailSentAt?: string;
};

const INITIAL_CODE = "52637";
const initialLinks: Record<string, string> = {
  "october-2026":
    "https://teams.live.com/meet/9311088784337?p=Lysj4OZ99MoA7fZOid",
  "november-2026":
    "https://teams.live.com/meet/935267981695?p=403xr2YCKmuZs2nVM7",
};
const initialHash = bcrypt.hashSync(INITIAL_CODE, 10);
const configRef = () => adminDb.collection("committeeMeetingConfig").doc("hub");
const requests = () => adminDb.collection("committeeRequests");
const sender = "James Square Committee <committee@james-square.com>";
const recipient = "committee@james-square.com";
const responseHeaders = {
  "Cache-Control": "no-store, private",
  Vary: "Authorization",
};
export const meetingResponse = (body: object, status = 200) =>
  Response.json(body, { status, headers: responseHeaders });
const escapeHtml = (text: string) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
const emailHtml = (text: string) =>
  `<div style="font-family:Arial,sans-serif;line-height:1.6;max-width:600px"><h2>James Square</h2>${text
    .split("\n")
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join("")}</div>`;

export function defaultPrivateHub(): PrivateHub {
  return {
    meetings: DEFAULT_MEETINGS.map((m) => ({
      ...m,
      agenda: m.agenda.map((a) => ({ ...a })),
      teamsUrl: initialLinks[m.id] ?? "",
    })),
    whatsappUrl: DEFAULT_WHATSAPP_URL,
    accessCode: INITIAL_CODE,
    accessCodeHash: initialHash,
    revision: "initial",
  };
}
export function firestoreConfigured() {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID ||
      process.env.FIREBASE_ADMIN_CREDENTIALS ||
      process.env.GOOGLE_APPLICATION_CREDENTIALS ||
      process.env.GOOGLE_CLOUD_PROJECT ||
      process.env.GCLOUD_PROJECT ||
      process.env.FIRESTORE_EMULATOR_HOST,
  );
}
export async function getPrivateHub(): Promise<PrivateHub> {
  // Local development can display the default hub without inventing credentials.
  // A configured database outage must NEVER re-enable an old code or old links.
  if (!firestoreConfigured()) {
    if (process.env.NODE_ENV === "production")
      throw new Error("Meeting configuration is unavailable.");
    return defaultPrivateHub();
  }
  const snap = await configRef().get();
  if (!snap.exists) return defaultPrivateHub();
  return snap.data() as PrivateHub;
}
export function publicHub(config: PrivateHub): MeetingHub {
  // Explicit allowlist, never spread private documents into a public response.
  return {
    whatsappUrl: config.whatsappUrl,
    meetings: config.meetings.map((m) => ({
      id: m.id,
      title: m.title,
      month: m.month,
      date: m.date,
      time: m.time,
      location: m.location,
      agenda: m.agenda.map((a) => ({
        title: a.title,
        ...(a.description ? { description: a.description } : {}),
      })),
      approvedMinutes: m.approvedMinutes,
    })),
  };
}
export async function getPublicHub() {
  return publicHub(await getPrivateHub());
}

/** Strict JSON body limit and same-origin browser mutations; no entered codes are logged. */
export async function meetingBody(
  request: Request,
): Promise<Record<string, unknown>> {
  const origin = request.headers.get("origin");
  // Next's local request URL can use localhost even when the browser uses
  // 127.0.0.1. Compare against the actual Host and trusted proxy protocol.
  const expected = new URL(request.url);
  expected.host = request.headers.get("host") ?? expected.host;
  const protocol = request.headers.get("x-forwarded-proto");
  if (protocol === "https" || protocol === "http")
    expected.protocol = `${protocol}:`;
  if (origin && origin !== expected.origin)
    throw new Error("Please submit from the James Square website.");
  if (!request.headers.get("content-type")?.includes("application/json"))
    throw new Error("A JSON request is required.");
  if (Number(request.headers.get("content-length")) > 64 * 1024)
    throw new Error("Request is too large.");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("A request body is required.");
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > 64 * 1024) {
      await reader.cancel();
      throw new Error("Request is too large.");
    }
    chunks.push(value);
  }
  const text = Buffer.concat(chunks).toString("utf8");
  const body: unknown = JSON.parse(text);
  if (!body || typeof body !== "object" || Array.isArray(body))
    throw new Error("Invalid request.");
  return body as Record<string, unknown>;
}

export async function meetingThrottle(
  request: Request,
  scope: string,
  limit: number,
): Promise<Response | null> {
  const key = clientKey(request, scope);
  const local = rateLimit(key, { limit, windowMs: 15 * 60_000 });
  if (!local.allowed) {
    const response = tooManyRequests(local);
    response.headers.set("Cache-Control", "no-store");
    return response;
  }
  if (!firestoreConfigured()) return null;
  // Shared across production instances. Store only a hashed key and expiring counters.
  const ref = adminDb
    .collection("rateLimits")
    .doc(createHash("sha256").update(key).digest("hex"));
  const now = Date.now();
  const result = await adminDb.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const resetAt = snap.get("resetAt") as number | undefined;
    const active = resetAt && resetAt > now;
    const count = active ? Number(snap.get("count") ?? 0) + 1 : 1;
    const end = active ? resetAt : now + 15 * 60_000;
    tx.set(ref, { count, resetAt: end, expiresAt: Timestamp.fromMillis(end) });
    return {
      allowed: count <= limit,
      remaining: Math.max(0, limit - count),
      retryAfter: Math.max(1, Math.ceil((end - now) / 1000)),
    };
  });
  if (result.allowed) return null;
  const response = tooManyRequests(result);
  response.headers.set("Cache-Control", "no-store");
  return response;
}

/** Rejects if the promise has not settled in time, so a stalled database cannot hang the page. */
export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Timed out")), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

/**
 * The meeting access code set in Vercel (TEAMS_MEETING_CODE). When present it
 * replaces the code stored in Firestore, and unlocking no longer depends on the
 * database being reachable: the committee changes the code in Vercel instead.
 */
export function environmentMeetingCode() {
  const value = process.env.TEAMS_MEETING_CODE;
  if (!value) return null;
  const code = normalizeMeetingCode(value).replace(/\s/g, "");
  return code || null;
}

function sameCode(entered: string, expected: string) {
  const a = createHash("sha256").update(entered).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

const DATABASE_TIMEOUT_MS = 3000;

export async function unlockMeeting(request: Request) {
  try {
    const envCode = environmentMeetingCode();
    // With the code in Vercel, a slow shared rate-limit store must not block
    // owners joining; the per-instance limit still applies first.
    const limited = envCode
      ? await withTimeout(
          meetingThrottle(request, "meeting-unlock", 8),
          DATABASE_TIMEOUT_MS,
        ).catch(() => null)
      : await meetingThrottle(request, "meeting-unlock", 8);
    if (limited) return limited;
    const body = await meetingBody(request);
    if (
      typeof body.code !== "string" ||
      body.code.length > 64 ||
      typeof body.meetingId !== "string"
    )
      return meetingResponse(
        { error: "Please enter the meeting access code." },
        400,
      );
    const entered = normalizeMeetingCode(body.code).replace(/\s/g, "");
    const wrongCode = () =>
      meetingResponse(
        {
          error:
            "That access code is incorrect. Please check the code supplied by the committee.",
        },
        403,
      );
    const noLink = () =>
      meetingResponse(
        { error: "Online access is not available for this meeting." },
        404,
      );

    if (envCode) {
      if (!sameCode(entered, envCode)) return wrongCode();
      // Prefer links the committee has saved in the admin workspace; fall back
      // to the built-in links if the database is slow or unreachable.
      const config = await withTimeout(
        getPrivateHub(),
        DATABASE_TIMEOUT_MS,
      ).catch(() => null);
      const saved = config?.meetings.find(
        (m) => m.id === body.meetingId && !isPastMeeting(m),
      );
      if (saved?.teamsUrl)
        return meetingResponse({
          teamsUrl: saved.teamsUrl,
          meeting: publicHub({ ...config!, meetings: [saved] }).meetings[0],
        });
      const fallback = DEFAULT_MEETINGS.find(
        (m) => m.id === body.meetingId && !isPastMeeting(m),
      );
      const teamsUrl = fallback ? initialLinks[fallback.id] : undefined;
      if (!fallback || !teamsUrl) return noLink();
      return meetingResponse({ teamsUrl, meeting: fallback });
    }

    const config = await getPrivateHub();
    if (!(await bcrypt.compare(entered, config.accessCodeHash)))
      return wrongCode();
    const meeting = config.meetings.find(
      (m) => m.id === body.meetingId && !isPastMeeting(m),
    );
    if (!meeting?.teamsUrl) return noLink();
    return meetingResponse({
      teamsUrl: meeting.teamsUrl,
      meeting: publicHub({ ...config, meetings: [meeting] }).meetings[0],
    });
  } catch {
    return meetingResponse(
      {
        error:
          "Meeting access is temporarily unavailable. Please try again later.",
      },
      503,
    );
  }
}

function requestNotification(data: CommitteeRequest, hub: PrivateHub) {
  const meeting = hub.meetings.find((m) => m.id === data.meetingId);
  return [
    data.kind === "rsvp"
      ? "Committee Meeting Attendance Request"
      : "Committee Membership Enquiry",
    `Full name: ${data.name}`,
    `Email: ${data.email}`,
    `Property address: ${data.property}`,
    ...(data.kind === "rsvp"
      ? [
          `Meeting: ${meeting ? meetingLabel(meeting) : data.meetingId}`,
          `Attendance: ${data.attendance}`,
        ]
      : [
          `Committee WhatsApp interest: ${data.whatsapp ? "Yes — eligibility review required" : "No"}`,
          ...(data.whatsapp ? [`Mobile / WhatsApp number: ${data.phone}`] : []),
        ]),
    `Message: ${data.message || "None supplied"}`,
    "Review this request in the Committee Area. No access code has been issued.",
  ].join("\n");
}
async function notifyCommittee(
  id: string,
  data: CommitteeRequest,
  hub: PrivateHub,
) {
  const text = requestNotification(data, hub);
  await sendWithResend({
    from: sender,
    to: recipient,
    replyTo: data.email,
    subject: `${data.kind === "rsvp" ? "Committee meeting RSVP" : "Committee Membership Enquiry"} — ${data.name}`,
    text,
    html: emailHtml(text),
    idempotencyKey: `committee-notification/${id}`,
  });
}
export async function submitCommitteeRequest(request: Request) {
  try {
    const limited = await meetingThrottle(request, "committee-request", 5);
    if (limited) return limited;
    let data: CommitteeRequest;
    const hub = await getPrivateHub();
    try {
      data = validateCommitteeRequest(await meetingBody(request), hub.meetings);
    } catch (error) {
      return meetingResponse(
        {
          error:
            error instanceof Error ? error.message : "Please check the form.",
        },
        400,
      );
    }
    if (!firestoreConfigured())
      return meetingResponse(
        {
          error:
            "Requests are temporarily unavailable. Please email committee@james-square.com.",
        },
        503,
      );
    const id = randomUUID(),
      now = new Date();
    const expiresAt = new Date(
      now.getTime() + 180 * 24 * 60 * 60_000,
    ).toISOString();
    await requests()
      .doc(id)
      .create({
        ...data,
        status: "pending",
        createdAt: now.toISOString(),
        expiresAt,
        // This field may be configured as a Firestore TTL policy; manual purge is also provided.
        deleteAfter: Timestamp.fromDate(new Date(expiresAt)),
        notificationStatus: "pending",
        acknowledgementStatus: "pending",
      });
    let delivered = false;
    try {
      await notifyCommittee(id, data, hub);
      delivered = true;
    } catch {
      /* Retry through the private workspace. */
    }
    await requests()
      .doc(id)
      .update({ notificationStatus: delivered ? "sent" : "failed" });
    let acknowledged = false;
    if (delivered) {
      const text = `Hello ${data.name},\nThank you for your ${data.kind === "rsvp" ? "request to attend a committee meeting" : "interest in joining the committee"}. Your request has been received and will be reviewed by the committee.\nThis is an acknowledgement, not approval. No meeting access code, membership or WhatsApp access has been granted.\nJames Square Committee`;
      try {
        await sendWithResend({
          from: sender,
          to: data.email,
          subject: "James Square — request received",
          text,
          html: emailHtml(text),
          idempotencyKey: `committee-acknowledgement/${id}`,
        });
        acknowledged = true;
      } catch {
        /* Notification delivery is the required mail operation. */
      }
      await requests()
        .doc(id)
        .update({ acknowledgementStatus: acknowledged ? "sent" : "failed" });
    }
    return meetingResponse(
      {
        success: true,
        requestId: id,
        message: delivered
          ? "Thank you. Your request has been saved and sent to the committee for review. Approval is not automatic."
          : "Your request has been saved, but the email notification is delayed. You can contact committee@james-square.com and quote your request reference.",
      },
      delivered ? 200 : 202,
    );
  } catch {
    return meetingResponse(
      {
        error:
          "We could not save your request. Please try again later or contact the committee.",
      },
      503,
    );
  }
}

export function validatePrivateHub(
  body: unknown,
): Omit<PrivateHub, "accessCodeHash" | "revision"> {
  if (!body || typeof body !== "object")
    throw new Error("Invalid meeting configuration.");
  const b = body as PrivateHub;
  if (typeof b.accessCode !== "string")
    throw new Error("An access code is required.");
  const accessCode = normalizeMeetingCode(b.accessCode);
  if (!/^[0-9]{5,12}$/.test(accessCode))
    throw new Error("Use a code of 5–12 digits.");
  if (typeof b.whatsappUrl !== "string" || b.whatsappUrl.length > 500)
    throw new Error("Invalid WhatsApp invite.");
  const whatsapp = new URL(b.whatsappUrl);
  if (
    whatsapp.protocol !== "https:" ||
    whatsapp.hostname !== "chat.whatsapp.com" ||
    whatsapp.username ||
    whatsapp.password ||
    whatsapp.port
  )
    throw new Error("Use an HTTPS chat.whatsapp.com invite.");
  if (
    !Array.isArray(b.meetings) ||
    b.meetings.length < 2 ||
    b.meetings.length > 50
  )
    throw new Error("Configure between 2 and 50 meetings.");
  const ids = new Set<string>();
  const meetings = b.meetings.map((m) => {
    if (!m || typeof m !== "object") throw new Error("Invalid meeting.");
    if (!/^[a-z0-9-]{1,80}$/.test(m.id) || ids.has(m.id))
      throw new Error(
        "Meeting IDs must be unique lowercase letters, numbers and hyphens.",
      );
    ids.add(m.id);
    const clean = (value: unknown, max: number, required = false) => {
      if (
        typeof value !== "string" ||
        value.length > max ||
        (required && !value.trim()) ||
        /https?:\/\/[^\s]*teams\.(?:live|microsoft)\.com/i.test(value)
      )
        throw new Error(
          "Check meeting text fields. Keep Teams links in the private URL field.",
        );
      return value.trim();
    };
    if (
      !/^\d{4}-\d{2}$/.test(m.month) ||
      !DateTime.fromISO(`${m.month}-01`).isValid
    )
      throw new Error("Invalid meeting month.");
    if (
      m.date !== null &&
      (!/^\d{4}-\d{2}-\d{2}$/.test(m.date) ||
        !DateTime.fromISO(m.date).isValid ||
        m.date.slice(0, 7) !== m.month)
    )
      throw new Error("Meeting date must be valid and match its month.");
    if (
      m.time !== null &&
      (!m.date || !/^([01]\d|2[0-3]):[0-5]\d$/.test(m.time))
    )
      throw new Error(
        "A confirmed time requires a confirmed date, using 24-hour UK time.",
      );
    const teamsUrl = typeof m.teamsUrl === "string" ? m.teamsUrl.trim() : "";
    if (teamsUrl) {
      const url = new URL(teamsUrl);
      if (
        url.protocol !== "https:" ||
        !["teams.live.com", "teams.microsoft.com"].includes(url.hostname) ||
        url.username ||
        url.password ||
        url.port ||
        teamsUrl.length > 2000
      )
        throw new Error("Use a valid private Microsoft Teams HTTPS link.");
    }
    if (!Array.isArray(m.agenda) || m.agenda.length > 40)
      throw new Error("Use at most 40 agenda items.");
    return {
      id: m.id,
      title: clean(m.title, 150, true),
      month: m.month,
      date: m.date,
      time: m.time,
      location: clean(m.location, 300, true),
      teamsUrl,
      approvedMinutes: clean(m.approvedMinutes, 12000),
      agenda: m.agenda.map((a) => ({
        title: clean(a.title, 200, true),
        description: clean(a.description ?? "", 1500),
      })),
    };
  });
  return { meetings, whatsappUrl: whatsapp.href, accessCode };
}

export async function committeeAdminGet(request: Request) {
  const auth = await requireCommittee(request);
  if (!auth.ok) {
    auth.response.headers.set("Cache-Control", "no-store");
    return auth.response;
  }
  try {
    const hub = await getPrivateHub();
    if (!firestoreConfigured()) throw new Error("Database unavailable");
    const snap = await requests().orderBy("createdAt", "desc").limit(100).get();
    return meetingResponse({
      config: {
        meetings: hub.meetings,
        accessCode: hub.accessCode,
        whatsappUrl: hub.whatsappUrl,
        revision: hub.revision,
      },
      requests: snap.docs
        .map((d) => ({
          ...(d.data() as SavedCommitteeRequest),
          id: d.id,
          deleteAfter: undefined,
        }))
        .filter((d) => d.expiresAt > new Date().toISOString()),
    });
  } catch {
    return meetingResponse(
      {
        error:
          "The committee database is unavailable. Check the Firebase server configuration.",
      },
      503,
    );
  }
}

export async function committeeAdminPost(request: Request) {
  const auth = await requireCommittee(request);
  if (!auth.ok) {
    auth.response.headers.set("Cache-Control", "no-store");
    return auth.response;
  }
  try {
    const limited = await meetingThrottle(
      request,
      `committee-admin-${auth.token.uid}`,
      40,
    );
    if (limited) return limited;
    if (!firestoreConfigured())
      return meetingResponse(
        { error: "The committee database is not configured." },
        503,
      );
    const body = await meetingBody(request);
    if (body.action === "saveConfig") {
      let clean: ReturnType<typeof validatePrivateHub>;
      try {
        clean = validatePrivateHub(body.config);
      } catch (error) {
        return meetingResponse(
          {
            error:
              error instanceof Error ? error.message : "Invalid configuration.",
          },
          400,
        );
      }
      const hash = await bcrypt.hash(clean.accessCode, 10);
      const saved = await adminDb.runTransaction(async (tx) => {
        const snap = await tx.get(configRef());
        const existing = snap.exists
          ? (snap.data() as PrivateHub)
          : defaultPrivateHub();
        if (existing.revision !== body.revision) return false;
        if (
          existing.meetings.some(
            (m) => !clean.meetings.some((n) => n.id === m.id),
          )
        )
          throw new Error("Preserve existing meetings and their archive.");
        tx.set(configRef(), {
          ...clean,
          accessCodeHash: hash,
          revision: randomUUID(),
          updatedBy: auth.token.uid,
          updatedAt: new Date().toISOString(),
        });
        return true;
      });
      return saved
        ? meetingResponse({ success: true })
        : meetingResponse(
            {
              error:
                "Another committee member changed the configuration. Reload before saving.",
            },
            409,
          );
    }
    if (body.action === "purgeExpired") {
      const expired = await requests()
        .where("expiresAt", "<=", new Date().toISOString())
        .limit(100)
        .get();
      const batch = adminDb.batch();
      expired.docs.forEach((d) => batch.delete(d.ref));
      await batch.commit();
      return meetingResponse({ success: true, deleted: expired.size });
    }
    if (typeof body.id !== "string" || !/^[a-zA-Z0-9-]{1,80}$/.test(body.id))
      return meetingResponse({ error: "Invalid request reference." }, 400);
    const ref = requests().doc(body.id),
      snap = await ref.get();
    if (!snap.exists)
      return meetingResponse({ error: "Request not found." }, 404);
    const data = snap.data() as SavedCommitteeRequest;
    if (body.action === "deleteRequest") {
      await ref.delete();
      return meetingResponse({ success: true });
    }
    if (data.expiresAt <= new Date().toISOString())
      return meetingResponse(
        {
          error:
            "This request has expired. Delete it using the retention controls.",
        },
        410,
      );
    if (
      body.action === "status" &&
      ["pending", "approved", "declined"].includes(String(body.status))
    ) {
      await ref.update({
        status: body.status,
        reviewedBy: auth.token.uid,
        reviewedAt: new Date().toISOString(),
      });
      return meetingResponse({ success: true });
    }
    const hub = await getPrivateHub();
    if (body.action === "retryNotification") {
      await notifyCommittee(body.id, data, hub);
      await ref.update({ notificationStatus: "sent" });
      return meetingResponse({ success: true });
    }
    if (body.action === "sendApproval") {
      if (data.kind !== "rsvp" || data.status !== "approved")
        return meetingResponse(
          { error: "Approve a meeting RSVP before sending access details." },
          400,
        );
      const meeting = hub.meetings.find(
        (m) => m.id === data.meetingId && !isPastMeeting(m),
      );
      if (!meeting)
        return meetingResponse(
          { error: "This meeting is no longer upcoming." },
          400,
        );
      const text = `Hello ${data.name},\nYour request to attend the James Square Committee Meeting (${meetingLabel(meeting)}) has been approved.\nTime: ${meeting.time ?? "To be confirmed"} (UK time). Location: ${meeting.location}.\nFor online attendance, return to https://www.james-square.com/committee-meeting, choose your meeting and enter access code ${hub.accessCode}.\nPlease do not share the code publicly. Microsoft Teams organiser and lobby controls still apply.\nPlease follow the attendance guidelines on the page. Attendance does not automatically grant speaking or voting rights; rights under the constitution are preserved.\nJames Square Committee`;
      // Prevent simultaneous clicks from sending duplicates; release a failed send for retry.
      const claimed = await adminDb.runTransaction(async (tx) => {
        const current = await tx.get(ref);
        if (
          !current.exists ||
          current.get("status") !== "approved" ||
          current.get("approvalEmailSentAt") ||
          Number(current.get("approvalSendingUntil") ?? 0) > Date.now()
        )
          return false;
        tx.update(ref, { approvalSendingUntil: Date.now() + 60_000 });
        return true;
      });
      if (!claimed)
        return meetingResponse(
          {
            error:
              "Approval has already been sent, is being sent, or this request is no longer approved.",
          },
          409,
        );
      try {
        await sendWithResend({
          from: sender,
          to: data.email,
          subject: "James Square — committee meeting attendance approved",
          text,
          html: emailHtml(text),
          idempotencyKey: `committee-approval/${body.id}`,
        });
        await ref.update({
          approvalEmailSentAt: new Date().toISOString(),
          approvalSendingUntil: 0,
          approvedBy: auth.token.uid,
        });
      } catch {
        await ref.update({ approvalSendingUntil: 0 });
        throw new Error("Delivery unavailable");
      }
      return meetingResponse({ success: true });
    }
    return meetingResponse({ error: "Unknown committee action." }, 400);
  } catch {
    return meetingResponse(
      { error: "The action could not be completed. Please try again later." },
      503,
    );
  }
}
