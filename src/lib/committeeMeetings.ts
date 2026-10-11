/**
 * Single source of truth for James Square committee meeting dates.
 *
 * The homepage "Upcoming committee meetings" card and the /committee-meeting
 * page both read from this list, so a date only ever has to be changed here.
 *
 * TO ADD A MEETING: append an entry with its start time as an ISO string that
 * carries the UK offset for that date (+01:00 during British Summer Time,
 * +00:00 otherwise). Meetings drop off "upcoming" automatically once they have
 * ended, so past entries can stay here as a record.
 *
 * Keep `teamsUrl` null unless the committee has decided the joining link may be
 * published openly. Online joining details are otherwise sent privately to
 * owners who register in advance.
 */

export type AgendaItem = { title: string; description?: string };

export type CommitteeMeeting = {
  id: string;
  /** Start time, ISO 8601 with the UK offset for that date. */
  startsAt: string;
  durationMinutes: number;
  location: string;
  /** Public Teams link, only when the committee has chosen to publish it. */
  teamsUrl: string | null;
  /** Calendar file under /public, without any private joining link. */
  icsPath: string | null;
  /** Null until the committee publishes the agenda. */
  agenda: AgendaItem[] | null;
};

export const COMMITTEE_EMAIL = 'committee@james-square.com';
export const COMMITTEE_MEETING_PATH = '/committee-meeting';
export const MEETING_LOCATION = 'The Conservatory, James Square';

export const committeeMeetings: CommitteeMeeting[] = [
  {
    id: '2026-09-15',
    startsAt: '2026-09-15T18:15:00+01:00',
    durationMinutes: 120,
    location: MEETING_LOCATION,
    teamsUrl: 'https://teams.live.com/meet/9379620383354?p=GEqjTA0LIPWYyshEWv',
    icsPath: '/calendar/james-square-committee-meeting-september-2026.ics',
    agenda: [
      {
        title: 'Swimming Pool – Lothian House Visit',
        description:
          'Update following the recent visit to the swimming pool facilities at Lothian House.',
      },
      {
        title: 'Swimming Pool Risk Assessment',
        description:
          'Update following the recent risk assessment visit and any actions arising from it.',
      },
      {
        title: 'Caretaker',
        description: 'Update and discussion regarding the caretaker arrangements at James Square.',
      },
      {
        title: 'Fire Alarm',
        description: 'Update on recent fire alarm discussions, volunteer arrangements and training.',
      },
      {
        title: 'Cleaning',
        description: 'Update on recent discussions regarding cleaning arrangements at James Square.',
      },
      { title: 'FIOR', description: 'Update on matters relating to FIOR.' },
      {
        title: 'Myreside',
        description: 'Update on recent discussions and matters raised with Myreside Management.',
      },
      { title: 'Any Other Business' },
    ],
  },
  {
    id: '2026-10-12',
    startsAt: '2026-10-12T18:15:00+01:00',
    durationMinutes: 120,
    location: MEETING_LOCATION,
    teamsUrl: null,
    icsPath: '/calendar/james-square-committee-meeting-october-2026.ics',
    agenda: null,
  },
  {
    id: '2026-11-17',
    startsAt: '2026-11-17T18:15:00+00:00',
    durationMinutes: 120,
    location: MEETING_LOCATION,
    teamsUrl: null,
    icsPath: '/calendar/james-square-committee-meeting-november-2026.ics',
    agenda: null,
  },
];

export function meetingStart(meeting: CommitteeMeeting) {
  return new Date(meeting.startsAt);
}

export function meetingEnd(meeting: CommitteeMeeting) {
  return new Date(meetingStart(meeting).getTime() + meeting.durationMinutes * 60_000);
}

/** Meetings that have not yet finished, soonest first. */
export function upcomingMeetings(now = new Date(), meetings = committeeMeetings) {
  return meetings
    .filter((meeting) => meetingEnd(meeting).getTime() > now.getTime())
    .sort((a, b) => meetingStart(a).getTime() - meetingStart(b).getTime());
}

/** The most recent meeting that has finished, if any. */
export function lastMeeting(now = new Date(), meetings = committeeMeetings) {
  const past = meetings
    .filter((meeting) => meetingEnd(meeting).getTime() <= now.getTime())
    .sort((a, b) => meetingStart(b).getTime() - meetingStart(a).getTime());
  return past[0] ?? null;
}

const UK_TIME_ZONE = 'Europe/London';

/** e.g. "Monday 12 October 2026" in UK time. */
export function formatMeetingDate(meeting: CommitteeMeeting) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: UK_TIME_ZONE,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).formatToParts(meetingStart(meeting));
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';
  return `${get('weekday')} ${get('day')} ${get('month')} ${get('year')}`;
}

/** e.g. "18:15" in UK time. */
export function formatMeetingTime24(meeting: CommitteeMeeting) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: UK_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(meetingStart(meeting));
}

/** e.g. "6:15 pm" in UK time. */
export function formatMeetingTime12(meeting: CommitteeMeeting) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: UK_TIME_ZONE,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
    .format(meetingStart(meeting))
    .replace(/\s*([ap])\.?m\.?/i, (_, letter: string) => ` ${letter.toLowerCase()}m`);
}

/** Calendar date in UK time as a day count, so "tomorrow" follows UK midnight. */
function ukDayNumber(date: Date) {
  const [y, m, d] = new Intl.DateTimeFormat('en-CA', {
    timeZone: UK_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(date)
    .split('-')
    .map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / 86_400_000);
}

/** "today", "tomorrow", or null when the meeting is further away (or over). */
export function relativeMeetingDay(meeting: CommitteeMeeting, now = new Date()) {
  const diff = ukDayNumber(meetingStart(meeting)) - ukDayNumber(now);
  if (diff === 0) return 'today';
  if (diff === 1) return 'tomorrow';
  return null;
}
