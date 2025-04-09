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
  setDoc,
  addDoc,
} from 'firebase/firestore';

interface UserRegistration {
  id: string;
  email: string;
  fullName: string;
  username: string;
  property: string;
  createdAt: string;
  isFlagged?: boolean;
  isAdmin?: boolean;
  disabled?: boolean;
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

export default function AdminDashboard() {
  // Admin authentication states.
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Data states.
  const [users, setUsers] = useState<UserRegistration[]>([]);
  const [bookings, setBookings] = useState<BookingActivity[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  // UI states.
  const [editingUser, setEditingUser] = useState<UserRegistration | null>(null);
  const [customNotice, setCustomNotice] = useState<string>('');
  const [facilityRules, setFacilityRules] = useState<string>('');
  const [debugMode, setDebugMode] = useState<boolean>(false);
  
  // Communication form state.
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [emailMessage, setEmailMessage] = useState<string>('');

  // Check authentication status and verify admin role.
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

  // Fetch users, bookings, logs, feedback, and facility configurations if the viewer is an admin.
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

    const fetchActivityLogs = async () => {
      const q = query(collection(db, 'activityLogs'), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      const logs: ActivityLog[] = [];
      snapshot.forEach((docSnap) => {
        logs.push({ id: docSnap.id, ...docSnap.data() } as ActivityLog);
      });
      setActivityLogs(logs);
    };

    const fetchFeedbacks = async () => {
      const q = query(collection(db, 'feedback'), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      const feedbackList: Feedback[] = [];
      snapshot.forEach((docSnap) => {
        feedbackList.push({ id: docSnap.id, ...docSnap.data() } as Feedback);
      });
      setFeedbacks(feedbackList);
    };

    // Optionally load facility configuration (notice and rules).
    const fetchFacilityConfig = async () => {
      const configDocRef = doc(db, 'siteConfigs', 'facilityInfo');
      const docSnap = await getDoc(configDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCustomNotice(data.customNotice || '');
        setFacilityRules(data.facilityRules || '');
      }
    };

    fetchUsers();
    fetchBookings();
    fetchActivityLogs();
    fetchFeedbacks();
    fetchFacilityConfig();
  }, [isAdmin]);

  // -----------------
  // User Editing and Controls
  // -----------------
  const startEditing = (user: UserRegistration) => {
    setEditingUser({ ...user });
  };

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

  // Toggle user admin status.
  const toggleAdminStatus = async (user: UserRegistration) => {
    const newStatus = !user.isAdmin;
    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, { isAdmin: newStatus });
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === user.id ? { ...u, isAdmin: newStatus } : u))
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

