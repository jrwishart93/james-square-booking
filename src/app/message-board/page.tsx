'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { MessageCircle, ThumbsDown, ThumbsUp } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  deleteDoc,
  updateDoc,
  where,
  setDoc,
  type DocumentData,
  type FieldValue,
  type Timestamp,
} from 'firebase/firestore';
import { onAuthStateChanged, type User } from 'firebase/auth';

/* ============================
   Types
============================ */

type UserDoc = {
  fullName?: string;
  isAdmin?: boolean;
  lastSeenMessageBoardAt?: Timestamp;
};

type Post = {
  id: string;
  title: string;
  body: string;
  authorId: string;
  authorName?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
  isAdminPost?: boolean;
};

type Comment = {
  id: string;
  body: string;
  authorId: string;
  authorName?: string;
  createdAt?: unknown;
};

type Reply = {
  id: string;
  body: string;
  authorId: string;
  authorName?: string;
  createdAt?: unknown;
};

type ReactionType = 'like' | 'dislike' | null;

type ReportPayload = {
  postId: string;
  targetType: 'post' | 'comment' | 'reply';
  commentId?: string;
  replyId?: string;
  reason: string;
  reporterUid: string;
  reporterEmail?: string;
  createdAt: FieldValue; // serverTimestamp()
  contentSnippet?: string;
};

/* ============================
   Helpers
============================ */

/** Look up user's display name from /users by email */
async function getDisplayNameFromProfile(email?: string | null): Promise<string | undefined> {
  if (!email) return undefined;
  const snap = await getDocs(query(collection(db, 'users'), where('email', '==', email)));
  if (!snap.empty) {
    const data = snap.docs[0].data() as UserDoc;
    if (data?.fullName) return data.fullName;
  }
  return undefined;
}

/** Create a report in /reports with a consistent shape */
async function createReportDoc(data: Omit<ReportPayload, 'createdAt'>): Promise<void> {
  await addDoc(collection(db, 'reports'), {
    ...data,
    createdAt: serverTimestamp(),
  } as ReportPayload);
}

function MoreMenu({ onReport }: { onReport: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-800"
        aria-label="More options"
        title="More options"
      >
        ⋯
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-32 rounded-md border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
          <button
            onClick={() => {
              setOpen(false);
              onReport();
            }}
            className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            Report
          </button>
        </div>
      )}
    </div>
  );
}

function formatTimestampLabel(value?: unknown): string {
  if (value && typeof value === 'object' && 'toDate' in (value as Record<string, unknown>)) {
    const date = (value as { toDate?: () => Date }).toDate?.();
    if (date instanceof Date && !Number.isNaN(date.getTime())) {
      return date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
    }
  }

  return 'Unknown time';
}

const TWO_WEEKS_MS = 1000 * 60 * 60 * 24 * 14;

function toMillis(value?: unknown): number | null {
  if (value && typeof value === 'object') {
    if ('toMillis' in (value as Record<string, unknown>)) {
      const millis = (value as { toMillis?: () => number }).toMillis?.();
      if (typeof millis === 'number') return millis;
    }
    if ('toDate' in (value as Record<string, unknown>)) {
      const date = (value as { toDate?: () => Date }).toDate?.();
      if (date instanceof Date && !Number.isNaN(date.getTime())) return date.getTime();
    }
  }

  return null;
}

function getUnreadCutoffMillis(lastSeenMessageBoardAt?: Timestamp | null): number {
  const twoWeeksAgo = Date.now() - TWO_WEEKS_MS;
  const lastSeenMillis = lastSeenMessageBoardAt?.toMillis();
  return lastSeenMillis !== undefined ? Math.max(lastSeenMillis, twoWeeksAgo) : twoWeeksAgo;
}

function isPostUnread(updatedAt: unknown, lastSeenMessageBoardAt?: Timestamp | null): boolean {
  const cutoffMillis = getUnreadCutoffMillis(lastSeenMessageBoardAt);
  const updatedMillis = toMillis(updatedAt);
  if (!updatedMillis) return false;
  return updatedMillis > cutoffMillis;
}

/* ============================
   Page
============================ */

