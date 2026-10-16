import { describe, expect, it } from "vitest";
import {
  DEFAULT_MEETINGS,
  DEFAULT_WHATSAPP_URL,
  londonToday,
  meetingCalendar,
  meetingLabel,
  normalizeMeetingCode,
  splitMeetings,
  validateCommitteeRequest,
} from "./committeeMeetings";

const form = {
  kind: "rsvp",
  name: "Alex Owner",
  email: "alex@example.com",
  property: "Flat G/2, 39 Caledonian Crescent, James Square, Edinburgh",
  message: "Please discuss the gardens.",
  meetingId: "october-2026",
  attendance: "online",
  privacy: true,
  website: "",
};
describe("committee meeting dates and forms", () => {
  it("uses the confirmed 18:15 dates for October to December", () => {
    const october = DEFAULT_MEETINGS[0],
      november = DEFAULT_MEETINGS[1],
      december = DEFAULT_MEETINGS[2];
    expect(meetingLabel(october)).toBe("Monday 12 October 2026");
    expect(meetingLabel(november)).toBe("Tuesday 17 November 2026");
    expect(october.time).toBe("18:15");
    expect(november.time).toBe("18:15");
    expect(meetingLabel(december)).toBe("Tuesday 8 December 2026");
    expect(december.time).toBe("18:15");
    expect(december.agenda).toEqual([]);
    expect(november.agenda).toEqual([]);
  });
  it("archives only past dates, retains agendas, and sorts chronologically", () => {
    const before = splitMeetings([...DEFAULT_MEETINGS].reverse(), "2026-10-11");
    expect(before.upcoming.map((m) => m.id)).toEqual([
      "october-2026",
      "november-2026",
      "december-2026",
    ]);
    expect(before.past.map((m) => m.id)).toEqual([
      "september-2026",
      "august-2026",
    ]);
    const after = splitMeetings(DEFAULT_MEETINGS, "2026-11-18");
    expect(after.upcoming.map((m) => m.id)).toEqual(["december-2026"]);
    expect(
      after.past.find((m) => m.id === "october-2026")?.agenda,
    ).toHaveLength(7);
    expect(
      after.past.find((m) => m.id === "september-2026")?.agenda,
    ).toHaveLength(8);
    expect(after.past.find((m) => m.id === "august-2026")?.agenda).toHaveLength(
      9,
    );
    expect(splitMeetings(DEFAULT_MEETINGS, "2027-01-01").upcoming).toHaveLength(
      0,
    );
  });
  it("uses the UK date across midnight in summer time", () => {
    expect(londonToday(new Date("2026-10-11T23:15:00Z"))).toBe("2026-10-12");
  });
  it("exports authorised calendar times with correct October and November UTC offsets", () => {
    const url = "https://teams.live.com/meet/test";
    expect(meetingCalendar(DEFAULT_MEETINGS[0], url)).toContain(
      "DTSTART:20261012T171500Z",
    );
    expect(meetingCalendar(DEFAULT_MEETINGS[1], url)).toContain(
      "DTSTART:20261117T181500Z",
    );
    expect(meetingCalendar(DEFAULT_MEETINGS[2], url)).toContain(
      "DTSTART:20261208T181500Z",
    );
    // A meeting without a confirmed day never gets an invented date.
    expect(
      meetingCalendar({ ...DEFAULT_MEETINGS[2], date: null, time: null }, url),
    ).toBeNull();
  });
  it("folds calendar lines at 75 UTF-8 bytes and escapes text", () => {
    const ics = meetingCalendar(
      { ...DEFAULT_MEETINGS[0], location: "x, y; z\n" + "é".repeat(150) },
      "https://teams.live.com/meet/test",
    )!;
    expect(ics).toContain("LOCATION:x\\, y\\; z\\n");
    expect(
      ics
        .split("\r\n")
        .every((line) => new TextEncoder().encode(line).length <= 75),
    ).toBe(true);
  });
  it("allows hyphens without accepting letters as code digits", () => {
    expect(normalizeMeetingCode(" 5-2-6-3-7 ")).toBe("52637");
    expect(normalizeMeetingCode("5a2637")).toBe("5a2637");
  });
  it("accepts flexible property addresses and strips unrelated membership fields", () => {
    expect(
      validateCommitteeRequest(
        { ...form, whatsapp: true, phone: "+44 123456789" },
        DEFAULT_MEETINGS,
        "2026-10-11",
      ),
    ).toMatchObject({ property: form.property, whatsapp: false, phone: "" });
  });
  it("rejects missing details, invalid emails, expired meetings, spam and missing privacy acknowledgement", () => {
    for (const patch of [
      { name: "" },
      { property: "" },
      { email: "bad" },
      { meetingId: "august-2026" },
      { attendance: "anything" },
      { website: "spam" },
      { privacy: false },
      { name: "a\r\nb" },
      { message: "x".repeat(4001) },
    ]) {
      expect(() =>
        validateCommitteeRequest(
          { ...form, ...patch },
          DEFAULT_MEETINGS,
          "2026-10-11",
        ),
      ).toThrow();
    }
  });
  it("requires a mobile number only for membership WhatsApp opt-in", () => {
    const member = { ...form, kind: "membership", meetingId: "not-a-meeting" };
    expect(() =>
      validateCommitteeRequest(
        { ...member, whatsapp: true, phone: "-------" },
        DEFAULT_MEETINGS,
        "2026-10-11",
      ),
    ).toThrow();
    expect(
      validateCommitteeRequest(member, DEFAULT_MEETINGS, "2026-10-11"),
    ).toMatchObject({
      kind: "membership",
      meetingId: "",
      attendance: "",
      phone: "",
    });
    expect(() =>
      validateCommitteeRequest(
        { ...member, whatsapp: true },
        DEFAULT_MEETINGS,
        "2026-10-11",
      ),
    ).toThrow();
    expect(() =>
      validateCommitteeRequest(
        { ...member, whatsapp: true, phone: "not a phone" },
        DEFAULT_MEETINGS,
        "2026-10-11",
      ),
    ).toThrow();
    expect(
      validateCommitteeRequest(
        { ...member, whatsapp: true, phone: "+44 (0)7700 900123" },
        DEFAULT_MEETINGS,
        "2026-10-11",
      ).phone,
    ).toBe("+44 (0)7700 900123");
  });
  it("keeps the public WhatsApp invite exact", () => {
    expect(DEFAULT_WHATSAPP_URL).toBe(
      "https://chat.whatsapp.com/EyIsRJB2nLGCKR5AADHXjO?s=cl&p=i&ilr=4&iam=2",
    );
  });
});
