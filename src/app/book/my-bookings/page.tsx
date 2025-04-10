'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { DateTime } from 'luxon';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Booking {
  id: string;
  facility: string;
  date: string;
  time: string;
}

const facilityIcons: Record<string, string> = {
  Pool: '/images/icons/pool-icon.png',
  Gym: '/images/icons/gym-icon.png',
  Sauna: '/images/icons/sauna-icon.png',
};

export default function MyBookingsPage() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<'date' | 'facility'>('date');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({ email: firebaseUser.email! });
      } else {
        router.push('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      const todayISO = DateTime.now().setZone('Europe/London').toISODate();
      const q = query(
        collection(db, 'bookings'),
        where('user', '==', user.email),
        where('date', '>=', todayISO),
        orderBy('date', 'asc'),
        orderBy('time', 'asc')
      );
      const snap = await getDocs(q);
      const bookingsList: Booking[] = snap.docs.map(docSnap => ({
        id: docSnap.id,
        facility: docSnap.data().facility,
        date: docSnap.data().date,
        time: docSnap.data().time,
      }));
      setBookings(bookingsList);
    };
    fetchBookings();
  }, [user]);

  const cancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    await deleteDoc(doc(db, 'bookings', bookingId));
    setBookings(prev => prev.filter(b => b.id !== bookingId));
  };

  const addToCalendar = (booking: Booking) => {
    const start = DateTime.fromISO(`${booking.date}T${booking.time}`, { zone: 'Europe/London' });
    const end = start.plus({ minutes: 60 });

    const calendarContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `UID:${booking.id}@jamessquare.com`,
      `SUMMARY:${booking.facility} Booking`,
      `DTSTART:${start.toUTC().toFormat("yyyyLLdd'T'HHmmss'Z'")}`,
      `DTEND:${end.toUTC().toFormat("yyyyLLdd'T'HHmmss'Z'")}`,
      'DESCRIPTION:Your booking at James Square',
      'LOCATION:James Square Facilities',
      'SEQUENCE:0',
      'BEGIN:VALARM',
      'TRIGGER:-PT15M',
      'ACTION:DISPLAY',
      'DESCRIPTION:Booking Reminder',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\n');

    const blob = new Blob([calendarContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${booking.facility}-booking-${booking.date}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const sortedBookings = bookings.slice().sort((a, b) => {
    if (sortBy === 'facility') {
      return a.facility.localeCompare(b.facility) || a.date.localeCompare(b.date) || a.time.localeCompare(b.time);
    } else {
      return a.date.localeCompare(b.date) || a.time.localeCompare(b.time);
    }
  });

  if (loading) {
    return <div className="py-12 text-center text-gray-600 dark:text-gray-300">Loading...</div>;
  }

  return (
    <main className="max-w-4xl mx-auto py-12 px-4 text-gray-800 dark:text-gray-100">
      <div className="text-center mb-6">
        <Link href="/book/schedule">
          <button className="px-6 py-3 bg-green-700 text-white rounded-xl hover:bg-green-800 transition duration-300 shadow-md">
            Make New Booking
          </button>
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-center mb-6">🗓️ My Upcoming Bookings</h1>
      {bookings.length === 0 ? (
        <div className="text-center">
          <p>You don&apos;t have any upcoming bookings.</p>
          <Link href="/book" className="underline text-blue-600 dark:text-blue-400">Make a booking now</Link>
        </div>
      ) : (
        <>
          <div className="mb-6 flex justify-center gap-4">
            <button
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${sortBy === 'date' ? 'bg-blue-800 text-white' : 'bg-gray-100 dark:bg-gray-700 dark:text-white'}`}
              onClick={() => setSortBy('date')}
            >
              Sort by Date
            </button>
            <button
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${sortBy === 'facility' ? 'bg-blue-800 text-white' : 'bg-gray-100 dark:bg-gray-700 dark:text-white'}`}
              onClick={() => setSortBy('facility')}
            >
              Sort by Facility
            </button>
          </div>

          <ul className="space-y-6">
            {sortedBookings.map(booking => (
              <motion.li
                key={booking.id}
                layout
                className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:justify-between items-center"
              >
                <div className="flex items-center mb-4 md:mb-0">
                  <Image
                    src={facilityIcons[booking.facility]}
                    alt={`${booking.facility} icon`}
                    width={48}
                    height={48}
                    className="w-12 h-12 mr-4"
                  />
                  <div>
                    <p className="font-semibold text-lg">📍 {booking.facility}</p>
                    <p className="text-sm">📅 {DateTime.fromISO(booking.date).toLocaleString(DateTime.DATE_MED)}</p>
                    <p className="text-sm">🕒 {booking.time}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm transition shadow-md"
                    onClick={() => addToCalendar(booking)}
                  >
                    Add to Calendar
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition shadow-md"
                    onClick={() => cancelBooking(booking.id)}
                  >
                    Cancel
                  </button>
                </div>
              </motion.li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
