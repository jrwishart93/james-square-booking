'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { db, auth } from '@/lib/firebase';
import {
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  collection,
  query,
  where,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { DateTime } from 'luxon';

interface Slot {
  start: string;
  end: string;
  status: string;
  groupKeys?: string[];
}

// time slots (no 12 : 30)
const timeSlots = [
  '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
  '09:00', '09:30', '10:00', '10:30', '11:00',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00',
];

function generateInitialBookings() {
  const facilities = ['Pool', 'Gym', 'Sauna'];
  const bookings: Record<string, Record<string, Record<string, string>>> = {};
  facilities.forEach((f) => (bookings[f] = {}));
  return bookings;
}

function getUKDate(offset = 0) {
  return DateTime.now()
    .setZone('Europe/London')
    .plus({ days: offset })
    .toISODate();
}

function renderDateSelector(
  selectedDate: string,
  setSelectedDate: (d: string) => void,
) {
  const today = DateTime.now().setZone('Europe/London');
  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = today.plus({ days: i });
    return {
      iso: date.toISODate(),
      display: date.toLocaleString({
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      }),
    };
  });

  return (
    <div className="flex overflow-x-auto gap-2 mb-6 px-2 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
      {dates.map(({ iso, display }) => (
        <button
          key={iso}
          onClick={() => setSelectedDate(iso)}
          className={`min-w-[110px] px-3 py-1 rounded text-sm border whitespace-nowrap transition duration-200 transform hover:scale-105 hover:shadow-md ${
            iso === selectedDate
              ? 'bg-black text-white dark:bg-blue-600 dark:ring dark:ring-blue-400'
              : iso === getUKDate()
              ? 'border-black text-black font-semibold'
              : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white'
          }`}
        >
          {display}
        </button>
      ))}
    </div>
  );
}

