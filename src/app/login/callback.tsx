'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';

export default function LoginCallback() {
  const router = useRouter();

  useEffect(() => {
    const completeSignIn = async () => {
      if (typeof window === 'undefined') return;

      const email = window.localStorage.getItem('emailForSignIn');

      if (!email) {
        alert('Missing email for sign-in. Please start again.');
        router.push('/login');
        return;
      }

      try {
        const auth = getAuth();
        if (isSignInWithEmailLink(auth, window.location.href)) {
          await signInWithEmailLink(auth, email, window.location.href);
          window.localStorage.removeItem('emailForSignIn');
          window.localStorage.removeItem('nameForSignIn');
          window.localStorage.removeItem('buildingForSignIn');
          window.localStorage.removeItem('flatForSignIn');
          // Redirect to dashboard after successful email sign in.
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error signing in with email link:', error);
        alert('Sign-in failed. Please try again.');
        router.push('/login');
      }
    };

    completeSignIn();
  }, [router]);

  return (
    <main className="text-center mt-32">
      <p className="text-lg text-gray-700">Completing your sign-in...</p>
    </main>
  );
}