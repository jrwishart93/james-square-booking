'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

import { auth } from '@/lib/firebase';
import AdminEmailPanel from '../AdminEmailPanel';

type Status = 'idle' | 'checking' | 'denied';

export default function AdminEmailPage() {
  const [status, setStatus] = useState<Status>('checking');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setStatus('denied');
        return;
      }

      try {
        const tokenResult = await user.getIdTokenResult();
        if (tokenResult.claims.admin === true) {
          setStatus('idle');
        } else {
          setStatus('denied');
        }
      } catch (error) {
        console.error('Failed to verify admin claim', error);
        setStatus('denied');
      }
    });

    return () => unsubscribe();
  }, []);

  if (status === 'checking') {
    return (
      <main className="jqs-gradient-bg min-h-screen">
        <div className="max-w-4xl mx-auto p-6">
          <div className="jqs-glass rounded-2xl p-4">Checking admin access…</div>
        </div>
      </main>
    );
  }

  if (status === 'denied') {
    return (
      <main className="jqs-gradient-bg min-h-screen">
        <div className="max-w-4xl mx-auto p-6">
          <div className="jqs-glass rounded-2xl p-4 text-red-600 dark:text-red-400">
            Access denied. Admins only.
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="jqs-gradient-bg min-h-screen">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <header>
          <h1 className="text-3xl font-bold">Admin Email</h1>
          <p className="text-sm opacity-80 mt-1">
            Send announcements to James Square residents using the secure admin mailer.
          </p>
        </header>
        <AdminEmailPanel />
      </div>
    </main>
  );
}
