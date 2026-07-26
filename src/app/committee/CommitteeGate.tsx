'use client';

import { useEffect, useState, type FormEvent } from 'react';

import { verifyAccessCode } from '@/app/actions/accessCodes';

import CommitteeContent from './CommitteeContent';

const ACCESS_KEY = 'js_committee_access';

const glassCard =
  'jqs-glass rounded-2xl border border-white/20 bg-white/50 dark:bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)]';

export default function CommitteeGate() {
  const [passcode, setPasscode] = useState('');
  const [hasAccess, setHasAccess] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(ACCESS_KEY);
    if (stored === 'granted') {
      setHasAccess(true);
    }
  }, []);

  const handleChange = (value: string) => {
    const next = value.replace(/\D/g, '').slice(0, 4);
    setPasscode(next);
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      // Verified on the server: the code is no longer present in this bundle.
      const result = await verifyAccessCode('committee', passcode);
      if (result.ok) {
        sessionStorage.setItem(ACCESS_KEY, 'granted');
        setHasAccess(true);
        setError('');
        return;
      }
      setError(result.error ?? 'Incorrect passcode. Please try again.');
    } catch {
      setError('We could not check that passcode. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (hasAccess) {
    return <CommitteeContent />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16 text-[color:var(--text-primary)]">
      <div className={`w-full max-w-md p-6 ${glassCard}`}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">Committee Area</h1>
            <p className="text-sm text-[color:var(--text-muted)]">
              This is a private space for James Square committee use.
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="committee-passcode">
              Passcode
            </label>
            <input
              className="w-full rounded-xl border border-[color:var(--glass-border)] bg-white/70 px-4 py-2 text-base text-[color:var(--text-primary)] shadow-inner focus:outline-none focus:ring-2 focus:ring-[color:var(--btn-ring)] dark:bg-white/10"
              id="committee-passcode"
              inputMode="numeric"
              maxLength={4}
              onChange={(event) => handleChange(event.target.value)}
              type="text"
              value={passcode}
            />
          </div>
          {error ? (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          ) : null}
          <button
            className="w-full rounded-full px-4 py-2 text-sm font-semibold jqs-glass hover:brightness-[1.05] transition disabled:opacity-60"
            disabled={submitting}
            type="submit"
          >
            {submitting ? 'Checking…' : 'Continue'}
          </button>
        </form>
      </div>
    </main>
  );
}
