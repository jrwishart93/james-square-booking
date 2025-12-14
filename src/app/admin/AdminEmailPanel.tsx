'use client';

import { useEffect, useMemo, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';

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
  const { user } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [subject, setSubject] = useState('');
  const [bodyHtml, setBodyHtml] = useState('<p>Hello everyone,</p><p>Quick update...</p>');
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [sending, setSending] = useState(false);
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

  const selectedEmails = useMemo(
    () => users.filter((user) => selected[user.id]).map((user) => user.email),
    [selected, users],
  );

  const handleSend = async (recipients: string[]) => {
    if (!user) {
      setStatus({ tone: 'error', message: 'You must be signed in.' });
      return;
    }

    if (!recipients.length) {
      setStatus({ tone: 'error', message: 'No recipients selected.' });
      return;
    }

    if (!subject.trim()) {
      setStatus({ tone: 'error', message: 'Please enter a subject.' });
      return;
    }

    if (!bodyHtml.trim()) {
      setStatus({ tone: 'error', message: 'Please enter a message body.' });
      return;
    }

    try {
      setSending(true);
      setStatus({ tone: 'idle', message: 'Sending...' });

      const token = await user.getIdToken();

      const res = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          to: recipients,
          subject,
          message: bodyHtml,
        }),
      });

      if (res.ok) {
        setStatus({ tone: 'success', message: 'Email sent successfully.' });
        setBodyHtml('');
        setSelected({});
      } else {
        setStatus({ tone: 'error', message: 'Failed to send email' });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send email.';
      setStatus({ tone: 'error', message });
    } finally {
      setSending(false);
    }
  };

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
            onClick={() => void handleSend(allEmails)}
            disabled={sending || !allEmails.length}
            className="inline-flex items-center justify-center rounded-xl border border-white/25 px-4 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Send to all ({allEmails.length})
          </button>
          <button
            type="button"
            onClick={() => void handleSend(selectedEmails)}
            disabled={sending || !selectedEmails.length}
            className="inline-flex items-center justify-center rounded-xl bg-white/80 px-4 py-2 text-sm font-medium text-gray-900 shadow hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white/90"
          >
            Send to selected ({selectedEmails.length})
          </button>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-200">Subject</span>
          <input
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Update about shared facilities"
            className="rounded-xl border border-white/20 bg-white/70 px-3 py-2 text-sm text-slate-900 shadow focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400/60 dark:border-white/10 dark:bg-white/10 dark:text-white"
            disabled={sending}
          />
        </label>
      </div>

      <label className="flex flex-col gap-2 text-sm">
        <span className="font-medium text-slate-700 dark:text-slate-200">Message (basic HTML allowed)</span>
        <textarea
          value={bodyHtml}
          onChange={(event) => setBodyHtml(event.target.value)}
          rows={8}
          className="rounded-xl border border-white/20 bg-white/60 px-3 py-3 font-mono text-xs text-slate-900 shadow-inner focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400/60 dark:border-white/10 dark:bg-white/10 dark:text-white"
          disabled={sending}
        />
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Allowed tags: p, br, strong, em, b, i, u, ul, ol, li, h1–h6, a, div, span.
        </span>
      </label>

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
                  checked={Boolean(selected[u.id])}
                  onChange={(event) =>
                    setSelected((prev) => ({
                      ...prev,
                      [u.id]: event.target.checked,
                    }))
                  }
                  disabled={sending}
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
