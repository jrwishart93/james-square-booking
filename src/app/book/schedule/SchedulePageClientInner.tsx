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

// Define interface for Slot
interface Slot {
  start: string;
  end: string;
  status: string;
  groupKeys?: string[];
}

// Define the time slots for booking.
const timeSlots = [
  '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'
];

// Initialize bookings state for each facility.
function generateInitialBookings() {
  const facilities = ['Pool', 'Gym', 'Sauna'];
  const bookings: Record<string, Record<string, Record<string, string>>> = {};
  facilities.forEach((facility) => {
    bookings[facility] = {};
  });
  return bookings;
}

// Using Luxon to always return the current UK date.
function getUKDate(offset = 0) {
  return DateTime.now()
    .setZone('Europe/London')
    .plus({ days: offset })
    .toISODate();
}

// Render a horizontal date selector.
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
          className={`min-w-[110px] px-3 py-1 rounded text-sm border whitespace-nowrap transition duration-200 ease-in-out transform hover:scale-105 hover:shadow-md ${
            iso === selectedDate
              ? 'bg-black text-white'
              : iso === getUKDate()
              ? 'border-black text-black font-semibold'
              : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white'
          }`}
          onClick={() => setSelectedDate(iso)}
        >
          {display}
        </button>
      ))}
    </div>
  );
}

function SchedulePageClientInner() {
  const searchParams = useSearchParams();
  const expandedParam = searchParams.get('expanded')?.toLowerCase();

  // Track expanded state per facility.
  const [expandedFacilities, setExpandedFacilities] = useState<Record<string, boolean>>(
    expandedParam ? { [expandedParam]: true } : {}
  );
  // Bookings state: facility → date → time → email.
  const [bookings, setBookings] = useState<Record<string, Record<string, Record<string, string>>>>(
    generateInitialBookings()
  );
  const [selectedDate, setSelectedDate] = useState(getUKDate());
  // The user object includes an optional isAdmin flag.
  const [user, setUser] = useState<{ email: string; isAdmin?: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch bookings for the selected date.
  useEffect(() => {
    async function fetchBookings(date: string) {
      const q = query(
        collection(db, 'bookings'),
        where('date', '==', date)
      );
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

  // Listen for authentication state changes.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // A user is considered an admin if their email ends with '@admin.com'
        const isAdmin = firebaseUser.email?.endsWith('@admin.com') || false;
        setUser({ email: firebaseUser.email ?? '', isAdmin });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Toggle expand/collapse for a facility.
  function handleToggleExpand(facility: string) {
    const key = facility.toLowerCase();
    setExpandedFacilities((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  // Count how many slots the current user has booked for a facility and overall.
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

  // Check if the user has booked a specific slot for the previous 3 consecutive days.
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

  // Handle booking or cancelling a slot.
  async function onBook(facility: string, time: string) {
    if (!user) {
      router.push('/login');
      return;
    }
    // Check consecutive bookings before proceeding.
    const hasConsecutive = await checkConsecutiveBookings(facility, time);
    if (hasConsecutive) {
      alert('You have already booked this slot for 3 consecutive days. You cannot book it again.');
      return;
    }
    const isBooked = bookings[facility][selectedDate]?.[time] === user.email;
    const bookingRef = doc(db, `bookings/${facility}_${selectedDate}_${time}`);

    if (isBooked) {
      // Cancel the booking.
      await deleteDoc(bookingRef);
      setBookings((prev) => {
        const updated = { ...prev };
        delete updated[facility][selectedDate][time];
        return updated;
      });
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

  // Render the schedule for a given facility.
  function renderSchedule(facility: string) {
    const scheduleSlots: Slot[] = [];
    for (let i = 0; i < timeSlots.length - 1;) {
      const start = timeSlots[i];
      let end = timeSlots[i + 1];
      if (start === '09:30') {
        // Group cleaning slots from 09:30 to 11:00.
        end = timeSlots[i + 3] || end;
        scheduleSlots.push({
          start,
          end,
          status: 'Closed for Cleaning',
          groupKeys: ['09:30', '10:00', '10:30']
        });
        i += 3;
      } else {
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

    const isExpanded = !!expandedFacilities[facility.toLowerCase()];
    const displayedSlots = isExpanded
      ? scheduleSlots
      : scheduleSlots.filter(
          slot =>
            slot.status === 'Closed for Cleaning' ||
            slot.status === 'Free to Use without Booking'
        );

    return (
      <motion.div
        layout
        key={facility}
        className="rounded-xl shadow-md p-4 border transition-all duration-300 bg-white dark:bg-gray-900"
      >
        <h2 className="text-xl font-semibold mb-3 text-center text-black dark:text-white">
          {facility}
        </h2>
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
        {/* Updated Expand/Minimise Button */}
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
        {['Pool', 'Gym', 'Sauna'].map((facility) => (
          <React.Fragment key={facility}>{renderSchedule(facility)}</React.Fragment>
        ))}
      </div>
    </main>
  );
}

export default SchedulePageClientInner;