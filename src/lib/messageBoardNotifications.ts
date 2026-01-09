import {
  Timestamp,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';

// In-app unread detection uses user.lastSeenMessageBoardAt + post.updatedAt (no notifications collection).
// The "new" window is either within the last 2 weeks or since last seen, whichever is earlier.
export type UnreadMessageBoardResult = {
  hasUnread: boolean;
  count: number;
};

const TWO_WEEKS_MS = 1000 * 60 * 60 * 24 * 14;

function getUnreadCutoff(lastSeenMessageBoardAt?: Timestamp | null): Timestamp {
  const twoWeeksAgo = Date.now() - TWO_WEEKS_MS;
  const lastSeenMillis = lastSeenMessageBoardAt?.toMillis();
  const cutoffMillis =
    lastSeenMillis !== undefined ? Math.min(lastSeenMillis, twoWeeksAgo) : twoWeeksAgo;
  return Timestamp.fromMillis(cutoffMillis);
}

export async function getUnreadMessageBoardCount(
  userId: string,
  lastSeenMessageBoardAt?: Timestamp | null,
  maxResults = 5
): Promise<UnreadMessageBoardResult> {
  const postsRef = collection(db, 'messageBoard');
  const safeLimit = Math.max(1, Math.min(maxResults, 5));
  const cutoff = getUnreadCutoff(lastSeenMessageBoardAt);

  const postsQuery = query(
    postsRef,
    where('updatedAt', '>', cutoff),
    orderBy('updatedAt', 'desc'),
    limit(safeLimit)
  );

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
