'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';

function resolveRedirectTarget(from: string | null): string {
  if (!from || !from.startsWith('/')) return '/dashboard';
  if (from.startsWith('//')) return '/dashboard';
  return from;
}

async function createServerSession(idToken: string) {
  const response = await fetch('/api/auth/session-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    throw new Error('Failed to establish server session.');
  }
}

export default function LoginCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = resolveRedirectTarget(searchParams.get('from'));

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
            const credential = await signInWithEmailLink(auth, email, window.location.href);
            const idToken = await credential.user.getIdToken(true);
            await createServerSession(idToken);
            window.localStorage.removeItem('emailForSignIn');
            window.localStorage.removeItem('nameForSignIn');
            window.localStorage.removeItem('buildingForSignIn');
            window.localStorage.removeItem('flatForSignIn');
            router.push(redirectTarget);
          }
      } catch (error) {
        console.error('Error signing in with email link:', error);
        alert('Sign-in failed. Please try again.');
        router.push('/login');
      }
    };

    completeSignIn();
  }, [redirectTarget, router]);

  return (
    <main className="text-center mt-32">
      <p className="text-lg text-gray-700">Completing your sign-in...</p>
    </main>
  );
}
