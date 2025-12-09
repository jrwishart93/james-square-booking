'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';

import { GlassCard } from '@/components/GlassCard';
import GradientBG from '@/components/GradientBG';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { verifyPasscode } from './actions';

const OwnersPage = () => {
  const { user, loading } = useAuth();
  type AccessState = 'checking' | 'notOwner' | 'owner';
  const [accessState, setAccessState] = useState<AccessState>('checking');
  const [ownerByClaim, setOwnerByClaim] = useState(false);
  const [ownerByRole, setOwnerByRole] = useState(false);
  const ownerByClaimRef = useRef(false);
  const [passcode, setPasscode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    if (!user) {
      setOwnerByClaim(false);
      setOwnerByRole(false);
      setAccessState('notOwner');
      return undefined;
    }

    setAccessState('checking');

    const evaluateAccess = async () => {
      try {
        const tokenResult = await user.getIdTokenResult(true);
        const byClaim = tokenResult.claims?.owner === true;
        const userSnap = await getDoc(doc(db, 'users', user.uid));
        const byRole = Boolean(userSnap.data()?.roles?.owner);

        if (!alive) return;

        setOwnerByClaim(byClaim);
        setOwnerByRole(byRole);
        setAccessState(byClaim || byRole ? 'owner' : 'notOwner');
      } catch (error) {
        console.error('Owners access check failed', error);
        if (alive) {
          setOwnerByClaim(false);
          setOwnerByRole(false);
          setAccessState('notOwner');
        }
      }
    };

    evaluateAccess();

    return () => {
      alive = false;
    };
  }, [user]);

  useEffect(() => {
    ownerByClaimRef.current = ownerByClaim;
  }, [ownerByClaim]);

  useEffect(() => {
    if (!user?.uid) {
      return undefined;
    }

    const ref = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(ref, (snap) => {
      const byRole = Boolean(snap.data()?.roles?.owner);
      setOwnerByRole(byRole);
      setAccessState((prev) => {
        if (ownerByClaimRef.current || byRole) {
          return 'owner';
        }
        return prev === 'checking' ? 'checking' : 'notOwner';
      });
    });

    return () => unsubscribe();
  }, [user?.uid]);

  useEffect(() => {
    setErrorMessage(null);
    setPasscode('');
  }, [user]);

  const handleUnlock = async (formData: FormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await verifyPasscode(formData);

      if (!result.ok) {
        setErrorMessage(result.error ?? 'Incorrect passcode.');
        return;
      }

      if (!user) {
        setErrorMessage('Please sign in first.');
        return;
      }

      await setDoc(
        doc(db, 'users', user.uid),
        { roles: { owner: true } },
        { merge: true },
      );

      await user.getIdToken(true);
      setOwnerByRole(true);
      setAccessState('owner');
      setPasscode('');
    } catch (error) {
      console.error('Failed to submit owners passcode', error);
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isOwner = ownerByClaim || ownerByRole;

  return (
    <GradientBG className="min-h-screen py-10">
      <div className="relative max-w-5xl mx-auto px-4 md:px-6 pt-10 md:pt-14 pb-12 space-y-10">
        <header className="space-y-3 text-center md:text-left">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-600/80 dark:text-slate-300/70">
            Resident Access
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white">
            Owners Area
          </h1>
          <p className="max-w-3xl text-sm md:text-base text-slate-600 dark:text-slate-300">
            A private space for James Square owners to access AGM resources, participate in votes,
            and collaborate on community discussions.
          </p>
        </header>

        {loading || accessState === 'checking' ? (
          <div className="grid gap-6 md:grid-cols-2">
            <GlassCard className="md:col-span-2" title="Checking access">
              <div className="space-y-4">
                <div className="h-3 rounded-full bg-gradient-to-r from-white/20 via-white/10 to-white/20 animate-pulse" />
                <div className="h-3 rounded-full bg-gradient-to-r from-white/15 via-white/8 to-white/15 animate-pulse" />
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Checking access… This usually takes just a moment.
                </p>
              </div>
            </GlassCard>
          </div>
        ) : isOwner && accessState === 'owner' ? (
          <div className="grid gap-6 md:grid-cols-2">
            <GlassCard
              title="AGM resources"
              subtitle="Download packs, notes, and archives from recent Annual General Meetings."
              footer="Updated ahead of each AGM."
            >
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/owners/agm/2025"
                  className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 bg-white/80 text-gray-900 hover:bg-white transition shadow-md backdrop-blur active:scale-[0.99] dark:bg-white/90"
                >
                  2025 AGM Hub
                </Link>
                <Link
                  href="/owners/agm/archive"
                  className="rounded-xl px-4 py-2.5 border border-white/20 text-white/90 hover:bg-white/5 transition"
                >
                  View archive
                </Link>
              </div>
            </GlassCard>

            <GlassCard
              title="Votes & decisions"
              subtitle="Review open ballots and stay informed on quorum progress."
              footer="Notifications also appear via email when new votes open."
            >
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/owners/votes"
                  className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 bg-white/80 text-gray-900 hover:bg-white transition shadow-md backdrop-blur active:scale-[0.99] dark:bg-white/90"
                >
                  View votes
                </Link>
              </div>
            </GlassCard>

            <GlassCard
              className="md:col-span-2"
              title="Owners discussions"
              subtitle="Share updates, ask questions, and coordinate with fellow owners."
              footer="Remember to keep conversations respectful and focused on the building."
            >
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/owners/discussions"
                  className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 bg-white/80 text-gray-900 hover:bg-white transition shadow-md backdrop-blur active:scale-[0.99] dark:bg-white/90"
                >
                  Enter discussions
                </Link>
              </div>
            </GlassCard>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <GlassCard
              title="Welcome, owners 👋"
              subtitle="Use the same six-digit passcode that was emailed by Pedrom on 2 September 2025 along with the AGM Zoom instructions."
              footer="Tip: search your inbox for “James Square AGM Zoom” or “Pedrom” to find the email."
            >
              <form
                onSubmit={async (event) => {
                  event.preventDefault();
                  const formData = new FormData(event.currentTarget);
                  await handleUnlock(formData);
                }}
                className="space-y-4"
                aria-busy={isSubmitting}
              >
                <div className="space-y-3">
                  <p className="text-sm text-slate-700 dark:text-slate-200">
                    Enter it below to unlock documents, votes, and discussions curated for the James
                    Square owners community. If you can’t remember the code, check your inbox for
                    Pedrom’s message titled “James Square AGM Zoom” sent on <strong>2 Sept 2025</strong>.
                  </p>
                  <label htmlFor="owners-passcode" className="block text-sm font-medium opacity-80">
                    Enter the Owners passcode
                  </label>
                  <input
                    id="owners-passcode"
                    name="passcode"
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="one-time-code"
                    value={passcode}
                    onChange={(event) => setPasscode(event.target.value)}
                    className="w-full rounded-xl bg-white/5 dark:bg-white/10 border border-white/20 dark:border-white/10 backdrop-blur px-4 py-3 text-base text-slate-900 dark:text-white shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-400/60 focus:border-transparent"
                    aria-invalid={errorMessage ? true : undefined}
                    aria-describedby="owners-passcode-help"
                    disabled={isSubmitting}
                  />
                  {errorMessage && <p className="text-sm text-red-400">{errorMessage}</p>}
                  <p id="owners-passcode-help" className="text-xs text-slate-600 dark:text-slate-400">
                    This is the same code from the AGM Zoom email. Keep it private.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 bg-white/80 text-gray-900 hover:bg-white transition shadow-md backdrop-blur active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white/90"
                  >
                    {isSubmitting ? 'Checking…' : 'Unlock Owners Access'}
                  </button>

                  {!user && (
                    <Link
                      href="/login"
                      className="rounded-xl px-4 py-2.5 border border-white/20 text-white/90 hover:bg-white/5 transition"
                    >
                      Sign in first
                    </Link>
                  )}
                </div>
              </form>
            </GlassCard>

            <GlassCard
              title="How it works"
              subtitle="Quick steps to join the owners portal."
              footer={
                <span>
                  Problems? Reach out on the{' '}
                  <Link href="/message-board" className="underline">
                    Message Board
                  </Link>
                  .
                </span>
              }
            >
              <ol className="space-y-3 text-sm text-slate-700 dark:text-slate-200">
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/70 text-gray-900 shadow dark:bg-white/90">
                    1
                  </span>
                  <span>Sign in with your James Square account.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/70 text-gray-900 shadow dark:bg-white/90">
                    2
                  </span>
                  <span>Enter the six-digit passcode from the AGM welcome email.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/70 text-gray-900 shadow dark:bg-white/90">
                    3
                  </span>
                  <span>Access resources, vote on motions, and join discussions.</span>
                </li>
              </ol>
            </GlassCard>
          </div>
        )}
      </div>
    </GradientBG>
  );
};

export default OwnersPage;
