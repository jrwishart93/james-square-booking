/**
 * Single source of truth for whether the shared facilities are open.
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
  : 'Facility status';

/** The standing explanation. Kept in one place so every page tells the same story. */
export const facilitiesExplainer =
  'They have been closed since the plant room failure and remain closed on safety grounds. Repair and refurbishment options were discussed at the 2026 AGM and no reopening date has been set. Booking is unavailable until they reopen.';
