'use client';

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

export default function AccountPageClient() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        (async () => {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data() as Profile);
          }
          setLoading(false);
        })();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="text-center mt-20">Loading your account...</div>;
  }

  if (!profile) {
    return <div className="text-center mt-20">No profile found.</div>;
  }

  return (
    <div className="max-w-lg mx-auto mt-20 p-6 bg-white dark:bg-gray-900 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">My Account</h1>
      <div className="space-y-3">
        <p><strong>Full Name:</strong> {profile.fullName}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Building:</strong> {profile.building}</p>
        <p><strong>Flat:</strong> {profile.flat}</p>
      </div>
    </div>
  );
}
