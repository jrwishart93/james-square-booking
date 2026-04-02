'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  type DocumentData,
} from 'firebase/firestore';

import { auth, db } from '@/lib/firebase';

type AGMComment = {
  id: string;
  message: string;
  userId: string;
  userName: string;
  createdAt?: unknown;
  parentId: string | null;
};

const MAX_MESSAGE_LENGTH = 1200;

function formatTimestampLabel(value?: unknown): string {
  if (value && typeof value === 'object' && 'toDate' in (value as Record<string, unknown>)) {
    const date = (value as { toDate?: () => Date }).toDate?.();
    if (date instanceof Date && !Number.isNaN(date.getTime())) {
      return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    }
  }

  return 'Pending time';
}

async function getUserDisplayName(user: User): Promise<string> {
  try {
    const userSnap = await getDoc(doc(db, 'users', user.uid));
    const profile = userSnap.data() as { fullName?: string } | undefined;
    if (profile?.fullName?.trim()) {
      return profile.fullName.trim();
    }
  } catch (error) {
    console.error('Failed to resolve user profile name', error);
  }

  return user.displayName || user.email || 'Unknown user';
}

function CommentRow({
  comment,
  replies,
  currentUser,
  postingId,
  onSubmitReply,
}: {
  comment: AGMComment;
  replies: AGMComment[];
  currentUser: User | null;
  postingId: string | null;
  onSubmitReply: (parentId: string, value: string) => Promise<void>;
}) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');

  const isPostingReply = postingId === comment.id;

  const submitReply = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!replyText.trim()) return;
    await onSubmitReply(comment.id, replyText);
    setReplyText('');
    setShowReply(false);
  };

  return (
    <article className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
      <p className="text-sm font-semibold text-white">{comment.userName}</p>
      <p className="mt-0.5 text-xs text-slate-300">{formatTimestampLabel(comment.createdAt)}</p>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-100">{comment.message}</p>

      <div className="mt-3">
        <button
          type="button"
          onClick={() => setShowReply((current) => !current)}
          disabled={!currentUser}
          className="text-xs font-medium text-cyan-300 hover:text-cyan-200 disabled:cursor-not-allowed disabled:text-slate-400"
        >
          Reply
        </button>
      </div>

      {showReply && (
        <form onSubmit={submitReply} className="mt-3 space-y-2">
          <textarea
            value={replyText}
            onChange={(event) => setReplyText(event.target.value)}
            rows={3}
            maxLength={MAX_MESSAGE_LENGTH}
            className="w-full rounded-xl border border-white/20 bg-slate-900/40 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-cyan-300 focus:outline-none"
            placeholder="Write a reply..."
            disabled={!currentUser || isPostingReply}
          />
          <button
            type="submit"
            disabled={!currentUser || !replyText.trim() || isPostingReply}
            className="inline-flex items-center rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPostingReply ? 'Posting...' : 'Post reply'}
          </button>
        </form>
      )}

      {replies.length > 0 && (
        <ul className="mt-4 space-y-3 border-l border-white/20 pl-4">
          {replies.map((reply) => (
            <li key={reply.id} className="rounded-xl border border-white/15 bg-white/5 p-3">
              <p className="text-xs font-semibold text-white">{reply.userName}</p>
              <p className="mt-0.5 text-[11px] text-slate-300">{formatTimestampLabel(reply.createdAt)}</p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-100">{reply.message}</p>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export default function AGMComments() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [comments, setComments] = useState<AGMComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [postingId, setPostingId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, setCurrentUser);

    const commentsQuery = query(collection(db, 'agmComments'), orderBy('createdAt', 'asc'));
    const unsubscribeComments = onSnapshot(
      commentsQuery,
      (snapshot) => {
        const items: AGMComment[] = snapshot.docs.map((commentDoc) => {
          const data = commentDoc.data() as DocumentData;
          return {
            id: commentDoc.id,
            message: typeof data.message === 'string' ? data.message : '',
            userId: typeof data.userId === 'string' ? data.userId : '',
            userName: typeof data.userName === 'string' ? data.userName : 'Unknown user',
            createdAt: data.createdAt,
            parentId: typeof data.parentId === 'string' ? data.parentId : null,
          };
        });

        setComments(items);
        setLoading(false);
      },
      (error) => {
        console.error('Failed to load AGM comments', error);
        setComments([]);
        setLoading(false);
      },
    );

    return () => {
      unsubscribeAuth();
      unsubscribeComments();
    };
  }, []);

  const topLevelComments = useMemo(
    () => comments.filter((item) => item.parentId === null),
    [comments],
  );

  const repliesByParent = useMemo(() => {
    const grouped = new Map<string, AGMComment[]>();

    comments.forEach((item) => {
      if (!item.parentId) return;
      const existing = grouped.get(item.parentId) ?? [];
      existing.push(item);
      grouped.set(item.parentId, existing);
    });

    return grouped;
  }, [comments]);

  const postMessage = async (text: string, parentId: string | null) => {
    if (!currentUser || !text.trim()) return;

    const postKey = parentId ?? 'root';
    setPostingId(postKey);
    try {
      const userName = await getUserDisplayName(currentUser);
      await addDoc(collection(db, 'agmComments'), {
        message: text.trim(),
        userId: currentUser.uid,
        userName,
        createdAt: serverTimestamp(),
        parentId,
      });
    } finally {
      setPostingId(null);
    }
  };

  const submitTopLevel = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await postMessage(message, null);
    setMessage('');
  };

  return (
    <section className="rounded-2xl border bg-white/10 px-6 py-6 backdrop-blur">
      <h2 className="text-2xl font-semibold text-white">AGM Agenda Comments</h2>
      <p className="mt-2 text-sm text-slate-200">
        Owners can suggest topics or raise questions ahead of the AGM in June 2026. All comments are visible to the
        community.
      </p>

      <div className="mt-6 space-y-4">
        {loading ? (
          <p className="text-sm text-slate-300">Loading comments...</p>
        ) : topLevelComments.length === 0 ? (
          <p className="text-sm text-slate-300">No comments yet. Be the first to suggest an agenda item.</p>
        ) : (
          topLevelComments.map((comment) => (
            <CommentRow
              key={comment.id}
              comment={comment}
              replies={repliesByParent.get(comment.id) ?? []}
              currentUser={currentUser}
              postingId={postingId}
              onSubmitReply={async (parentId, value) => {
                await postMessage(value, parentId);
              }}
            />
          ))
        )}
      </div>

      <form onSubmit={submitTopLevel} className="mt-6 space-y-3">
        <label htmlFor="agm-comment-input" className="block text-sm font-medium text-white">
          Add a comment
        </label>
        <textarea
          id="agm-comment-input"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={4}
          maxLength={MAX_MESSAGE_LENGTH}
          className="w-full rounded-xl border border-white/20 bg-slate-900/40 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-cyan-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          placeholder={currentUser ? 'Share your agenda item or question...' : 'Please log in to add a comment'}
          disabled={!currentUser || postingId === 'root'}
        />
        {!currentUser && <p className="text-sm text-amber-200">Please log in to add a comment</p>}
        <button
          type="submit"
          disabled={!currentUser || !message.trim() || postingId === 'root'}
          className="inline-flex items-center rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow disabled:cursor-not-allowed disabled:opacity-60"
        >
          {postingId === 'root' ? 'Posting...' : 'Post comment'}
        </button>
      </form>
    </section>
  );
}
