'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { DateTime } from 'luxon';
import Link from 'next/link';
import { motion } from 'framer-motion';

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

  const sortedBookings = bookings.slice().sort((a, b) => {
    if (sortBy === 'facility') {
      return a.facility.localeCompare(b.facility) || a.date.localeCompare(b.date) || a.time.localeCompare(b.time);
    } else {
      return a.date.localeCompare(b.date) || a.time.localeCompare(b.time);
    }
  });

  if (loading) {
    return <div className="py-12 text-center">Loading...</div>;
  }

  return (
    <main className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-4">🗓️ My Upcoming Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center">
          <p>You don't have any upcoming bookings.</p>
          <Link href="/book" className="underline text-blue-600">Make a booking now</Link>
        </div>
      ) : (
        <>
          <div className="mb-6 flex justify-center gap-4">
            <button
              className={`px-4 py-1 rounded ${sortBy === 'date' ? 'bg-black text-white' : 'bg-gray-200'}`}
              onClick={() => setSortBy('date')}
            >
              Sort by Date
            </button>
            <button
              className={`px-4 py-1 rounded ${sortBy === 'facility' ? 'bg-black text-white' : 'bg-gray-200'}`}
              onClick={() => setSortBy('facility')}
            >
              Sort by Facility
            </button>
          </div>

          <ul className="space-y-4">
            {sortedBookings.map(booking => (
              <motion.li
                key={booking.id}
                layout
                className="border rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:justify-between items-center"
              >
                <div className="flex items-center mb-2 md:mb-0">
                  <img
                    src={facilityIcons[booking.facility]}
                    alt={`${booking.facility} icon`}
                    className="w-10 h-10 mr-3"
                  />
                  <div>
                    <p className="font-semibold">📍 {booking.facility}</p>
                    <p>📅 {DateTime.fromISO(booking.date).toLocaleString(DateTime.DATE_MED)}</p>
                    <p>🕒 {booking.time}</p>
                  </div>
                </div>
                <button
                  className="mt-2 md:mt-0 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                  onClick={() => cancelBooking(booking.id)}
                >
                  Cancel Booking
                </button>
              </motion.li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}