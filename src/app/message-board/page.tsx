'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
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
} from 'firebase/firestore';
import { onAuthStateChanged, type User } from 'firebase/auth';

/* ============================
   Types
============================ */

type UserDoc = {
  fullName?: string;
  isAdmin?: boolean;
};

type Post = {
  id: string;
  title: string;
  body: string;
  authorId: string;
  authorName?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
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

/* ============================
   Page
============================ */

export default function MessageBoardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [busy, setBusy] = useState(false);

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
        };
      });
      setPosts(list);
    });

    return () => {
      unsubAuth();
      unsubPosts();
    };
  }, []);

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
    <main className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Message Board</h1>

      {/* Create box */}
      <div className="glass p-4 mb-6 rounded-2xl border">
        {!user ? (
          <p className="text-sm">
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
              className="w-full mb-2 px-3 py-2 rounded border"
            />
            <textarea
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              placeholder="Say something…"
              className="w-full mb-3 px-3 py-2 rounded border min-h-[100px]"
            />
            <button
              onClick={createPost}
              disabled={busy || !newTitle.trim() || !newBody.trim()}
              className="px-4 py-2 rounded-xl bg-black/80 text-white hover:bg-black disabled:opacity-50"
            >
              {busy ? 'Posting…' : 'Post'}
            </button>
          </>
        )}
      </div>

      {/* Posts */}
      <ul className="space-y-4">
        {posts.map((p) => (
          <PostCard key={p.id} post={p} currentUser={user} />
        ))}
      </ul>
    </main>
  );
}

/* ============================
   Post Card
============================ */

function PostCard({ post, currentUser }: { post: Post; currentUser: User | null }) {
  const mine = useMemo(() => currentUser?.uid === post.authorId, [currentUser?.uid, post.authorId]);

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
    <li className="glass p-4 rounded-2xl border">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        {editing ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-2 py-1 rounded border"
          />
        ) : (
          <h3 className="text-lg font-semibold">{post.title}</h3>
        )}

        <div className="flex items-center gap-2">
          {/* Reactions */}
          <button
            onClick={() => toggleReaction('like')}
            className={`px-2 py-1 rounded border ${
              myReaction === 'like' ? 'bg-black/80 text-white' : ''
            }`}
            aria-label="Like"
            title="Like"
          >
            👍 {likeCount}
          </button>
          <button
            onClick={() => toggleReaction('dislike')}
            className={`px-2 py-1 rounded border ${
              myReaction === 'dislike' ? 'bg-black/80 text-white' : ''
            }`}
            aria-label="Dislike"
            title="Dislike"
          >
            👎 {dislikeCount}
          </button>
        </div>
      </div>

      {/* Body */}
      {editing ? (
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full my-2 px-2 py-1 rounded border min-h-[80px]"
        />
      ) : (
        <p className="my-2 whitespace-pre-wrap">{post.body}</p>
      )}

      {/* Meta */}
      <p className="text-xs text-slate-500 mb-3">By {post.authorName || 'Unknown'}</p>

      {/* Actions */}
      <div className="flex gap-2">
        {mine ? (
          editing ? (
            <>
              <button
                onClick={onSave}
                className="px-3 py-1 rounded bg-black/80 text-white hover:bg-black"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setTitle(post.title);
                  setBody(post.body);
                  setEditing(false);
                }}
                className="px-3 py-1 rounded border"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setEditing(true)} className="px-3 py-1 rounded border">
                Edit
              </button>
              <button
                onClick={onDelete}
                className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </>
          )
        ) : null}
        <button onClick={onReport} className="px-3 py-1 rounded border">
          Report
        </button>
      </div>

      {/* Comments */}
      <Comments postId={post.id} currentUser={currentUser} />
    </li>
  );
}

/* ============================
   Comments & Replies
============================ */

function Comments({ postId, currentUser }: { postId: string; currentUser: User | null }) {
  const [list, setList] = useState<Comment[]>([]);
  const [body, setBody] = useState('');

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
    setBody('');
  }

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
    <div className="mt-4">
      <h4 className="font-semibold mb-2">Comments</h4>

      <ul className="space-y-3">
        {list.map((c) => {
          const mine = currentUser?.uid === c.authorId;
          return (
            <li key={c.id} className="glass p-3 rounded-2xl border">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <p className="whitespace-pre-wrap">{c.body}</p>
                  <p className="text-xs text-slate-500 mt-1">By {c.authorName || 'Unknown'}</p>
                </div>
                <div className="flex items-center gap-2">
                  {mine && (
                    <button
                      onClick={() => deleteComment(c.id)}
                      className="text-xs px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  )}
                  <button
                    onClick={() => reportComment(c)}
                    className="text-xs px-2 py-1 rounded border"
                  >
                    Report
                  </button>
                </div>
              </div>

              {/* Replies */}
              <Replies postId={postId} comment={c} currentUser={currentUser} />
            </li>
          );
        })}
      </ul>

      <div className="mt-3 flex gap-2">
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add a comment…"
          className="flex-1 px-3 py-2 rounded border"
        />
        <button
          onClick={addComment}
          className="px-3 py-2 rounded-xl bg-black/80 text-white hover:bg-black"
        >
          Comment
        </button>
      </div>
    </div>
  );
}

function Replies({
  postId,
  comment,
  currentUser,
}: {
  postId: string;
  comment: Comment;
  currentUser: User | null;
}) {
  const [list, setList] = useState<Reply[]>([]);
  const [body, setBody] = useState('');

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
    setBody('');
  }

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

  return (
    <div className="mt-3 pl-3 border-l">
      <h5 className="font-medium mb-2 text-sm">Replies</h5>
      <ul className="space-y-2">
        {list.map((r) => {
          const mine = currentUser?.uid === r.authorId;
          return (
            <li
              key={r.id}
              className="slot px-3 py-2 rounded-xl flex items-start justify-between gap-3"
            >
              <div className="flex-1">
                <p className="whitespace-pre-wrap">{r.body}</p>
                <p className="text-xs text-slate-500 mt-1">By {r.authorName || 'Unknown'}</p>
              </div>
              <div className="flex items-center gap-2">
                {mine && (
                  <button
                    onClick={() => deleteReply(r.id)}
                    className="text-xs px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                )}
                <button
                  onClick={() => reportReply(r)}
                  className="text-xs px-2 py-1 rounded border"
                >
                  Report
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-2 flex gap-2">
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write a reply…"
          className="flex-1 px-3 py-2 rounded border"
        />
        <button
          onClick={addReply}
          className="px-3 py-2 rounded-xl bg-black/80 text-white hover:bg-black"
        >
          Reply
        </button>
      </div>
    </div>
  );
}
