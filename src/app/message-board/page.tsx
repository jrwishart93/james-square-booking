'use client';

import { useEffect, useState } from 'react';
import { Post } from '@/components/MessageBoard/types';
import PostCard from '@/components/MessageBoard/PostCard';

export default function MessageBoardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('/api/message-board');
        if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
        const data: { posts: Post[] } = await res.json();
        setPosts(data.posts);
      } catch (err) {
        console.error(err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (loading) return <p>Loading posts…</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <main className="py-8 px-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Community Message Board</h1>
      {posts.length === 0 ? (
        <p>No posts yet. Be the first to share!</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </main>
  );
}
