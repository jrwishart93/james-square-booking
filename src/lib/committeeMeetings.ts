/** Public data only. Private configuration lives in committeeMeetings.server.ts. */
import { DateTime } from "luxon";

export type AgendaItem = { title: string; description?: string };
export type Meeting = {
  id: string;
  title: string;
  month: string;
  date: string | null;
  time: string | null;
  location: string;
  agenda: AgendaItem[];
  approvedMinutes: string;
};
export type MeetingHub = { meetings: Meeting[]; whatsappUrl: string };
export type Attendance = "online" | "in-person" | "unsure";
export type CommitteeRequest = {
  kind: "rsvp" | "membership";
  name: string;
  email: string;
  property: string;
  message: string;
  meetingId: string;
  attendance: Attendance | "";
  whatsapp: boolean;
  phone: string;
};
export const DEFAULT_WHATSAPP_URL =
  "https://chat.whatsapp.com/EyIsRJB2nLGCKR5AADHXjO?s=cl&p=i&ilr=4&iam=2";
const location = "The Conservatory, James Square";
export const DEFAULT_MEETINGS: Meeting[] = [
  {
    id: "october-2026",
    title: "James Square Committee Meeting",
    month: "2026-10",
    date: "2026-10-12",
    time: "18:15",
    location,
    approvedMinutes: "",
    agenda: [
      {
        title: "Caretaker Duties",
        description:
          "Review of current caretaker responsibilities, duties and arrangements.",
      },
      {
        title: "Cleaning Arrangements",
        description:
          "Update on recent discussions regarding communal cleaning standards, responsibilities and service provision.",
      },
      {
        title: "Gardening and Grounds Maintenance",
        description:
          "Update on the gardener’s duties, grounds maintenance, performance and outstanding concerns.",
      },
      {
        title: "Swimming Pool",
        description:
          "Update on the current pool situation, outstanding works, assessments and plans going forward.",
      },
      {
        title: "Current Maintenance Plans",
        description:
          "Discussion of existing and proposed maintenance work across James Square, including outstanding issues and priorities.",
      },
      {
        title: "Property Factor Fees",
        description:
          "Review of current factoring charges, associated costs and any relevant financial updates.",
      },
      {
        title: "Any Other Business (AOB)",
        description:
          "Additional matters raised by committee members, subject to available time.",
      },
    ],
  },
  {
    id: "november-2026",
    title: "James Square Committee Meeting",
    month: "2026-11",
    date: "2026-11-17",
    time: "18:15",
    location,
    agenda: [],
    approvedMinutes: "",
  },
  {
    id: "december-2026",
    title: "James Square Committee Meeting",
    month: "2026-12",
    date: null,
    time: null,
    location,
    agenda: [],
    approvedMinutes: "",
  },
  {
    id: "september-2026",
    title: "James Square Committee Meeting",
    month: "2026-09",
    date: "2026-09-15",
    time: "18:15",
    location,
    approvedMinutes: "",
    agenda: [
      {
        title: "Swimming Pool – Lothian House Visit",
        description:
          "Update following the recent visit to the swimming pool facilities at Lothian House.",
      },
      {
        title: "Swimming Pool Risk Assessment",
        description:
          "Update following the recent risk assessment visit and any actions arising from it.",
      },
      {
        title: "Caretaker",
        description:
          "Update and discussion regarding the caretaker arrangements at James Square.",
      },
      {
        title: "Fire Alarm",
        description:
          "Update on recent fire alarm discussions, volunteer arrangements and training.",
      },
      {
        title: "Cleaning",
        description:
          "Update on recent discussions regarding cleaning arrangements at James Square.",
      },
      { title: "FIOR", description: "Update on matters relating to FIOR." },
      {
        title: "Myreside",
        description:
          "Update on recent discussions and matters raised with Myreside Management.",
      },
      { title: "Any Other Business" },
    ],
  },
  {
    id: "august-2026",
    title: "James Square Committee Meeting",
    month: "2026-08",
    date: "2026-08-10",
    time: "18:00",
    location: "The conservatory at James Square",
    approvedMinutes: "",
    agenda: [
      "Introductions for new members",
      "Official acceptance of the constitution",
      "Discussion and election of office holders",
      "Discussion on emergency contacts and alarm responders",
      "Jimmy meeting update",
      "Agreement on wages to allow instruction to Myreside Management",
      "Discussion on access and key holders",
      "Update on Fior next steps",
      "Update on the JSPA account",
    ].map((title) => ({ title })),
  },
];

