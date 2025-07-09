'use client';

import Link from 'next/link';
import { Post } from './types';

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="border-b pb-4">
      <h2 className="text-xl font-semibold">
        <Link href={`/message-board/${post.id}`} className="text-blue-600 hover:underline">
          {post.title}
        </Link>
      </h2>
      <div className="text-sm text-gray-500">by {post.author}</div>
      {post.excerpt && <p className="mt-1 text-gray-700">{post.excerpt}</p>}
    </article>
  );
}
