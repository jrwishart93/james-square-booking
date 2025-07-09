'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Post { id: string; title: string; }

export default function MessageBoardHighlights({ limit = 3 }: { limit?: number }) {
  const [posts, setPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/message-board?limit=${limit}`);
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts || []);
        } else {
          setPosts([]);
        }
      } catch (err) {
        console.error('Failed to load posts', err);
        setPosts([]);
      }
    };
    load();
  }, [limit]);

  if (posts === null) {
    return <p>Loading…</p>;
  }

  if (posts.length === 0) {
    return (
      <p>
        <Link href="/message-board" className="underline">
          Be the first to post
        </Link>
      </p>
    );
  }

  return (
    <ul className="space-y-1 list-disc ml-5">
      {posts.map((p) => (
        <li key={p.id}>
          <Link href={`/message-board/${p.id}`} className="text-blue-600 hover:underline">
            {p.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
