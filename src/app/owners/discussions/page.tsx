'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';

import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';

interface DiscussionThread {
  id: string;
  title: string;
  summary?: string;
  createdAtLabel: string;
}

const AccessDenied = () => (
  <div className="max-w-3xl mx-auto p-6">
    <p className="text-lg font-medium text-red-600">Access denied. Owners only.</p>
  </div>
);

const OwnersDiscussionsPage = () => {
  const { user, loading } = useAuth();
  const [isChecking, setIsChecking] = useState(false);
  const [isOwner, setIsOwner] = useState<boolean | null>(null);
  const [threads, setThreads] = useState<DiscussionThread[]>([]);
  const [fetchState, setFetchState] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [newTitle, setNewTitle] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let active = true;

    if (!user) {
      setIsOwner(false);
      return;
    }

    const verifyClaim = async () => {
      setIsChecking(true);
      try {
        const token = await user.getIdTokenResult(true);
        if (active) {
          setIsOwner(Boolean(token.claims?.owner));
        }
      } catch {
        if (active) {
          setIsOwner(false);
        }
      } finally {
        if (active) {
          setIsChecking(false);
        }
      }
    };

    verifyClaim();

    return () => {
      active = false;
    };
  }, [user]);

  useEffect(() => {
    if (!isOwner) return;

    let active = true;

    const fetchThreads = async () => {
      setFetchState('loading');
      try {
        const discussionsQuery = query(collection(db, 'owners_discussions'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(discussionsQuery);
        if (!active) return;

        const mapped: DiscussionThread[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as Record<string, unknown>;
          const createdAt = (data.createdAt as { toDate?: () => Date })?.toDate?.();
          const createdAtLabel = createdAt ? createdAt.toLocaleString() : 'No date';

          return {
            id: docSnap.id,
            title: typeof data.title === 'string' && data.title.trim() ? data.title : 'Untitled thread',
            summary: typeof data.summary === 'string' && data.summary.trim() ? data.summary : undefined,
            createdAtLabel,
          };
        });

        setThreads(mapped);
        setFetchState('success');
      } catch (error) {
        console.error('Failed to load owner discussions', error);
        if (active) {
          setFetchState('error');
        }
      }
    };

    fetchThreads();

    return () => {
      active = false;
    };
  }, [isOwner, reloadToken]);

  const handleCreateThread = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      setFormMessage('You must be signed in.');
      return;
    }

    if (!isOwner) {
      setFormMessage('Only owners can create threads.');
      return;
    }

    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      setFormMessage('Thread title is required.');
      return;
    }

    setIsCreating(true);
    setFormMessage('Creating thread...');

    try {
      await addDoc(collection(db, 'owners_discussions'), {
        title: trimmedTitle,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
      });

      setNewTitle('');
      setFormMessage('Thread created.');
      setReloadToken((token) => token + 1);
    } catch (error) {
      console.error('Failed to create discussion thread', error);
      setFormMessage('Failed to create thread. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const content = useMemo(() => {
    if (fetchState === 'loading') {
      return <p className="text-gray-600">Loading discussions...</p>;
    }
    if (fetchState === 'error') {
      return <p className="text-red-600">Failed to load discussions. Please try again later.</p>;
    }
    if (threads.length === 0) {
      return <p className="text-gray-600">No discussions have been posted yet.</p>;
    }

    return (
      <ul className="list-disc pl-5 space-y-2">
        {threads.map((thread) => (
          <li key={thread.id} className="text-gray-800">
            <span className="font-medium">{thread.title}</span>
            <span className="ml-2 text-sm text-gray-500">({thread.createdAtLabel})</span>
            {thread.summary && <p className="text-sm text-gray-600">{thread.summary}</p>}
            <p className="text-sm">
              <Link href={`/owners/discussions/${thread.id}`} className="underline">
                Open thread
              </Link>
            </p>
          </li>
        ))}
      </ul>
    );
  }, [fetchState, threads]);

  if (loading || isChecking) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-gray-600">Checking access...</p>
      </div>
    );
  }

  if (!user || !isOwner) {
    return <AccessDenied />;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-semibold">Owners Discussions</h1>
      <p className="text-gray-700">
        Browse discussion starters and follow-up notes shared by fellow owners. Threads appear in
        reverse chronological order.
      </p>

      <form onSubmit={handleCreateThread} className="space-y-3">
        <div className="space-y-1">
          <label htmlFor="owners-discussion-title" className="block text-sm font-medium">
            New thread title
          </label>
          <input
            id="owners-discussion-title"
            type="text"
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="e.g. Roof maintenance schedule"
            maxLength={200}
            disabled={isCreating}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isCreating}
          className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isCreating ? 'Creating...' : 'Create thread'}
        </button>
        {formMessage && <p className="text-sm text-gray-600">{formMessage}</p>}
      </form>

      {content}
    </div>
  );
};

export default OwnersDiscussionsPage;
