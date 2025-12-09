'use client';

import { useEffect, useMemo, useState } from 'react';
import { collection, doc, getDocs, onSnapshot, query, updateDoc, where } from 'firebase/firestore';

import { db } from '@/lib/firebase';

interface OwnerRecord {
  id: string;
  email: string;
  fullName?: string;
}

type StatusMessage = {
  text: string;
  tone: 'idle' | 'error' | 'success';
};

const OwnersPanel = () => {
  const [owners, setOwners] = useState<OwnerRecord[]>([]);
  const [emailInput, setEmailInput] = useState('');
  const [status, setStatus] = useState<StatusMessage>({ text: '', tone: 'idle' });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const ownersQuery = query(collection(db, 'users'), where('roles.owner', '==', true));

    const unsubscribe = onSnapshot(ownersQuery, (snapshot) => {
      const list = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as { email?: string; fullName?: string };
        return {
          id: docSnap.id,
          email: data.email ?? 'Unknown email',
          fullName: data.fullName,
        } satisfies OwnerRecord;
      });
      setOwners(list);
    });

    return () => unsubscribe();
  }, []);

  const ownerCount = owners.length;

  const resetStatus = () => setStatus({ text: '', tone: 'idle' });

  const handleOwnerToggle = async (grant: boolean) => {
    const raw = emailInput.trim();

    if (!raw) {
      setStatus({ text: 'Please enter an email address.', tone: 'error' });
      return;
    }

    setIsProcessing(true);
    setStatus({ text: grant ? 'Granting owner access…' : 'Revoking owner access…', tone: 'idle' });

    try {
      const candidates = Array.from(new Set([raw, raw.toLowerCase()]));
      let userDocId: string | null = null;

      for (const candidate of candidates) {
        const emailQuery = query(collection(db, 'users'), where('email', '==', candidate));
        const snapshot = await getDocs(emailQuery);
        if (!snapshot.empty) {
          userDocId = snapshot.docs[0].id;
          break;
        }
      }

      if (!userDocId) {
        setStatus({ text: `No user found with email “${raw}”.`, tone: 'error' });
        return;
      }

      await updateDoc(doc(db, 'users', userDocId), {
        'roles.owner': grant,
      });

      setStatus({
        text: grant ? 'Owner access granted.' : 'Owner access revoked.',
        tone: 'success',
      });
      setEmailInput('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error occurred.';
      setStatus({ text: message, tone: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  const ownersList = useMemo(() => {
    if (owners.length === 0) {
      return (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No owners have been added yet.
        </p>
      );
    }

    return (
      <ul className="divide-y divide-white/10 dark:divide-white/5 text-sm">
        {owners.map((owner) => (
          <li key={owner.id} className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">{owner.email}</p>
              {owner.fullName && (
                <p className="text-xs text-slate-500 dark:text-slate-400">{owner.fullName}</p>
              )}
            </div>
            <code className="text-xs text-slate-500 dark:text-slate-400">{owner.id}</code>
          </li>
        ))}
      </ul>
    );
  }, [owners]);

  return (
    <section className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-md backdrop-blur dark:border-white/10 dark:bg-white/5 space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Owners Control Panel</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Manage owner access by email and monitor current members.
          </p>
        </div>
        <span className="inline-flex items-center rounded-full border border-white/30 px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-200">
          Owners: {ownerCount}
        </span>
      </header>

      <div className="flex flex-col gap-3 md:flex-row">
        <input
          type="email"
          value={emailInput}
          onChange={(event) => {
            setEmailInput(event.target.value);
            resetStatus();
          }}
          placeholder="owner@example.com"
          className="flex-1 rounded-xl border border-white/20 bg-white/40 px-3 py-2 text-sm text-slate-900 backdrop-blur focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400/60 dark:border-white/10 dark:bg-white/10 dark:text-white"
          autoComplete="email"
          aria-label="Owner email"
          disabled={isProcessing}
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleOwnerToggle(true)}
            disabled={isProcessing}
            className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Grant owner
          </button>
          <button
            type="button"
            onClick={() => handleOwnerToggle(false)}
            disabled={isProcessing}
            className="inline-flex items-center justify-center rounded-xl border border-white/25 px-4 py-2 text-sm font-medium text-white/90 shadow transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Revoke owner
          </button>
        </div>
      </div>

      {status.text && (
        <p
          className={
            status.tone === 'error'
              ? 'text-sm text-rose-400'
              : status.tone === 'success'
                ? 'text-sm text-emerald-400'
                : 'text-sm text-slate-600 dark:text-slate-300'
          }
          aria-live="polite"
        >
          {status.text}
        </p>
      )}

      <div>
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200">Current owners</h3>
        <div className="mt-2 rounded-xl border border-white/15 bg-white/5 p-3 shadow-inner dark:border-white/10 dark:bg-white/5">
          {ownersList}
        </div>
      </div>
    </section>
  );
};

export default OwnersPanel;
