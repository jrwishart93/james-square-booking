'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { db, auth } from '@/lib/firebase';
import { doc, setDoc, deleteDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Define the time slots for booking.
const timeSlots = [
  '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'
];

// Initialize bookings state for each facility.
const generateInitialBookings = () => {
  const facilities = ['Pool', 'Gym', 'Sauna'];
  const bookings: Record<string, Record<string, Record<string, string>>> = {};
  facilities.forEach((facility) => (bookings[facility] = {}));
  return bookings;
};

// Get the current UK date (or offset by a number of days).
const getUKDate = (offset = 0) => {
  const uk = new Date(new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' }));
  uk.setDate(uk.getDate() + offset);
  return uk.toISOString().split('T')[0];
};

// Render a horizontal date selector.
const renderDateSelector = (selectedDate: string, setSelectedDate: (d: string) => void) => {
  const today = new Date();
  const todayISO = today.toISOString().split('T')[0];
  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const iso = date.toISOString().split('T')[0];
    const display = `${date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    })}`.replace(',', '');
    return { iso, display };
  });

  return (
    <div className="flex overflow-x-auto gap-2 mb-6 px-2 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
      {dates.map(({ iso, display }) => (
        <button
          key={iso}
          className={`min-w-[110px] px-3 py-1 rounded text-sm border whitespace-nowrap transition duration-200 ease-in-out transform hover:scale-105 hover:shadow-md ${
            iso === selectedDate
              ? 'bg-black text-white'
              : iso === todayISO
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
};

export default function SchedulePageClient() {
  const [expandedFacility, setExpandedFacility] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Record<string, Record<string, Record<string, string>>>>(generateInitialBookings);
  const [selectedDate, setSelectedDate] = useState(getUKDate());
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch bookings for the selected date and listen for auth state changes.
  useEffect(() => {
    fetchBookings(selectedDate);
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ? { email: firebaseUser.email ?? '' } : null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [selectedDate]);

  const handleExpand = (facility: string | null) => {
    setExpandedFacility((prev) => (prev === facility ? null : facility));
  };

  // Fetch bookings from Firestore for the given date.
  const fetchBookings = async (date: string) => {
    const snapshot = await getDocs(query(collection(db, 'bookings'), where('date', '==', date)));
    const updated = generateInitialBookings();
    snapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data() as { facility: string; date: string; time: string; user: string };
      if (!updated[data.facility][data.date]) updated[data.facility][data.date] = {};
      updated[data.facility][data.date][data.time] = data.user;
    });
    setBookings(updated);
  };

  // Count how many slots the user has booked for the facility and overall for the day.
  const countUserBookings = (facility: string) => {
    let facilityCount = 0;
    let totalCount = 0;
    const selectedFacilityBookings = bookings[facility]?.[selectedDate] || {};
    facilityCount = Object.values(selectedFacilityBookings).filter((email) => email === user?.email).length;

    Object.values(bookings).forEach((fac) => {
      const dayBookings = fac[selectedDate] || {};
      totalCount += Object.values(dayBookings).filter((email) => email === user?.email).length;
    });

    return { facilityCount, totalCount };
  };

  // Handle booking or cancelling a slot.
  const onBook = async (facility: string, time: string) => {
    if (!user) {
      router.push('/login');
      return;
    }

    const isBooked = bookings[facility][selectedDate]?.[time] === user.email;
    const bookingRef = doc(db, `bookings/${facility}_${selectedDate}_${time}`);

    if (isBooked) {
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
  };

  const renderSchedule = (facility: string) => {
    const isExpanded = expandedFacility === null || expandedFacility === facility;

    return (
      <motion.div
        layout
        key={facility}
        className={`rounded-xl shadow-md p-4 border transition-all duration-300 ${
          isExpanded
            ? 'bg-white dark:bg-gray-900 scale-[1.03]'
            : 'bg-gray-100 dark:bg-gray-800 opacity-40 scale-95 pointer-events-none'
        }`}
      >
        <h2 className="text-xl font-semibold mb-3 text-center">{facility}</h2>
        <ul className="space-y-2">
          <AnimatePresence>
            {timeSlots.map((start, i) => {
              const end = timeSlots[i + 1];
              if (!end) return null;
              const bookedBy = bookings[facility][selectedDate]?.[start] || null;
              const isOwn = bookedBy === user?.email;

              const [h, m] = start.split(':').map(Number);
              const timeValue = h * 60 + m;

              let status = 'Unavailable';
              if ((h === 9 && m >= 30) || h === 10) status = 'Cleaning';
              else if (start === '11:00') status = 'Free Use';
              else if ((timeValue >= 330 && timeValue < 570) || (timeValue >= 1020 && timeValue < 1380))
                status = 'Available';

              const showLabel = isOwn
                ? 'Your booking'
                : bookedBy
                ? 'Booked by another user'
                : status;

              const styleClass = isOwn
                ? 'bg-green-700 text-white'
                : bookedBy
                ? 'bg-gray-300 text-gray-700 italic'
                : status === 'Available'
                ? 'bg-green-100 text-black'
                : status === 'Cleaning'
                ? 'bg-blue-100 text-blue-700'
                : status === 'Free Use'
                ? 'bg-yellow-100 text-gray-800'
                : 'bg-red-100 text-gray-500';

              return (
                <motion.li
                  key={start}
                  className={`flex justify-between items-center px-3 py-2 rounded ${styleClass}`}
                  title={isOwn ? 'Your booking' : bookedBy ? 'Booked by another user' : ''}
                >
                  <span className="text-sm font-medium">
                    {start} – {end}
                  </span>
                  {status === 'Available' ? (
                    user ? (
                      bookedBy && !isOwn ? (
                        <span className="text-xs italic">Booked by another user</span>
                      ) : (
                        <button
                          aria-label={`Book ${facility} at ${start}`}
                          onClick={() => onBook(facility, start)}
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
        <div className="text-right mt-3">
          <button
            onClick={() => handleExpand(facility)}
            className="text-xs text-gray-500 hover:text-black"
          >
            {expandedFacility === facility ? 'Minimise' : '...'}
          </button>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return <main className="text-center py-12">Loading...</main>;
  }

  return (
    <main className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-4 text-center">Facility Booking</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
        This page is visible to all users — but you&apos;ll need to sign in to book a slot.
      </p>

      {!user && (
        <div className="text-center mb-6 text-sm text-red-600">
          You&apos;re currently viewing as a guest. <Link href="/login" className="underline">Sign in</Link> to make bookings.
        </div>
      )}

      {renderDateSelector(selectedDate, setSelectedDate)}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['Pool', 'Gym', 'Sauna'].map((facility) => (
          <React.Fragment key={facility}>
            {renderSchedule(facility)}
          </React.Fragment>
        ))}
      </div>
    </main>
  );
}
