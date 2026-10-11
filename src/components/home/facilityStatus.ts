/**
 * Single source of truth for whether the shared facilities are open.
 *
 * TO REOPEN BOOKING when the works are done:
 *   1. Set `open: true` on each facility below that is genuinely back in use.
 *      A facility left `open: false` stays marked closed everywhere.
 *   2. That is the whole change. `bookingEnabled` follows automatically, and
 *      with it: the "Book a facility" link on the homepage status band, the
 *      Book Facilities and My Dashboard items in the header, the footer link,
 *      the availability and dashboard buttons on /book, and the bookable
 *      facility tiles in place of the closed ones.
 *   3. Update the pool closure entry in components/home/notices.tsx: give it an
 *      `endsAt` so it archives itself, and post a reopening notice.
 *
 * If a reopening date is confirmed BEFORE the works finish, set
 * `expectedReopen` (for example 'March 2027') and leave `open: false`. The date
 * then shows on the status chips and on the closed facility cards. Only set it
 * when the date comes from Myreside or the committee: an unsourced date costs
 * more trust than the closure itself.
 *
 * The homepage, the navigation and the booking pages all read from here, so the
 * site can never show a "Closed" badge and a live booking button side by side.
 * When the pool, gym and sauna reopen, set `open: true` on each facility and set
 * `bookingEnabled` to true. Nothing else needs to change.
 */

export type FacilityKey = 'pool' | 'gym' | 'sauna';

export type FacilityStatus = {
  key: FacilityKey;
  /** Display name used in headings and status chips. */
  name: string;
  /** Short name used inside sentences and buttons. */
  shortName: string;
  open: boolean;
  /**
   * Expected reopening, only when we have been given a date we can attribute.
   * Leave null rather than guessing: an unsourced date costs more trust than
   * the closure itself.
   */
  expectedReopen: string | null;
};

export const facilityStatuses: FacilityStatus[] = [
  { key: 'pool', name: 'Swimming Pool', shortName: 'pool', open: false, expectedReopen: null },
  { key: 'gym', name: 'Gym', shortName: 'gym', open: false, expectedReopen: null },
  { key: 'sauna', name: 'Sauna', shortName: 'sauna', open: false, expectedReopen: null },
];

/** True only when every shared facility is closed. */
export const allFacilitiesClosed = facilityStatuses.every((facility) => !facility.open);

/** True when at least one facility can be booked. Gates every booking entry point. */
export const bookingEnabled = facilityStatuses.some((facility) => facility.open);

/** Human list of the closed facilities, e.g. "pool, gym and sauna". */
export function closedFacilityList() {
  const names = facilityStatuses.filter((f) => !f.open).map((f) => f.shortName);
  if (names.length === 0) return '';
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

/** Headline used at the top of the facilities section and the booking page. */
export const facilitiesHeadline = allFacilitiesClosed
  ? 'The swimming pool, gym and sauna are closed.'
  : bookingEnabled && facilityStatuses.every((facility) => facility.open)
    ? 'The swimming pool, gym and sauna are open.'
    : `Some facilities are open. The ${closedFacilityList()} ${
        facilityStatuses.filter((facility) => !facility.open).length === 1 ? 'is' : 'are'
      } still closed.`;

/**
 * Label for the link to /book. While the facilities are closed that page is
 * still worth reaching: it carries the facility descriptions, the pool rules
 * and the 3D scan. It just does not offer a booking.
 */
export const facilitiesPageLinkLabel = bookingEnabled
  ? 'Book a facility'
  : 'Facility details and pool rules';

/**
 * The standing explanation, kept in one place so every page tells the same
 * story. It swaps with the status: a closed-state paragraph must never render
 * under an Open chip, which is the contradiction this module exists to prevent.
 */
export const facilitiesExplainer = allFacilitiesClosed
  ? 'They have been closed since the plant room failure and remain closed on safety grounds. Repair and refurbishment options were discussed at the 2026 AGM and no reopening date has been set. Booking is unavailable until they reopen.'
  : 'Bookings are recommended for morning and evening sessions. Daytime use between 11:00 and 17:00 does not need a booking. Maximum of 2 bookings per facility per day.';
