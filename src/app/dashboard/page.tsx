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
import Image from 'next/image';
import Button from '@/components/ui/Button';
import GlassCard from '@/components/ui/GlassCard';
import SegmentedControl from '@/components/ui/SegmentedControl';

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
  const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [property, setProperty] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
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
      if (!user?.email) return;
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
        console.error('Error fetching bookings:', error);
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
    }
    return a.date.localeCompare(b.date) || a.time.localeCompare(b.time);
  });

  if (loading) {
    return <div className="py-12 text-center text-[color:var(--text-secondary)]">Loading...</div>;
  }

  const bookingView = showUpcoming ? 'upcoming' : 'past';

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-90">
        <div className="absolute inset-0 bg-[radial-gradient(1100px_780px_at_12%_-10%,rgba(99,138,255,0.08),transparent),radial-gradient(1100px_760px_at_110%_0%,rgba(125,211,252,0.07),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(1200px_800px_at_50%_110%,rgba(255,255,255,0.4),transparent)] dark:bg-[radial-gradient(1000px_780px_at_20%_120%,rgba(76,106,255,0.08),transparent)]" />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-[color:var(--text-primary)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2 text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--muted)]">Welcome back</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight drop-shadow-sm">🧑‍💻 My Dashboard</h1>
            <p className="text-[color:var(--text-secondary)] leading-relaxed">
              Keep on top of your bookings and account details with the new Liquid Glass look.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="primary" href="/book/schedule">
              Make New Booking
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SegmentedControl
            ariaLabel="Show upcoming or past bookings"
            options={[
              { label: 'Upcoming', value: 'upcoming' },
              { label: 'Past', value: 'past' },
            ]}
            value={bookingView}
            onChange={(value) => setShowUpcoming(value === 'upcoming')}
          />
          <div className="flex flex-wrap gap-3">
            <SegmentedControl
              ariaLabel="Sort bookings"
              options={[
                { label: 'Date', value: 'date' },
                { label: 'Facility', value: 'facility' },
              ]}
              value={sortBy}
              onChange={(value) => setSortBy(value as 'date' | 'facility')}
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <GlassCard
            title={`🗓️ ${showUpcoming ? 'Upcoming Bookings' : 'Past Bookings'}`}
            subtitle="Premium glass surfaces keep every booking easy to scan."
          >
            {sortedBookings.length === 0 ? (
              <p className="text-center text-[color:var(--text-secondary)]">
                No {showUpcoming ? 'upcoming' : 'past'} bookings.
              </p>
            ) : (
              <ul className="space-y-4">
                {sortedBookings.map((booking) => (
                  <li
                    key={booking.id}
                    className="glass-outline glass-surface rounded-2xl border border-transparent px-4 py-4 sm:px-5 shadow-[0_12px_28px_rgba(15,23,42,0.12)] dark:shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start gap-4">
                        <Image
                          src={facilityIcons[booking.facility]}
                          alt={`${booking.facility} icon`}
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-xl bg-white/60 p-2 dark:bg-white/10"
                        />
                        <div className="space-y-1 leading-relaxed">
                          <p className="text-lg font-semibold">📍 {booking.facility}</p>
                          <p className="text-sm text-[color:var(--text-secondary)]">
                            📅 {DateTime.fromISO(booking.date).toLocaleString(DateTime.DATE_MED)}
                          </p>
                          <p className="text-sm text-[color:var(--text-secondary)]">🕒 {booking.time}</p>
                        </div>
                      </div>
                      {showUpcoming && (
                        <div className="flex flex-wrap gap-3">
                          <Button variant="secondary" onClick={() => addToCalendar(booking)}>
                            Add to Calendar
                          </Button>
                          <Button
                            variant="ghost"
                            className="text-red-600 dark:text-red-300"
                            onClick={() => cancelBooking(booking.id)}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </GlassCard>

          <GlassCard title="👤 My Profile" subtitle="Update your info to keep your bookings in sync.">
            <div className="space-y-4 text-[color:var(--text-primary)]">
              {editing ? (
                <>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-[color:var(--text-secondary)]">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-[color:var(--glass-border)] bg-white/70 px-4 py-2.5 text-[color:var(--text-primary)] shadow-inner focus:outline-none focus:ring-2 focus:ring-[color:var(--btn-ring)] dark:bg-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-[color:var(--text-secondary)]">Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full rounded-xl border border-[color:var(--glass-border)] bg-white/70 px-4 py-2.5 text-[color:var(--text-primary)] shadow-inner focus:outline-none focus:ring-2 focus:ring-[color:var(--btn-ring)] dark:bg-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-[color:var(--text-secondary)]">Property</label>
                    <select
                      value={property}
                      onChange={(e) => setProperty(e.target.value)}
                      className="w-full rounded-xl border border-[color:var(--glass-border)] bg-white/70 px-4 py-2.5 text-[color:var(--text-primary)] shadow-inner focus:outline-none focus:ring-2 focus:ring-[color:var(--btn-ring)] dark:bg-white/10"
                    >
                      <option value="">Select Property</option>
                      {propertyOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={updateProfile}>Save</Button>
                    <Button variant="secondary" onClick={() => setEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1 leading-relaxed text-[color:var(--text-secondary)]">
                    <p>
                      <strong className="text-[color:var(--text-primary)]">Email:</strong> {email}
                    </p>
                    <p>
                      <strong className="text-[color:var(--text-primary)]">Username:</strong> {username}
                    </p>
                    <p>
                      <strong className="text-[color:var(--text-primary)]">Property:</strong> {property}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={() => setEditing(true)} variant="secondary">
                      Edit Profile
                    </Button>
                    <Button variant="ghost" onClick={() => setShowModal(true)}>
                      Reset Password
                    </Button>
                  </div>
                </>
              )}
              {feedback && <p className="text-sm text-emerald-600 dark:text-emerald-300">{feedback}</p>}
            </div>
          </GlassCard>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 sm:px-0">
          <div className="glass-surface glass-outline w-full max-w-md p-6">
            <h3 className="text-lg font-semibold">Confirm Password Reset</h3>
            <p className="mt-2 text-[color:var(--text-secondary)] leading-relaxed">
              Are you sure you want to receive a password reset link at <strong>{user?.email}</strong>?
            </p>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button onClick={sendPasswordReset}>Send Email</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
