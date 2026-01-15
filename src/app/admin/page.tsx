'use client';

import React, { useEffect, useMemo, useState, ChangeEvent } from 'react';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  addDoc,
} from 'firebase/firestore';
import OwnersPanel from './OwnersPanel';
import AdminEmailPanel from './AdminEmailPanel';
import AdminVoteAuditPanel from './AdminVoteAuditPanel';
import { getQuestions } from '@/app/voting/services/storageService';
import type { Question } from '@/app/voting/types';

/* ---------- Types (unchanged) ---------- */
interface UserRegistration {
  id: string;
  email: string;
  fullName: string;
  username: string;
  property: string;
  createdAt?: string | Date | { toDate: () => Date };
  lastLoginAt?: string | Date | { toDate: () => Date };
  residentType?: string;
  residentTypeLabel?: string;
  isFlagged?: boolean;
  isAdmin?: boolean;
  disabled?: boolean;
  requiresResidentTypeConfirmation?: boolean;
}
interface BookingActivity {
  id: string;
  facility: string;
  time: string;
  user: string;
  date: string;
  timestamp: number | Date;
}
interface ActivityLog {
  id: string;
  action: string;
  admin: string;
  timestamp: number | Date;
}
interface Feedback {
  id: string;
  user: string;
  message: string;
  timestamp: number | Date;
}

const PEAK_TIMES = new Set([
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30',
]);

const isPeakTime = (time: string) => PEAK_TIMES.has(time);

/* ---------- Small UI helpers (visual-only) ---------- */
function Section({
  title,
  subtitle,
  count,
  children,
  defaultOpen = false,
}: {
  title: string;
  subtitle?: string;
  count?: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="jqs-glass p-5 rounded-2xl">
      <button
        className="w-full flex items-start justify-between gap-4 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          {subtitle && (
            <p className="text-sm opacity-80 mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {typeof count === 'number' && (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold jqs-glass">
              {count}
            </span>
          )}
          <span
            className={`inline-block transition-transform ${
              open ? 'rotate-180' : 'rotate-0'
            }`}
            aria-hidden
          >
            ▾
          </span>
        </div>
      </button>

      <div
        className={`overflow-hidden transition-[grid-template-rows] duration-300 mt-4 ${
          open ? 'grid grid-rows-[1fr]' : 'grid grid-rows-[0fr]'
        }`}
      >
        <div className="min-h-0">{children}</div>
      </div>
    </section>
  );
}

/* Badge “pills” for quick KPIs */
function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="jqs-glass rounded-2xl px-4 py-3 text-sm">
      <div className="opacity-80">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}

