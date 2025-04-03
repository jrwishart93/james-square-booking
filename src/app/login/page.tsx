'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    // If user comes back with email link
    if (typeof window !== 'undefined' && isSignInWithEmailLink(auth, window.location.href)) {
      const savedEmail = window.localStorage.getItem('emailForSignIn');
      if (savedEmail) {
        setIsSigningIn(true);
        signInWithEmailLink(auth, savedEmail, window.location.href)
          .then(() => {
            setMessage('You are now signed in!');
            window.localStorage.removeItem('emailForSignIn');
          })
          .catch((error) => {
            console.error('Error signing in with email link:', error);
            setMessage('Error signing in. Please try again.');
          })
          .finally(() => setIsSigningIn(false));
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const actionCodeSettings = {
      url: window.location.origin + '/login',
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      setMessage('Check your inbox for a sign-in link.');
    } catch (error) {
      console.error(error);
      setMessage('Error sending sign-in email.');
    }
  };

  return (
    <main className="max-w-md mx-auto mt-20 p-6 bg-white dark:bg-gray-900 rounded-lg shadow text-center">
      <h1 className="text-2xl font-bold mb-6">Sign In</h1>

      {isSigningIn ? (
        <p className="text-gray-600 dark:text-gray-300">Signing you in...</p>
      ) : (
        <>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
            >
              Send Sign-In Link
            </button>
          </form>
          {message && <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">{message}</p>}
        </>
      )}
    </main>
  );
}
