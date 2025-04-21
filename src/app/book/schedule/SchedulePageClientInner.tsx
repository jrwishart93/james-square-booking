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
  setSelectedDate: (d: string) => void,
  user: { email: string; isAdmin?: boolean } | null
) {
  const today = DateTime.now().setZone('Europe/London');
  const dateRange = user?.isAdmin ? 60 : 14;

  const dates = Array.from({ length: dateRange }, (_, i) => {
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

  const [maintenanceWindows, setMaintenanceWindows] = useState<
  { facility: string; startDate: string; endDate: string }[]
>([]);
  
  // Admin-only state for maintenance window form
  const [newFacility, setNewFacility] = useState('Pool');
  const [newStartDate, setNewStartDate] = useState(getUKDate());
  const [newEndDate, setNewEndDate] = useState(getUKDate());

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
    async function fetchData(date: string) {
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

      const winSnap = await getDocs(query(
        collection(db, 'maintenanceWindows'),
        where('startDate', '<=', date),
        where('endDate',   '>=', date),
      ));
      const windows: { facility: string; startDate: string; endDate: string }[] = [];
      winSnap.forEach(docSnap => windows.push(docSnap.data() as any));
      setMaintenanceWindows(windows);

    }
    fetchData(selectedDate);
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
  async function checkPeakTimePattern(
    userEmail: string,
    time: string
  ): Promise<boolean> {
    const peakTimes = [
      '17:00', '17:30', '18:00', '18:30',
      '19:00', '19:30', '20:00', '20:30'
    ];
  
    // Only care about peak slots
    if (!peakTimes.includes(time)) return false;
  
    const current = DateTime.fromISO(selectedDate, { zone: 'Europe/London' });
  
    let consecutivePeakDays = 0;
  
    for (let i = 1; i <= 2; i++) {
      const prevDate = current.minus({ days: i }).toISODate();
  
      const q = query(
        collection(db, 'bookings'),
        where('date', '==', prevDate),
        where('user', '==', userEmail),
        where('time', 'in', peakTimes)       // ← match *any* peak slot
      );
  
      const snap = await getDocs(q);
      if (!snap.empty) {
        consecutivePeakDays++;
      } else {
        break;  // stop as soon as a non‑peak day is found
      }
    }
  
    // If they had peak bookings on both previous days,
    // this (peak) booking would be the 3rd in a row
    return consecutivePeakDays >= 2;
  }
  async function onBook(facility: string, time: string) {
    if (!user) {
      router.push('/login');
      return;
    }
    // 1) Block booking the same slot 3 days in a row
    const hasConsecutive = await checkConsecutiveBookings(facility, time);
    if (hasConsecutive) {
      alert('You have already booked this slot for 3 consecutive days. You cannot book it again.');
      return;
    }

    // 2) Warn on 3rd consecutive day of ANY peak slot
const isPeakOveruse = await checkPeakTimePattern(user.email, time);
if (isPeakOveruse) {
  const ok = window.confirm(
    "⚠️ Peak Time Booking Notice\n\n" +
    "Our system has detected that you\u2019ve already booked peak time slots (between 5pm and 9pm) on the past couple of days. " +
    "These facilities are shared, and evening hours are a popular time for many residents.\n\n" +
    "Please be respectful and considerate of others who may also wish to use this space. Only continue if you are confident you will attend and use this booking.\n\n" +
    "Regularly reserving peak time slots without using them may lead to future restrictions.\n\n" +
    "Press OK to confirm, or Cancel to choose a different time."
  );
  
  if (!ok) {
    return;  // user cancelled — abort booking
  }
}
  
    const isBooked = bookings[facility][selectedDate]?.[time] === user.email;
    const bookingRef = doc(db, `bookings/${facility}_${selectedDate}_${time}`);
  
    if (isBooked) {
      // --- Cancel existing booking ---
      await deleteDoc(bookingRef);
      setBookings(prev => {
        const updated = { ...prev };
        delete updated[facility][selectedDate][time];
        return updated;
      });
      setBookingConfirm({ message: 'Booking Cancelled!', type: 'cancel' });
      setTimeout(() => setBookingConfirm(null), 2000);
    } else {
      // --- New booking: enforce per-facility & daily limits ---
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
        setBookings(prev => ({
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
  
  async function createWindow() {
    if (!user?.isAdmin) return;
  
    const id = `${newFacility}_${newStartDate}_${newEndDate}`;
    await setDoc(doc(db, 'maintenanceWindows', id), {
      facility: newFacility,
      startDate: newStartDate,
      endDate: newEndDate,
      timestamp: new Date(),
    });
  
    setMaintenanceWindows((prev) => [
      ...prev,
      { facility: newFacility, startDate: newStartDate, endDate: newEndDate }
    ]);
  
    alert(`✅ ${newFacility} blocked from ${newStartDate} to ${newEndDate}`);
  }
  
  async function deleteWindow(id: string) {
    if (!user?.isAdmin) return;
  
    await deleteDoc(doc(db, 'maintenanceWindows', id));
  
    setMaintenanceWindows((prev) =>
      prev.filter((win) => `${win.facility}_${win.startDate}_${win.endDate}` !== id)
    );
  
    alert(`🧹 Unblocked ${id}`);
  }
  
  function renderSchedule(facility: string) {
    // Use const for the array that we build up.
    const closedWindow = maintenanceWindows.find(
      (w) =>
        w.facility === facility &&
        w.startDate <= selectedDate &&
        w.endDate   >= selectedDate
    );
    if (closedWindow) {
      return (
        <motion.div
          layout
          key={facility}
          className="rounded-xl shadow-md p-6 border bg-white dark:bg-gray-900"
        >
          <h2 className="text-xl font-semibold mb-4 text-center text-black dark:text-white">
            {facility}
          </h2>
          <div className="px-4 py-6 text-center italic bg-gray-100 dark:bg-gray-800 rounded-xl">
            🚧 Closed from {closedWindow.startDate} to {closedWindow.endDate}
          </div>
        </motion.div>
      );
    }
    const scheduleSlots: Slot[] = [];

    if (isSpecialTuesday) {
      // For special Tuesday deep cleaning (applied to all facilities):
      // 05:30–09:30: Available
      // 09:30–12:30: Closed for Cleaning
      // 12:30–17:00: Free to Use without Booking
      // 17:00–23:00: Available
      for (let i = 0; i < timeSlots.length - 1; ) {
        if (timeSlots[i] === '09:30') {
          // Insert two custom chunks:
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
          if (idx17 >= 0) {
            // Jump to index for '17:00'
            // We use a new counter value.
            i = idx17;
          } else {
            i = timeSlots.length;
          }
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
      
{user?.isAdmin && (
  <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900 rounded-xl">
    <h3 className="font-semibold mb-2 text-black dark:text-white">
      🛠 Block Facility for Date Range
    </h3>

    {/* Block form */}
    <div className="flex flex-wrap gap-2 items-center mb-4">
      <select
        value={newFacility}
        onChange={(e) => setNewFacility(e.target.value)}
        className="px-3 py-1 border rounded"
      >
        {['Pool', 'Gym', 'Sauna'].map((f) => (
          <option key={f} value={f}>{f}</option>
        ))}
      </select>
      <input
        type="date"
        value={newStartDate}
        onChange={(e) => setNewStartDate(e.target.value)}
        className="px-3 py-1 border rounded"
      />
      <input
        type="date"
        value={newEndDate}
        onChange={(e) => setNewEndDate(e.target.value)}
        className="px-3 py-1 border rounded"
      />
      <button
        onClick={createWindow}
        className="px-4 py-1 bg-yellow-600 text-white font-semibold rounded hover:bg-yellow-700"
      >
        Block
      </button>
    </div>

    {/* Unblock list */}
    {maintenanceWindows.length > 0 ? (
      <>
        <h4 className="font-semibold mb-2 text-black dark:text-white">
          🔓 Active Maintenance Windows
        </h4>
        <ul className="space-y-2">
          {maintenanceWindows.map((win) => {
            const id = `${win.facility}_${win.startDate}_${win.endDate}`;
            return (
              <li
                key={id}
                className="flex items-center justify-between text-sm bg-white dark:bg-gray-700 p-2 rounded shadow"
              >
                <span className="text-black dark:text-white">
                  {win.facility}: {win.startDate} → {win.endDate}
                </span>
                <button
                  onClick={() => deleteWindow(id)}
                  className="text-xs px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Unblock
                </button>
              </li>
            );
          })}
        </ul>
      </>
    ) : (
      <p className="text-sm italic text-gray-700 dark:text-gray-300">
        No current maintenance windows.
      </p>
    )}
  </div>
)}


{renderDateSelector(selectedDate, setSelectedDate, user)}

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
</main>
  );
}
