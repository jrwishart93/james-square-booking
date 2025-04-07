'use client';

import React, { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, orderBy, query, doc, getDoc } from 'firebase/firestore';

interface UserRegistration {
  id: string;
  email: string;
  fullName: string;
  building: string;
  flat: string;
  createdAt: string;
  isFlagged?: boolean;
}

interface BookingActivity {
  id: string;
  facility: string;
  time: string;
  user: string;
  date: string;
  timestamp: number | Date;
}

export default function AdminDashboard() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [users, setUsers] = useState<UserRegistration[]>([]);
  const [bookings, setBookings] = useState<BookingActivity[]>([]);
  const [loading, setLoading] = useState(true);

  // Check auth status and if the user is admin
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
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

  // Fetch user registrations and booking activities if admin
  useEffect(() => {
    if (!isAdmin) return;

    const fetchUsers = async () => {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const userList: UserRegistration[] = [];
      snapshot.forEach((docSnap) => {
        userList.push({ id: docSnap.id, ...docSnap.data() } as UserRegistration);
      });
      setUsers(userList);
    };

    const fetchBookings = async () => {
      const q = query(collection(db, 'bookings'), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      const bookingList: BookingActivity[] = [];
      snapshot.forEach((docSnap) => {
        bookingList.push({ id: docSnap.id, ...docSnap.data() } as BookingActivity);
      });
      setBookings(bookingList);
    };

    fetchUsers();
    fetchBookings();
  }, [isAdmin]);

  if (loading) {
    return <div className="p-6 text-center">Loading admin dashboard...</div>;
  }

  if (!isAdmin) {
    return <div className="p-6 text-center text-red-600">Access denied. Admins only.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {/* User Registrations Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">User Registrations</h2>
        {users.length === 0 ? (
          <p>No user registrations found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Full Name</th>
                  <th className="border px-4 py-2">Building</th>
                  <th className="border px-4 py-2">Flat</th>
                  <th className="border px-4 py-2">Registered At</th>
                  <th className="border px-4 py-2">Flagged</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="border px-4 py-2">{user.email}</td>
                    <td className="border px-4 py-2">{user.fullName}</td>
                    <td className="border px-4 py-2">{user.building}</td>
                    <td className="border px-4 py-2">{user.flat}</td>
                    <td className="border px-4 py-2">{new Date(user.createdAt).toLocaleString()}</td>
                    <td className="border px-4 py-2">{user.isFlagged ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Booking Activities Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">Recent Booking Activities</h2>
        {bookings.length === 0 ? (
          <p>No booking activities found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Facility</th>
                  <th className="border px-4 py-2">Time</th>
                  <th className="border px-4 py-2">User</th>
                  <th className="border px-4 py-2">Date</th>
                  <th className="border px-4 py-2">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="border px-4 py-2">{booking.facility}</td>
                    <td className="border px-4 py-2">{booking.time}</td>
                    <td className="border px-4 py-2">{booking.user}</td>
                    <td className="border px-4 py-2">{booking.date}</td>
                    <td className="border px-4 py-2">
                      {booking.timestamp instanceof Date
                        ? booking.timestamp.toLocaleString()
                        : new Date(booking.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