export default function MessageBoardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [lastSeenMessageBoardAt, setLastSeenMessageBoardAt] = useState<Timestamp | null | undefined>(
    undefined
  );
  const hasUpdatedLastSeenRef = useRef(false);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, setUser);

    const qPosts = query(collection(db, 'messageBoard'), orderBy('createdAt', 'desc'));
    const unsubPosts = onSnapshot(qPosts, (snap) => {
      const list: Post[] = snap.docs.map((d) => {
        const data = d.data() as DocumentData;
        return {
          id: d.id,
          title: (data.title as string) ?? '',
          body: (data.body as string) ?? '',
          authorId: (data.authorId as string) ?? '',
          authorName: data.authorName as string | undefined,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          isAdminPost: data.isAdminPost as boolean | undefined,
        };
      });
      setPosts(list);
    });

    return () => {
      unsubAuth();
      unsubPosts();
    };
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!user) {
      setLastSeenMessageBoardAt(undefined);
      hasUpdatedLastSeenRef.current = false;
      return;
    }

    let isMounted = true;
    const fetchLastSeen = async () => {
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (!isMounted) return;
      const data = snap.data() as UserDoc | undefined;
      setLastSeenMessageBoardAt(data?.lastSeenMessageBoardAt ?? null);
    };

    void fetchLastSeen();

    return () => {
      isMounted = false;
    };
  }, [user]);

  useEffect(() => {
    if (!user || hasUpdatedLastSeenRef.current) return;
    hasUpdatedLastSeenRef.current = true;

    void updateDoc(doc(db, 'users', user.uid), {
      lastSeenMessageBoardAt: serverTimestamp(),
    }).catch((err) => {
      console.error('Failed to update lastSeenMessageBoardAt', err);
    });
  }, [user]);

  async function createPost() {
    if (!user) {
      alert('Sign in to post');
      return;
    }
    if (!newTitle.trim() || !newBody.trim()) return;

    setBusy(true);
    try {
      const name =
        (await getDisplayNameFromProfile(user.email)) ||
        user.displayName ||
        user.email ||
        'Unknown';

      await addDoc(collection(db, 'messageBoard'), {
        title: newTitle.trim(),
        body: newBody.trim(),
        authorId: user.uid, // ✅ required by rules
        authorName: name,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setNewTitle('');
      setNewBody('');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="w-full px-4 py-8 sm:px-6 sm:max-w-5xl sm:mx-auto space-y-6">
      <header
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/80 via-white/60 to-slate-100/60 dark:from-slate-900/60 dark:via-slate-900/52 dark:to-slate-800/50 backdrop-blur-xl px-6 py-8 text-center shadow-[0_20px_70px_rgba(15,23,42,0.16)] ring-1 ring-black/5 dark:ring-white/10 transition-all duration-500 ease-out ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        <div className="pointer-events-none absolute inset-0 opacity-70 blur-3xl">
          <div className="absolute inset-x-6 -top-10 h-36 rounded-full bg-gradient-to-r from-cyan-200/50 via-blue-200/40 to-purple-200/40 dark:from-cyan-500/20 dark:via-blue-500/15 dark:to-purple-500/20" />
        </div>
        <div className="relative space-y-3">
          <h1 className="text-3xl md:text-4xl font-semibold leading-tight text-slate-900 dark:text-white">
            Message Board
          </h1>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-200/80 max-w-2xl mx-auto leading-relaxed">
            Share updates, questions, or concerns with other residents.
          </p>
        </div>
      </header>

      {/* Create box */}
      <div
        className={`rounded-3xl message-surface message-surface--lift p-4 sm:p-6 transition-all duration-200 ease-out ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        } focus-within:shadow-[var(--glass-shadow-lift)] focus-within:-translate-y-0.5`}
      >
        {!user ? (
          <p className="text-sm text-slate-700 dark:text-slate-200/90 leading-relaxed">
            You&apos;re not signed in.{' '}
            <Link href="/login" className="underline">
              Sign in
            </Link>{' '}
            to post.
          </p>
        ) : (
          <>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Post title"
              className="w-full mb-3 px-4 py-3 rounded-2xl message-field text-lg font-semibold text-slate-900 placeholder:text-slate-500 dark:text-white dark:placeholder:text-slate-400 border-none focus:outline-none focus:ring-0 transition-all duration-200 ease-out"
            />
            <textarea
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              placeholder="Say something…"
              className="w-full mb-4 px-4 py-3 rounded-2xl message-field text-base text-slate-900 placeholder:text-slate-500 dark:text-slate-100 dark:placeholder:text-slate-500 border-none focus:outline-none focus:ring-0 transition-all duration-200 ease-out min-h-[120px] leading-relaxed resize-none"
            />
            <button
              onClick={createPost}
              disabled={busy || !newTitle.trim() || !newBody.trim()}
              className="message-pressable inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 text-white shadow-lg shadow-slate-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 ease-out disabled:translate-y-0 dark:from-white/90 dark:via-white/80 dark:to-white/80 dark:text-slate-900"
            >
              {busy ? 'Posting…' : 'Post'}
            </button>
          </>
        )}
      </div>

      {/* Posts */}
      <ul className="space-y-4 sm:space-y-5">
        {posts.map((p, index) => (
          <PostCard
            key={p.id}
            post={p}
            currentUser={user}
            index={index}
            mounted={mounted}
            lastSeenMessageBoardAt={lastSeenMessageBoardAt}
          />
        ))}
      </ul>
    </main>
  );
}

/* ============================
   Post Card
============================ */

function PostCard({
  post,
  currentUser,
  index,
  mounted,
  lastSeenMessageBoardAt,
}: {
  post: Post;
  currentUser: User | null;
  index: number;
  mounted: boolean;
  lastSeenMessageBoardAt?: Timestamp | null;
}) {
  const mine = useMemo(() => currentUser?.uid === post.authorId, [currentUser?.uid, post.authorId]);
  const isUnread = useMemo(() => {
    if (mine) return false;
    return isPostUnread(post.updatedAt, lastSeenMessageBoardAt);
  }, [lastSeenMessageBoardAt, mine, post.updatedAt]);

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [body, setBody] = useState(post.body);

  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [myReaction, setMyReaction] = useState<ReactionType>(null);

  // Watch reactions (counts + my reaction)
  useEffect(() => {
    const likesQ = query(
      collection(db, 'messageBoard', post.id, 'reactions'),
      where('type', '==', 'like')
    );
    const dislikesQ = query(
      collection(db, 'messageBoard', post.id, 'reactions'),
      where('type', '==', 'dislike')
    );

    const unsubLikes = onSnapshot(likesQ, (snap) => setLikeCount(snap.size));
    const unsubDislikes = onSnapshot(dislikesQ, (snap) => setDislikeCount(snap.size));

    let unsubMine: (() => void) | undefined;
    if (currentUser?.uid) {
      const mineRef = doc(db, 'messageBoard', post.id, 'reactions', currentUser.uid);
      unsubMine = onSnapshot(mineRef, (d) => {
        setMyReaction(d.exists() ? ((d.data() as DocumentData).type as ReactionType) : null);
      });
    }

    return () => {
      unsubLikes();
      unsubDislikes();
      if (unsubMine) unsubMine();
    };
  }, [post.id, currentUser?.uid]);

  async function toggleReaction(type: Exclude<ReactionType, null>) {
    if (!currentUser) {
      alert('Sign in to react');
      return;
    }
    const ref = doc(db, 'messageBoard', post.id, 'reactions', currentUser.uid);
    const cur = await getDoc(ref);
    if (!cur.exists()) {
      await setDoc(ref, { type, createdAt: serverTimestamp() });
    } else {
      const prev = (cur.data() as DocumentData).type as ReactionType;
      if (prev === type) {
        await deleteDoc(ref); // remove reaction
      } else {
        await updateDoc(ref, { type, updatedAt: serverTimestamp() });
      }
    }
  }

  async function onDelete() {
    if (!currentUser) return;
    if (!confirm('Delete this post?')) return;
    await deleteDoc(doc(db, 'messageBoard', post.id));
  }

  async function onSave() {
    if (!currentUser) return;
    await updateDoc(doc(db, 'messageBoard', post.id), {
      title: title.trim(),
      body: body.trim(),
      updatedAt: serverTimestamp(),
    });
    setEditing(false);
  }

  async function onReport() {
    if (!currentUser) {
      alert('Sign in to report');
      return;
    }
    const reason = prompt('Reason for report (optional):') || '';
    await createReportDoc({
      targetType: 'post',
      postId: post.id,
      reason,
      reporterUid: currentUser.uid,
      reporterEmail: currentUser.email ?? undefined,
      contentSnippet: `${post.title} — ${post.body?.slice(0, 140)}`,
    });
    alert('Reported — thanks. Admin will review.');
  }

  return (
    <li
      className={`relative overflow-hidden rounded-3xl message-surface message-surface--lift p-4 sm:p-6 space-y-4 transition-[opacity,transform,box-shadow,filter] duration-200 ease-out ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
      } hover:shadow-[var(--glass-shadow-lift)] sm:hover:-translate-y-1 ${
        isUnread
          ? 'ring-1 ring-emerald-200/70 dark:ring-emerald-400/20 shadow-[0_0_0_1px_rgba(16,185,129,0.06)]'
          : ''
      }`}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-40 blur-2xl">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-cyan-200/35 via-blue-200/30 to-purple-200/25 dark:from-cyan-500/15 dark:via-blue-500/12 dark:to-purple-600/15" />
      </div>
      {/* Header */}
      <div className="relative flex items-start gap-3">
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500/80 dark:text-slate-400/80">Resident post</p>
            {isUnread ? (
              <span className="inline-flex items-center rounded-full bg-emerald-100/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200">
                New
              </span>
            ) : null}
          </div>
          {editing ? (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-2xl message-field text-base font-semibold text-slate-900 dark:text-white border-none focus:outline-none focus:ring-0 transition-all"
            />
          ) : (
            <h3 className="text-xl font-semibold leading-snug text-slate-900 dark:text-white">{post.title}</h3>
          )}
        </div>
        <MoreMenu onReport={onReport} />
      </div>

      {/* Body */}
      {editing ? (
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full my-2 px-3 py-2 rounded-2xl message-field text-sm sm:text-base text-slate-900 dark:text-slate-100 border-none focus:outline-none focus:ring-0 transition-all min-h-[100px] leading-relaxed resize-none"
        />
      ) : (
        <p className="my-2 whitespace-pre-wrap leading-relaxed text-slate-800 dark:text-slate-100 text-base">{post.body}</p>
      )}

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500/80 dark:text-slate-400/80 leading-relaxed">
        <span className="inline-flex items-center rounded-full bg-black/5 px-3 py-1 dark:bg-white/5 shadow-inner shadow-black/5 dark:shadow-black/10">
          By {post.authorName || 'Unknown'}
        </span>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3 pt-2 text-sm text-slate-600/90 dark:text-slate-200/75">
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleReaction('like')}
            className={`message-pressable message-react inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-150 ease-out shadow-inner shadow-black/5 dark:shadow-black/20 ${
              myReaction === 'like'
                ? 'bg-green-500/15 text-green-700 dark:bg-green-500/20 dark:text-green-200 shadow-none'
                : 'bg-black/5 text-slate-600 dark:bg-white/5 dark:text-slate-200 hover:bg-black/10 dark:hover:bg-white/10'
            }`}
            aria-label="Like"
            title="Like"
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            <span>{likeCount}</span>
          </button>
          <button
            onClick={() => toggleReaction('dislike')}
            className={`message-pressable message-react inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-150 ease-out shadow-inner shadow-black/5 dark:shadow-black/20 ${
              myReaction === 'dislike'
                ? 'bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200 shadow-none'
                : 'bg-black/5 text-slate-600 dark:bg-white/5 dark:text-slate-200 hover:bg-black/10 dark:hover:bg-white/10'
            }`}
            aria-label="Dislike"
            title="Dislike"
          >
            <ThumbsDown className="h-3.5 w-3.5" />
            <span>{dislikeCount}</span>
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-wrap pt-1">
        {mine ? (
          editing ? (
            <>
              <button
                onClick={onSave}
                className="message-pressable px-3 py-1.5 rounded-full bg-slate-900 text-white shadow-md shadow-slate-900/20 hover:-translate-y-[1px] transition-all duration-150 dark:bg-white dark:text-slate-900"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setTitle(post.title);
                  setBody(post.body);
                  setEditing(false);
                }}
                className="message-pressable px-3 py-1.5 rounded-full bg-black/5 text-slate-700 hover:bg-black/10 transition-colors dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="message-pressable px-3 py-1.5 rounded-full bg-black/5 text-slate-700 hover:bg-black/10 transition-colors dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
              >
                Edit
              </button>
              <button
                onClick={onDelete}
                className="message-pressable px-3 py-1.5 rounded-full bg-red-600 text-white shadow-md shadow-red-900/30 hover:bg-red-600/90 transition-all"
              >
                Delete
              </button>
            </>
          )
          ) : null}
      </div>

      {/* Comments */}
      <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/10">
        <Comments postId={post.id} currentUser={currentUser} />
      </div>
    </li>
  );
}

