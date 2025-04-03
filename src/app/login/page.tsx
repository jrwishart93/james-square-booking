'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [building, setBuilding] = useState('');
  const [flat, setFlat] = useState('');
  const [message, setMessage] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFullName(data.fullName || '');
          setBuilding(data.building || '');
          setFlat(data.flat || '');
        }
        setEmail(user.email || '');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      if (isRegistering) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          fullName,
          building,
          flat,
          createdAt: new Date().toISOString(),
        });

        setIsRedirecting(true);
        window.location.href = '/book/schedule';
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setIsRedirecting(true);
        window.location.href = '/book/schedule';
      }
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        setIsRegistering(true);
        setMessage('No account found. Switching to registration.');
      } else {
        console.error(error);
        setMessage(error.message || 'Something went wrong. Please try again.');
      }
    }
  };

  if (isRedirecting) {
    return (
      <main className="flex items-center justify-center h-screen text-center">
        <div>
          <div className="animate-spin h-10 w-10 border-4 border-black border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-lg text-gray-800 dark:text-gray-200">Signing you in...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto mt-20 p-6 bg-white dark:bg-gray-900 rounded-lg shadow text-center">
      <h1 className="text-2xl font-bold mb-6">{isRegistering ? 'Register' : 'Sign In'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {isRegistering && (
          <>
            <input
              type="text"
              placeholder="Full name"
              className="w-full px-4 py-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-white"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Building"
              className="w-full px-4 py-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-white"
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Flat"
              className="w-full px-4 py-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-white"
              value={flat}
              onChange={(e) => setFlat(e.target.value)}
              required
            />
          </>
        )}

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          {isRegistering ? 'Create Account' : 'Log In'}
        </button>
      </form>

      <button
        onClick={() => setIsRegistering(!isRegistering)}
        className="mt-4 text-sm text-blue-600 underline"
      >
        {isRegistering ? 'Already have an account? Log in' : 'New here? Register'}
      </button>

      {message && <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">{message}</p>}
    </main>
  );
}
