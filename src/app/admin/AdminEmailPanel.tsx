'use client';

import { useEffect, useMemo, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

import { db } from '@/lib/firebase';
/**
 * Legacy admin email panel.
 * Deprecated in favor of /admin/email and kept read-only for reference.
 */

type AdminUser = {
  id: string;
  email: string;
  fullName?: string;
};

type Status = {
  tone: 'idle' | 'success' | 'error';
  message: string;
};

const baseCardClasses =
  'rounded-2xl border border-white/20 bg-white/10 dark:border-white/10 dark:bg-white/5 backdrop-blur px-6 py-6 shadow-md space-y-5';

const AdminEmailPanel = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [status, setStatus] = useState<Status>({ tone: 'idle', message: '' });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const q = query(collection(db, 'users'), orderBy('email'));
        const snapshot = await getDocs(q);
        const mapped: AdminUser[] = snapshot.docs
          .map((docSnap) => {
            const data = docSnap.data() as { email?: string; fullName?: string };
            if (!data?.email) return null;
            return {
              id: docSnap.id,
              email: data.email,
              fullName: data.fullName,
            } satisfies AdminUser;
          })
          .filter(Boolean) as AdminUser[];
        setUsers(mapped);
      } catch (error) {
        console.error('Failed to load users for email panel', error);
        setStatus({ tone: 'error', message: 'Failed to load users.' });
      } finally {
        setLoadingUsers(false);
      }
    };

    void loadUsers();
  }, []);

  const allEmails = useMemo(() => users.map((u) => u.email), [users]);

  return (
    <section className={baseCardClasses}>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Email Residents</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Compose an announcement and send it to selected residents.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled
            className="inline-flex items-center justify-center rounded-xl border border-white/25 px-4 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Send to all ({allEmails.length})
          </button>
          <button
            type="button"
            disabled
            className="inline-flex items-center justify-center rounded-xl bg-white/80 px-4 py-2 text-sm font-medium text-gray-900 shadow hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white/90"
          >
            Send to selected (0)
          </button>
        </div>
      </header>

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-400/20 dark:bg-amber-900/20 dark:text-amber-100">
        This panel is deprecated. Please use the dedicated Admin Email Centre at /admin/email.
      </div>

      {status.message && (
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
          {status.message}
        </p>
      )}

      <div>
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200">Recipients</h3>
        <div className="mt-2 max-h-64 overflow-auto rounded-xl border border-white/15 bg-white/5 dark:border-white/10 dark:bg-white/5">
          {loadingUsers ? (
            <div className="px-3 py-4 text-sm text-slate-500 dark:text-slate-400">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="px-3 py-4 text-sm text-slate-500 dark:text-slate-400">No users found.</div>
          ) : (
            users.map((u) => (
              <label key={u.id} className="flex items-center gap-3 border-b border-white/10 px-3 py-2 last:border-b-0 dark:border-white/5">
                <input
                  type="checkbox"
                  checked={false}
                  disabled
                />
                <div>
                  <p className="text-sm text-slate-900 dark:text-white">{u.fullName || u.email}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{u.email}</p>
                </div>
              </label>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminEmailPanel;
