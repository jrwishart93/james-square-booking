'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc, collection, getDocs, deleteDoc } from 'firebase/firestore';

export default function AdminResetPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userDocRef);
        const userData = userSnap.data();
        if (userData?.isAdmin) {
          setIsAdmin(true);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleReset = async () => {
    const confirmed = confirm('Are you sure you want to delete ALL bookings? This cannot be undone.');
    if (!confirmed) return;

    try {
      const snapshot = await getDocs(collection(db, 'bookings'));
      const deletions = snapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletions);
      alert('✅ All bookings have been cleared.');
    } catch (error) {
      console.error('Error resetting bookings:', error);
      alert('❌ Failed to reset bookings. Check console for details.');
    }
  };

  if (loading) return <p className="p-6 text-center">Checking admin status…</p>;
  if (!isAdmin) return <p className="p-6 text-center text-red-600">Access denied. Admins only.</p>;

  return (
    <main className="max-w-xl mx-auto py-20 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin – Reset Bookings</h1>
      <p className="text-center mb-4 text-gray-600">
        This will delete <strong>all bookings</strong> from the system.
      </p>
      <div className="text-center">
        <button
          onClick={handleReset}
          className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition font-semibold shadow-md"
        >
          Reset All Bookings
        </button>
      </div>
    </main>
  );
}