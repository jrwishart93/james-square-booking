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

/* ---------- UI helpers (purely visual) ---------- */

function Legend() {
  return (
    <div className="jqs-glass px-3 py-2 flex flex-wrap items-center justify-center gap-4 mt-6">
      <span className="jqs-chip"><span className="jqs-dot jqs-dot--yours" /> Your booking</span>
      <span className="jqs-chip"><span className="jqs-dot jqs-dot--booked" /> Booked</span>
      <span className="jqs-chip"><span className="jqs-dot jqs-dot--free" /> Free use</span>
      <span className="jqs-chip"><span className="jqs-dot jqs-dot--closed" /> Cleaning / Closed</span>
      <span className="jqs-chip"><span className="jqs-dot jqs-dot--avail" /> Available</span>
    </div>
  );
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
    <div className="flex overflow-x-auto gap-2 mb-6 px-2">
      {dates.map(({ iso, display }) => {
        const isActive = iso === selectedDate;
        const isToday = iso === getUKDate();

        // Tailwind-only visual boost in LIGHT mode when active:
        // - strong contrast bg + white text + ring + shadow
        // Dark mode keeps the glass look but with a subtle ring.
        const activeLight =
          'bg-black text-white ring-2 ring-black/70 shadow-[0_8px_24px_rgba(0,0,0,0.25)]';
        const activeDark =
          'dark:bg-white/10 dark:text-white dark:ring-2 dark:ring-blue-300/60';

        return (
          <button
            key={iso}
            onClick={() => setSelectedDate(iso)}
            className={[
              'jqs-date-pill whitespace-nowrap transition active:scale-[0.98]',
              isActive
                ? `jqs-date-pill--active ${activeLight} ${activeDark}`
                : 'hover:ring-1 hover:ring-black/15 dark:hover:ring-white/20',
              // give “today” a subtle outline when not active
              !isActive && isToday ? 'border border-black/20 dark:border-white/20' : ''
            ].join(' ')}
            aria-current={isActive ? 'date' : undefined}
            aria-selected={isActive || undefined}
            aria-label={`${display}${isToday ? ' (Today)' : ''}`}
            title={isToday ? 'Today' : undefined}
          >
            <span className={`text-sm ${isToday && !isActive ? 'font-semibold' : 'font-medium'}`}>
              {display}
            </span>

            {/* tiny accent dot for quick recognition when active */}
            {isActive && (
              <span
                className="ml-2 inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_2px_rgba(255,255,255,0.65)] dark:shadow-[0_0_0_2px_rgba(0,0,0,0.55)]"
                aria-hidden="true"
              />
            )}
          </button>
        );
      })}
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
        where('endDate', '>=', date),
      ));
  
      const windows: { facility: string; startDate: string; endDate: string }[] = [];
      winSnap.forEach((docSnap) => {
        const data = docSnap.data() as { facility: string; startDate: string; endDate: string };
        windows.push(data);
      });
  
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
        break;  // stop as soon as a non-peak day is found
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
      if (!ok) return;
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
    // maintenance window check
    const closedWindow = maintenanceWindows.find(
      (w) =>
        w.facility === facility &&
        w.startDate <= selectedDate &&
        w.endDate >= selectedDate
    );
    if (closedWindow) {
      return (
        <motion.div layout key={facility} className="jqs-glass p-6 transition-all">
          <h2 className="text-xl font-semibold mb-4 text-center">
            {facility}
          </h2>
          <div className="px-4 py-6 text-center italic rounded-xl slot slot-closed">
            🚧 Closed from {closedWindow.startDate} to {closedWindow.endDate}
          </div>
        </motion.div>
      );
    }

    // build scheduleSlots
    const scheduleSlots: Slot[] = [];

    if (isSpecialTuesday) {
      for (let i = 0; i < timeSlots.length - 1; ) {
        if (timeSlots[i] === "09:30") {
          scheduleSlots.push({
            start: "09:30",
            end: "12:30",
            status: "Closed for Cleaning",
            groupKeys: ["09:30", "10:00", "10:30", "11:00"],
          });
          scheduleSlots.push({
            start: "12:30",
            end: "17:00",
            status: "Free to Use without Booking",
          });
          const idx17 = timeSlots.indexOf("17:00");
          i = idx17 >= 0 ? idx17 : timeSlots.length;
        } else {
          const start = timeSlots[i];
          const end = timeSlots[i + 1];
          const [h, m] = start.split(":").map(Number);
          const minutes = h * 60 + m;
          let status = "Unavailable";
          if (
            (minutes >= 330 && minutes < 570) ||
            (minutes >= 1020 && minutes < 1380)
          ) {
            status = "Available";
          }
          scheduleSlots.push({ start, end, status });
          i++;
        }
      }
    } else {
      for (let i = 0; i < timeSlots.length - 1; ) {
        const start = timeSlots[i];
        if (start === "09:30") {
          const newEnd = timeSlots[i + 3] ?? timeSlots[i + 1];
          scheduleSlots.push({
            start,
            end: newEnd,
            status: "Closed for Cleaning",
            groupKeys: ["09:30", "10:00", "10:30", "11:00"],
          });
          i += 3;
        } else {
          const end = timeSlots[i + 1];
          let status = "Unavailable";
          if (start === "11:00") {
            status = "Free to Use without Booking";
          } else {
            const [h, m] = start.split(":").map(Number);
            const minutes = h * 60 + m;
            if (
              (minutes >= 330 && minutes < 570) ||
              (minutes >= 1020 && minutes < 1380)
            ) {
              status = "Available";
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
      <motion.div layout key={facility} className="jqs-glass p-4 transition-all">
        <h2 className="text-xl font-semibold mb-3 text-center">{facility}</h2>

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
                  showLabel = "Your booking";
                } else if (bookedBy) {
                  showLabel = user?.isAdmin
                    ? `Booked by: ${bookedBy}`
                    : "Booked by another user";
                }

                let slotClass = "slot";
                if (isOwn) slotClass = "slot slot-yours";
                else if (bookedBy) slotClass = "slot slot-booked italic";
                else if (slot.status === "Available") slotClass = "slot slot-available";
                else if (slot.status === "Closed for Cleaning") slotClass = "slot slot-closed";
                else if (slot.status === "Free to Use without Booking") slotClass = "slot slot-maint";
                else slotClass = "slot slot-closed";

                const actionable =
                  slot.status === "Available" && (!bookedBy || isOwn);

                return (
                  <motion.li
                    key={slot.start}
                    className="flex justify-between items-center"
                    layout
                  >
                    <div
                      className={`${slotClass} w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl`}
                    >
                      <span className="text-sm font-medium">
                        {slot.start} – {slot.end}
                      </span>

                      {actionable ? (
                        user ? (
                          <button
                            aria-label={`${
                              isOwn ? "Cancel" : "Book"
                            } ${facility} at ${slot.start}`}
                            onClick={() => onBook(facility, slot.start)}
                            className="text-xs rounded-full px-3 py-1 bg-black/80 text-white hover:bg-black transition"
                          >
                            {isOwn ? "Cancel" : "Book"}
                          </button>
                        ) : (
                          <Link href="/login" className="text-xs underline">
                            Sign in to book
                          </Link>
                        )
                      ) : (
                        <span className="text-xs italic">{showLabel}</span>
                      )}
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}

        <div className="mt-4">
          <button
            onClick={() => handleToggleExpand(facility)}
            className="w-full py-2 px-4 rounded-full jqs-glass font-semibold hover:brightness-[1.05] transition"
          >
            {isExpanded ? "Minimise Time Slots" : "Expand to See All Slots"}
          </button>
        </div>
      </motion.div>
    );
  } // end of renderSchedule

  // back in SchedulePageClientInner component scope
  if (loading) {
    return <main className="text-center py-12">Loading...</main>;
  }

  return (
    <main className="jqs-gradient-bg min-h-screen">
      <div className="max-w-6xl mx-auto py-12 px-4">
        <AnimatePresence>
          {bookingConfirm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed top-4 left-1/2 -translate-x-1/2 px-4 py-2 jqs-glass rounded z-50"
            >
              {bookingConfirm.message}
            </motion.div>
          )}
        </AnimatePresence>

        <h1 className="text-4xl font-bold mb-2 text-center">Facility Booking</h1>
        <p className="text-center mb-6 text-[color:var(--text-muted)]">
          This page is visible to all users — but you&apos;ll need to sign in to book a slot.
        </p>

        {!user && (
          <div className="text-center mb-6 text-sm text-red-600 dark:text-red-400">
            You&apos;re currently viewing as a guest.{" "}
            <Link href="/login" className="underline">
              Sign in
            </Link>{" "}
            to make bookings.
          </div>
        )}

        {user?.isAdmin && (
          <div className="mb-6 p-4 jqs-glass rounded-2xl">
            <h3 className="font-semibold mb-2">
              🛠 Block Facility for Date Range
            </h3>

            <div className="flex flex-wrap gap-2 items-center mb-4">
              <select
                value={newFacility}
                onChange={(e) => setNewFacility(e.target.value)}
                className="px-3 py-1 border rounded bg-transparent"
              >
                {["Pool", "Gym", "Sauna"].map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={newStartDate}
                onChange={(e) => setNewStartDate(e.target.value)}
                className="px-3 py-1 border rounded bg-transparent"
              />
              <input
                type="date"
                value={newEndDate}
                onChange={(e) => setNewEndDate(e.target.value)}
                className="px-3 py-1 border rounded bg-transparent"
              />
              <button
                onClick={createWindow}
                className="px-4 py-1 rounded-full jqs-glass font-semibold hover:brightness-[1.05] transition"
              >
                Block
              </button>
            </div>

            {maintenanceWindows.length > 0 ? (
              <>
                <h4 className="font-semibold mb-2">
                  🔓 Active Maintenance Windows
                </h4>
                <ul className="space-y-2">
                  {maintenanceWindows.map((win) => {
                    const id = `${win.facility}_${win.startDate}_${win.endDate}`;
                    return (
                      <li
                        key={id}
                        className="flex items-center justify-between text-sm jqs-glass p-2 rounded"
                      >
                        <span>
                          {win.facility}: {win.startDate} → {win.endDate}
                        </span>
                        <button
                          onClick={() => deleteWindow(id)}
                          className="text-xs px-3 py-1 rounded-full bg-black/80 text-white hover:bg-black transition"
                        >
                          Unblock
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : (
              <p className="text-sm italic text-[color:var(--text-muted)]">
                No current maintenance windows.
              </p>
            )}
          </div>
        )}

        {renderDateSelector(selectedDate, setSelectedDate, user)}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["Pool", "Gym", "Sauna"].map((f) => (
            <React.Fragment key={f}>{renderSchedule(f)}</React.Fragment>
          ))}
        </div>

        <Legend />

        <div className="flex justify-center mt-6">
          <Link
            href="/book/my-bookings"
            className="px-4 py-2 rounded-full jqs-glass font-semibold hover:brightness-[1.05] transition"
          >
            My Bookings
          </Link>
        </div>
      </div>
    </main>
  );
} // end of export default function SchedulePageClientInner