export default function SchedulePageClientInner() {
  /* ---------------- state ---------------- */
  const searchParams = useSearchParams();
  const expandedParam = searchParams.get('expanded')?.toLowerCase();
  const [expandedFacilities, setExpandedFacilities] = useState<Record<string, boolean>>(
    expandedParam ? { [expandedParam]: true } : {},
  );
  const [bookings, setBookings] = useState<Record<string, Record<string, Record<string, string>>>>(
    generateInitialBookings(),
  );
  const [selectedDate, setSelectedDate] = useState(getUKDate());
  const [user, setUser] = useState<{ email: string; isAdmin?: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingConfirm, setBookingConfirm] = useState<{ message: string; type: 'success' | 'cancel' } | null>(null);

  /* peak‑warning modal */
  const [showPeakWarning, setShowPeakWarning] = useState(false);
  const [confirmPeakUsage, setConfirmPeakUsage] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<{ facility: string; time: string } | null>(null);

  const router = useRouter();

  /* special Tuesday flag — every 14 days starting 2025‑04‑15 */
  const isSpecialTuesday = (() => {
    const dt = DateTime.fromISO(selectedDate, { zone: 'Europe/London' });
    if (dt.weekday !== 2) return false;
    const baseline = DateTime.fromISO('2025-04-15', { zone: 'Europe/London' });
    const diffDays = dt.diff(baseline, 'days').days;
    return diffDays >= 0 && Math.round(diffDays) % 14 === 0;
  })();

  /* ---------------- effects ---------------- */
  useEffect(() => {
    async function fetchBookings(date: string) {
      const snap = await getDocs(
        query(collection(db, 'bookings'), where('date', '==', date)),
      );
      const updated = generateInitialBookings();
      snap.forEach((d) => {
        const { facility, date: dDate, time, user: u } = d.data() as {
          facility: string;
          date: string;
          time: string;
          user: string;
        };
        if (!updated[facility][dDate]) updated[facility][dDate] = {};
        updated[facility][dDate][time] = u;
      });
      setBookings(updated);
    }
    fetchBookings(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setUser({
          email: fbUser.email ?? '',
          isAdmin: fbUser.email?.endsWith('@admin.com') ?? false,
        });
      } else setUser(null);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  /* ---------------- helpers ---------------- */
  function handleToggleExpand(fac: string) {
    const k = fac.toLowerCase();
    setExpandedFacilities((p) => ({ ...p, [k]: !p[k] }));
  }

  function countUserBookings(facility: string) {
    const dayBookings = bookings[facility]?.[selectedDate] ?? {};
    const facilityCount = Object.values(dayBookings).filter((e) => e === user?.email).length;

    let totalCount = 0;
    Object.values(bookings).forEach((fac) => {
      totalCount += Object.values(fac[selectedDate] ?? {}).filter((e) => e === user?.email).length;
    });
    return { facilityCount, totalCount };
  }

  async function checkConsecutiveBookings(facility: string, time: string): Promise<boolean> {
    if (!user) return false;
    const base = DateTime.fromISO(selectedDate, { zone: 'Europe/London' });
    let run = 0;
    for (let i = 1; i <= 3; i++) {
      const prev = base.minus({ days: i }).toISODate();
      const snap = await getDocs(
        query(
          collection(db, 'bookings'),
          where('facility', '==', facility),
          where('date', '==', prev),
          where('time', '==', time),
        ),
      );
      const found = snap.docs.some((d) => (d.data() as any).user === user.email);
      if (found) run += 1;
      else break;
    }
    return run === 3;
  }

  async function checkPeakBookings(email: string): Promise<boolean> {
    const peak = ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'];
    const base = DateTime.fromISO(selectedDate, { zone: 'Europe/London' });
    let cnt = 0;
    for (let i = 1; i <= 3; i++) {
      const date = base.minus({ days: i }).toISODate();
      const snap = await getDocs(
        query(collection(db, 'bookings'), where('date', '==', date), where('user', '==', email)),
      );
      if (snap.docs.some((d) => peak.includes((d.data() as any).time))) cnt += 1;
    }
    return cnt >= 3;
  }

  /* ---------------- booking core ---------------- */
  async function proceedWithBooking(facility: string, time: string) {
    // guard: no user ➜ exit (satisfies TypeScript)
    if (!user) return;

    const isBooked = bookings[facility][selectedDate]?.[time] === user.email;
    const bookingRef = doc(db, `bookings/${facility}_${selectedDate}_${time}`);

    if (isBooked) {
      await deleteDoc(bookingRef);
      setBookings((prev) => {
        const up = { ...prev };
        delete up[facility][selectedDate][time];
        return up;
      });
      setBookingConfirm({ message: 'Booking Cancelled!', type: 'cancel' });
      setTimeout(() => setBookingConfirm(null), 2000);
      return;
    }

    const { facilityCount, totalCount } = countUserBookings(facility);
    if (facilityCount >= 2) return alert('You can only book 2 slots per facility per day.');
    if (totalCount >= 6) return alert('You can only book up to 6 slots per day.');

    try {
      await setDoc(bookingRef, {
        facility,
        time,
        user: user.email,
        date: selectedDate,
        timestamp: new Date(),
      });
      setBookings((p) => ({
        ...p,
        [facility]: {
          ...p[facility],
          [selectedDate]: { ...(p[facility][selectedDate] || {}), [time]: user.email },
        },
      }));
      setBookingConfirm({ message: 'Booking Successful!', type: 'success' });
      setTimeout(() => setBookingConfirm(null), 2000);
    } catch (e: any) {
      console.error('booking failed', e.message);
      alert(
        e.code === 'permission-denied'
          ? 'That time slot has already been booked.'
          : 'An error occurred while booking. Please try again.',
      );
    }
  }

  async function onBook(fac: string, time: string) {
    if (!user) return router.push('/login');

    if (await checkConsecutiveBookings(fac, time))
      return alert('You have already booked this slot for 3 consecutive days.');

    const peak = ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'];
    if (peak.includes(time) && (await checkPeakBookings(user.email))) {
      setPendingBooking({ facility: fac, time });
      setShowPeakWarning(true);
      return;
    }
    await proceedWithBooking(fac, time);
  }

  /* ---------------- schedule builder ---------------- */
  function renderSchedule(facility: string) {
    const schedule: Slot[] = [];

    if (isSpecialTuesday) {
      for (let i = 0; i < timeSlots.length - 1; ) {
        if (timeSlots[i] === '09:30') {
          schedule.push({
            start: '09:30',
            end: '12:30',
            status: 'Closed for Cleaning',
            groupKeys: ['09:30', '10:00', '10:30', '11:00'],
          });
          schedule.push({ start: '12:30', end: '17:00', status: 'Free to Use without Booking' });
          i = timeSlots.indexOf('17:00');
          continue;
        }
        const start = timeSlots[i];
        const end = timeSlots[i + 1];
        const [h, m] = start.split(':').map(Number);
        const v = h * 60 + m;
        schedule.push({
          start,
          end,
          status: v < 570 || v >= 1020 ? 'Available' : 'Unavailable',
        });
        i++;
      }
    } else {
      for (let i = 0; i < timeSlots.length - 1; ) {
        const start = timeSlots[i];
        if (start === '09:30') {
          const end = timeSlots[i + 3] ?? timeSlots[i + 1];
          schedule.push({
            start,
            end,
            status: 'Closed for Cleaning',
            groupKeys: ['09:30', '10:00', '10:30', '11:00'],
          });
          i += 3;
          continue;
        }
        const end = timeSlots[i + 1];
        let status = 'Unavailable';
        if (start === '11:00') status = 'Free to Use without Booking';
        else {
          const [h, m] = start.split(':').map(Number);
          const v = h * 60 + m;
          if (v < 570 || v >= 1020) status = 'Available';
        }
        schedule.push({ start, end, status });
        i++;
      }
    }

    const expanded = !!expandedFacilities[facility.toLowerCase()];
    const view = expanded ? schedule : [];

    return (
      <motion.div layout key={facility} className="rounded-xl shadow-md p-4 border bg-white dark:bg-gray-900">
        <h2 className="text-xl font-semibold mb-3 text-center">{facility}</h2>

        {expanded && (
          <ul className="space-y-2">
            <AnimatePresence>
              {view.map((slot) => {
                const keys = slot.groupKeys ?? [slot.start];
                const bookedBy = keys
                  .map((k) => bookings[facility][selectedDate]?.[k])
                  .find(Boolean) as string | undefined;
                const isOwn = bookedBy === user?.email;

                let label = slot.status;
                if (isOwn) label = 'Your booking';
                else if (bookedBy) label = user?.isAdmin ? `Booked by: ${bookedBy}` : 'Booked by another user';

                const cls =
                  isOwn
                    ? 'bg-green-700 text-white'
                    : bookedBy
                    ? 'bg-gray-300 text-gray-700 italic'
                    : slot.status === 'Available'
                    ? 'bg-green-100'
                    : slot.status === 'Closed for Cleaning'
                    ? 'bg-blue-100 text-blue-700'
                    : slot.status === 'Free to Use without Booking'
                    ? 'bg-yellow-100 text-gray-800'
                    : 'bg-red-100 text-gray-500';

                return (
                  <motion.li
                    key={slot.start}
                    className={`flex justify-between items-center px-3 py-2 rounded ${cls}`}
                  >
                    <span className="text-sm font-medium">
                      {slot.start} – {slot.end}
                    </span>

                    {slot.status === 'Available' ? (
                      user ? (
                        bookedBy && !isOwn ? (
                          <span className="text-xs italic">{label}</span>
                        ) : (
                          <button
                            aria-label={`Book ${facility} at ${slot.start}`}
                            onClick={() => onBook(facility, slot.start)}
                            className="text-xs text-white bg-black rounded px-2 py-1 hover:bg-gray-900"
                          >
                            {isOwn ? 'Cancel' : 'Book'}
                          </button>
                        )
                      ) : bookedBy ? (
                        <span className="text-xs italic">Booked by another user</span>
                      ) : (
                        <Link href="/login" className="text-xs text-red-600 underline">
                          Sign in to book
                        </Link>
                      )
                    ) : (
                      <span className="text-xs italic">{label}</span>
                    )}
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}

        <button
          onClick={() => handleToggleExpand(facility)}
          className="mt-4 w-full py-2 px-4 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700"
        >
          {expanded ? 'Minimise Time Slots' : 'Expand to See All Slots'}
        </button>
      </motion.div>
    );
  }

  /* ---------------- loading ---------------- */
  if (loading) return <main className="text-center py-12">Loading…</main>;

  /* ---------------- render ---------------- */
  return (
    <main className="max-w-6xl mx-auto py-12 px-4">
      {/* toast */}
      <AnimatePresence>
        {bookingConfirm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded shadow-lg z-50 ${
              bookingConfirm.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white`}
          >
            {bookingConfirm.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* peak‑time warning modal */}
      {showPeakWarning && pendingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
            <h3 className="text-lg font-semibold mb-2">Peak Time Booking Warning</h3>
            <p className="mb-4">
              Our system has detected that you have booked peak‑time slots for three consecutive days.
              Please confirm that you intend to use this booking.
            </p>
            <label className="flex items-center mb-4">
              <input
                type="checkbox"
                className="mr-2"
                checked={confirmPeakUsage}
                onChange={() => setConfirmPeakUsage((c) => !c)}
              />
              I confirm I intend to use this peak time slot.
            </label>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowPeakWarning(false);
                  setConfirmPeakUsage(false);
                  setPendingBooking(null);
                }}
              >
                Cancel
              </button>
              <button
                disabled={!confirmPeakUsage}
                onClick={async () => {
                  if (pendingBooking) await proceedWithBooking(pendingBooking.facility, pendingBooking.time);
                  setShowPeakWarning(false);
                  setConfirmPeakUsage(false);
                  setPendingBooking(null);
                }}
                className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-4xl font-bold mb-4 text-center">Facility Booking</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
        This page is visible to all users &mdash; but you&apos;ll need to sign in to book a slot.
      </p>

      {!user && (
        <div className="text-center mb-6 text-sm text-red-600">
          You&apos;re currently viewing as a guest.{' '}
          <Link href="/login" className="underline">
            Sign in
          </Link>{' '}
          to make bookings.
        </div>
      )}

      {renderDateSelector(selectedDate, setSelectedDate)}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['Pool', 'Gym', 'Sauna'].map((f) => (
          <React.Fragment key={f}>{renderSchedule(f)}</React.Fragment>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <Link
          href="/book/my-bookings"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          My Bookings
        </Link>
      </div>
    </main>
  );
}
