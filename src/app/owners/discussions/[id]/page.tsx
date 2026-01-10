'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';

import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import PageContainer from '@/components/layout/PageContainer';

interface DiscussionThread {
  title: string;
}

interface Message {
  id: string;
  text: string;
  authorUid?: string;
  createdAtLabel: string;
}

const AccessDenied = () => (
  <div className="w-full px-4 py-6 sm:px-6 sm:max-w-4xl sm:mx-auto">
    <p className="text-lg font-medium text-red-600">Access denied. Owners only.</p>
  </div>
);

const MAX_MESSAGE_LENGTH = 1000;

const OwnersDiscussionDetailPage = () => {
  const params = useParams<{ id: string }>();
  const threadId = params?.id;
  const { user, loading } = useAuth();
  const [isChecking, setIsChecking] = useState(false);
  const [isOwner, setIsOwner] = useState<boolean | null>(null);
  const [thread, setThread] = useState<DiscussionThread | null>(null);
  const [threadState, setThreadState] = useState<'idle' | 'loading' | 'error' | 'success' | 'not-found'>('idle');
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesState, setMessagesState] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [messageText, setMessageText] = useState('');
  const [messageStatus, setMessageStatus] = useState('');
  const [isSending, setIsSending] = useState(false);
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
    if (!isOwner || !threadId) return;

    let active = true;

    const fetchThread = async () => {
      setThreadState('loading');
      try {
        const threadRef = doc(db, 'owners_discussions', threadId);
        const threadSnap = await getDoc(threadRef);
        if (!active) return;

        if (!threadSnap.exists()) {
          setThreadState('not-found');
          return;
        }

        const data = threadSnap.data() as Record<string, unknown>;
        setThread({
          title: typeof data.title === 'string' && data.title.trim() ? data.title : 'Untitled thread',
        });
        setThreadState('success');
      } catch (error) {
        console.error('Failed to load discussion thread', error);
        if (active) {
          setThreadState('error');
        }
      }
    };

    fetchThread();

    return () => {
      active = false;
    };
  }, [isOwner, threadId]);

  useEffect(() => {
    if (!isOwner || !threadId) return;

    let active = true;

    const fetchMessages = async () => {
      setMessagesState('loading');
      try {
        const messagesQuery = query(
          collection(db, 'owners_discussions', threadId, 'messages'),
          orderBy('createdAt', 'asc'),
        );
        const snapshot = await getDocs(messagesQuery);
        if (!active) return;

        const mapped: Message[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as Record<string, unknown>;
          const createdAt = (data.createdAt as { toDate?: () => Date })?.toDate?.();
          const createdAtLabel = createdAt ? createdAt.toLocaleString() : 'No date';

          return {
            id: docSnap.id,
            text: typeof data.text === 'string' ? data.text : '',
            authorUid: typeof data.authorUid === 'string' ? data.authorUid : undefined,
            createdAtLabel,
          };
        });

        setMessages(mapped);
        setMessagesState('success');
      } catch (error) {
        console.error('Failed to load discussion messages', error);
        if (active) {
          setMessagesState('error');
        }
      }
    };

    fetchMessages();

    return () => {
      active = false;
    };
  }, [isOwner, threadId, reloadToken]);

  const handleSendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      setMessageStatus('You must be signed in.');
      return;
    }

    if (!isOwner) {
      setMessageStatus('Only owners can post.');
      return;
    }

    if (!threadId) {
      setMessageStatus('Thread not available.');
      return;
    }

    const trimmed = messageText.trim();

    if (!trimmed) {
      setMessageStatus('Message cannot be empty.');
      return;
    }

    if (trimmed.length > MAX_MESSAGE_LENGTH) {
      setMessageStatus('Message is too long.');
      return;
    }

    setIsSending(true);
    setMessageStatus('Posting message...');

    try {
      await addDoc(collection(db, 'owners_discussions', threadId, 'messages'), {
        text: trimmed,
        authorUid: user.uid,
        createdAt: serverTimestamp(),
      });

      setMessageText('');
      setMessageStatus('Message posted.');
      setReloadToken((token) => token + 1);
    } catch (error) {
      console.error('Failed to post message', error);
      setMessageStatus('Failed to post message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const renderMessages = useMemo(() => {
    if (messagesState === 'loading') {
      return <p className="text-gray-600">Loading messages...</p>;
    }

    if (messagesState === 'error') {
      return <p className="text-red-600">Failed to load messages.</p>;
    }

    if (messages.length === 0) {
      return <p className="text-gray-600">No messages yet. Start the conversation below.</p>;
    }

    return (
      <ul className="space-y-4">
        {messages.map((message) => (
          <li key={message.id} className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900 leading-tight">
                    {message.authorUid || 'Unknown author'}
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed">{message.createdAtLabel}</p>
                </div>
              </div>
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{message.text}</p>
            </div>
          </li>
        ))}
      </ul>
    );
  }, [messages, messagesState]);

  if (loading || isChecking) {
    return (
      <PageContainer>
        <div className="w-full py-6 sm:max-w-4xl sm:mx-auto">
          <p className="text-gray-600">Checking access...</p>
        </div>
      </PageContainer>
    );
  }

  if (!user || !isOwner) {
    return (
      <PageContainer>
        <AccessDenied />
      </PageContainer>
    );
  }

  if (!threadId) {
    return (
      <PageContainer>
        <div className="w-full py-6 sm:max-w-4xl sm:mx-auto">
          <p className="text-red-600">Thread id is missing.</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="w-full py-6 sm:max-w-4xl sm:mx-auto space-y-5">
        <div className="flex items-center gap-3 text-sm">
          <Link href="/owners/discussions" className="underline">
            ← Back to discussions
          </Link>
        </div>

        {threadState === 'loading' && <p className="text-gray-600">Loading thread...</p>}
        {threadState === 'error' && <p className="text-red-600">Failed to load thread.</p>}
        {threadState === 'not-found' && (
          <p className="text-red-600">Thread not found or has been removed.</p>
        )}

        {threadState === 'success' && thread && (
          <>
            <h1 className="text-3xl font-semibold leading-snug">{thread.title}</h1>
          <section className="space-y-5">
            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold leading-tight">Messages</h2>
              </div>
              {renderMessages}
            </div>

            <form onSubmit={handleSendMessage} className="space-y-3">
              <div className="space-y-1">
                <label htmlFor="owners-discussion-message" className="block text-sm font-medium">
                  New message
                </label>
                <textarea
                  id="owners-discussion-message"
                  value={messageText}
                  onChange={(event) => setMessageText(event.target.value)}
                  maxLength={MAX_MESSAGE_LENGTH}
                  rows={4}
                  className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm leading-relaxed focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Share an update or question..."
                  disabled={isSending}
                  required
                />
                <p className="text-xs text-gray-500">Maximum {MAX_MESSAGE_LENGTH} characters.</p>
              </div>
              <button
                type="submit"
                disabled={isSending}
                className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSending ? 'Posting...' : 'Post message'}
              </button>
              {messageStatus && <p className="text-sm text-gray-600">{messageStatus}</p>}
            </form>
          </section>
        </>
        )}
      </div>
    </PageContainer>
  );
};

export default OwnersDiscussionDetailPage;
