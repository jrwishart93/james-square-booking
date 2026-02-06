'use client';

import { useEffect, useMemo, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

import { auth, db } from '@/lib/firebase';
import { sendAdminEmailRequest } from '@/lib/client/sendAdminEmailRequest';

const baseCardClasses =
  'rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-6 py-6 shadow-[0_18px_40px_rgba(0,0,0,0.4)] space-y-5';

type AdminUser = {
  id: string;
  email: string;
  fullName?: string;
  residentType?: string;
  roles?: {
    owner?: boolean;
  };
};

type RecipientMode = 'all' | 'owners' | 'selected' | 'custom';

type Status = {
  tone: 'idle' | 'loading' | 'success' | 'error';
  message: string;
};

type SenderOption = {
  label: string;
  value: string;
};

const senderOptions: SenderOption[] = [
  { label: 'no-reply@james-square.com', value: 'no-reply@james-square.com' },
  { label: 'committee@james-square.com', value: 'committee@james-square.com' },
  { label: 'support@james-square.com', value: 'support@james-square.com' },
];

const confirmationPhrase = 'SEND TO ALL';

const AdminEmailPanel = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [recipientMode, setRecipientMode] = useState<RecipientMode>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [customEmail, setCustomEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>({ tone: 'idle', message: '' });
  const [senderEmail, setSenderEmail] = useState(senderOptions[0]?.value ?? '');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [confirmAcknowledged, setConfirmAcknowledged] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const q = query(collection(db, 'users'), orderBy('email'));
        const snapshot = await getDocs(q);
        const mapped = snapshot.docs
          .map((docSnap) => {
            const data = docSnap.data() as {
              email?: string;
              fullName?: string;
              residentType?: string;
              roles?: { owner?: boolean };
            };
            if (!data?.email) return null;
            return {
              id: docSnap.id,
              email: data.email,
              fullName: data.fullName,
              residentType: data.residentType,
              roles: data.roles,
            } satisfies AdminUser;
          })
          .filter(Boolean) as AdminUser[];
        setUsers(mapped);
      } catch (error) {
        console.error('Failed to load users for email panel', error);
        setStatus({ tone: 'error', message: 'Failed to load recipients.' });
      } finally {
        setLoadingUsers(false);
      }
    };

    void loadUsers();
  }, []);

  const ownerUsers = useMemo(
    () =>
      users.filter(
        (user) => user.residentType === 'owner' || Boolean(user.roles?.owner),
      ),
    [users],
  );

  const normalizedCustomEmail = useMemo(() => customEmail.trim().toLowerCase(), [customEmail]);
  const customEmailIsValid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedCustomEmail),
    [normalizedCustomEmail],
  );

  const recipientCount = useMemo(() => {
    if (recipientMode === 'all') return users.length;
    if (recipientMode === 'owners') return ownerUsers.length;
    if (recipientMode === 'custom') return customEmailIsValid ? 1 : 0;
    return selectedIds.length;
  }, [
    recipientMode,
    selectedIds.length,
    users.length,
    ownerUsers.length,
    customEmailIsValid,
  ]);

  const recipientTypeLabel = useMemo(() => {
    if (recipientMode === 'all') return 'everyone';
    if (recipientCount === 1) return 'one user';
    return 'a group';
  }, [recipientCount, recipientMode]);

  const shouldConfirmSend = recipientMode === 'all' || recipientCount > 1;
  const isAllRecipients = recipientMode === 'all';
  const showCommitteeWarning =
    senderEmail === 'committee@james-square.com' && recipientCount > 1;

  const handleToggleSelected = (userId: string) => {
    setSelectedIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId],
    );
  };

  const buildRecipientEmails = () => {
    if (recipientMode === 'all') {
      return users.map((user) => user.email);
    }

    if (recipientMode === 'owners') {
      return ownerUsers.map((user) => user.email);
    }

    if (recipientMode === 'custom') {
      return normalizedCustomEmail ? [normalizedCustomEmail] : [];
    }

    const selected = new Set(selectedIds);
    return users.filter((user) => selected.has(user.id)).map((user) => user.email);
  };

  const validateSend = () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setStatus({ tone: 'error', message: 'You must be signed in to send email.' });
      return null;
    }

    if (!subject.trim() || !message.trim()) {
      setStatus({ tone: 'error', message: 'Subject and message are required.' });
      return null;
    }

    if (recipientMode === 'selected' && selectedIds.length === 0) {
      setStatus({ tone: 'error', message: 'Select at least one recipient.' });
      return null;
    }

    if (recipientMode === 'custom' && !customEmailIsValid) {
      setStatus({ tone: 'error', message: 'Enter a valid email address.' });
      return null;
    }

    return currentUser;
  };

  const performSend = async () => {
    const currentUser = validateSend();
    if (!currentUser) return;

    try {
      setStatus({ tone: 'loading', message: 'Sending email…' });
      const response = await sendAdminEmailRequest(currentUser, {
        subject: subject.trim(),
        message: message.trim(),
        sender: senderEmail,
        recipients: {
          mode: recipientMode,
          emails: buildRecipientEmails(),
        },
      });

      setStatus({
        tone: 'success',
        message: `Email sent to ${response?.recipients ?? recipientCount} recipient(s).`,
      });
      setSubject('');
      setMessage('');
      setSelectedIds([]);
      setCustomEmail('');
    } catch (error) {
      console.error('Failed to send admin email', error);
      setStatus({
        tone: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Failed to send email. Please try again.',
      });
    }
  };

  const resetConfirmation = () => {
    setConfirmText('');
    setConfirmAcknowledged(false);
    setConfirmOpen(false);
  };

  const handleSubmit = async () => {
    const currentUser = validateSend();
    if (!currentUser) return;

    if (shouldConfirmSend) {
      setConfirmOpen(true);
      return;
    }

    await performSend();
  };

  const handleConfirmSend = async () => {
    const isConfirmed = isAllRecipients
      ? confirmText.trim().toUpperCase() === confirmationPhrase
      : confirmAcknowledged;

    if (!isConfirmed) return;

    resetConfirmation();
    await performSend();
  };

  return (
    <section className={baseCardClasses}>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Email Residents</h2>
          <p className="text-sm text-slate-300">
            Compose and send an announcement using the official James Square admin system.
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300">
          Recipients: <strong>{recipientCount}</strong>
        </div>
      </header>

      <div className="rounded-xl border border-indigo-400/30 bg-indigo-500/10 px-4 py-3 text-sm text-indigo-100">
        Emails are delivered from the official James Square admin system. Replies go to the configured Resend sender.
      </div>

      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-200">
            Recipients
          </label>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {(
              [
                { value: 'all', label: `All users (${users.length})` },
                { value: 'owners', label: `Owners only (${ownerUsers.length})` },
                { value: 'selected', label: `Selected users (${selectedIds.length})` },
                { value: 'custom', label: 'Send to a custom email address' },
              ] as const
            ).map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${
                  recipientMode === option.value
                    ? 'border-indigo-400/40 bg-indigo-500/15 text-indigo-100'
                    : 'border-white/10 bg-white/5 text-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="recipient-mode"
                  value={option.value}
                  checked={recipientMode === option.value}
                  onChange={() => setRecipientMode(option.value)}
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200">
            Sender address
          </label>
          <select
            value={senderEmail}
            onChange={(event) => setSenderEmail(event.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100"
          >
            {senderOptions.map((option) => (
              <option key={option.value} value={option.value} className="text-slate-900">
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {recipientMode === 'custom' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-200">
              Custom recipient email
            </label>
            <input
              type="email"
              value={customEmail}
              onChange={(event) => setCustomEmail(event.target.value)}
              onBlur={() => setCustomEmail(normalizedCustomEmail)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500"
              placeholder="someone@example.com"
            />
            <p className="text-xs text-slate-400">
              This email will not be saved.
            </p>
            {!customEmailIsValid && customEmail.trim().length > 0 && (
              <p className="text-xs text-rose-400">Please enter a valid email address.</p>
            )}
          </div>
        )}

        {recipientMode === 'selected' && (
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-200">Select recipients</h3>
              <span className="text-xs text-slate-400">
                {selectedIds.length} selected
              </span>
            </div>
            <div className="mt-2 max-h-64 overflow-auto rounded-xl border border-white/10 bg-white/5">
              {loadingUsers ? (
                <div className="px-3 py-4 text-sm text-slate-400">Loading users…</div>
              ) : users.length === 0 ? (
                <div className="px-3 py-4 text-sm text-slate-400">No users found.</div>
              ) : (
                users.map((user) => (
                  <label
                    key={user.id}
                    className="flex items-center gap-3 border-b border-white/10 px-3 py-2 last:border-b-0"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(user.id)}
                      onChange={() => handleToggleSelected(user.id)}
                    />
                    <div>
                      <p className="text-sm text-slate-100">
                        {user.fullName || user.email}
                      </p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-200">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500"
              placeholder="Enter email subject"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-200">
              Message
            </label>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={5}
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500"
              placeholder="Write a clear message for residents."
            />
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
          This email will be sent to <strong>{recipientCount}</strong> recipients ({recipientTypeLabel}) using{' '}
          <strong>{senderEmail}</strong>.
        </div>

        {status.message && (
          <p
            className={
              status.tone === 'error'
                ? 'text-sm text-rose-400'
                : status.tone === 'success'
                  ? 'text-sm text-emerald-400'
                  : status.tone === 'loading'
                    ? 'text-sm text-slate-400'
                    : 'text-sm text-slate-300'
            }
            aria-live="polite"
          >
            {status.message}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={status.tone === 'loading' || loadingUsers}
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status.tone === 'loading' ? 'Sending…' : shouldConfirmSend ? 'Review and send' : 'Send email'}
          </button>
          <span className="text-xs text-slate-400">
            Emails are sent only after you confirm the send.
          </span>
        </div>
      </div>

      {confirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg space-y-4 rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(17,24,39,0.96),rgba(15,23,42,0.95))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">
                Confirm email send
              </h3>
              <p className="text-sm text-slate-300">
                You are about to email{' '}
                <strong>{isAllRecipients ? 'ALL users' : `${recipientCount} recipients`}</strong>. This
                action cannot be undone. Are you sure you want to continue?
              </p>
              <p className="text-sm text-slate-300">
                This email will be sent using <strong>{senderEmail}</strong>.
              </p>
              {showCommitteeWarning && (
                <p className="text-sm font-semibold text-amber-400">
                  Committee mail is selected for multiple recipients. Please confirm this is intended.
                </p>
              )}
            </div>

            {isAllRecipients ? (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-200">
                  Type {confirmationPhrase} to confirm
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(event) => setConfirmText(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100"
                  placeholder={confirmationPhrase}
                />
              </div>
            ) : (
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={confirmAcknowledged}
                  onChange={(event) => setConfirmAcknowledged(event.target.checked)}
                />
                I understand this email will reach multiple recipients.
              </label>
            )}

            <div className="flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={resetConfirmation}
                disabled={status.tone === 'loading'}
                className="rounded-full px-4 py-2 text-sm font-semibold jqs-glass disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSend}
                disabled={
                  status.tone === 'loading' ||
                  (isAllRecipients
                    ? confirmText.trim().toUpperCase() !== confirmationPhrase
                    : !confirmAcknowledged)
                }
                className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status.tone === 'loading' ? 'Sending…' : 'Confirm send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminEmailPanel;
