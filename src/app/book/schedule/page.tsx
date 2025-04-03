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

const timeSlots = [
  '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
  '22:00', '22:30', '23:00'
];

const generateInitialBookings = () => {
  const facilities = ['Pool', 'Gym', 'Sauna'];
  const bookings: Record<string, Record<string, Record<string, string>>> = {};
  facilities.forEach((facility) => (bookings[facility] = {}));
  return bookings;
};

const getUKDate = (offset = 0) => {
  const uk = new Date(new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' }));
  uk.setDate(uk.getDate() + offset);
  return uk.toISOString().split('T')[0];
};

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

export default function Page() {
  const [expandedFacility, setExpandedFacility] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Record<string, Record<string, Record<string, string>>>>(generateInitialBookings);
  const [selectedDate, setSelectedDate] = useState(getUKDate());
  const [user, setUser] = useState<{ email: string } | null>(null);

  const handleExpand = (facility: string | null) => {
    setExpandedFacility((prev) => (prev === facility ? null : facility));
  };

  const fetchBookings = async (date: string) => {
    const snapshot = await getDocs(query(collection(db, 'bookings'), where('date', '==', date)));
    const updated = generateInitialBookings();
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (!updated[data.facility][data.date]) updated[data.facility][data.date] = {};
      updated[data.facility][data.date][data.time] = data.user;
    });
    setBookings(updated);
  };

  useEffect(() => {
    fetchBookings(selectedDate);
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ? { email: firebaseUser.email ?? '' } : null);
    });
    return () => unsubscribe();
  }, [selectedDate]);

  const onBook = async (facility: string, time: string) => {
    if (!user) return;
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
    }
  };

  const renderSchedule = (facility: string) => {
    const isExpanded = expandedFacility === null || expandedFacility === facility;

    return (
      <motion.div
        layout
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
              else if ((timeValue >= 330 && timeValue < 570) || (timeValue >= 1020 && timeValue < 1380)) status = 'Available';

              return (
                <motion.li
                  key={start}
                  className={`flex justify-between items-center px-3 py-2 rounded ${
                    isOwn ? 'bg-green-700 text-white' :
                    status === 'Available' ? 'bg-green-100 text-black' :
                    status === 'Cleaning' ? 'bg-blue-100 text-blue-700' :
                    status === 'Free Use' ? 'bg-yellow-100 text-gray-800' : 'bg-red-100 text-gray-500'
                  }`}
                  title={isOwn ? 'Your booking' : bookedBy ? 'Booked' : ''}
                >
                  <span className="text-sm font-medium">{start} – {end}</span>
                  {status === 'Available' ? (
                    user ? (
                      <button
                        onClick={() => onBook(facility, start)}
                        className="text-xs text-white bg-black rounded px-2 py-1 hover:bg-gray-900"
                      >
                        {isOwn ? 'Cancel' : 'Book'}
                      </button>
                    ) : (
                      <a href="/login" className="text-xs text-red-600 underline">Sign in to book</a>
                    )
                  ) : (
                    <span className="text-xs italic">{isOwn ? 'Your booking' : status}</span>
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

  return (
    <main className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-4 text-center">Facility Booking</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
        Select a day and book your slots below. Booking required 05:30–09:30 & 17:00–23:00.
      </p>

      {renderDateSelector(selectedDate, setSelectedDate)}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['Pool', 'Gym', 'Sauna'].map((facility) => renderSchedule(facility))}
      </div>
    </main>
  );
}
