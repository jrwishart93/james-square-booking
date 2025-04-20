'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query, where, setDoc } from 'firebase/firestore';

export default function LoginPageClient() {
  // In registration mode we use separate inputs for email and username,
  // while login mode uses one field for email or username.
  const [identifier, setIdentifier] = useState(''); // For login: Email or Username
  const [password, setPassword] = useState('');

  // Registration fields:
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState(''); // For registration mode.
  const [email, setEmail] = useState(''); // For registration mode.
  const [property, setProperty] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [message, setMessage] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // List of property options
  const propertyOptions = [
    '39/1', '39/2', '39/3', '39/4', '39/5', '39/6', '39/7', '39/8', '39/9', '39/10',
    '39/11', '39/12', '39/13', '39/14', '39/15', '39B',
    '45/1', '45/2', '45/3', '45/4', '45/5', '45/6', '45/7', '45/8', '45/9', '45/10',
    '45/11', '45/12', '45/13', '45/14', '45/15', '45/16', '45/17', '45/18', '45/19',
    '51/1', '51/2', '51/3', '51/4', '51/5', '51/6', '51/7', '51/8', '51/9', '51/10',
    '51/11', '51/12', '51/13', '51/14', '51/15', '51/16', '51/17', '51/18', '51/19',
    '51/20', '51/21', '51/22', '51/23', '51/24', '51/25', '51/26', '51/27', '51/28', '51/29', '51/30', '51/31',
    '55/1', '55/2', '55/3', '55/4', '55/5', '55/6', '55/7', '55/8', '55/9', '55/10',
    '55/11', '55/12', '55/13', '55/14', '55/15',
    '57/1', '57/2', '57/3', '57/4', '57/5', '57/6',
    '59/1', '59/2', '59/3', '59/4', '59/5', '59/6',
    '61/1', '61/2', '61/3', '61/4', '61/5', '61/6', '61/7', '61/8',
    '65/1', '65/2'
  ];

  // On mount, load user data if already authenticated.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFullName(data.fullName || '');
          setUsername(data.username || '');
          setProperty(data.property || '');
          // Pre-fill login identifier with email.
          setIdentifier(user.email?.toLowerCase().trim() || '');
          // Also set registration email if available.
          setEmail(user.email?.toLowerCase().trim() || '');
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      if (isRegistering) {
        // Ensure terms are agreed.
        if (!agreedToTerms) {
          setMessage('You must agree to the facility rules and terms to register.');
          return;
        }
        // Registration: Create user with email and password, then store additional info.
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await setDoc(doc(db, 'users', user.uid), {
          email,
          username: username.toLowerCase().trim(),
          fullName,
          property,
          createdAt: new Date().toISOString(),
        });
        setMessage('Registration successful! Redirecting to dashboard...');
        setIsRedirecting(true);
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      } else {
        // Login: Treat identifier as email if it contains "@" otherwise as username.
        let loginEmail = identifier;
        if (!loginEmail.includes('@')) {
          const q = query(collection(db, 'users'), where('username', '==', loginEmail));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            loginEmail = querySnapshot.docs[0].data().email;
          } else {
            setMessage('No account found for that username.');
            return;
          }
        }
        await signInWithEmailAndPassword(auth, loginEmail, password);
        setIsRedirecting(true);
        window.location.href = '/dashboard';
      }
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      if (err.code === 'auth/user-not-found') {
        setIsRegistering(true);
        setMessage('No account found. Switching to registration.');
      } else {
        console.error(err);
        setMessage(err.message || 'Something went wrong. Please try again.');
      }
    }
  };

  if (isRedirecting) {
    return (
      <main className="flex items-center justify-center h-screen text-center">
        <div>
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-lg text-gray-800 dark:text-gray-200">Signing you in...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto mt-20 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
        {isRegistering ? 'Register' : 'Log In'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        {isRegistering ? (
          <>
            {/* Registration Mode: Separate inputs for email and username */}
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-300"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase().trim())}
              required
            />
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-300"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
              required
            />
          </>
        ) : (
          // Login Mode: One input for email or username.
          <input
            type="text"
            placeholder="Email or Username"
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-300"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value.toLowerCase().trim())}
            required
          />
        )}
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-300"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {isRegistering && (
          <>
            <input
              type="text"
              placeholder="Full name"
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-300"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            {/* Dropdown for property selection */}
            <select
              value={property}
              onChange={(e) => setProperty(e.target.value)}
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
              required
            >
              <option value="">Select Property</option>
              {propertyOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {/* Confirmation checkbox */}
            <label className="flex items-center mt-4">
              <input
                type="checkbox"
                className="mr-2"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                required
              />
              <span className="text-sm text-gray-900 dark:text-gray-100">
                I have read the facility rules and agree to the terms and conditions.
              </span>
            </label>
          </>
        )}
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 dark:bg-blue-500 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isRegistering ? 'Create Account' : 'Log In'}
        </button>
      </form>

      {!isRegistering && (
  <div className="mt-2 text-center">
    <Link
      href="/reset-password"
      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
    >
      Forgot your password?
    </Link>
  </div>
)}

      <button
        onClick={() => setIsRegistering(!isRegistering)}
        className="mt-4 text-sm text-blue-600 dark:text-blue-400 underline focus:outline-none"
      >
        {isRegistering ? 'Already have an account? Log in' : 'New here? Register'}
      </button>

      {message && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{message}</p>}
    </main>
  );
}