export default function AdminDashboard() {
  /* ---------- Auth / admin state (unchanged) ---------- */
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  /* ---------- Data state (unchanged) ---------- */
  const [users, setUsers] = useState<UserRegistration[]>([]);
  const [bookings, setBookings] = useState<BookingActivity[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [votingQuestions, setVotingQuestions] = useState<Question[]>([]);
  const [votingLoading, setVotingLoading] = useState<boolean>(true);
  const [votingError, setVotingError] = useState<string | null>(null);

  /* ---------- UI state (unchanged) ---------- */
  const [editingUser, setEditingUser] = useState<UserRegistration | null>(null);
  const [customNotice, setCustomNotice] = useState<string>('');
  const [facilityRules, setFacilityRules] = useState<string>('');
  const [debugMode, setDebugMode] = useState<boolean>(false);
  const [residentFilter, setResidentFilter] = useState<
    'all' | 'owners' | 'renters' | 'unknown'
  >('all');
  const [activityFilter, setActivityFilter] = useState<
    'all' | 'active' | 'inactive' | 'never'
  >('all');
  const [bookingFacilityFilter, setBookingFacilityFilter] = useState<
    'all' | 'Pool' | 'Gym' | 'Sauna'
  >('all');
  const [activeTab, setActiveTab] = useState<
    'overview' | 'voting' | 'users' | 'owners' | 'comms' | 'system'
  >('overview');
  const [bookingTimeFilter, setBookingTimeFilter] = useState<
    'all' | 'peak' | 'off-peak'
  >('all');
  const [bookingUserFilter, setBookingUserFilter] = useState<string>('all');
  const [bookingViewMode, setBookingViewMode] = useState<
    'chronological' | 'grouped'
  >('chronological');
  const [showBookingFilters, setShowBookingFilters] = useState<boolean>(false);


  /* ---------- Auth check (unchanged) ---------- */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists() && userSnap.data().isAdmin) {
          setIsAdmin(true);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  /* ---------- Fetch data (unchanged) ---------- */
  useEffect(() => {
    if (!isAdmin) return;

    const fetchUsers = async () => {
      const qUsers = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(qUsers);
      const list: UserRegistration[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as UserRegistration);
      });
      setUsers(list);
    };

    const fetchBookings = async () => {
      const qBookings = query(collection(db, 'bookings'), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(qBookings);
      const list: BookingActivity[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as BookingActivity);
      });
      setBookings(list);
    };

    const fetchActivityLogs = async () => {
      const qLogs = query(collection(db, 'activityLogs'), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(qLogs);
      const list: ActivityLog[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as ActivityLog);
      });
      setActivityLogs(list);
    };

    const fetchFeedbacks = async () => {
      const qFb = query(collection(db, 'feedback'), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(qFb);
      const list: Feedback[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Feedback);
      });
      setFeedbacks(list);
    };

    const fetchFacilityConfig = async () => {
      const configDocRef = doc(db, 'siteConfigs', 'facilityInfo');
      const docSnap = await getDoc(configDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCustomNotice(data.customNotice || '');
        setFacilityRules(data.facilityRules || '');
      }
    };

    const fetchVotingQuestions = async () => {
      setVotingLoading(true);
      setVotingError(null);
      try {
        const list = await getQuestions();
        setVotingQuestions(list);
      } catch (error) {
        console.error('Failed to load voting questions:', error);
        setVotingError('Unable to load voting questions.');
      } finally {
        setVotingLoading(false);
      }
    };

    fetchUsers();
    fetchBookings();
    fetchActivityLogs();
    fetchFeedbacks();
    fetchFacilityConfig();
    fetchVotingQuestions();
  }, [isAdmin]);

  /* ---------- User Editing & Controls (unchanged) ---------- */
  const startEditing = (user: UserRegistration) => setEditingUser({ ...user });
  const cancelEditing = () => setEditingUser(null);
  const handleEditChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (editingUser) {
      setEditingUser({ ...editingUser, [e.target.name]: e.target.value });
    }
  };
  const saveEdits = async () => {
    if (!editingUser) return;
    try {
      const userRef = doc(db, 'users', editingUser.id);
      await updateDoc(userRef, {
        fullName: editingUser.fullName,
        username: editingUser.username,
        property: editingUser.property,
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? { ...u, ...editingUser } : u))
      );
      setEditingUser(null);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };
  const removeUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to remove this user?')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };
  const toggleAdminStatus = async (user: UserRegistration) => {
    const newStatus = !user.isAdmin;
    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, { isAdmin: newStatus });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isAdmin: newStatus } : u))
      );
      await addDoc(collection(db, 'activityLogs'), {
        action: newStatus ? 'Promoted to Admin' : 'Demoted from Admin',
        admin: auth.currentUser?.email || 'unknown',
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Failed to update admin status:', error);
    }
  };
  const toggleDisabledStatus = async (user: UserRegistration) => {
    const newStatus = !user.disabled;
    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, { disabled: newStatus });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, disabled: newStatus } : u))
      );
      await addDoc(collection(db, 'activityLogs'), {
        action: newStatus ? 'Disabled user account' : 'Enabled user account',
        admin: auth.currentUser?.email || 'unknown',
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Failed to update disabled status:', error);
    }
  };

  const requireResidentTypeConfirmation = async (user: UserRegistration) => {
    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, { requiresResidentTypeConfirmation: true });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? { ...u, requiresResidentTypeConfirmation: true }
            : u
        )
      );
      await addDoc(collection(db, 'activityLogs'), {
        action: 'Flagged resident type confirmation requirement',
        admin: auth.currentUser?.email || 'unknown',
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Failed to require resident type confirmation:', error);
    }
  };

  /* ---------- Booking / Logs controls (unchanged) ---------- */
  const resetBookings = async () => {
    if (window.confirm('Are you sure you want to reset all bookings? This action cannot be undone.')) {
      try {
        const bookingsCollectionRef = collection(db, 'bookings');
        const snapshot = await getDocs(bookingsCollectionRef);
        const deletePromises = snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
        await Promise.all(deletePromises);
        setBookings([]);
        alert('All bookings have been reset.');
        await addDoc(collection(db, 'activityLogs'), {
          action: 'Reset all bookings',
          admin: auth.currentUser?.email || 'unknown',
          timestamp: new Date(),
        });
      } catch (error) {
        console.error('Failed to reset bookings:', error);
        alert('Failed to reset bookings. Please try again later.');
      }
    }
  };

  /* ---------- Facility config (unchanged) ---------- */
  const updateFacilityConfig = async () => {
    try {
      const configDocRef = doc(db, 'siteConfigs', 'facilityInfo');
      await setDoc(
        configDocRef,
        { customNotice, facilityRules },
        { merge: true }
      );
      alert('Facility configuration updated.');
      await addDoc(collection(db, 'activityLogs'), {
        action: 'Updated facility configuration',
        admin: auth.currentUser?.email || 'unknown',
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Failed to update facility configuration:', error);
      alert('Failed to update facility configuration.');
    }
  };


  /* ---------- Export / Debug (unchanged) ---------- */
  const exportDataAsCSV = () => {
    const convertToCSV = <T extends Record<string, unknown>>(data: T[]): string => {
      if (data.length === 0) return '';
      const header = Object.keys(data[0]);
      const rows = data.map((item) =>
        header.map((field) => String(item[field]))
      );
      return [header.join(','), ...rows.map(row => row.join(','))].join('\n');
    };

    let csvContent = '';
    if (users.length > 0) {
      csvContent += 'Users:\n' + convertToCSV(users.map(u => ({
        ...u,
        lastLoginAt: formatLastLoginForExport(u),
      }))) + '\n\n';
    }
    if (bookings.length > 0) {
      csvContent += 'Bookings:\n' + convertToCSV(bookings.map(b => ({ ...b }))) + '\n\n';
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'export_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleDebugMode = () => setDebugMode((prev) => !prev);

  const formatDate = (dateValue: UserRegistration['createdAt']) => {
    if (!dateValue) return 'Unknown';

    if (typeof dateValue === 'string' || dateValue instanceof Date) {
      return new Date(dateValue).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      });
    }

    const timestamp = dateValue as { toDate?: () => Date };

    if (typeof timestamp.toDate === 'function') {
      return timestamp.toDate().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      });
    }

    return 'Unknown';
  };

  const formatLastLoginForExport = (user: UserRegistration) => {
    const lastLoginDate = getLastLoginDate(user.lastLoginAt);
    return lastLoginDate ? lastLoginDate.toISOString() : 'Before tracking enabled';
  };

  const getLastLoginDate = (dateValue: UserRegistration['lastLoginAt']) => {
    if (!dateValue) return null;

    if (typeof dateValue === 'string' || dateValue instanceof Date) {
      const parsed = new Date(dateValue);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    }

    const timestamp = dateValue as { toDate?: () => Date };

    if (typeof timestamp.toDate === 'function') {
      return timestamp.toDate();
    }

    return null;
  };

  const getLastLoginDisplay = (user: UserRegistration) => {
    const lastLoginDate = getLastLoginDate(user.lastLoginAt);
    if (!lastLoginDate) {
      return {
        label: 'Before tracking enabled',
        status: 'never',
      } as const;
    }

    const daysSinceLogin = Math.floor(
      (Date.now() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const label = lastLoginDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });

    if (daysSinceLogin >= 30) {
      return { label, status: 'inactive' } as const;
    }

    return { label, status: 'active' } as const;
  };

  const getResidentTypeLabel = (user: UserRegistration) => {
    const rawLabel = user.residentTypeLabel?.trim();
    if (!rawLabel) {
      return {
        label: 'Unknown – confirmation required',
        isMissing: true,
      };
    }
    return { label: rawLabel, isMissing: false };
  };

  const getResidentCategory = (user: UserRegistration) => {
    const label = (user.residentTypeLabel || user.residentType || '').toLowerCase();
    if (label.includes('owner')) {
      return 'owners';
    }
    if (label.includes('rent')) {
      return 'renters';
    }
    return 'unknown';
  };

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  /* ---------- Derived stats (unchanged) ---------- */
  const bookingStats = bookings.reduce((stats: { [key: string]: number }, booking) => {
    stats[booking.facility] = (stats[booking.facility] || 0) + 1;
    return stats;
  }, {});

  const nonAdminBookings = useMemo(() => {
    const adminEmails = new Set(
      users.filter((user) => user.isAdmin).map((user) => user.email)
    );
    return bookings.filter((booking) => !adminEmails.has(booking.user));
  }, [bookings, users]);

  const bookingInsights = useMemo(() => {
    const totalBookings = nonAdminBookings.length;
    const uniqueUsers = new Set(nonAdminBookings.map((booking) => booking.user));
    const uniqueUsersCount = uniqueUsers.size;
    const averageBookingsPerUser = uniqueUsersCount
      ? totalBookings / uniqueUsersCount
      : 0;
    const peakBookings = nonAdminBookings.filter((booking) =>
      isPeakTime(booking.time)
    ).length;
    const peakPercentage = totalBookings
      ? (peakBookings / totalBookings) * 100
      : 0;

    return {
      totalBookings,
      uniqueUsersCount,
      averageBookingsPerUser,
      peakBookings,
      peakPercentage,
    };
  }, [nonAdminBookings]);

  const bookingFilterOptions = useMemo(() => {
    const uniqueUsers = Array.from(
      new Set(nonAdminBookings.map((booking) => booking.user))
    ).sort((a, b) => a.localeCompare(b));
    return uniqueUsers;
  }, [nonAdminBookings]);

  const filteredBookings = useMemo(() => {
    return nonAdminBookings.filter((booking) => {
      if (bookingFacilityFilter !== 'all' && booking.facility !== bookingFacilityFilter) {
        return false;
      }
      if (bookingTimeFilter === 'peak' && !isPeakTime(booking.time)) {
        return false;
      }
      if (bookingTimeFilter === 'off-peak' && isPeakTime(booking.time)) {
        return false;
      }
      if (bookingUserFilter !== 'all' && booking.user !== bookingUserFilter) {
        return false;
      }
      return true;
    });
  }, [bookingFacilityFilter, bookingTimeFilter, bookingUserFilter, nonAdminBookings]);

  const bookingUserBreakdown = useMemo(() => {
    const totals = new Map<
      string,
      { total: number; peak: number }
    >();
    filteredBookings.forEach((booking) => {
      const current = totals.get(booking.user) ?? { total: 0, peak: 0 };
      const next = {
        total: current.total + 1,
        peak: current.peak + (isPeakTime(booking.time) ? 1 : 0),
      };
      totals.set(booking.user, next);
    });

    const overallTotal = filteredBookings.length;
    const averagePerUser = totals.size ? overallTotal / totals.size : 0;

    const breakdown = Array.from(totals.entries()).map(([user, stats]) => {
      const share = overallTotal ? (stats.total / overallTotal) * 100 : 0;
      let indicator: 'High usage' | 'Above average' | null = null;
      if (averagePerUser > 0 && stats.total > averagePerUser * 2) {
        indicator = 'High usage';
      } else if (averagePerUser > 0 && stats.total > averagePerUser * 1.5) {
        indicator = 'Above average';
      }
      return {
        user,
        total: stats.total,
        peak: stats.peak,
        share,
        indicator,
      };
    });

    breakdown.sort((a, b) => b.total - a.total);

    return { breakdown, averagePerUser };
  }, [filteredBookings]);

  const timeSlotBreakdown = useMemo(() => {
    const totals = new Map<string, number>();
    filteredBookings.forEach((booking) => {
      totals.set(booking.time, (totals.get(booking.time) ?? 0) + 1);
    });
    const breakdown = Array.from(totals.entries()).map(([time, total]) => ({
      time,
      total,
    }));
    breakdown.sort((a, b) => b.total - a.total || a.time.localeCompare(b.time));
    const topTimes = new Set(breakdown.slice(0, 5).map((item) => item.time));

    return {
      breakdown,
      topTimes,
    };
  }, [filteredBookings]);

  const peakOffPeakStats = useMemo(() => {
    const peakBookings = filteredBookings.filter((booking) =>
      isPeakTime(booking.time)
    ).length;
    const totalBookings = filteredBookings.length;
    const offPeakBookings = totalBookings - peakBookings;
    const peakPercentage = totalBookings ? (peakBookings / totalBookings) * 100 : 0;
    const offPeakPercentage = totalBookings ? 100 - peakPercentage : 0;
    return {
      peakBookings,
      offPeakBookings,
      peakPercentage,
      offPeakPercentage,
    };
  }, [filteredBookings]);

  const facilityUsage = useMemo(() => {
    const totals = new Map<
      string,
      { total: number; peak: number }
    >();
    filteredBookings.forEach((booking) => {
      const current = totals.get(booking.facility) ?? { total: 0, peak: 0 };
      totals.set(booking.facility, {
        total: current.total + 1,
        peak: current.peak + (isPeakTime(booking.time) ? 1 : 0),
      });
    });

    const overallTotal = filteredBookings.length || 1;

    const breakdown = Array.from(totals.entries()).map(([facility, stats]) => ({
      facility,
      total: stats.total,
      peak: stats.peak,
      share: (stats.total / overallTotal) * 100,
    }));

    breakdown.sort((a, b) => b.total - a.total);

    return breakdown;
  }, [filteredBookings]);

  const groupedBookingsByUser = useMemo(() => {
    const grouped = new Map<string, BookingActivity[]>();
    filteredBookings.forEach((booking) => {
      const current = grouped.get(booking.user) ?? [];
      current.push(booking);
      grouped.set(booking.user, current);
    });
    const entries = Array.from(grouped.entries()).map(([user, entries]) => ({
      user,
      entries,
      total: entries.length,
    }));
    entries.sort((a, b) => b.total - a.total);
    return entries;
  }, [filteredBookings]);

  const mobileBookingGroups = useMemo(() => {
    const groups: Array<{ user: string; entries: BookingActivity[] }> = [];
    let currentGroup: { user: string; entries: BookingActivity[] } | null = null;

    filteredBookings.forEach((booking) => {
      if (!currentGroup || currentGroup.user !== booking.user) {
        currentGroup = { user: booking.user, entries: [booking] };
        groups.push(currentGroup);
        return;
      }
      currentGroup.entries.push(booking);
    });

    return groups;
  }, [filteredBookings]);

  const residentStats = useMemo(() => {
    const nonAdminUsers = users.filter((user) => !user.isAdmin);
    const stats = nonAdminUsers.reduce(
      (acc, user) => {
        const category = getResidentCategory(user);
        if (category === 'owners') {
          acc.owners += 1;
        } else if (category === 'renters') {
          acc.renters += 1;
        } else {
          acc.unknown += 1;
        }
        return acc;
      },
      { total: nonAdminUsers.length, owners: 0, renters: 0, unknown: 0 }
    );

    return { ...stats };
  }, [users]);

  const activityStats = useMemo(() => {
    const nonAdminUsers = users.filter((user) => !user.isAdmin);
    return nonAdminUsers.reduce(
      (acc, user) => {
        const status = getLastLoginDisplay(user).status;
        if (status === 'inactive') {
          acc.inactive += 1;
        }
        if (status === 'never') {
          acc.never += 1;
        }
        return acc;
      },
      { inactive: 0, never: 0 }
    );
  }, [users]);

  const votingOverview = useMemo(() => {
    const activeVotes = votingQuestions.filter((question) => question.status === 'open');
    const totalsByQuestion = votingQuestions.map((question) => {
      const total = Object.values(question.voteTotals ?? {}).reduce(
        (sum, count) => sum + count,
        0
      );
      return { id: question.id, title: question.title, total };
    });
    const totalBallotsCast = totalsByQuestion.reduce((sum, q) => sum + q.total, 0);

    return {
      activeCount: activeVotes.length,
      totalBallotsCast,
      totalsByQuestion,
    };
  }, [votingQuestions]);

  const filteredUsers = useMemo(() => {
    const nonAdminUsers = users.filter((user) => !user.isAdmin);
    const residentFiltered = residentFilter === 'all'
      ? nonAdminUsers
      : nonAdminUsers.filter(
        (user) => getResidentCategory(user) === residentFilter
      );

    if (activityFilter === 'all') {
      return residentFiltered;
    }

    return residentFiltered.filter((user) => {
      const status = getLastLoginDisplay(user).status;
      if (activityFilter === 'active') {
        return status === 'active';
      }
      if (activityFilter === 'inactive') {
        return status === 'inactive';
      }
      return status === 'never';
    });
  }, [activityFilter, residentFilter, users]);

  /* ---------- Guards (unchanged) ---------- */
  if (loading) {
    return (
      <main className="jqs-gradient-bg min-h-screen">
        <div className="max-w-7xl mx-auto p-6">
          <div className="jqs-glass rounded-2xl p-4">Loading admin dashboard...</div>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="jqs-gradient-bg min-h-screen">
        <div className="max-w-7xl mx-auto p-6">
          <div className="jqs-glass rounded-2xl p-4 text-red-600 dark:text-red-400">
            Access denied. Admins only.
          </div>
        </div>
      </main>
    );
  }

  /* ---------- Render ---------- */
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'voting', label: 'Voting' },
    { id: 'users', label: 'Users' },
    { id: 'owners', label: 'Owners' },
    { id: 'comms', label: 'Comms' },
    { id: 'system', label: 'System' },
  ] as const;

  return (
    <main className="jqs-gradient-bg min-h-screen">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="opacity-80 text-sm mt-1">
              Manage users, bookings, configuration, and communications.
            </p>
          </div>
          <div className="grid grid-flow-col auto-cols-max gap-3">
            <StatPill label="Users" value={users.length} />
            <StatPill label="Bookings" value={bookings.length} />
            <StatPill label="Logs" value={activityLogs.length} />
            <StatPill label="Feedback" value={feedbacks.length} />
          </div>
        </header>

        <div className="sticky top-0 z-20 -mx-6 px-6 py-2 md:static">
          <div className="jqs-glass rounded-full px-2 py-2">
            <div className="flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-thin">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-600 dark:text-slate-200 hover:bg-white/10'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="jqs-glass rounded-2xl p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div>
                  <h2 className="text-lg font-semibold">Resident Breakdown</h2>
                  <p className="text-xs opacity-75">
                    Admin/system accounts excluded from totals.
                  </p>
                </div>
                <div className="text-xs opacity-70">Matches the filtered user list.</div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <StatPill label="Total Residents" value={residentStats.total} />
                <StatPill label="Owners" value={residentStats.owners} />
                <StatPill label="Renters" value={residentStats.renters} />
                <StatPill label="Unknown" value={residentStats.unknown} />
                <StatPill label="Inactive 30+ days" value={activityStats.inactive} />
              </div>
            </div>
            <div className="jqs-glass rounded-2xl px-4 py-3 text-xs opacity-80">
              Some residents signed up before resident-type confirmation existed. Unknown residents will be
              asked to confirm their status later. (Admin-only notice)
            </div>
          </>
        )}

        {activeTab === 'owners' && (
          <Section
            title="Owners"
            subtitle="Grant or revoke owner access without sharing the passcode"
            defaultOpen
          >
            <OwnersPanel />
          </Section>
        )}

        {activeTab === 'comms' && (
          <Section
            title="Email Residents"
            subtitle="Send announcements to selected owners or all residents"
          >
            <AdminEmailPanel />
          </Section>
        )}

        {(activeTab === 'overview' || activeTab === 'voting') && (
          <Section
            title="Voting Overview"
            subtitle="High-level totals with quick access to the full audit"
            defaultOpen
          >
            <div className="space-y-4">
              {votingLoading ? (
                <div className="jqs-glass rounded-xl p-3">Loading voting overview...</div>
              ) : votingError ? (
                <div className="jqs-glass rounded-xl p-3 text-red-600 dark:text-red-400">
                  {votingError}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <StatPill label="Active votes" value={votingOverview.activeCount} />
                    <StatPill label="Total ballots cast" value={votingOverview.totalBallotsCast} />
                    <div className="jqs-glass rounded-2xl px-4 py-3 text-sm flex flex-col justify-between gap-2">
                      <div className="opacity-80">Voting audit</div>
                      <Link
                        href="/admin/voting"
                        className="text-sm font-semibold text-indigo-600 hover:underline"
                      >
                        Open detailed audit →
                      </Link>
                    </div>
                  </div>
                  <div className="jqs-glass rounded-2xl p-4">
                    <h3 className="text-sm font-semibold mb-3">Votes per question</h3>
                    {votingOverview.totalsByQuestion.length === 0 ? (
                      <div className="text-sm opacity-80">No questions created yet.</div>
                    ) : (
                      <div className="space-y-2 text-sm">
                        {votingOverview.totalsByQuestion.map((question) => (
                          <div key={question.id} className="flex flex-wrap justify-between gap-2">
                            <span className="font-medium">{question.title}</span>
                            <span className="opacity-80">{question.total} ballots</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </Section>
        )}

        {activeTab === 'voting' && (
          <Section title="Voting Audit" subtitle="Review ballot details by voter">
            <AdminVoteAuditPanel />
          </Section>
        )}

        {/* Users */}
        {activeTab === 'users' && (
          <Section
            title="Users"
            subtitle="Manage accounts, roles, and access"
            count={filteredUsers.length}
            defaultOpen
          >
            {filteredUsers.length === 0 ? (
              <div className="jqs-glass rounded-xl p-3">No users found.</div>
            ) : (
              <>
              <div className="flex flex-col gap-3 mb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide opacity-70">Resident type</span>
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'owners', label: 'Owners' },
                    { id: 'renters', label: 'Renters' },
                    { id: 'unknown', label: 'Unknown' },
                  ].map((filter) => {
                    const isActive = residentFilter === filter.id;
                    return (
                      <button
                        key={filter.id}
                        type="button"
                        onClick={() =>
                          setResidentFilter(
                            filter.id as 'all' | 'owners' | 'renters' | 'unknown'
                          )
                        }
                        className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                          isActive
                            ? 'bg-indigo-600 text-white shadow'
                            : 'jqs-glass hover:brightness-[1.05]'
                        }`}
                      >
                        {filter.label}
                      </button>
                    );
                  })}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide opacity-70">Activity</span>
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'active', label: 'Active' },
                    { id: 'inactive', label: 'Inactive 30+ days' },
                    { id: 'never', label: 'Never logged in' },
                  ].map((filter) => {
                    const isActive = activityFilter === filter.id;
                    return (
                      <button
                        key={filter.id}
                        type="button"
                        onClick={() =>
                          setActivityFilter(
                            filter.id as 'all' | 'active' | 'inactive' | 'never'
                          )
                        }
                        className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                          isActive
                            ? 'bg-emerald-600 text-white shadow'
                            : 'jqs-glass hover:brightness-[1.05]'
                        }`}
                      >
                        {filter.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto jqs-glass rounded-2xl">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left">
                      {[
                        'Email',
                        'Full Name',
                        'Username',
                        'Property',
                        'Type',
                        'Registered',
                        'Last login',
                        'Flagged',
                        'Admin',
                        'Disabled',
                        'Actions',
                      ].map((h) => (
                        <th key={h} className="px-3 py-2 border-b border-[color:var(--glass-border)]">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) =>
                      editingUser && editingUser.id === user.id ? (
                        <tr key={user.id} className="align-top">
                          <td className="px-3 py-2">{user.email}</td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              name="fullName"
                              value={editingUser.fullName || ''}
                              onChange={handleEditChange}
                              className="w-full border rounded px-2 py-1 bg-transparent"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              name="username"
                              value={editingUser.username || ''}
                              onChange={handleEditChange}
                              className="w-full border rounded px-2 py-1 bg-transparent"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              name="property"
                              value={editingUser.property || ''}
                              onChange={handleEditChange}
                              className="w-full border rounded px-2 py-1 bg-transparent"
                            />
                          </td>
                          <td className="px-3 py-2">
                            {(() => {
                              const status = getResidentTypeLabel(user);
                              return (
                                <span className={status.isMissing ? 'text-amber-600 font-semibold' : undefined}>
                                  {status.label}
                                </span>
                              );
                            })()}
                          </td>
                          <td className="px-3 py-2">
                            {formatDate(user.createdAt)}
                          </td>
                          <td className="px-3 py-2">
                            {(() => {
                              const lastLogin = getLastLoginDisplay(user);
                              return (
                                <div className="space-y-1">
                                  <div>{lastLogin.label}</div>
                                  {lastLogin.status === 'inactive' && (
                                    <div className="text-xs text-amber-600">Inactive 30+ days</div>
                                  )}
                                  {lastLogin.status === 'never' && (
                                    <div className="text-xs text-slate-500">Never logged in</div>
                                  )}
                                </div>
                              );
                            })()}
                          </td>
                          <td className="px-3 py-2">{user.isFlagged ? 'Yes' : 'No'}</td>
                          <td className="px-3 py-2">{user.isAdmin ? 'Yes' : 'No'}</td>
                          <td className="px-3 py-2">{user.disabled ? 'Yes' : 'No'}</td>
                          <td className="px-3 py-2 space-x-1">
                            <button onClick={saveEdits} className="rounded-full px-3 py-1 text-xs bg-emerald-600 text-white">
                              Save
                            </button>
                            <button onClick={cancelEditing} className="rounded-full px-3 py-1 text-xs jqs-glass">
                              Cancel
                            </button>
                            {getResidentCategory(user) === 'unknown' && (
                              <button
                                onClick={() => requireResidentTypeConfirmation(user)}
                                className="rounded-full px-3 py-1 text-xs bg-slate-700 text-white"
                              >
                                Require confirmation
                              </button>
                            )}
                            <button onClick={() => removeUser(user.id)} className="rounded-full px-3 py-1 text-xs bg-red-600 text-white">
                              Remove
                            </button>
                          </td>
                        </tr>
                      ) : (
                        <tr key={user.id} className="align-top">
                          <td className="px-3 py-2">{user.email}</td>
                          <td className="px-3 py-2">{user.fullName}</td>
                          <td className="px-3 py-2">{user.username}</td>
                          <td className="px-3 py-2">{user.property}</td>
                          <td className="px-3 py-2">
                            {(() => {
                              const status = getResidentTypeLabel(user);
                              return (
                                <span className={status.isMissing ? 'text-amber-600 font-semibold' : undefined}>
                                  {status.label}
                                </span>
                              );
                            })()}
                          </td>
                          <td className="px-3 py-2">
                            {formatDate(user.createdAt)}
                          </td>
                          <td className="px-3 py-2">
                            {(() => {
                              const lastLogin = getLastLoginDisplay(user);
                              return (
                                <div className="space-y-1">
                                  <div>{lastLogin.label}</div>
                                  {lastLogin.status === 'inactive' && (
                                    <div className="text-xs text-amber-600">Inactive 30+ days</div>
                                  )}
                                  {lastLogin.status === 'never' && (
                                    <div className="text-xs text-slate-500">Never logged in</div>
                                  )}
                                </div>
                              );
                            })()}
                          </td>
                          <td className="px-3 py-2">{user.isFlagged ? 'Yes' : 'No'}</td>
                          <td className="px-3 py-2">{user.isAdmin ? 'Yes' : 'No'}</td>
                          <td className="px-3 py-2">{user.disabled ? 'Yes' : 'No'}</td>
                          <td className="px-3 py-2 space-x-1">
                            <button onClick={() => startEditing(user)} className="rounded-full px-3 py-1 text-xs jqs-glass">
                              Edit
                            </button>
                            <button onClick={() => toggleAdminStatus(user)} className="rounded-full px-3 py-1 text-xs bg-indigo-600 text-white">
                              {user.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                            </button>
                            <button onClick={() => toggleDisabledStatus(user)} className="rounded-full px-3 py-1 text-xs bg-amber-500 text-black">
                              {user.disabled ? 'Enable' : 'Disable'}
                            </button>
                            {getResidentCategory(user) === 'unknown' && (
                              <button
                                onClick={() => requireResidentTypeConfirmation(user)}
                                className="rounded-full px-3 py-1 text-xs bg-slate-700 text-white"
                              >
                                Require confirmation
                              </button>
                            )}
                            <button onClick={() => removeUser(user.id)} className="rounded-full px-3 py-1 text-xs bg-red-600 text-white">
                              Remove
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4 mt-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="jqs-glass rounded-2xl p-3 text-sm">
                    <div className="flex flex-col gap-1">
                      <div className="text-base font-semibold">{user.fullName}</div>
                      <div className="text-sm opacity-80">{user.property}</div>
                    </div>
                    <div className="mt-2 space-y-1">
                      <p>
                        <strong>Status:</strong>{' '}
                        <span className={getResidentTypeLabel(user).isMissing ? 'text-amber-600 font-semibold' : undefined}>
                          {getResidentTypeLabel(user).label}
                        </span>
                      </p>
                      <p><strong>Email:</strong> {user.email}</p>
                      <p><strong>Username:</strong> {user.username}</p>
                    </div>
                    <p>
                      <strong>Registered:</strong>{' '}
                      {formatDate(user.createdAt)}
                    </p>
                    <p>
                      <strong>Last login:</strong>{' '}
                      <span>{getLastLoginDisplay(user).label}</span>
                    </p>
                    {getLastLoginDisplay(user).status === 'inactive' && (
                      <p className="text-xs text-amber-600">Inactive 30+ days</p>
                    )}
                    {getLastLoginDisplay(user).status === 'never' && (
                      <p className="text-xs text-slate-500">Never logged in</p>
                    )}
                    <p><strong>Flagged:</strong> {user.isFlagged ? 'Yes' : 'No'}</p>
                    <p><strong>Admin:</strong> {user.isAdmin ? 'Yes' : 'No'}</p>
                    <p><strong>Disabled:</strong> {user.disabled ? 'Yes' : 'No'}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <button
                        onClick={() => startEditing(user)}
                        className="jqs-glass px-4 py-2 rounded-full text-xs font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => toggleAdminStatus(user)}
                        className="px-4 py-2 rounded-full text-xs font-semibold bg-indigo-600 text-white"
                      >
                        {user.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                      </button>
                      <button
                        onClick={() => toggleDisabledStatus(user)}
                        className="px-4 py-2 rounded-full text-xs font-semibold bg-amber-500 text-black"
                      >
                        {user.disabled ? 'Enable' : 'Disable'}
                      </button>
                      {getResidentCategory(user) === 'unknown' && (
                        <button
                          onClick={() => requireResidentTypeConfirmation(user)}
                          className="px-4 py-2 rounded-full text-xs font-semibold bg-slate-700 text-white"
                        >
                          Require confirmation
                        </button>
                      )}
                      <button
                        onClick={() => removeUser(user.id)}
                        className="px-4 py-2 rounded-full text-xs font-semibold bg-red-600 text-white"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              </>
            )}
          </Section>
        )}

        {activeTab === 'system' && (
          <Section
            title="Booking Insights"
            subtitle="Read-only analysis of facility usage patterns"
            defaultOpen
          >
            <div className="space-y-4">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold">Overview</h3>
                  <p className="text-xs opacity-75">
                    Admin and system accounts are excluded from insight totals.
                  </p>
                </div>
                <div className="text-xs opacity-70">
                  Based on all bookings in the system.
                </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
                <StatPill label="Total bookings" value={bookingInsights.totalBookings} />
                <StatPill label="Unique booking users" value={bookingInsights.uniqueUsersCount} />
                <StatPill
                  label="Average bookings per user"
                  value={bookingInsights.averageBookingsPerUser.toFixed(1)}
                />
                <StatPill
                  label="Peak-time bookings"
                  value={`${bookingInsights.peakBookings} (${formatPercentage(
                    bookingInsights.peakPercentage
                  )})`}
                />
              </div>
            </div>

            <div className="jqs-glass rounded-2xl p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold">Booking filters</h3>
                  <p className="text-xs opacity-75">
                    Filters apply to the insights and recent activity list below.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBookingFilters((prev) => !prev)}
                  className="md:hidden text-xs font-semibold rounded-full px-3 py-1 jqs-glass"
                >
                  {showBookingFilters ? 'Hide filters' : 'Show filters'}
                </button>
              </div>
              <div
                className={`mt-4 space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-4 ${
                  showBookingFilters ? 'block' : 'hidden md:grid'
                }`}
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide opacity-70 mb-2">
                    Facility
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'Pool', label: 'Pool' },
                      { id: 'Gym', label: 'Gym' },
                      { id: 'Sauna', label: 'Sauna' },
                    ].map((filter) => {
                      const isActive = bookingFacilityFilter === filter.id;
                      return (
                        <button
                          key={filter.id}
                          type="button"
                          onClick={() =>
                            setBookingFacilityFilter(
                              filter.id as 'all' | 'Pool' | 'Gym' | 'Sauna'
                            )
                          }
                          className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                            isActive
                              ? 'bg-indigo-600 text-white shadow'
                              : 'jqs-glass hover:brightness-[1.05]'
                          }`}
                        >
                          {filter.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide opacity-70 mb-2">
                    Time category
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'peak', label: 'Peak' },
                      { id: 'off-peak', label: 'Off-peak' },
                    ].map((filter) => {
                      const isActive = bookingTimeFilter === filter.id;
                      return (
                        <button
                          key={filter.id}
                          type="button"
                          onClick={() =>
                            setBookingTimeFilter(filter.id as 'all' | 'peak' | 'off-peak')
                          }
                          className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                            isActive
                              ? 'bg-emerald-600 text-white shadow'
                              : 'jqs-glass hover:brightness-[1.05]'
                          }`}
                        >
                          {filter.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide opacity-70 mb-2">
                    User
                  </p>
                  <select
                    value={bookingUserFilter}
                    onChange={(event) => setBookingUserFilter(event.target.value)}
                    className="w-full rounded-xl border border-transparent bg-transparent jqs-glass px-3 py-2 text-sm"
                  >
                    <option value="all">All users</option>
                    {bookingFilterOptions.map((email) => (
                      <option key={email} value={email}>
                        {email}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="jqs-glass rounded-2xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-sm font-semibold">Bookings per user</h3>
                    <p className="text-xs opacity-75">
                      Compare booking share by resident email.
                    </p>
                  </div>
                  <div className="text-xs opacity-70">
                    Baseline: {bookingUserBreakdown.averagePerUser.toFixed(1)} avg per user
                  </div>
                </div>
                {bookingUserBreakdown.breakdown.length === 0 ? (
                  <div className="text-sm opacity-80">No bookings match the filters.</div>
                ) : (
                  <>
                    <div className="hidden md:block overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="text-left">
                            {['User', 'Total', '% of all', 'Peak-time', 'Indicator'].map((h) => (
                              <th
                                key={h}
                                className="px-3 py-2 border-b border-[color:var(--glass-border)]"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {bookingUserBreakdown.breakdown.map((item) => (
                            <tr key={item.user}>
                              <td className="px-3 py-2">{item.user}</td>
                              <td className="px-3 py-2">{item.total}</td>
                              <td className="px-3 py-2">{formatPercentage(item.share)}</td>
                              <td className="px-3 py-2">{item.peak}</td>
                              <td className="px-3 py-2">
                                {item.indicator ? (
                                  <span className="text-xs font-semibold px-2 py-1 rounded-full jqs-glass">
                                    {item.indicator}
                                  </span>
                                ) : (
                                  <span className="text-xs opacity-70">In line with average</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="md:hidden space-y-3">
                      {bookingUserBreakdown.breakdown.map((item) => (
                        <div key={item.user} className="jqs-glass rounded-2xl p-3 text-sm">
                          <div className="font-semibold">{item.user}</div>
                          <div className="mt-2 space-y-1">
                            <p>
                              <strong>Total bookings:</strong> {item.total} (
                              {formatPercentage(item.share)})
                            </p>
                            <p>
                              <strong>Peak-time bookings:</strong> {item.peak}
                            </p>
                            <div className="pt-1">
                              <span className="text-xs font-semibold px-2 py-1 rounded-full jqs-glass">
                                {item.indicator ?? 'In line with average'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="jqs-glass rounded-2xl p-4">
                <h3 className="text-sm font-semibold">Peak vs off-peak usage</h3>
                <p className="text-xs opacity-75 mt-1">
                  Peak time is defined as 5pm–8:30pm, matching the booking system&apos;s fair-use
                  logic.
                </p>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <StatPill
                    label="Peak bookings"
                    value={`${peakOffPeakStats.peakBookings} (${formatPercentage(
                      peakOffPeakStats.peakPercentage
                    )})`}
                  />
                  <StatPill
                    label="Off-peak bookings"
                    value={`${peakOffPeakStats.offPeakBookings} (${formatPercentage(
                      peakOffPeakStats.offPeakPercentage
                    )})`}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="jqs-glass rounded-2xl p-4">
                <h3 className="text-sm font-semibold mb-3">Busiest time slots</h3>
                {timeSlotBreakdown.breakdown.length === 0 ? (
                  <div className="text-sm opacity-80">No time slots to display yet.</div>
                ) : (
                  <>
                    <div className="hidden md:block overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="text-left">
                            {['Time', 'Bookings'].map((h) => (
                              <th
                                key={h}
                                className="px-3 py-2 border-b border-[color:var(--glass-border)]"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {timeSlotBreakdown.breakdown.map((item) => (
                            <tr
                              key={item.time}
                              className={
                                timeSlotBreakdown.topTimes.has(item.time)
                                  ? 'bg-amber-500/10'
                                  : undefined
                              }
                            >
                              <td className="px-3 py-2 font-medium">{item.time}</td>
                              <td className="px-3 py-2">{item.total}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="md:hidden space-y-3">
                      {timeSlotBreakdown.breakdown.map((item) => {
                        const maxCount = timeSlotBreakdown.breakdown[0]?.total ?? 0;
                        const width = maxCount ? Math.round((item.total / maxCount) * 100) : 0;
                        return (
                          <div key={item.time} className="text-sm">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{item.time}</span>
                              <span className="opacity-70">{item.total} bookings</span>
                            </div>
                            <div className="mt-2 h-2 rounded-full bg-slate-200/40 overflow-hidden">
                              <div
                                className={`h-full ${
                                  timeSlotBreakdown.topTimes.has(item.time)
                                    ? 'bg-amber-500'
                                    : 'bg-slate-500'
                                }`}
                                style={{ width: `${width}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              <div className="jqs-glass rounded-2xl p-4">
                <h3 className="text-sm font-semibold mb-3">Facility usage comparison</h3>
                {facilityUsage.length === 0 ? (
                  <div className="text-sm opacity-80">No facility usage data available.</div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {facilityUsage.map((facility) => (
                      <div key={facility.facility} className="jqs-glass rounded-2xl p-3 text-sm">
                        <div className="text-base font-semibold">{facility.facility}</div>
                        <div className="mt-2 space-y-1">
                          <p>
                            <strong>Total bookings:</strong> {facility.total} (
                            {formatPercentage(facility.share)})
                          </p>
                          <p>
                            <strong>Peak-time bookings:</strong> {facility.peak}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            </div>
          </Section>
        )}

        {/* Booking Activities */}
        {activeTab === 'system' && (
          <Section
            title="Recent Booking Activities"
            subtitle="Newest first"
            count={filteredBookings.length}
          >
            {filteredBookings.length === 0 ? (
              <div className="jqs-glass rounded-xl p-3">No booking activities found.</div>
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="text-xs opacity-70">
                    Showing {filteredBookings.length} of {nonAdminBookings.length} bookings.
                  </div>
                  <div className="flex items-center gap-2 md:hidden">
                    <button
                      type="button"
                      onClick={() => setBookingViewMode('chronological')}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                        bookingViewMode === 'chronological'
                          ? 'bg-indigo-600 text-white shadow'
                          : 'jqs-glass hover:brightness-[1.05]'
                      }`}
                    >
                      Chronological
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingViewMode('grouped')}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                        bookingViewMode === 'grouped'
                          ? 'bg-indigo-600 text-white shadow'
                          : 'jqs-glass hover:brightness-[1.05]'
                      }`}
                    >
                      Grouped by user
                    </button>
                  </div>
                </div>
                <div className="hidden md:block overflow-x-auto jqs-glass rounded-2xl">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left">
                        {['Facility', 'Time', 'User', 'Date', 'Timestamp'].map((h) => (
                          <th key={h} className="px-3 py-2 border-b border-[color:var(--glass-border)]">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map((b) => (
                        <tr key={b.id}>
                          <td className="px-3 py-2">{b.facility}</td>
                          <td className="px-3 py-2">{b.time}</td>
                          <td className="px-3 py-2">{b.user}</td>
                          <td className="px-3 py-2">{b.date}</td>
                          <td className="px-3 py-2">
                            {b.timestamp instanceof Date
                              ? b.timestamp.toLocaleString()
                              : new Date(b.timestamp).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="md:hidden space-y-4">
                  {bookingViewMode === 'chronological' ? (
                    mobileBookingGroups.map((group, index) => (
                      <div key={`${group.user}-${index}`} className="jqs-glass rounded-2xl p-3">
                        <div className="text-sm font-semibold">{group.user}</div>
                        <div className="mt-2 space-y-2">
                          {group.entries.map((booking) => (
                            <div key={booking.id} className="text-sm">
                              <div className="font-medium">{booking.facility}</div>
                              <div className="text-xs opacity-80">
                                {booking.date} · {booking.time}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    groupedBookingsByUser.map((group) => (
                      <div key={group.user} className="jqs-glass rounded-2xl p-3">
                        <div className="text-sm font-semibold">{group.user}</div>
                        <div className="text-xs opacity-80">
                          {group.total} bookings
                        </div>
                        <div className="mt-2 space-y-2">
                          {group.entries.map((booking) => (
                            <div key={booking.id} className="text-sm">
                              <div className="font-medium">{booking.facility}</div>
                              <div className="text-xs opacity-80">
                                {booking.date} · {booking.time}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </Section>
        )}

        {/* Booking Statistics */}
        {activeTab === 'system' && (
          <Section
            title="Booking Statistics"
            subtitle="Quick totals by facility"
          >
            {Object.keys(bookingStats).length === 0 ? (
              <div className="jqs-glass rounded-xl p-3">No booking data available.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(bookingStats).map(([facility, count]) => (
                  <div key={facility} className="jqs-glass p-4 rounded-2xl">
                    <h3 className="text-lg font-semibold">{facility}</h3>
                    <p className="opacity-80">{count} bookings</p>
                  </div>
                ))}
              </div>
            )}
          </Section>
        )}

        {/* Activity Logs */}
        {activeTab === 'system' && (
          <Section
            title="Activity Logs"
            subtitle="Admin actions recorded by the system"
            count={activityLogs.length}
          >
            {activityLogs.length === 0 ? (
              <div className="jqs-glass rounded-xl p-3">No activity logs found.</div>
            ) : (
              <div className="overflow-x-auto jqs-glass rounded-2xl">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left">
                      {['Action', 'Admin', 'Timestamp'].map((h) => (
                        <th key={h} className="px-3 py-2 border-b border-[color:var(--glass-border)]">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activityLogs.map((log) => (
                      <tr key={log.id}>
                        <td className="px-3 py-2">{log.action}</td>
                        <td className="px-3 py-2">{log.admin}</td>
                        <td className="px-3 py-2">
                          {log.timestamp instanceof Date
                            ? log.timestamp.toLocaleString()
                            : new Date(log.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>
        )}

        {/* Facility Management */}
        {activeTab === 'system' && (
          <Section
            title="Facility Management"
            subtitle="Notice and rules displayed to users"
            defaultOpen
          >
            <div className="grid gap-4">
              <div className="jqs-glass rounded-2xl p-4">
                <label className="block font-medium mb-1">Custom Notice:</label>
                <textarea
                  value={customNotice}
                  onChange={(e) => setCustomNotice(e.target.value)}
                  rows={3}
                  className="w-full border rounded p-2 bg-transparent"
                />
              </div>
              <div className="jqs-glass rounded-2xl p-4">
                <label className="block font-medium mb-1">Facility Rules:</label>
                <textarea
                  value={facilityRules}
                  onChange={(e) => setFacilityRules(e.target.value)}
                  rows={3}
                  className="w-full border rounded p-2 bg-transparent"
                />
              </div>
              <div>
                <button
                  onClick={updateFacilityConfig}
                  className="px-4 py-2 rounded-full jqs-glass font-semibold hover:brightness-[1.05] transition"
                >
                  Update Facility Info
                </button>
              </div>
            </div>
          </Section>
        )}

        {/* Technical Tools */}
        {(activeTab === 'comms' || activeTab === 'system') && (
          <Section
            title="Technical Tools"
            subtitle="Debug and data export"
          >
            <div className="flex flex-wrap gap-3 mb-4">
              <button
                onClick={toggleDebugMode}
                className="px-4 py-2 rounded-full jqs-glass font-semibold hover:brightness-[1.05] transition"
              >
                {debugMode ? 'Disable Debug Mode' : 'Enable Debug Mode'}
              </button>
              <button
                onClick={exportDataAsCSV}
                className="px-4 py-2 rounded-full jqs-glass font-semibold hover:brightness-[1.05] transition"
              >
                Export Data as CSV
              </button>
            </div>

            <div className="jqs-glass rounded-2xl p-4">
              <h3 className="text-lg font-semibold mb-2">Feedback Inbox</h3>
              {feedbacks.length === 0 ? (
                <div>No feedback found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left">
                        {['User', 'Message', 'Timestamp'].map((h) => (
                          <th key={h} className="px-3 py-2 border-b border-[color:var(--glass-border)]">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {feedbacks.map((fb) => (
                        <tr key={fb.id}>
                          <td className="px-3 py-2">{fb.user}</td>
                          <td className="px-3 py-2">{fb.message}</td>
                          <td className="px-3 py-2">
                            {fb.timestamp instanceof Date
                              ? fb.timestamp.toLocaleString()
                              : new Date(fb.timestamp).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {debugMode && (
              <div className="jqs-glass rounded-2xl p-4 mt-4">
                <h3 className="text-lg font-semibold mb-2">Debug Information</h3>
                <pre className="text-xs overflow-auto">
                  {JSON.stringify({ users, bookings, activityLogs, feedbacks }, null, 2)}
                </pre>
              </div>
            )}
          </Section>
        )}

        {/* Danger Zone */}
        {activeTab === 'system' && (
          <Section
            title="Danger Zone"
            subtitle="Irreversible system actions — use with caution"
          >
            <div className="jqs-glass p-4 rounded-2xl">
              <p className="text-sm opacity-90 mb-3">
                Clicking the button below will <strong>delete all existing facility bookings</strong> from the system.
                This action is <strong>permanent and cannot be undone</strong>.
              </p>
              <button
                aria-label="Reset all facility bookings permanently"
                onClick={resetBookings}
                className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition font-semibold shadow"
              >
                Reset All Bookings
              </button>
            </div>
          </Section>
        )}
      </div>
    </main>
  );
}
