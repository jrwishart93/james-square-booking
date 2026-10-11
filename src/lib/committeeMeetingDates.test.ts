import { describe, expect, it } from 'vitest';
import {
  committeeMeetings,
  formatMeetingDate,
  formatMeetingTime12,
  formatMeetingTime24,
  relativeMeetingDay,
  upcomingMeetings,
} from './committeeMeetingDates';

const byId = (id: string) => committeeMeetings.find((meeting) => meeting.id === id)!;

describe('committee meeting dates', () => {
  it('formats the October and November meetings in UK time', () => {
    expect(formatMeetingDate(byId('2026-10-12'))).toBe('Monday 12 October 2026');
    expect(formatMeetingTime24(byId('2026-10-12'))).toBe('18:15');
    expect(formatMeetingTime12(byId('2026-10-12'))).toBe('6:15 pm');
    // November is after the clocks go back, so the offset changes but the time does not.
    expect(formatMeetingDate(byId('2026-11-17'))).toBe('Tuesday 17 November 2026');
    expect(formatMeetingTime24(byId('2026-11-17'))).toBe('18:15');
  });

  it('promotes October as next on 11 October, and says tomorrow', () => {
    const now = new Date('2026-10-11T12:00:00+01:00');
    const upcoming = upcomingMeetings(now);
    expect(upcoming.map((m) => m.id)).toEqual(['2026-10-12', '2026-11-17']);
    expect(relativeMeetingDay(upcoming[0], now)).toBe('tomorrow');
  });

  it('says today on the day and keeps the meeting listed while it is running', () => {
    const now = new Date('2026-10-12T19:00:00+01:00');
    const upcoming = upcomingMeetings(now);
    expect(upcoming[0].id).toBe('2026-10-12');
    expect(relativeMeetingDay(upcoming[0], now)).toBe('today');
  });

  it('promotes November once the October meeting has finished', () => {
    const now = new Date('2026-10-12T21:00:00+01:00');
    const upcoming = upcomingMeetings(now);
    expect(upcoming.map((m) => m.id)).toEqual(['2026-11-17']);
    expect(relativeMeetingDay(upcoming[0], now)).toBeNull();
  });

  it('uses UK midnight for "tomorrow", not UTC', () => {
    // 23:30 BST on 11 October is still 11 October in the UK (22:30 UTC).
    expect(relativeMeetingDay(byId('2026-10-12'), new Date('2026-10-11T22:30:00Z'))).toBe(
      'tomorrow'
    );
    // 00:30 BST on 12 October is 23:30 UTC on 11 October, but it is already "today".
    expect(relativeMeetingDay(byId('2026-10-12'), new Date('2026-10-11T23:30:00Z'))).toBe('today');
  });

  it('has nothing upcoming once every listed meeting is past', () => {
    expect(upcomingMeetings(new Date('2026-12-01T12:00:00Z'))).toEqual([]);
  });
});