  // Toggle user disabled status.
  const toggleDisabledStatus = async (user: UserRegistration) => {
    const newStatus = !user.disabled;
    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, { disabled: newStatus });
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === user.id ? { ...u, disabled: newStatus } : u))
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

  // -----------------
  // Booking and Logs Controls
  // -----------------
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

  // -----------------
  // Facility Management
  // -----------------
  const updateFacilityConfig = async () => {
    try {
      const configDocRef = doc(db, 'siteConfigs', 'facilityInfo');
      await setDoc(
        configDocRef,
        {
          customNotice,
          facilityRules,
        },
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

  // -----------------
  // Communication Tools
  // -----------------
  const sendEmailToUsers = async () => {
    // In production, you would integrate an email service.
    console.log('Sending email with subject:', emailSubject, 'and message:', emailMessage);
    alert('Email sent (mock implementation).');
    await addDoc(collection(db, 'activityLogs'), {
      action: 'Sent email to users',
      admin: auth.currentUser?.email || 'unknown',
      timestamp: new Date(),
    });
    setEmailSubject('');
    setEmailMessage('');
  };

  // -----------------
  // Technical Tools
  // -----------------
  const exportDataAsCSV = () => {
    const convertToCSV = (data: any[]) => {
      const array = [Object.keys(data[0])].concat(data.map(item => Object.values(item)));
      return array.map(row => row.join(',')).join('\n');
    };

    let csvContent = '';

    if (users.length > 0) {
      csvContent += 'Users:\n' + convertToCSV(users) + '\n\n';
    }
    if (bookings.length > 0) {
      csvContent += 'Bookings:\n' + convertToCSV(bookings) + '\n\n';
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

  const toggleDebugMode = () => {
    setDebugMode((prev) => !prev);
  };

  // Compute facility booking statistics.
  const bookingStats = bookings.reduce((stats: { [key: string]: number }, booking) => {
    stats[booking.facility] = (stats[booking.facility] || 0) + 1;
    return stats;
  }, {});

  if (loading) {
    return <div className="p-6 text-center">Loading admin dashboard...</div>;
  }

  if (!isAdmin) {
    return <div className="p-6 text-center text-red-600">Access denied. Admins only.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Booking System Controls */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={resetBookings}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Reset All Bookings
        </button>
      </div>

      <hr />

      {/* User Registrations & Controls */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">User Registrations</h2>
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
                  <th className="border px-4 py-2">Admin</th>
                  <th className="border px-4 py-2">Disabled</th>
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
                      <td className="border px-4 py-2">{user.isFlagged ? 'Yes' : 'No'}</td>
                      <td className="border px-4 py-2">{user.isAdmin ? 'Yes' : 'No'}</td>
                      <td className="border px-4 py-2">{user.disabled ? 'Yes' : 'No'}</td>
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
                      <td className="border px-4 py-2">{user.isAdmin ? 'Yes' : 'No'}</td>
                      <td className="border px-4 py-2">{user.disabled ? 'Yes' : 'No'}</td>
                      <td className="border px-4 py-2 space-x-2">
                        <button
                          onClick={() => startEditing(user)}
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => toggleAdminStatus(user)}
                          className="bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600"
                        >
                          {user.isAdmin ? 'Revoke Admin' : 'Promote to Admin'}
                        </button>
                        <button
                          onClick={() => toggleDisabledStatus(user)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                        >
                          {user.disabled ? 'Enable Account' : 'Disable Account'}
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

      <hr />

      {/* Booking Activities */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Recent Booking Activities</h2>
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

      <hr />

      {/* Booking Statistics */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Booking Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(bookingStats).map(([facility, count]) => (
            <div key={facility} className="border p-4 rounded">
              <h3 className="text-xl font-bold">{facility}</h3>
              <p>{count} bookings</p>
            </div>
          ))}
        </div>
      </section>

      <hr />

      {/* Activity Logs */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Activity Logs</h2>
        {activityLogs.length === 0 ? (
          <p>No activity logs found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Action</th>
                  <th className="border px-4 py-2">Admin</th>
                  <th className="border px-4 py-2">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {activityLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="border px-4 py-2">{log.action}</td>
                    <td className="border px-4 py-2">{log.admin}</td>
                    <td className="border px-4 py-2">
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
      </section>

      <hr />

      {/* Facility Management */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Facility Management</h2>
        <div className="mb-4">
          <label className="block font-medium mb-1">Custom Notice:</label>
          <textarea
            value={customNotice}
            onChange={(e) => setCustomNotice(e.target.value)}
            className="w-full border rounded p-2"
            rows={3}
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Facility Rules:</label>
          <textarea
            value={facilityRules}
            onChange={(e) => setFacilityRules(e.target.value)}
            className="w-full border rounded p-2"
            rows={3}
          ></textarea>
        </div>
        <button
          onClick={updateFacilityConfig}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Update Facility Info
        </button>
      </section>

      <hr />

      {/* Communication Tools */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Communication Tools</h2>
        <div className="mb-4">
          <label className="block font-medium mb-1">Email Subject:</label>
          <input
            type="text"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Email Message:</label>
          <textarea
            value={emailMessage}
            onChange={(e) => setEmailMessage(e.target.value)}
            className="w-full border rounded px-2 py-1"
            rows={3}
          ></textarea>
        </div>
        <button
          onClick={sendEmailToUsers}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send Email to Users
        </button>
      </section>

      <hr />

      {/* Technical Tools */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Technical Tools</h2>
        <div className="flex flex-wrap gap-4 mb-4">
          <button
            onClick={toggleDebugMode}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            {debugMode ? 'Disable Debug Mode' : 'Enable Debug Mode'}
          </button>
          <button
            onClick={exportDataAsCSV}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Export Data as CSV
          </button>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">Feedback Inbox</h3>
          {feedbacks.length === 0 ? (
            <p>No feedback found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">User</th>
                    <th className="border px-4 py-2">Message</th>
                    <th className="border px-4 py-2">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbacks.map((fb) => (
                    <tr key={fb.id}>
                      <td className="border px-4 py-2">{fb.user}</td>
                      <td className="border px-4 py-2">{fb.message}</td>
                      <td className="border px-4 py-2">
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
      </section>

      {debugMode && (
        <section className="bg-gray-100 p-4 rounded">
          <h2 className="text-2xl font-semibold mb-4">Debug Information</h2>
          <pre>{JSON.stringify({ users, bookings, activityLogs, feedbacks }, null, 2)}</pre>
        </section>
      )}
    </div>
  );
}