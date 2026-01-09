import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
  type Timestamp,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';

// In-app unread detection uses user.lastSeenMessageBoardAt + post.updatedAt (no notifications collection).
export type UnreadMessageBoardResult = {
  hasUnread: boolean;
  count: number;
};

export async function getUnreadMessageBoardCount(
  userId: string,
  lastSeenMessageBoardAt?: Timestamp | null,
  maxResults = 5
): Promise<UnreadMessageBoardResult> {
  const postsRef = collection(db, 'messageBoard');
  const safeLimit = Math.max(1, Math.min(maxResults, 5));

  const postsQuery = lastSeenMessageBoardAt
    ? query(
        postsRef,
        where('updatedAt', '>', lastSeenMessageBoardAt),
        orderBy('updatedAt', 'desc'),
        limit(safeLimit)
      )
    : query(postsRef, orderBy('updatedAt', 'desc'), limit(safeLimit));

  const snapshot = await getDocs(postsQuery);
  const unreadDocs = snapshot.docs.filter((docSnap) => {
    const data = docSnap.data() as { authorId?: string };
    return data.authorId !== userId;
  });

  return {
    hasUnread: unreadDocs.length > 0,
    count: unreadDocs.length,
  };
}
