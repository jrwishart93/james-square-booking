'use client';

import { generateViewport } from 'next/metadata';

export const metadata = {
  title: 'Account',
  description: 'Manage your account details',
};

export const viewport = generateViewport({
  width: 'device-width',
  initialScale: 1,
});

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// Define the Profile type
interface Profile {
  fullName: string;
  email: string;
  building: string;
  flat: string;
}

export default function AccountPage() {
  // Replace any with the Profile type (or null if no profile is found)
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          // Here, we're assuming the data conforms to the Profile interface.
          setProfile(docSnap.data() as Profile);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <main className="text-center mt-20">Loading your account...</main>;
  }

  if (!profile) {
    return <main className="text-center mt-20">No profile found.</main>;
  }

  return (
    <main className="max-w-lg mx-auto mt-20 p-6 bg-white dark:bg-gray-900 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">My Account</h1>
      <div className="space-y-3">
        <p><strong>Full Name:</strong> {profile.fullName}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Building:</strong> {profile.building}</p>
        <p><strong>Flat:</strong> {profile.flat}</p>
      </div>
    </main>
  );
}
