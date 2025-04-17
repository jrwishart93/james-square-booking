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

// Our original timeSlots array (notice there's no '12:30')
const timeSlots = [
  '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
  '09:00', '09:30', '10:00', '10:30', '11:00',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'
];

function generateInitialBookings() {
  const facilities = ['Pool', 'Gym', 'Sauna'];
  const bookings: Record<string, Record<string, Record<string, string>>> = {};
  facilities.forEach((facility) => {
    bookings[facility] = {};
  });
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
  setSelectedDate: (d: string) => void
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
          className={`min-w-[110px] px-3 py-1 rounded text-sm border whitespace-nowrap transition duration-200 ease-in-out transform hover:scale-105 hover:shadow-md ${
            iso === selectedDate
              ? 'bg-black text-white dark:bg-blue-600 dark:ring dark:ring-blue-400 dark:text-white'
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
  const searchParams = useSearchParams();
  const expandedParam = searchParams.get('expanded')?.toLowerCase();

  const [expandedFacilities, setExpandedFacilities] = useState<Record<string, boolean>>(
    expandedParam ? { [expandedParam]: true } : {}
  );
  const [bookings, setBookings] = useState<Record<string, Record<string, Record<string, string>>>>(
    generateInitialBookings()
  );
  const [selectedDate, setSelectedDate] = useState(getUKDate());
  const [user, setUser] = useState<{ email: string; isAdmin?: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingConfirm, setBookingConfirm] = useState<{ message: string; type: 'success' | 'cancel' } | null>(null);

  // New state variables to handle peak-time booking warnings.
  const [showPeakWarning, setShowPeakWarning] = useState(false);
  const [confirmPeakUsage, setConfirmPeakUsage] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<{ facility: string; time: string } | null>(null);

  const router = useRouter();

  // Determine if the selected date is a special Tuesday (every 14 days starting from 2025-04-15)
  const isSpecialTuesday = (() => {
    const dt = DateTime.fromISO(selectedDate, { zone: 'Europe/London' });
    if (dt.weekday !== 2) return false; // Tuesday
    const baseline = DateTime.fromISO('2025-04-15', { zone: 'Europe/London' });
    const diffDays = dt.diff(baseline, 'days').days;
    return diffDays >= 0 && Math.round(diffDays) % 14 === 0;
  })();

  useEffect(() => {
    async function fetchBookings(date: string) {
      const q = query(collection(db, 'bookings'), where('date', '==', date));
      const snap = await getDocs(q);
      const updated = generateInitialBookings();
      snap.forEach((docSnap) => {
        const data = docSnap.data() as {
          facility: string;
          date: string;
          time: string;
          user: string;
        };
        if (!updated[data.facility][data.date]) {
          updated[data.facility][data.date] = {};
        }
        updated[data.facility][data.date][data.time] = data.user;
      });
      setBookings(updated);
    }
    fetchBookings(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const isAdmin = firebaseUser.email?.endsWith('@admin.com') || false;
        setUser({ email: firebaseUser.email ?? '', isAdmin });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  function handleToggleExpand(facility: string) {
    const key = facility.toLowerCase();
    setExpandedFacilities((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function countUserBookings(facility: string) {
    let facilityCount = 0;
    let totalCount = 0;
    const selectedFacilityBookings = bookings[facility]?.[selectedDate] || {};
    facilityCount = Object.values(selectedFacilityBookings).filter(
      (bookedEmail) => bookedEmail === user?.email
    ).length;
    Object.values(bookings).forEach((fac) => {
      const dayBookings = fac[selectedDate] || {};
      totalCount += Object.values(dayBookings).filter(
        (bookedEmail) => bookedEmail === user?.email
      ).length;
    });
    return { facilityCount, totalCount };
  }

  // Existing check: block if already booked the same slot for 3 consecutive days.
  async function checkConsecutiveBookings(facility: string, time: string): Promise<boolean> {
    if (!user) return false;
    const currentDate = DateTime.fromISO(selectedDate, { zone: 'Europe/London' });
    let consecutiveCount = 0;
    for (let i = 1; i <= 3; i++) {
      const prevDate = currentDate.minus({ days: i }).toISODate();
      const q = query(
        collection(db, 'bookings'),
        where('facility', '==', facility),
        where('date', '==', prevDate),
        where('time', '==', time)
      );
      const snap = await getDocs(q);
      let found = false;
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.user === user.email) {
          found = true;
        }
      });
      if (found) consecutiveCount++;
      else break;
    }
    return consecutiveCount === 3;
  }

  // New function: check if the user has peak bookings (from 17:00 to 20:30) for 3 previous consecutive days.
  async function checkPeakBookings(userEmail: string): Promise<boolean> {
    const peakSlots = ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'];
    let peakBookingCount = 0;
    const currentDate = DateTime.fromISO(selectedDate, { zone: 'Europe/London' });
    for (let i = 1; i <= 3; i++) {
      const dateToCheck = currentDate.minus({ days: i }).toISODate();
      const q = query(
        collection(db, 'bookings'),
        where('date', '==', dateToCheck),
        where('user', '==', userEmail)
      );
      const snap = await getDocs(q);
      if (snap.docs.some((docSnap) => peakSlots.includes(docSnap.data().time))) {
        peakBookingCount++;
      }
    }
    return peakBookingCount >= 3;
  }

  // Extracted booking logic so it can be called normally or when confirmed via the peak warning.
  async function proceedWithBooking(facility: string, time: string) {
    const isBooked = bookings[facility][selectedDate]?.[time] === user.email;
    const bookingRef = doc(db, `bookings/${facility}_${selectedDate}_${time}`);

    if (isBooked) {
      await deleteDoc(bookingRef);
      setBookings((prev) => {
        const updated = { ...prev };
        delete updated[facility][selectedDate][time];
        return updated;
      });
      setBookingConfirm({ message: 'Booking Cancelled!', type: 'cancel' });
      setTimeout(() => setBookingConfirm(null), 2000);
    } else {
      const { facilityCount, totalCount } = countUserBookings(facility);
      if (facilityCount >= 2) {
        alert('You can only book 2 slots per facility per day.');
        return;
      }
      if (totalCount >= 6) {
        alert('You can only book up to 6 slots per day.');
        return;
      }
      try {
        await setDoc(bookingRef, {
          facility,
          time,
          user: user.email,
          date: selectedDate,
          timestamp: new Date(),
        });
        setBookings((prev) => ({
          ...prev,
          [facility]: {
            ...prev[facility],
            [selectedDate]: {
              ...(prev[facility][selectedDate] || {}),
              [time]: user.email,
            },
          },
        }));
        setBookingConfirm({ message: 'Booking Successful!', type: 'success' });
        setTimeout(() => setBookingConfirm(null), 2000);
      } catch (err: unknown) {
        const error = err as { code?: string; message?: string };
        if (error.code === 'permission-denied') {
          alert('That time slot has already been booked. Please choose another.');
        } else {
          console.error('Booking failed:', error.message);
          alert('An error occurred while booking. Please try again.');
        }
      }
    }
  }

  async function onBook(facility: string, time: string) {
    if (!user) {
      router.push('/login');
      return;
    }
    const hasConsecutive = await checkConsecutiveBookings(facility, time);
    if (hasConsecutive) {
      alert('You have already booked this slot for 3 consecutive days. You cannot book it again.');
      return;
    }
    // If the time is one of the peak slots, check for peak bookings warning.
    const peakSlots = ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'];
    if (peakSlots.includes(time)) {
      if (await checkPeakBookings(user.email)) {
        // Trigger the warning modal.
        setPendingBooking({ facility, time });
        setShowPeakWarning(true);
        return;
      }
    }
    await proceedWithBooking(facility, time);
  }

  function renderSchedule(facility: string) {
    // Build up the schedule slots.
    const scheduleSlots: Slot[] = [];

    if (isSpecialTuesday) {
      // Special Tuesday deep cleaning schedule:
      // 05:30–09:30: Available
      // 09:30–12:30: Closed for Cleaning
      // 12:30–17:00: Free to Use without Booking
      // 17:00–23:00: Available
      for (let i = 0; i < timeSlots.length - 1; ) {
        if (timeSlots[i] === '09:30') {
          scheduleSlots.push({
            start: '09:30',
            end: '12:30',
            status: 'Closed for Cleaning',
            groupKeys: ['09:30', '10:00', '10:30', '11:00']
          });
          scheduleSlots.push({
            start: '12:30',
            end: '17:00',
            status: 'Free to Use without Booking'
          });
          const idx17 = timeSlots.indexOf('17:00');
          i = idx17 >= 0 ? idx17 : timeSlots.length;
        } else {
          const start = timeSlots[i];
          const end = timeSlots[i + 1];
          const [h, m] = start.split(':').map(Number);
          const timeValue = h * 60 + m;
          let status = 'Unavailable';
          if ((timeValue >= 330 && timeValue < 570) || (timeValue >= 1020 && timeValue < 1380)) {
            status = 'Available';
          }
          scheduleSlots.push({ start, end, status });
          i++;
        }
      }
    } else {
      // Default schedule logic:
      for (let i = 0; i < timeSlots.length - 1; ) {
        const start = timeSlots[i];
        if (start === '09:30') {
          // Group cleaning from 09:30 to 11:00.
          const newEnd = timeSlots[i + 3] ?? timeSlots[i + 1];
          scheduleSlots.push({
            start,
            end: newEnd,
            status: 'Closed for Cleaning',
            groupKeys: ['09:30', '10:00', '10:30', '11:00']
          });
          i += 3;
        } else {
          const start = timeSlots[i];
          const end = timeSlots[i + 1];
          let status = 'Unavailable';
          if (start === '11:00') {
            status = 'Free to Use without Booking';
          } else {
            const [h, m] = start.split(':').map(Number);
            const timeValue = h * 60 + m;
            if ((timeValue >= 330 && timeValue < 570) || (timeValue >= 1020 && timeValue < 1380)) {
              status = 'Available';
            }
          }
          scheduleSlots.push({ start, end, status });
          i++;
        }
      }
    }

    const isExpanded = !!expandedFacilities[facility.toLowerCase()];
    const displayedSlots = isExpanded ? scheduleSlots : [];

    return (
      <motion.div
        layout
        key={facility}
        className="rounded-xl shadow-md p-4 border transition-all duration-300 bg-white dark:bg-gray-900"
      >
        <h2 className="text-xl font-semibold mb-3 text-center text-black dark:text-white">
          {facility}
        </h2>
        {isExpanded && (
          <ul className="space-y-2">
            <AnimatePresence>
              {displayedSlots.map((slot) => {
                const keysToCheck = slot.groupKeys ? slot.groupKeys : [slot.start];
                const bookedBy =
                  keysToCheck
                    .map((key) => bookings[facility][selectedDate]?.[key])
                    .find((val) => !!val) || null;
                const isOwn = bookedBy === user?.email;
                let showLabel = slot.status;
                if (isOwn) {
                  showLabel = 'Your booking';
                } else if (bookedBy) {
                  showLabel = user?.isAdmin ? `Booked by: ${bookedBy}` : 'Booked by another user';
                }
                let styleClass = '';
                if (isOwn) {
                  styleClass = 'bg-green-700 text-white';
                } else if (bookedBy) {
                  styleClass = 'bg-gray-300 text-gray-700 italic';
                } else {
                  if (slot.status === 'Available') {
                    styleClass = 'bg-green-100 text-black';
                  } else if (slot.status === 'Closed for Cleaning') {
                    styleClass = 'bg-blue-100 text-blue-700';
                  } else if (slot.status === 'Free to Use without Booking') {
                    styleClass = 'bg-yellow-100 text-gray-800';
                  } else {
                    styleClass = 'bg-red-100 text-gray-500';
                  }
                }
                return (
                  <motion.li
                    key={slot.start}
                    className={`flex justify-between items-center px-3 py-2 rounded ${styleClass}`}
                    title={isOwn ? 'Your booking' : bookedBy ? 'Booked by another user' : ''}
                  >
                    <span className="text-sm font-medium">
                      {slot.start} – {slot.end}
                    </span>
                    {slot.status === 'Available' ? (
                      user ? (
                        bookedBy && !isOwn ? (
                          <span className="text-xs italic">
                            {user?.isAdmin ? `Booked by: ${bookedBy}` : 'Booked by another user'}
                          </span>
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
                      <span className="text-xs italic">{showLabel}</span>
                    )}
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
        <div className="mt-4">
          <button
            onClick={() => handleToggleExpand(facility)}
            className="w-full py-2 px-4 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors"
          >
            {isExpanded ? 'Minimise Time Slots' : 'Expand to See All Slots'}
          </button>
        </div>
      </motion.div>
    );
  }

  if (loading) {
    return <main className="text-center py-12">Loading...</main>;
  }

  return (
    <main className="max-w-6xl mx-auto py-12 px-4">
      <AnimatePresence>
        {bookingConfirm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg z-50 ${
              bookingConfirm.type === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {bookingConfirm.message}
          </motion.div>
        )}
      </AnimatePresence>
{/* Peak Time Warning Modal */}
{showPeakWarning && pendingBooking && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg">
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
          onChange={() => setConfirmPeakUsage(!confirmPeakUsage)}
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
            if (pendingBooking) {
              await proceedWithBooking(pendingBooking.facility, pendingBooking.time);
            }
            setShowPeakWarning(false);
            setConfirmPeakUsage(false);
            setPendingBooking(null);
          }}
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
    You&apos;re currently viewing as a guest.{` `}
    <Link href="/login" className="underline">
      Sign in
    </Link>{` `}
    to make bookings.
  </div>
)}

{renderDateSelector(selectedDate, setSelectedDate)}

<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {['Pool', 'Gym', 'Sauna'].map((facility) => (
    <React.Fragment key={facility}>{renderSchedule(facility)}</React.Fragment>
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
