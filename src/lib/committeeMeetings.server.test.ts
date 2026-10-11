import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import bcrypt from "bcryptjs";

const mocks = vi.hoisted(() => ({
  store: new Map<string, Record<string, unknown>>(),
  fail: false,
  authorised: true,
  send: vi.fn(),
  localAllowed: true,
}));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/email/sendWithResend", () => ({ sendWithResend: mocks.send }));
vi.mock("@/lib/security/rateLimit", () => ({
  clientKey: (r: Request, scope: string) =>
    `${scope}:${r.headers.get("x-forwarded-for") ?? "test"}`,
  rateLimit: () => ({ allowed: mocks.localAllowed, retryAfter: 900 }),
  tooManyRequests: () =>
    new Response(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: { "Retry-After": "900" },
    }),
}));
vi.mock("@/lib/security/requireAuth", () => ({
  requireCommittee: async () =>
    mocks.authorised
      ? { ok: true, token: { uid: "committee-user" } }
      : {
          ok: false,
          response: Response.json(
            { error: "Committee members only" },
            { status: 403 },
          ),
        },
}));
vi.mock("@/lib/firebaseAdmin", () => {
  const snapshot = (path: string) => ({
    exists: mocks.store.has(path),
    data: () => mocks.store.get(path),
    get: (key: string) => mocks.store.get(path)?.[key],
  });
  const doc = (path: string) => ({
    path,
    get: async () => {
      if (mocks.fail) throw new Error("Database offline");
      return snapshot(path);
    },
    create: async (data: Record<string, unknown>) => {
      if (mocks.fail) throw new Error("Database offline");
      mocks.store.set(path, data);
    },
    update: async (data: Record<string, unknown>) => {
      if (mocks.fail) throw new Error("Database offline");
      mocks.store.set(path, { ...mocks.store.get(path), ...data });
    },
    delete: async () => {
      mocks.store.delete(path);
    },
  });
  const query = () => ({
    limit: () => query(),
    get: async () => ({ size: 0, docs: [] }),
  });
  return {
    adminDb: {
      collection: (name: string) => ({
        doc: (id: string) => doc(`${name}/${id}`),
        orderBy: () => query(),
        where: () => query(),
      }),
      runTransaction: async (fn: (tx: object) => Promise<unknown>) => {
        if (mocks.fail) throw new Error("Database offline");
        return fn({
          get: (ref: ReturnType<typeof doc>) => ref.get(),
          set: (ref: ReturnType<typeof doc>, data: Record<string, unknown>) =>
            mocks.store.set(ref.path, data),
          update: (
            ref: ReturnType<typeof doc>,
            data: Record<string, unknown>,
          ) =>
            mocks.store.set(ref.path, {
              ...mocks.store.get(ref.path),
              ...data,
            }),
        });
      },
      batch: () => ({ delete: vi.fn(), commit: vi.fn() }),
    },
  };
});
import {
  committeeAdminGet,
  committeeAdminPost,
  defaultPrivateHub,
  getPrivateHub,
  meetingBody,
  publicHub,
  submitCommitteeRequest,
  unlockMeeting,
  validatePrivateHub,
} from "./committeeMeetings.server";

const request = (body: object, ip = "test") =>
  new Request("https://www.james-square.com/api/committee-meetings", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });
