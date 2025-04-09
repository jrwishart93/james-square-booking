'use client';

import React, { useEffect, useState, ChangeEvent } from 'react';
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
} from 'firebase/firestore';

interface UserRegistration {
  id: string;
  email: string;
  fullName: string;
  username: string;
  property: string;
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
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [users, setUsers] = useState<UserRegistration[]>([]);
  const [bookings, setBookings] = useState<BookingActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<UserRegistration | null>(null);

  // Check auth status and if the current user is an admin.
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

  // Fetch user registrations and booking activities if admin.
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

  // Handler for editing user details.
  const startEditing = (user: UserRegistration) => {
    setEditingUser({ ...user });
  };

  // Cancel editing handler.
  const cancelEditing = () => {
    setEditingUser(null);
  };

  const handleEditChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (editingUser) {
      setEditingUser({
        ...editingUser,
        [e.target.name]: e.target.value,
      });
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
      // Update local state.
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editingUser.id ? { ...user, ...editingUser } : user
        )
      );
      setEditingUser(null);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  // Handler to remove a user.
  const removeUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to remove this user?')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  // NEW: Reset All Bookings Handler.
  const resetBookings = async () => {
    if (
      window.confirm(
        'Are you sure you want to reset all bookings? This action cannot be undone.'
      )
    ) {
      try {
        const bookingsCollectionRef = collection(db, 'bookings');
        const snapshot = await getDocs(bookingsCollectionRef);
        const deletePromises = snapshot.docs.map((docSnap) =>
          deleteDoc(docSnap.ref)
        );
        await Promise.all(deletePromises);
        // Reset local bookings state to an empty array.
        setBookings([]);
        alert('All bookings have been reset.');
      } catch (error) {
        console.error('Failed to reset bookings:', error);
        alert('Failed to reset bookings. Please try again later.');
      }
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading admin dashboard...</div>;
  }

  if (!isAdmin) {
    return <div className="p-6 text-center text-red-600">Access denied. Admins only.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {/* RESET BOOKINGS BUTTON */}
      {/* Use proper JSX comment syntax */}
      {/* Reset All Bookings Button */}
      <button
        onClick={resetBookings}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mb-6"
      >
        Reset All Bookings
      </button>

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
                  <th className="border px-4 py-2">Username</th>
                  <th className="border px-4 py-2">Property</th>
                  <th className="border px-4 py-2">Registered At</th>
                  <th className="border px-4 py-2">Flagged</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) =>
                  editingUser && editingUser.id === user.id ? (
                    <tr key={user.id}>
                      <td className="border px-4 py-2">{user.email}</td>
                      <td className="border px-4 py-2">
                        <input
                          type="text"
                          name="fullName"
                          value={editingUser.fullName || ''}
                          onChange={handleEditChange}
                          className="w-full border rounded px-2 py-1"
                        />
                      </td>
                      <td className="border px-4 py-2">
                        <input
                          type="text"
                          name="username"
                          value={editingUser.username || ''}
                          onChange={handleEditChange}
                          className="w-full border rounded px-2 py-1"
                        />
                      </td>
                      <td className="border px-4 py-2">
                        <input
                          type="text"
                          name="property"
                          value={editingUser.property || ''}
                          onChange={handleEditChange}
                          className="w-full border rounded px-2 py-1"
                        />
                      </td>
                      <td className="border px-4 py-2">
                        {new Date(user.createdAt).toLocaleString()}
                      </td>
                      <td className="border px-4 py-2">
                        {user.isFlagged ? 'Yes' : 'No'}
                      </td>
                      <td className="border px-4 py-2 space-x-2">
                        <button
                          onClick={saveEdits}
                          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => removeUser(user.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={user.id}>
                      <td className="border px-4 py-2">{user.email}</td>
                      <td className="border px-4 py-2">{user.fullName}</td>
                      <td className="border px-4 py-2">{user.username}</td>
                      <td className="border px-4 py-2">{user.property}</td>
                      <td className="border px-4 py-2">
                        {new Date(user.createdAt).toLocaleString()}
                      </td>
                      <td className="border px-4 py-2">{user.isFlagged ? 'Yes' : 'No'}</td>
                      <td className="border px-4 py-2 space-x-2">
                        <button
                          onClick={() => startEditing(user)}
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeUser(user.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  )
                )}
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