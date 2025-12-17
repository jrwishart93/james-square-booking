'use client';

import { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';

import { Vote } from '@/app/voting/types';
import { db } from '@/lib/firebase';

const mapVote = (snap: { id: string; data: () => Record<string, unknown> }): Vote => {
  const data = snap.data() as Record<string, unknown>;
  const createdAtTs = (data.createdAt as { toMillis?: () => number })?.toMillis?.();

  return {
    id: snap.id,
    questionId: typeof data.questionId === 'string' ? data.questionId : '',
    optionId: typeof data.optionId === 'string' ? data.optionId : '',
    voterName: typeof data.voterName === 'string' ? data.voterName : 'Unknown',
    flat: typeof data.flat === 'string' ? data.flat : 'Unknown',
    userId: typeof data.userId === 'string' ? data.userId : null,
    createdAt: createdAtTs ?? Date.now(),
  };
};

export const useAdminVotes = (questionId?: string) => {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!questionId) {
      setVotes([]);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'voting_votes'),
      where('questionId', '==', questionId),
      orderBy('createdAt', 'desc'),
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        setVotes(snapshot.docs.map(mapVote));
        setLoading(false);
      },
      (err) => {
        console.error('Failed to fetch admin votes', err);
        setError('Unable to load votes for this question.');
        setLoading(false);
      },
    );

    return () => unsub();
  }, [questionId]);

  const totalsByOption = useMemo(() => {
    return votes.reduce<Record<string, number>>((acc, vote) => {
      acc[vote.optionId] = (acc[vote.optionId] ?? 0) + 1;
      return acc;
    }, {});
  }, [votes]);

  return { votes, totalsByOption, loading, error };
};