export function londonToday(now = new Date()) {
  return DateTime.fromJSDate(now, { zone: "Europe/London" }).toISODate()!;
}
export function isPastMeeting(meeting: Meeting, today = londonToday()) {
  // An unconfirmed day is never invented. Archive a month-only meeting after that month ends.
  return meeting.date
    ? meeting.date < today
    : meeting.month < today.slice(0, 7);
}
export function splitMeetings(meetings: Meeting[], today = londonToday()) {
  const key = (meeting: Meeting) => meeting.date ?? `${meeting.month}-01`;
  return {
    upcoming: meetings
      .filter((m) => !isPastMeeting(m, today))
      .sort((a, b) => key(a).localeCompare(key(b))),
    past: meetings
      .filter((m) => isPastMeeting(m, today))
      .sort((a, b) => key(b).localeCompare(key(a))),
  };
}
export function meetingLabel(meeting: Meeting) {
  return DateTime.fromISO(meeting.date ?? `${meeting.month}-01`, {
    zone: "Europe/London",
  })
    .setLocale("en-GB")
    .toFormat(meeting.date ? "cccc d LLLL yyyy" : "LLLL yyyy");
}
export function monthLabel(meeting: Meeting) {
  return DateTime.fromISO(`${meeting.month}-01`)
    .setLocale("en-GB")
    .toFormat("LLLL yyyy");
}
export function normalizeMeetingCode(value: string) {
  return value.trim().replaceAll("-", "");
}

/** Calendar files are created only after access is authorised; time is never guessed. */
export function meetingCalendar(
  meeting: Meeting,
  teamsUrl: string,
  now = new Date(),
) {
  if (!meeting.date) return null;
  const escape = (s: string) =>
    s
      .replace(/\\/g, "\\\\")
      .replace(/\r?\n/g, "\\n")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;");
  const start = meeting.time
    ? `DTSTART:${DateTime.fromISO(`${meeting.date}T${meeting.time}`, { zone: "Europe/London" }).toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'")}`
    : `DTSTART;VALUE=DATE:${meeting.date.replaceAll("-", "")}`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//James Square//Committee Meetings//EN",
    "BEGIN:VEVENT",
    `UID:${meeting.id}@james-square.com`,
    `DTSTAMP:${DateTime.fromJSDate(now).toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'")}`,
    start,
    `SUMMARY:${escape(meeting.title)}`,
    `LOCATION:${escape(meeting.location)}`,
    `DESCRIPTION:${escape(`${meeting.time ? `Time: ${meeting.time} (Europe/London).` : "Time to be confirmed. Date reminder only."} Join on Microsoft Teams: ${teamsUrl}`)}`,
    `URL:${teamsUrl}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  // RFC 5545: fold UTF-8 lines at 75 octets, not 75 characters.
  return (
    lines
      .map((line) => {
        let result = "",
          count = 0;
        for (const char of line) {
          const size = new TextEncoder().encode(char).length;
          if (count + size > 75) {
            result += "\r\n ";
            count = 1;
          }
          result += char;
          count += size;
        }
        return result;
      })
      .join("\r\n") + "\r\n"
  );
}

export function validateCommitteeRequest(
  body: unknown,
  meetings: Meeting[],
  today = londonToday(),
): CommitteeRequest {
  if (!body || typeof body !== "object")
    throw new Error("Please complete the form.");
  const b = body as Record<string, unknown>;
  const text = (key: string, max: number, required = false) => {
    if (b[key] !== undefined && typeof b[key] !== "string")
      throw new Error(`Invalid ${key}.`);
    const value = (typeof b[key] === "string" ? b[key] : "").trim();
    if (
      (required && !value) ||
      value.length > max ||
      /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(value)
    )
      throw new Error(`Please check ${key}.`);
    return value;
  };
  if (b.website) throw new Error("Unable to accept this request.");
  if (b.privacy !== true)
    throw new Error("Please acknowledge the privacy notice.");
  if (b.kind !== "rsvp" && b.kind !== "membership")
    throw new Error("Invalid request type.");
  const name = text("name", 120, true),
    email = text("email", 254, true),
    property = text("property", 300, true);
  if (/[\r\n]/.test(name + email) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new Error("Please enter a valid name and email address.");
  const meetingId = b.kind === "rsvp" ? text("meetingId", 80, true) : "";
  const attendance = b.kind === "rsvp" ? b.attendance : "";
  if (
    b.kind === "rsvp" &&
    (!meetings.some((m) => m.id === meetingId && !isPastMeeting(m, today)) ||
      !["online", "in-person", "unsure"].includes(String(attendance)))
  )
    throw new Error(
      "Please choose an upcoming meeting and attendance preference.",
    );
  const whatsapp = b.kind === "membership" && b.whatsapp === true;
  const phone = whatsapp ? text("phone", 40, true) : "";
  const phoneDigits = phone.replace(/\D/g, "").length;
  if (
    whatsapp &&
    (!/^\+?[\d\s().-]{7,40}$/.test(phone) ||
      phoneDigits < 7 ||
      phoneDigits > 15)
  )
    throw new Error(
      "Please enter a valid mobile number, including the international prefix.",
    );
  return {
    kind: b.kind,
    name,
    email,
    property,
    message: text("message", 4000),
    meetingId,
    attendance: attendance as Attendance | "",
    whatsapp,
    phone,
  };
}