const form = {
  kind: "rsvp",
  name: "Alex Owner",
  email: "alex@example.com",
  property: "Flat 2, James Square",
  meetingId: "october-2026",
  attendance: "online",
  message: "<script>not executable</script>",
  privacy: true,
};
describe("private meeting access and request workflows", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-10-11T12:00:00Z"));
    vi.stubEnv("FIREBASE_PROJECT_ID", "demo-project");
    mocks.store.clear();
    mocks.fail = false;
    mocks.authorised = true;
    mocks.localAllowed = true;
    mocks.send.mockReset().mockResolvedValue({ id: "email-id" });
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
  });
  it("accepts the real browser Host behind Next local URL rewriting and rejects other origins", async () => {
    const local = (origin: string) =>
      new Request("http://localhost:3000/api/committee-meetings/unlock", {
        method: "POST",
        headers: {
          host: "127.0.0.1:3000",
          origin,
          "Content-Type": "application/json",
        },
        body: '{"meetingId":"october-2026"}',
      });
    expect(await meetingBody(local("http://127.0.0.1:3000"))).toEqual({
      meetingId: "october-2026",
    });
    await expect(
      meetingBody(local("https://another-site.example")),
    ).rejects.toThrow();
  });
  it("public projection strips links, access code, hash and private extra fields", () => {
    const hub = defaultPrivateHub();
    const data = JSON.stringify(publicHub(hub));
    expect(data).not.toContain("teams.live.com");
    expect(data).not.toContain("52637");
    expect(data).not.toContain("accessCode");
    expect(data).toContain("2026-10-12");
    expect(data).toContain("2026-11-17");
  });
  it("returns only the selected URL after validating either code format", async () => {
    for (const [meetingId, code] of [
      ["october-2026", "52637"],
      ["november-2026", "5-2-6-3-7"],
    ]) {
      const response = await unlockMeeting(request({ meetingId, code }));
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.meeting.id).toBe(meetingId);
      expect(data.teamsUrl).toBe(
        defaultPrivateHub().meetings.find((m) => m.id === meetingId)?.teamsUrl,
      );
      expect(data).not.toHaveProperty("accessCode");
      expect(data).not.toHaveProperty("accessCodeHash");
      expect(response.headers.get("Cache-Control")).toContain("no-store");
    }
  });
  it("does not reveal URLs for wrong codes, unknown meetings or archived meetings", async () => {
    for (const body of [
      { meetingId: "october-2026", code: "12345" },
      { meetingId: "september-2026", code: "52637" },
      { meetingId: "missing", code: "52637" },
    ]) {
      const response = await unlockMeeting(request(body));
      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(await response.text()).not.toContain("teams.live.com");
    }
  });
  it("blocks guessing after eight attempts with the shared Firestore counter", async () => {
    for (let i = 0; i < 8; i++)
      expect(
        (
          await unlockMeeting(
            request({ meetingId: "october-2026", code: "wrong" }),
          )
        ).status,
      ).toBe(403);
    const response = await unlockMeeting(
      request({ meetingId: "october-2026", code: "52637" }),
    );
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("900");
    expect(await response.text()).not.toContain("teams.live.com");
  });
  it("never falls back to the old code when configured Firestore fails", async () => {
    mocks.fail = true;
    await expect(getPrivateHub()).rejects.toThrow();
    const response = await unlockMeeting(
      request({ meetingId: "october-2026", code: "52637" }),
    );
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain("teams.live.com");
  });
  it("uses TEAMS_MEETING_CODE from the environment and ignores the stored code", async () => {
    vi.stubEnv("TEAMS_MEETING_CODE", "1-1-2-2-3");
    for (const code of ["11223", "1-1-2-2-3", " 1 1 2 2 3 "]) {
      const response = await unlockMeeting(
        request({ meetingId: "october-2026", code }),
      );
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.meeting.id).toBe("october-2026");
      expect(data.teamsUrl).toBe(
        defaultPrivateHub().meetings.find((m) => m.id === "october-2026")
          ?.teamsUrl,
      );
      expect(JSON.stringify(data)).not.toContain("11223");
    }
    const old = await unlockMeeting(
      request({ meetingId: "october-2026", code: "52637" }),
    );
    expect(old.status).toBe(403);
    expect(await old.text()).not.toContain("teams.live.com");
  });
  it("still unlocks with the environment code when the database is down", async () => {
    vi.stubEnv("TEAMS_MEETING_CODE", "11223");
    mocks.fail = true;
    const response = await unlockMeeting(
      request({ meetingId: "november-2026", code: "11223" }),
    );
    expect(response.status).toBe(200);
    expect((await response.json()).teamsUrl).toMatch(
      /^https:\/\/teams\.live\.com\/meet\//,
    );
    for (const body of [
      { meetingId: "november-2026", code: "12345" },
      { meetingId: "september-2026", code: "11223" },
      { meetingId: "december-2026", code: "11223" },
    ]) {
      const denied = await unlockMeeting(request(body));
      expect(denied.status).toBeGreaterThanOrEqual(400);
      expect(await denied.text()).not.toContain("teams.live.com");
    }
  });
  it("supports code rotation and rejects the old code immediately", async () => {
    const hub = defaultPrivateHub();
    hub.accessCode = "67890";
    hub.accessCodeHash = await bcrypt.hash("67890", 4);
    mocks.store.set("committeeMeetingConfig/hub", hub);
    expect(
      (
        await unlockMeeting(
          request({ meetingId: "october-2026", code: "52637" }),
        )
      ).status,
    ).toBe(403);
    expect(
      (
        await unlockMeeting(
          request({ meetingId: "october-2026", code: "67890" }),
        )
      ).status,
    ).toBe(200);
  });
  it("securely saves a pending RSVP, notifies the committee and acknowledges without an access code", async () => {
    const response = await submitCommitteeRequest(request(form));
    expect(response.status).toBe(200);
    const { requestId } = await response.json();
    const saved = mocks.store.get(`committeeRequests/${requestId}`);
    expect(saved).toMatchObject({
      kind: "rsvp",
      status: "pending",
      notificationStatus: "sent",
      acknowledgementStatus: "sent",
    });
    expect(mocks.send).toHaveBeenCalledTimes(2);
    expect(mocks.send.mock.calls[0][0]).toMatchObject({
      to: "committee@james-square.com",
      replyTo: "alex@example.com",
      text: expect.stringContaining("Flat 2, James Square"),
    });
    expect(mocks.send.mock.calls[0][0].html).toContain("&lt;script&gt;");
    for (const call of mocks.send.mock.calls) {
      expect(call[0].text).not.toContain("52637");
      expect(call[0].text).not.toContain("teams.live.com");
    }
  });
  it("stores membership interest separately without granting permissions", async () => {
    const response = await submitCommitteeRequest(
      request({
        ...form,
        kind: "membership",
        whatsapp: true,
        phone: "+44 7700 900123",
      }),
    );
    expect(response.status).toBe(200);
    const { requestId } = await response.json();
    expect(mocks.store.get(`committeeRequests/${requestId}`)).toMatchObject({
      kind: "membership",
      status: "pending",
      whatsapp: true,
      phone: "+44 7700 900123",
      meetingId: "",
    });
    expect(mocks.send.mock.calls[0][0].subject).toContain(
      "Committee Membership Enquiry",
    );
    expect(
      [...mocks.store.keys()].some((key) => key.startsWith("users/")),
    ).toBe(false);
  });
  it("does not send email for invalid forms or claim success without storage", async () => {
    expect(
      (await submitCommitteeRequest(request({ ...form, email: "invalid" })))
        .status,
    ).toBe(400);
    expect(mocks.send).not.toHaveBeenCalled();
    mocks.fail = true;
    expect((await submitCommitteeRequest(request(form))).status).toBe(503);
    expect(mocks.send).not.toHaveBeenCalled();
  });
  it("retains saved requests and exposes a truthful delayed-delivery result when email fails", async () => {
    mocks.send.mockRejectedValue(new Error("Email unavailable"));
    const response = await submitCommitteeRequest(request(form));
    expect(response.status).toBe(202);
    const { requestId, message } = await response.json();
    expect(message).toContain("delayed");
    expect(
      mocks.store.get(`committeeRequests/${requestId}`)?.notificationStatus,
    ).toBe("failed");
  });
  it("rejects non-committee access for private reads and mutations", async () => {
    mocks.authorised = false;
    const read = await committeeAdminGet(
      new Request("https://www.james-square.com/api/committee-meetings/admin"),
    );
    const write = await committeeAdminPost(
      request({ action: "saveConfig", config: defaultPrivateHub() }),
    );
    expect(read.status).toBe(403);
    expect(write.status).toBe(403);
    expect(await read.text()).not.toContain("52637");
    expect(mocks.store.size).toBe(0);
  });
  it("marking approved never sends email; only the explicit send action issues the code", async () => {
    const record = {
      ...form,
      status: "pending",
      createdAt: "2026-10-11",
      expiresAt: "2027-04-09",
    };
    mocks.store.set("committeeRequests/request-1", record);
    expect(
      (
        await committeeAdminPost(
          request({ action: "sendApproval", id: "request-1" }),
        )
      ).status,
    ).toBe(400);
    expect(
      (
        await committeeAdminPost(
          request({ action: "status", id: "request-1", status: "approved" }),
        )
      ).status,
    ).toBe(200);
    expect(mocks.send).not.toHaveBeenCalled();
    expect(
      (
        await committeeAdminPost(
          request({ action: "sendApproval", id: "request-1" }),
        )
      ).status,
    ).toBe(200);
    expect(mocks.send.mock.calls[0][0]).toMatchObject({
      to: "alex@example.com",
      text: expect.stringContaining("52637"),
    });
    expect(mocks.send.mock.calls[0][0].text).not.toContain("teams.live.com");
    expect(
      (
        await committeeAdminPost(
          request({ action: "sendApproval", id: "request-1" }),
        )
      ).status,
    ).toBe(409);
    expect(mocks.send).toHaveBeenCalledTimes(1);
  });
  it("does not send meeting access for a membership enquiry", async () => {
    mocks.store.set("committeeRequests/member-1", {
      ...form,
      kind: "membership",
      status: "approved",
      expiresAt: "2027-04-09",
    });
    expect(
      (
        await committeeAdminPost(
          request({ action: "sendApproval", id: "member-1" }),
        )
      ).status,
    ).toBe(400);
    expect(mocks.send).not.toHaveBeenCalled();
  });
  it("prevents stale configuration writes and invalid private/public URL placement", async () => {
    const config = defaultPrivateHub();
    expect(
      (
        await committeeAdminPost(
          request({ action: "saveConfig", config, revision: "stale" }),
        )
      ).status,
    ).toBe(409);
    expect(
      (
        await committeeAdminPost(
          request({ action: "saveConfig", config, revision: "initial" }),
        )
      ).status,
    ).toBe(200);
    expect(mocks.store.get("committeeMeetingConfig/hub")?.revision).not.toBe(
      "initial",
    );
    expect(() =>
      validatePrivateHub({
        ...config,
        whatsappUrl: "https://evil.example/invite",
      }),
    ).toThrow();
    expect(() =>
      validatePrivateHub({
        ...config,
        meetings: config.meetings.map((m) => ({
          ...m,
          teamsUrl: "javascript:alert(1)",
        })),
      }),
    ).toThrow();
    expect(() =>
      validatePrivateHub({
        ...config,
        meetings: config.meetings.map((m) => ({
          ...m,
          approvedMinutes: m.teamsUrl,
        })),
      }),
    ).toThrow();
  });
});
