'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { getIdTokenResult } from 'firebase/auth';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';

type AdminUser = {
  id: string;
  email: string;
  fullName?: string;
};

type AttachmentPayload = {
  filename: string;
  content: string;
};

type Status = {
  tone: 'idle' | 'success' | 'error';
  message: string;
};

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      if (!base64) {
        reject(new Error('Could not read file content'));
      } else {
        resolve(base64);
      }
    };
    reader.onerror = () => reject(reader.error || new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export default function AdminEmailPage() {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedUserEmails, setSelectedUserEmails] = useState<string[]>([]);
  const [manualEmails, setManualEmails] = useState<string[]>([]);
  const [manualEmailInput, setManualEmailInput] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<AttachmentPayload[]>([]);
  const [status, setStatus] = useState<Status>({ tone: 'idle', message: '' });
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const verifyAdmin = async () => {
      if (!user) {
        setIsAdmin(false);
        setCheckingAdmin(false);
        return;
      }

      try {
        const tokenResult = await getIdTokenResult(user);
        const hasAdminClaim = Boolean(tokenResult.claims.admin || tokenResult.claims.isAdmin);
        setIsAdmin(hasAdminClaim);
        if (!hasAdminClaim) {
          setStatus({ tone: 'error', message: 'You do not have access to this page.' });
        }
      } catch (error) {
        console.error('Failed to verify admin claim', error);
        setIsAdmin(false);
        setStatus({ tone: 'error', message: 'Unable to verify admin permissions.' });
      } finally {
        setCheckingAdmin(false);
      }
    };

    void verifyAdmin();
  }, [user]);

  useEffect(() => {
    if (!isAdmin) return;

    const loadUsers = async () => {
      setLoadingUsers(true);
      try {
        const usersQuery = query(collection(db, 'users'), orderBy('email'));
        const snapshot = await getDocs(usersQuery);
        const mapped = snapshot.docs
          .map((docSnap) => {
            const data = docSnap.data() as { email?: string; fullName?: string; name?: string };
            if (!data.email) return null;
            return {
              id: docSnap.id,
              email: data.email,
              fullName: data.fullName || data.name,
            } satisfies AdminUser;
          })
          .filter(Boolean) as AdminUser[];
        setUsers(mapped);
      } catch (error) {
        console.error('Failed to load users', error);
        setStatus({ tone: 'error', message: 'Failed to load user list.' });
      } finally {
        setLoadingUsers(false);
      }
    };

    void loadUsers();
  }, [isAdmin]);

  const recipients = useMemo(() => {
    const unique = new Set<string>();
    selectedUserEmails.forEach((email) => unique.add(email));
    manualEmails.forEach((email) => unique.add(email));
    return Array.from(unique);
  }, [manualEmails, selectedUserEmails]);

  const handleAddManualEmail = () => {
    const trimmed = manualEmailInput.trim();
    if (!trimmed) return;

    setManualEmails((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
    setManualEmailInput('');
  };

  const handleManualEmailKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddManualEmail();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !files.length) {
      setAttachments([]);
      return;
    }

    try {
      const encoded = await Promise.all(
        Array.from(files).map(async (file) => ({
          filename: file.name,
          content: await fileToBase64(file),
        })),
      );
      setAttachments(encoded);
    } catch (error) {
      console.error('Failed to process attachments', error);
      setStatus({ tone: 'error', message: 'Failed to process attachments.' });
    }
  };

  const handleSend = async () => {
    if (!user) {
      setStatus({ tone: 'error', message: 'You must be signed in.' });
      return;
    }

    if (!isAdmin) {
      setStatus({ tone: 'error', message: 'You do not have permission to send emails.' });
      return;
    }

    if (!recipients.length) {
      setStatus({ tone: 'error', message: 'Please select at least one recipient.' });
      return;
    }

    if (!subject.trim()) {
      setStatus({ tone: 'error', message: 'Subject is required.' });
      return;
    }

    if (!message.trim()) {
      setStatus({ tone: 'error', message: 'Message is required.' });
      return;
    }

    try {
      setSending(true);
      setStatus({ tone: 'idle', message: '' });

      const token = await user.getIdToken();
      const response = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          to: recipients,
          subject: subject.trim(),
          message,
          attachments: attachments.length ? attachments : undefined,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        const errorMessage = errorBody?.error || 'Failed to send email.';
        throw new Error(errorMessage);
      }

      setStatus({ tone: 'success', message: 'Email sent successfully.' });
      setSubject('');
      setMessage('');
      setSelectedUserEmails([]);
      setManualEmails([]);
      setAttachments([]);
      setManualEmailInput('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send email.';
      setStatus({ tone: 'error', message });
    } finally {
      setSending(false);
    }
  };

  if (loading || checkingAdmin) {
    return <p className="p-6 text-sm text-slate-500">Checking permissions...</p>;
  }

  if (!isAdmin) {
    return (
      <div className="p-6 text-sm text-rose-500">
        <p>Access denied. This page is for administrators only.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 p-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Admin Email Centre</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Send announcements to residents using the verified James Square email address.
        </p>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-slate-800 dark:text-slate-100">Select users</span>
            <select
              multiple
              value={selectedUserEmails}
              onChange={(event) =>
                setSelectedUserEmails(Array.from(event.target.selectedOptions).map((opt) => opt.value))
              }
              className="min-h-[180px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10 dark:bg-slate-800 dark:text-white"
              disabled={loadingUsers || sending}
            >
              {loadingUsers ? (
                <option>Loading users...</option>
              ) : users.length ? (
                users.map((u) => (
                  <option key={u.id} value={u.email}>
                    {u.fullName ? `${u.fullName} — ${u.email}` : u.email}
                  </option>
                ))
              ) : (
                <option>No users found</option>
              )}
            </select>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Hold Ctrl/Cmd to select multiple users.
            </span>
          </label>

          <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm shadow-inner dark:border-white/10 dark:bg-slate-800/70">
            <label className="flex flex-col gap-1">
              <span className="font-medium text-slate-800 dark:text-slate-100">Add email address</span>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={manualEmailInput}
                  onChange={(event) => setManualEmailInput(event.target.value)}
                  onKeyDown={handleManualEmailKey}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10 dark:bg-slate-900 dark:text-white"
                  placeholder="resident@example.com"
                  disabled={sending}
                />
                <button
                  type="button"
                  onClick={handleAddManualEmail}
                  className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow hover:bg-indigo-500 disabled:opacity-60"
                  disabled={sending || !manualEmailInput.trim()}
                >
                  Add
                </button>
              </div>
            </label>

            {manualEmails.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-700 dark:text-slate-200">Additional recipients</p>
                <ul className="flex flex-wrap gap-2">
                  {manualEmails.map((email) => (
                    <li key={email} className="flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs shadow dark:bg-slate-900">
                      <span>{email}</span>
                      <button
                        type="button"
                        className="text-slate-500 hover:text-rose-500"
                        onClick={() =>
                          setManualEmails((prev) => prev.filter((existing) => existing !== email))
                        }
                        aria-label={`Remove ${email}`}
                        disabled={sending}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 grid gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-800 dark:text-slate-100">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="Update about shared facilities"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10 dark:bg-slate-800 dark:text-white"
              disabled={sending}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-800 dark:text-slate-100">Message (HTML allowed)</label>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={8}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10 dark:bg-slate-800 dark:text-white"
              placeholder="<p>Hello everyone,</p><p>Here is the latest update...</p>"
              disabled={sending}
            />
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <label className="font-medium text-slate-800 dark:text-slate-100">Attachments</label>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              className="text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-indigo-700 hover:file:bg-indigo-100 dark:text-slate-300 dark:file:bg-indigo-900/40 dark:file:text-indigo-200"
              disabled={sending}
            />
            {attachments.length > 0 && (
              <ul className="list-disc space-y-1 pl-5 text-xs text-slate-600 dark:text-slate-300">
                {attachments.map((file) => (
                  <li key={file.filename}>{file.filename}</li>
                ))}
              </ul>
            )}
            <p className="text-xs text-slate-500 dark:text-slate-400">Attachments are sent securely via Resend.</p>
          </div>
        </div>

        {status.message && (
          <p
            className={
              status.tone === 'error'
                ? 'mt-3 text-sm text-rose-500'
                : status.tone === 'success'
                  ? 'mt-3 text-sm text-emerald-600'
                  : 'mt-3 text-sm text-slate-600 dark:text-slate-300'
            }
            aria-live="polite"
          >
            {status.message}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-600 dark:text-slate-300">
            Recipients selected: {recipients.length}
          </div>
          <button
            type="button"
            onClick={handleSend}
            disabled={sending || !recipients.length || !subject.trim() || !message.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sending ? 'Sending…' : 'Send email'}
          </button>
        </div>
      </div>
    </div>
  );
}