/* ============================
   Comments & Replies
============================ */

function Comments({ postId, currentUser }: { postId: string; currentUser: User | null }) {
  const [list, setList] = useState<Comment[]>([]);
  const [body, setBody] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const commentInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const qC = query(
      collection(db, 'messageBoard', postId, 'comments'),
      orderBy('createdAt', 'asc')
    );
    const unsub = onSnapshot(qC, (snap) => {
      const arr: Comment[] = snap.docs.map((d) => {
        const data = d.data() as DocumentData;
        return {
          id: d.id,
          body: (data.body as string) ?? '',
          authorId: (data.authorId as string) ?? '',
          authorName: data.authorName as string | undefined,
          createdAt: data.createdAt,
        };
      });
      setList(arr);
    });
    return () => unsub();
  }, [postId]);

  async function addComment() {
    if (!currentUser) {
      alert('Sign in to comment');
      return;
    }
    if (!body.trim()) return;

    const name =
      (await getDisplayNameFromProfile(currentUser.email)) ||
      currentUser.displayName ||
      currentUser.email ||
      'Unknown';

    await addDoc(collection(db, 'messageBoard', postId, 'comments'), {
      body: body.trim(),
      authorId: currentUser.uid, // ✅ required by rules
      authorName: name,
      createdAt: serverTimestamp(),
    });
    await updateDoc(doc(db, 'messageBoard', postId), {
      updatedAt: serverTimestamp(),
    });
    setBody('');
    setIsCommenting(false);
  }

  useEffect(() => {
    if (isCommenting) {
      requestAnimationFrame(() => {
        commentInputRef.current?.focus();
      });
    }
  }, [isCommenting]);

  async function deleteComment(id: string) {
    if (!currentUser) return;
    if (!confirm('Delete this comment?')) return;
    await deleteDoc(doc(db, 'messageBoard', postId, 'comments', id));
  }

  async function reportComment(c: Comment) {
    if (!currentUser) {
      alert('Sign in to report');
      return;
    }
    const reason = prompt('Reason for report (optional):') || '';
    await createReportDoc({
      targetType: 'comment',
      postId,
      commentId: c.id,
      reason,
      reporterUid: currentUser.uid,
      reporterEmail: currentUser.email ?? undefined,
      contentSnippet: c.body?.slice(0, 200),
    });
    alert('Reported — thanks.');
  }

  return (
    <div className="mt-3 space-y-3.5">
      <div className="flex items-center justify-between gap-2">
        <h4 className="font-medium text-lg leading-tight text-slate-900/90 dark:text-slate-50/90">
          Comments ({list.length})
        </h4>
      </div>

      <ul className="space-y-4">
        {list.map((c) => {
          const mine = currentUser?.uid === c.authorId;
          const createdLabel = formatTimestampLabel(c.createdAt);
          return (
            <li key={c.id} className="list-none">
              <div className="flex flex-col gap-3 rounded-2xl message-thread message-fade ml-1.5 sm:ml-2 p-4 sm:p-5 transition-[box-shadow,opacity] duration-200">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                      {c.authorName || 'Unknown'}
                    </p>
                    <p className="text-xs text-slate-500/75 dark:text-slate-400/75 leading-relaxed">{createdLabel}</p>
                  </div>
                  <MoreMenu onReport={() => reportComment(c)} />
                </div>

                <p className="whitespace-pre-wrap leading-relaxed text-slate-900 dark:text-slate-100">{c.body}</p>

                <Replies postId={postId} comment={c} currentUser={currentUser} onDelete={mine ? () => deleteComment(c.id) : undefined} />
              </div>
            </li>
          );
        })}
      </ul>

      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => setIsCommenting(true)}
          className="message-pressable inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 shadow-inner shadow-black/5 dark:shadow-black/15 min-h-[44px]"
          aria-label="Add a comment"
          aria-expanded={isCommenting}
        >
          <MessageCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Comment</span>
        </button>
      </div>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
          isCommenting ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              ref={commentInputRef}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setIsCommenting(false);
                  setBody('');
                }
              }}
              placeholder="Add a comment…"
              className="flex-1 px-4 py-2.5 rounded-2xl message-field text-sm sm:text-base text-slate-900 placeholder:text-slate-500 dark:text-slate-100 dark:placeholder:text-slate-500 border-none focus:outline-none focus:ring-0 transition-all duration-200 ease-out leading-relaxed"
            />
            <div className="flex items-center gap-3 sm:gap-2 sm:flex-row">
              <button
                onClick={addComment}
                className="message-pressable w-full sm:w-auto px-4 py-2 rounded-full bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg shadow-slate-900/20 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 ease-out dark:from-white/85 dark:to-white/80 dark:text-slate-900"
              >
                Comment
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCommenting(false);
                  setBody('');
                }}
                className="px-2 py-1 text-sm font-medium text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Replies({
  postId,
  comment,
  currentUser,
  onDelete,
}: {
  postId: string;
  comment: Comment;
  currentUser: User | null;
  onDelete?: () => void;
}) {
  const [list, setList] = useState<Reply[]>([]);
  const [body, setBody] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const replyInputRef = useRef<HTMLInputElement>(null);
  const [showReplies, setShowReplies] = useState(false);

  useEffect(() => {
    const qR = query(
      collection(db, 'messageBoard', postId, 'comments', comment.id, 'replies'),
      orderBy('createdAt', 'asc')
    );
    const unsub = onSnapshot(qR, (snap) => {
      const arr: Reply[] = snap.docs.map((d) => {
        const data = d.data() as DocumentData;
        return {
          id: d.id,
          body: (data.body as string) ?? '',
          authorId: (data.authorId as string) ?? '',
          authorName: data.authorName as string | undefined,
          createdAt: data.createdAt,
        };
      });
      setList(arr);
    });
    return () => unsub();
  }, [postId, comment.id]);

  async function addReply() {
    if (!currentUser) {
      alert('Sign in to reply');
      return;
    }
    if (!body.trim()) return;

    const name =
      (await getDisplayNameFromProfile(currentUser.email)) ||
      currentUser.displayName ||
      currentUser.email ||
      'Unknown';

    await addDoc(collection(db, 'messageBoard', postId, 'comments', comment.id, 'replies'), {
      body: body.trim(),
      authorId: currentUser.uid, // ✅ required by rules
      authorName: name,
      createdAt: serverTimestamp(),
    });
    await updateDoc(doc(db, 'messageBoard', postId), {
      updatedAt: serverTimestamp(),
    });
    setBody('');
    setIsReplying(false);
    setShowReplies(true);
  }

  useEffect(() => {
    if (isReplying) {
      requestAnimationFrame(() => {
        replyInputRef.current?.focus();
      });
    }
  }, [isReplying]);

  async function deleteReply(id: string) {
    if (!currentUser) return;
    if (!confirm('Delete this reply?')) return;
    await deleteDoc(doc(db, 'messageBoard', postId, 'comments', comment.id, 'replies', id));
  }

  async function reportReply(r: Reply) {
    if (!currentUser) {
      alert('Sign in to report');
      return;
    }
    const reason = prompt('Reason for report (optional):') || '';
    await createReportDoc({
      targetType: 'reply',
      postId,
      commentId: comment.id,
      replyId: r.id,
      reason,
      reporterUid: currentUser.uid,
      reporterEmail: currentUser.email ?? undefined,
      contentSnippet: r.body?.slice(0, 200),
    });
    alert('Reported — thanks.');
  }

  const hasReplies = list.length > 0;
  const repliesLabel =
    list.length === 1 ? 'View reply' : `View ${list.length} replies`;
  const hideLabel = 'Hide replies';
  const preview = hasReplies ? list[0] : null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <button
          type="button"
          onClick={() => {
            setIsReplying(true);
            setShowReplies(true);
          }}
          className="inline-flex items-center gap-1.5 font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white transition-colors min-h-[36px]"
          aria-label="Write a reply"
        >
          Reply
        </button>
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="message-pressable px-2.5 py-1.5 rounded-full bg-red-600 text-white shadow-md shadow-red-900/30 hover:bg-red-600/90 transition-colors text-[13px]"
          >
            Delete
          </button>
        )}
        {hasReplies && !showReplies && (
          <button
            type="button"
            onClick={() => setShowReplies(true)}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white underline decoration-slate-300 dark:decoration-slate-600"
          >
            {repliesLabel}
          </button>
        )}
        {hasReplies && showReplies && (
          <button
            type="button"
            onClick={() => setShowReplies(false)}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white underline decoration-slate-300 dark:decoration-slate-600"
          >
            {hideLabel}
          </button>
        )}
      </div>

      {preview && !showReplies && (
        <button
          type="button"
          onClick={() => setShowReplies(true)}
          aria-label={`Reply from ${preview.authorName || 'Unknown'}. Tap to view.`}
          className="group w-full text-left pl-3 sm:pl-4 flex flex-col gap-1 text-[13px] text-slate-700/80 dark:text-slate-200/80 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <div className="flex items-center gap-2 truncate">
            <span className="text-slate-500 dark:text-slate-400">↳</span>
            <span className="font-semibold min-w-[80px] truncate">{preview.authorName || 'Unknown'}:</span>
          </div>
          <div className="relative overflow-hidden">
            <p
              className="leading-snug truncate text-left"
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
              }}
            >
              {preview.body}
            </p>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-4 bg-gradient-to-b from-transparent to-white/80 dark:to-slate-900/80" />
          </div>
        </button>
      )}

      {showReplies && hasReplies && (
        <ul className="pl-3 sm:pl-4 space-y-2 border-l border-black/5 dark:border-white/10 transition-opacity duration-150 ease-out">
          {list.map((r) => {
            const mine = currentUser?.uid === r.authorId;
            const createdLabel = formatTimestampLabel(r.createdAt);
            return (
              <li
                key={r.id}
                className="px-3 py-2 rounded-xl text-sm text-slate-900 dark:text-slate-100 shadow-none bg-transparent"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <p className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                      {r.authorName || 'Unknown'}
                    </p>
                    <p className="text-[11px] text-slate-500/80 dark:text-slate-400/80 leading-relaxed">
                      {createdLabel}
                    </p>
                  </div>
                  <MoreMenu onReport={() => reportReply(r)} />
                </div>
                <p className="mt-1 whitespace-pre-wrap leading-relaxed text-sm text-slate-900 dark:text-slate-100">
                  {r.body}
                </p>
                <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                  {mine && (
                    <button
                      onClick={() => deleteReply(r.id)}
                      className="message-pressable px-2 py-1 rounded-full bg-red-600 text-white shadow-md shadow-red-900/30 hover:bg-red-600/90 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {isReplying && (
        <div className="pl-3 sm:pl-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center transition-opacity duration-150 ease-out">
            <input
              ref={replyInputRef}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setIsReplying(false);
                  setBody('');
                }
              }}
              placeholder="Write a reply…"
              className="flex-1 px-4 py-2.5 rounded-2xl message-field text-sm sm:text-base text-slate-900 placeholder:text-slate-500 dark:text-slate-100 dark:placeholder:text-slate-500 border-none focus:outline-none focus:ring-0 transition-all duration-150 ease-out leading-relaxed"
            />
            <div className="flex items-center gap-3 sm:gap-2 sm:flex-row">
              <button
                onClick={addReply}
                className="message-pressable w-full sm:w-auto px-4 py-2 rounded-full bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg shadow-slate-900/20 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-150 ease-out dark:from-white/85 dark:to-white/80 dark:text-slate-900"
              >
                Reply
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsReplying(false);
                  setBody('');
                }}
                className="px-2 py-1 text-sm font-medium text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
