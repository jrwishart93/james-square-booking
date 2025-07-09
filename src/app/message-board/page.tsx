'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

interface Post {
  id: string;
  title: string;
  author: string;
  excerpt?: string;
}

export default function MessageBoardPage() {
  const [posts, setPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(10));
        const snapshot = await getDocs(q);
        const items: Post[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data() as any;
          items.push({
            id: doc.id,
            title: data.title || '',
            author: data.author || '',
            excerpt: data.excerpt || (data.content ? data.content.slice(0, 100) : ''),
          });
        });
        setPosts(items);
      } catch (err) {
        console.error('Failed to fetch posts', err);
        setPosts([]);
      }
    };
    load();
  }, []);

  if (posts === null) {
    return <p>Loading posts...</p>;
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Message Board</h1>
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <ul className="space-y-6">
          {posts.map((post) => (
            <li key={post.id} className="border-b pb-4">
              <Link href={`/message-board/${post.id}`} className="text-xl font-semibold text-blue-600 hover:underline">
                {post.title}
              </Link>
              <div className="text-sm text-gray-500">by {post.author}</div>
              <p className="mt-1 text-gray-700">{post.excerpt}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
