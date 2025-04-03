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
        const auth = getAuth(); // Initialize auth using getAuth
        if (isSignInWithEmailLink(auth, window.location.href)) {
          await signInWithEmailLink(auth, email, window.location.href);
          window.localStorage.removeItem('emailForSignIn');
          window.localStorage.removeItem('nameForSignIn');
          window.localStorage.removeItem('buildingForSignIn');
          window.localStorage.removeItem('flatForSignIn');
          router.push('/success');
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
