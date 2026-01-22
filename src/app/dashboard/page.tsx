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
import Link from 'next/link';
import { DateTime } from 'luxon';
import Image from 'next/image';
import DashboardTabs from '@/components/DashboardTabs';
import Button from '@/components/ui/Button';
import GlassCard from '@/components/ui/GlassCard';
import SegmentedControl from '@/components/ui/SegmentedControl';
import MobileAppPoster from '@/components/home/MobileAppPoster';
import { Calendar, CalendarDays, CalendarX2, Clock3, MapPin, User as UserIcon } from 'lucide-react';

interface Booking {
  id: string;
  facility: string;
  date: string;
  time: string;
}

// Map facility names to icon paths
const facilityIcons: Record<string, string> = {
  Pool: '/images/icons/simple-pool-icon.png',
  Gym: '/images/icons/simple-gym-icon.png',
  Sauna: '/images/icons/simple-sauna-icon.png',
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

const mapResidentTypeToRole = (residentType?: string) => {
  if (residentType === 'owner') return 'Owner';
  if (residentType === 'renter') return 'Renter';
  if (residentType === 'stl_guest' || residentType === 'stl') return 'Short-term holiday guest';
  return '';
};

const residentTypeLabelMap: Record<string, string> = {
  owner: 'Owner',
  renter: 'Renter',
  stl: 'Short Term Holiday Let',
  stl_guest: 'Short Term Holiday Let',
};

const normalizeResidentType = (value?: string) => {
  if (value === 'stl_guest') return 'stl';
  return value ?? '';
};

export default function MyDashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [property, setProperty] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showResidentTypeConfirm, setShowResidentTypeConfirm] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'facility'>('date');
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');
  const [savingRole, setSavingRole] = useState(false);
  const [roleError, setRoleError] = useState('');
  const [residentType, setResidentType] = useState('');
  const [residentTypeLabel, setResidentTypeLabel] = useState('');
  const [isEditingResidentType, setIsEditingResidentType] = useState(false);
  const [selectedResidentType, setSelectedResidentType] = useState(residentType || '');
  const [savingResidentType, setSavingResidentType] = useState(false);
  const [residentTypeFeedback, setResidentTypeFeedback] = useState('');
  const [residentTypeError, setResidentTypeError] = useState('');
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
          const existingRole = (data as { userRole?: string }).userRole || '';
          const derivedRole =
            existingRole.trim() ||
            ((data as { residentTypeLabel?: string }).residentTypeLabel?.trim() ?? '') ||
            mapResidentTypeToRole((data as { residentType?: string }).residentType);
          setUsername((data as { username?: string }).username || '');
          setProperty((data as { property?: string }).property || '');
          setUserRole(derivedRole);
          const fetchedResidentType = (data as { residentType?: string }).residentType || '';
          const fetchedResidentTypeLabel = (data as { residentTypeLabel?: string }).residentTypeLabel || '';
          setResidentType(fetchedResidentType);
          setResidentTypeLabel(fetchedResidentTypeLabel);
          setSelectedResidentType(normalizeResidentType(fetchedResidentType));

          if (!existingRole && derivedRole) {
            await updateDoc(docRef, { userRole: derivedRole });
          }
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
      setFeedback('Profile updated successfully.');
      setEditing(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
      } else {
        console.error('An unknown error occurred:', error);
      }
      setFeedback('Failed to update profile.');
    }
  };

  const handleRoleSelection = async (roleValue: string) => {
    if (!user) return;
    setSavingRole(true);
    setRoleError('');
    try {
      await updateDoc(doc(db, 'users', user.uid), { userRole: roleValue });
      setUserRole(roleValue);
      setFeedback('Role saved successfully.');
    } catch (error) {
      console.error('Failed to save user role:', error);
      setRoleError('Failed to save role. Please try again.');
    } finally {
      setSavingRole(false);
    }
  };

  const sendPasswordReset = async () => {
    if (!user?.email) return;
    try {
      await sendPasswordResetEmail(auth, user.email);
      setFeedback('Password reset link sent to your email.');
    } catch {
      setFeedback('Failed to send reset email.');
    }
    setShowModal(false);
  };

  const displayResidentTypeLabel =
    residentTypeLabel ||
    residentTypeLabelMap[residentType] ||
    mapResidentTypeToRole(residentType) ||
    '';

  const handleResidentTypeSave = async () => {
    if (!user || !selectedResidentType) return;
    setSavingResidentType(true);
    setResidentTypeError('');
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        residentType: selectedResidentType,
        residentTypeLabel: residentTypeLabelMap[selectedResidentType],
        requiresResidentTypeConfirmation: true,
      });
      setResidentType(selectedResidentType);
      setResidentTypeLabel(residentTypeLabelMap[selectedResidentType]);
      setIsEditingResidentType(false);
      setResidentTypeFeedback('Resident status saved.');
    } catch (error) {
      console.error('Failed to update resident status:', error);
      setResidentTypeError('Failed to update resident status. Please try again.');
    } finally {
      setSavingResidentType(false);
      setShowResidentTypeConfirm(false);
    }
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
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f6f8fb_0%,#e7edf6_100%)] text-[color:var(--text-primary)] dark:bg-[linear-gradient(180deg,#070d1a_0%,#0a1426_58%,#060b18_100%)]">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-95">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(255,255,255,0.75),transparent_38%),radial-gradient(circle_at_85%_12%,rgba(221,234,255,0.55),transparent_36%),radial-gradient(circle_at_50%_115%,rgba(184,206,238,0.28),transparent_48%)] dark:bg-[radial-gradient(circle_at_18%_12%,rgba(66,106,165,0.18),transparent_42%),radial-gradient(circle_at_82%_18%,rgba(37,99,235,0.12),transparent_40%),radial-gradient(circle_at_50%_118%,rgba(21,94,149,0.24),transparent_50%)]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-4">
        <DashboardTabs user={user} />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-6 leading-relaxed">
        <div className="flex flex-col gap-3 text-center sm:text-left">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--muted)]">My dashboard</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight drop-shadow-sm">My Dashboard</h1>
              <p className="text-[color:var(--text-secondary)] leading-relaxed">
                Keep on top of your bookings and account details.
              </p>
            </div>
            <div className="sm:mb-1">
              <Button variant="primary" href="/book/schedule" className="w-full sm:w-auto">
                Make New Booking
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SegmentedControl
            ariaLabel="Show upcoming or past bookings"
            options={[
              { label: 'Upcoming', value: 'upcoming' },
              { label: 'Past', value: 'past' },
            ]}
            value={bookingView}
            onChange={(value) => setShowUpcoming(value === 'upcoming')}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <GlassCard
            title={
              <span className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-slate-700 dark:text-white/80" aria-hidden />
                <span className="text-lg font-semibold text-slate-900 dark:text-white">
                  {`${showUpcoming ? 'Upcoming' : 'Past'} Bookings`}
                </span>
              </span>
            }
            subtitle="See what’s scheduled at a glance."
            action={
              sortedBookings.length > 0 && (
                <div className="flex items-center gap-2 text-xs font-medium text-[color:var(--text-secondary)]">
                  <span className="hidden sm:inline">Sort by</span>
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
              )
            }
          >
            {sortedBookings.length === 0 ? (
              <div className="glass-outline glass-surface flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[color:var(--glass-border)] px-6 py-8 text-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--btn-bg)]/10 text-lg">
                  <CalendarX2 className="h-6 w-6 text-[color:var(--text-primary)]" aria-hidden />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-semibold text-[color:var(--text-primary)]">
                    No {showUpcoming ? 'upcoming' : 'past'} bookings yet
                  </p>
                  <p className="text-sm text-[color:var(--text-secondary)]">
                    Use “Make New Booking” above to reserve your next visit.
                  </p>
                </div>
              </div>
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
                          alt={booking.facility}
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-xl bg-white/60 p-2 dark:bg-white/10"
                        />
                        <div className="space-y-1 leading-relaxed">
                          <p className="text-lg font-semibold">
                            <span className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-[color:var(--text-secondary)]" aria-hidden />
                              {booking.facility}
                            </span>
                          </p>
                          <p className="text-sm text-[color:var(--text-secondary)]">
                            <span className="flex items-center gap-2">
                              <CalendarDays className="h-4 w-4 text-[color:var(--text-secondary)]" aria-hidden />
                              {DateTime.fromISO(booking.date).toLocaleString(DateTime.DATE_MED)}
                            </span>
                          </p>
                          <p className="text-sm text-[color:var(--text-secondary)]">
                            <span className="flex items-center gap-2">
                              <Clock3 className="h-4 w-4 text-[color:var(--text-secondary)]" aria-hidden />
                              {booking.time}
                            </span>
                          </p>
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

          <GlassCard
            title={
              <span className="flex items-center gap-3">
                <UserIcon className="h-5 w-5 text-slate-700 dark:text-white/80" aria-hidden />
                <span className="text-lg font-semibold text-slate-900 dark:text-white">My Profile</span>
              </span>
            }
            subtitle="Keep your details up to date."
          >
            <div className="space-y-3 text-[color:var(--text-primary)]">
              {editing ? (
                <>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-[color:var(--glass-border)] bg-white/70 px-4 py-2.5 text-[color:var(--text-primary)] shadow-inner focus:outline-none focus:ring-2 focus:ring-[color:var(--btn-ring)] dark:bg-white/10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]">Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full rounded-xl border border-[color:var(--glass-border)] bg-white/70 px-4 py-2.5 text-[color:var(--text-primary)] shadow-inner focus:outline-none focus:ring-2 focus:ring-[color:var(--btn-ring)] dark:bg-white/10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]">Property</label>
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
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={updateProfile} className="min-w-[120px]">
                      Save
                    </Button>
                    <Button variant="secondary" onClick={() => setEditing(false)} className="min-w-[120px]">
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1 leading-relaxed text-[color:var(--text-secondary)]">
                    <p className="text-sm">
                      <span className="text-[color:var(--muted)]">Email</span>
                      <br />
                      <span className="text-base text-[color:var(--text-primary)]">{email}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-[color:var(--muted)]">Username</span>
                      <br />
                      <span className="text-base text-[color:var(--text-primary)]">{username}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-[color:var(--muted)]">Property</span>
                      <br />
                      <span className="text-base text-[color:var(--text-primary)]">{property}</span>
                    </p>
                    {userRole ? (
                      <p className="text-sm">
                        <span className="text-[color:var(--muted)]">Role at James Square</span>
                        <br />
                        <span className="text-base text-[color:var(--text-primary)]">{userRole}</span>
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                    <Button onClick={() => setEditing(true)} variant="secondary" className="flex-1 min-w-[140px]">
                      Edit Profile
                    </Button>
                    <Button variant="ghost" onClick={() => setShowModal(true)} className="flex-1 min-w-[140px]">
                      Reset Password
                    </Button>
                  </div>
                </>
              )}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-[color:var(--text-secondary)]">
                  <span className="font-medium text-[color:var(--muted)]">Resident status</span>
                  {!isEditingResidentType && (
                    <Button
                      variant="ghost"
                      className="text-xs"
                      onClick={() => {
                        setSelectedResidentType(normalizeResidentType(residentType));
                        setIsEditingResidentType(true);
                        setResidentTypeFeedback('');
                        setResidentTypeError('');
                      }}
                    >
                      Change
                    </Button>
                  )}
                </div>
                {!isEditingResidentType ? (
                  <p className="text-sm text-[color:var(--text-primary)]">
                    {displayResidentTypeLabel || 'Not set'}
                  </p>
                ) : (
                  <div className="space-y-3 rounded-2xl border border-[color:var(--glass-border)] bg-white/60 p-4 text-left shadow-inner dark:bg-white/5">
                    <p className="text-sm font-semibold text-[color:var(--text-primary)]">
                      Update your resident status
                    </p>
                    <div className="space-y-2 text-[color:var(--text-primary)]">
                      {[
                        { value: 'owner', label: 'Owner' },
                        { value: 'renter', label: 'Renter' },
                        { value: 'stl', label: 'Short Term Holiday Let' },
                      ].map((option) => (
                        <label key={option.value} className="flex items-center gap-3 text-sm">
                          <input
                            type="radio"
                            name="residentType"
                            value={option.value}
                            checked={selectedResidentType === option.value}
                            onChange={() => setSelectedResidentType(option.value)}
                            className="h-4 w-4 accent-[color:var(--btn-bg)]"
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={() => setShowResidentTypeConfirm(true)}
                        className="min-w-[140px]"
                        disabled={!selectedResidentType || savingResidentType}
                      >
                        Save changes
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setIsEditingResidentType(false);
                          setSelectedResidentType(normalizeResidentType(residentType));
                          setResidentTypeError('');
                        }}
                        className="min-w-[140px]"
                        disabled={savingResidentType}
                      >
                        Cancel
                      </Button>
                    </div>
                    {residentTypeError && (
                      <p className="text-sm text-red-600 dark:text-red-400">{residentTypeError}</p>
                    )}
                  </div>
                )}
                {residentTypeFeedback && (
                  <p className="text-sm text-emerald-600 dark:text-emerald-300">{residentTypeFeedback}</p>
                )}
              </div>
              {!userRole && (
                <div className="mt-4 rounded-2xl border border-[color:var(--glass-border)] bg-white/60 p-4 text-left shadow-inner dark:bg-white/5">
                  <p className="text-sm font-semibold text-[color:var(--text-primary)]">
                    Please select your role at James Square
                  </p>
                  <div className="mt-3 space-y-2 text-[color:var(--text-primary)]">
                    {[
                      'Owner',
                      'Renter',
                      'Short-term holiday guest',
                    ].map((roleOption) => (
                      <label key={roleOption} className="flex items-center gap-3 text-sm">
                        <input
                          type="radio"
                          name="userRole"
                          value={roleOption}
                          checked={userRole === roleOption}
                          onChange={() => handleRoleSelection(roleOption)}
                          disabled={savingRole}
                          className="h-4 w-4 accent-[color:var(--btn-bg)]"
                        />
                        <span>{roleOption}</span>
                      </label>
                    ))}
                  </div>
                  {roleError && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{roleError}</p>}
                </div>
              )}
              {feedback && <p className="text-sm text-emerald-600 dark:text-emerald-300">{feedback}</p>}
            </div>
          </GlassCard>
        </div>

      </div>

      <MobileAppPoster />

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
      {showResidentTypeConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 sm:px-0">
          <div className="glass-surface glass-outline w-full max-w-md p-6">
            <h3 className="text-lg font-semibold">Confirm resident status</h3>
            <p className="mt-2 text-[color:var(--text-secondary)] leading-relaxed">
              Changing your resident status may affect what areas of the site you can access. If you’re unsure,
              please choose the option that best reflects your current situation.
            </p>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowResidentTypeConfirm(false)}
                disabled={savingResidentType}
              >
                Cancel
              </Button>
              <Button onClick={handleResidentTypeSave} disabled={savingResidentType || !selectedResidentType}>
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
