'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateEmail,
  updateProfile as firebaseUpdateProfile,
  User,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { DateTime } from 'luxon';
import Link from 'next/link';
import Image from 'next/image';

interface Booking {
  id: string;
  facility: string;
  date: string;
  time: string;
}

// Map facility names to icon paths
const facilityIcons: Record<string, string> = {
  Pool: '/images/icons/pool-icon.png',
  Gym: '/images/icons/gym-icon.png',
  Sauna: '/images/icons/sauna-icon.png',
};

// Full list of properties
const propertyOptions = [
  '39/1', '39/2', '39/3', '39/4', '39/5', '39/6', '39/7', '39/8', '39/9', '39/10',
  '39/11', '39/12', '39/13', '39/14', '39/15', '39B',
  '45/1', '45/2', '45/3', '45/4', '45/5', '45/6', '45/7', '45/8', '45/9', '45/10',
  '45/11', '45/12', '45/13', '45/14', '45/15', '45/16', '45/17', '45/18', '45/19',
  '51/1', '51/2', '51/3', '51/4', '51/5', '51/6', '51/7', '51/8', '51/9', '51/10',
  '51/11', '51/12', '51/13', '51/14', '51/15', '51/16', '51/17', '51/18', '51/19',
  '51/20', '51/21', '51/22', '51/23', '51/24', '51/25', '51/26', '51/27', '51/28', '51/29', '51/30', '51/31',
  '55/1', '55/2', '55/3', '55/4', '55/5', '55/6', '55/7', '55/8', '55/9', '55/10',
  '55/11', '55/12', '55/13', '55/14', '55/15',
  '57/1', '57/2', '57/3', '57/4', '57/5', '57/6',
  '59/1', '59/2', '59/3', '59/4', '59/5', '59/6',
  '61/1', '61/2', '61/3', '61/4', '61/5', '61/6', '61/7', '61/8',
  '65/1', '65/2'
];
export default function MyDashboardPage() {
  // The user state is now explicitly typed as Firebase User or null.
  const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [property, setProperty] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  // Reintroduced sortBy as a state variable to allow toggling between sorting by 'date' or 'facility'.
  const [sortBy, setSortBy] = useState<'date' | 'facility'>('date');
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setEmail(firebaseUser.email ?? '');
        const docRef = doc(db, 'users', firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUsername((data as { username?: string }).username || '');
          setProperty((data as { property?: string }).property || '');
        }
      } else {
        router.push('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.email) return; // Added email existence check
      try {
        const q = query(collection(db, 'bookings'), where('user', '==', user.email));
        const snap = await getDocs(q);
        const bookingsList: Booking[] = snap.docs.map((docSnap) => ({
          id: docSnap.id,
          facility: docSnap.data().facility,
          date: docSnap.data().date,
          time: docSnap.data().time,
        }));
        setBookings(bookingsList);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    fetchBookings();
  }, [user]);
  

  const cancelBooking = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    await deleteDoc(doc(db, 'bookings', bookingId));
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
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

  const updateProfile = async () => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        username: username.trim().toLowerCase(),
        property,
      });

      if (email !== user.email) {
        await updateEmail(user, email);
      }

      await firebaseUpdateProfile(user, { displayName: username });
      setFeedback('✅ Profile updated successfully.');
      setEditing(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
      } else {
        console.error('An unknown error occurred:', error);
      }
      setFeedback('❌ Failed to update profile.');
    }
  };

  const sendPasswordReset = async () => {
    if (!user?.email) return;
    try {
      await sendPasswordResetEmail(auth, user.email);
      setFeedback('✅ Password reset link sent to your email.');
    } catch {
      setFeedback('❌ Failed to send reset email.');
    }
    setShowModal(false);
  };

  const today = DateTime.now().toISODate();
  const filteredBookings = bookings.filter((b) => (showUpcoming ? b.date >= today : b.date < today));
  const sortedBookings = filteredBookings.sort((a, b) => {
    if (sortBy === 'facility') {
      return a.facility.localeCompare(b.facility) || a.date.localeCompare(b.date) || a.time.localeCompare(b.time);
    } else {
      return a.date.localeCompare(b.date) || a.time.localeCompare(b.time);
    }
  });

  if (loading)
    return <div className="py-12 text-center text-gray-600 dark:text-gray-300">Loading...</div>;

  return (
    <main className="max-w-4xl mx-auto py-12 px-4 text-gray-800 dark:text-gray-100">
      <div className="text-center mb-6">
        <Link href="/book/schedule">
          <button className="px-6 py-3 bg-green-700 text-white rounded-xl hover:bg-green-800 transition duration-300 shadow-md">
            Make New Booking
          </button>
        </Link>
      </div>

      <div className="mb-6 p-4 rounded-lg bg-gray-100 dark:bg-neutral-800">
  <h1
    className="
      text-4xl md:text-5xl font-extrabold text-center
      text-gray-900 dark:text-white
      dark:drop-shadow-lg
    "
  >
    🧑‍💻 My Dashboard
  </h1>
</div>
      {/* Sort controls */}
      <div className="flex justify-center items-center mb-4">
        <span className="mr-2 font-medium">Sort by:</span>
        <button
          onClick={() => setSortBy('date')}
          className={`px-4 py-1 border rounded ${sortBy === 'date' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          Date
        </button>
        <button
          onClick={() => setSortBy('facility')}
          className={`ml-2 px-4 py-1 border rounded ${sortBy === 'facility' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          Facility
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Bookings Section */}
        <div className="bg-white dark:bg-neutral-900 shadow-md rounded-2xl p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold mb-4">
              🗓️ {showUpcoming ? 'Upcoming Bookings' : 'Past Bookings'}
            </h2>
            <div className="inline-flex gap-2 justify-center">
              <button
                onClick={() => setShowUpcoming(true)}
                className={`text-sm px-4 py-1.5 rounded-lg font-medium transition shadow-sm 
                  ${showUpcoming ? 'bg-slate-600 text-white' : 'bg-slate-100 text-gray-800 dark:bg-slate-700 dark:text-white'} 
                  hover:bg-slate-500 dark:hover:bg-slate-600`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setShowUpcoming(false)}
                className={`text-sm px-4 py-1.5 rounded-lg font-medium transition shadow-sm 
                  ${!showUpcoming ? 'bg-slate-600 text-white' : 'bg-slate-100 text-gray-800 dark:bg-slate-700 dark:text-white'} 
                  hover:bg-slate-500 dark:hover:bg-slate-600`}
              >
                Past
              </button>
            </div>
          </div>

          {sortedBookings.length === 0 ? (
            <p className="text-center">No {showUpcoming ? 'upcoming' : 'past'} bookings.</p>
          ) : (
            <ul className="space-y-6">
              {sortedBookings.map((booking) => (
                <li
                  key={booking.id}
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
                      <p className="text-sm">
                        📅 {DateTime.fromISO(booking.date).toLocaleString(DateTime.DATE_MED)}
                      </p>
                      <p className="text-sm">🕒 {booking.time}</p>
                    </div>
                  </div>
                  {showUpcoming && (
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
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Profile Section */}
        <div className="bg-white dark:bg-neutral-900 shadow-md rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4">👤 My Profile</h2>
          <div className="space-y-4">
            {editing ? (
              <>
                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mt-1 px-4 py-2 border rounded-xl bg-gray-50 dark:bg-neutral-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full mt-1 px-4 py-2 border rounded-xl bg-gray-50 dark:bg-neutral-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Property</label>
                  <select
                    value={property}
                    onChange={(e) => setProperty(e.target.value)}
                    className="w-full mt-1 px-4 py-2 border rounded-xl bg-gray-50 dark:bg-neutral-700"
                  >
                    <option value="">Select Property</option>
                    {propertyOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-4">
                  <button onClick={updateProfile} className="bg-blue-700 text-white px-4 py-2 rounded-xl">
                    Save
                  </button>
                  <button onClick={() => setEditing(false)} className="bg-gray-300 dark:bg-gray-600 px-4 py-2 rounded-xl">
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p>
                  <strong>Email:</strong> {email}
                </p>
                <p>
                  <strong>Username:</strong> {username}
                </p>
                <p>
                  <strong>Property:</strong> {property}
                </p>
                <div className="flex gap-4">
                  <button onClick={() => setEditing(true)} className="bg-blue-700 text-white px-4 py-2 rounded-xl">
                    Edit Profile
                  </button>
                  <button onClick={() => setShowModal(true)} className="text-sm text-blue-600 dark:text-blue-400 underline mt-2">
                    Reset Password
                  </button>
                </div>
              </>
            )}
            {feedback && <p className="text-sm text-green-600 dark:text-green-400">{feedback}</p>}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Confirm Password Reset</h3>
            <p className="mb-6">
              Are you sure you want to receive a password reset link at <strong>{user?.email}</strong>?
            </p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-xl">
                Cancel
              </button>
              <button onClick={sendPasswordReset} className="px-4 py-2 bg-blue-700 text-white rounded-xl">
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}