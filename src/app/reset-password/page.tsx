'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sendPasswordResetEmail } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import PageContainer from '@/components/layout/PageContainer';

export default function ResetPasswordPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState(''); // email or username
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const resolveEmail = async (id: string): Promise<string | null> => {
    // If it looks like an email, validate its format
    if (id.includes('@')) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(id)) {
        throw new Error('invalid-email-format');
      }
      return id;
    }
    // Otherwise treat as username and look up
    const q = query(
      collection(db, 'users'),
      where('username', '==', id.toLowerCase())
    );
    const snap = await getDocs(q);
    return snap.empty ? null : (snap.docs[0].data().email as string);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const id = identifier.trim();
    if (!id) {
      setError('Please enter your email or username.');
      return;
    }

    setLoading(true);
    try {
      const email = await resolveEmail(id);
      if (!email) {
        setError('We could not find an account with that username.');
        return;
      }

      await sendPasswordResetEmail(auth, email);
      setMessage(
        'If an account exists, a password‑reset email has been sent. Please check your inbox.'
      );
      setTimeout(() => router.push('/login'), 5000);

    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'invalid-email-format') {
        setError('That doesn’t look like a valid email address.');
      } else if (err instanceof FirebaseError) {
        if (err.code === 'auth/invalid-email') {
          setError('Firebase: invalid email address.');
        } else {
          console.error(err);
          setError('Something went wrong. Please try again.');
        }
      } else {
        console.error(err);
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className="max-w-md mx-auto mt-20 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
          Reset Your Password
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Email or Username"
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-300"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            disabled={loading}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 dark:bg-blue-500 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Sending…' : 'Send Reset Email'}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-green-600 dark:text-green-400">
            {message}
          </p>
        )}
        {error && (
          <p className="mt-4 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        <button
          onClick={() => router.push('/login')}
          className="mt-6 text-sm text-blue-600 dark:text-blue-400 underline focus:outline-none"
        >
          Back to login
        </button>
      </div>
    </PageContainer>
  );
}
