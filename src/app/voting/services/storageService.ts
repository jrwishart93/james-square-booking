import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Question, Vote } from '../types';
import { addDuration, DURATION_PRESETS, DurationPreset } from '@/lib/voteExpiry';

const QUESTIONS_COLLECTION = 'voting_questions';
const VOTES_COLLECTION = 'voting_votes';

const normalizeOption = (label: string, index: number) => ({
  id: `${Date.now()}-${index}`,
  label,
});

export const normalizeFlat = (value: string): string => value.trim().toUpperCase();

const mapQuestionDoc = (snap: { id: string; data: () => Record<string, unknown> }): Question => {
  const data = snap.data();
  const createdAtTs =
    typeof data.createdAt === 'number'
      ? data.createdAt
      : typeof data.createdAt === 'string'
        ? new Date(data.createdAt).getTime()
        : data.createdAt instanceof Date
          ? data.createdAt.getTime()
          : (data.createdAt as { toMillis?: () => number })?.toMillis?.();
  const expiresAtValue =
    typeof data.expiresAt === 'number'
      ? data.expiresAt
      : typeof data.expiresAt === 'string'
        ? new Date(data.expiresAt).getTime()
        : data.expiresAt instanceof Date
          ? data.expiresAt.getTime()
          : (data.expiresAt as { toMillis?: () => number })?.toMillis?.();
  const expiresAt = typeof expiresAtValue === 'number' ? new Date(expiresAtValue) : null;
  const startsAtValue =
    typeof data.startsAt === 'number'
      ? data.startsAt
      : typeof data.startsAt === 'string'
        ? new Date(data.startsAt).getTime()
        : data.startsAt instanceof Date
          ? data.startsAt.getTime()
          : (data.startsAt as { toMillis?: () => number })?.toMillis?.();
  const startsAt = typeof startsAtValue === 'number' ? new Date(startsAtValue) : null;
  const rawPreset = typeof data.durationPreset === 'string' ? data.durationPreset : null;
  const durationPreset = DURATION_PRESETS.some((p) => p.value === rawPreset)
    ? (rawPreset as DurationPreset)
    : undefined;
  const rawStatus = typeof data.status === 'string' ? data.status.toLowerCase() : 'closed';
  const optionsRaw = Array.isArray(data.options) ? data.options : [];
  const options = optionsRaw
    .map((opt, idx) => {
      if (typeof opt === 'string') return { id: opt, label: opt };
      if (opt && typeof opt === 'object') {
        const val = opt as { id?: unknown; label?: unknown; title?: unknown; value?: unknown };
        const id = typeof val.id === 'string' ? val.id : typeof val.value === 'string' ? val.value : `${snap.id}-${idx}`;
        const label =
          typeof val.label === 'string'
            ? val.label
            : typeof val.title === 'string'
              ? val.title
              : id;
        return { id, label };
      }
      return null;
    })
    .filter(Boolean) as { id: string; label: string }[];

  const voteTotalsRaw = (data.voteTotals ?? {}) as Record<string, unknown>;
  const voteTotals = options.reduce<Record<string, number>>((totals, option) => {
    const value = voteTotalsRaw?.[option.id];
    totals[option.id] = typeof value === 'number' ? value : 0;
    return totals;
  }, {});

  return {
    id: snap.id,
    title: typeof data.title === 'string' ? data.title : 'Untitled question',
    description: typeof data.description === 'string' ? data.description : undefined,
    status: rawStatus === 'open' || rawStatus === 'scheduled' ? rawStatus : 'closed',
    createdAt: createdAtTs ?? Date.now(),
    durationPreset: durationPreset ?? '1m',
    expiresAt,
    startsAt,
    showLiveResults: typeof data.showLiveResults === 'boolean' ? data.showLiveResults : undefined,
    specialType: typeof data.specialType === 'string' ? data.specialType : undefined,
    documents: typeof data.documents === 'object' && data.documents
      ? (data.documents as {
          myreside?: { label: string; href: string }[];
          newton?: { label: string; href: string }[];
        })
      : undefined,
    options,
    voteTotals,
  };
};

export const getQuestions = async (): Promise<Question[]> => {
  const qs = query(collection(db, QUESTIONS_COLLECTION), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(qs);
  return snapshot.docs.map(mapQuestionDoc);
};

const mapVoteDoc = (snap: { id: string; data: () => Record<string, unknown> }): Vote => {
  const data = snap.data() as Record<string, unknown>;
  const createdAtTs =
    typeof data.createdAt === 'number'
      ? data.createdAt
      : (data.createdAt as { toMillis?: () => number })?.toMillis?.();
  const updatedAtTs =
    typeof data.updatedAt === 'number'
      ? data.updatedAt
      : (data.updatedAt as { toMillis?: () => number })?.toMillis?.();
  const userName =
    typeof data.userName === 'string'
      ? data.userName
      : typeof data.voterName === 'string'
        ? data.voterName
        : 'Unknown';
  const userNameLower =
    typeof data.userNameLower === 'string'
      ? data.userNameLower
      : typeof userName === 'string'
        ? userName.toLowerCase()
        : undefined;

  return {
    id: snap.id,
    questionId: typeof data.questionId === 'string' ? data.questionId : '',
    optionId: typeof data.optionId === 'string' ? data.optionId : '',
    userName,
    userNameLower,
    flat: typeof data.flat === 'string' ? data.flat : 'Unknown',
    userId: typeof data.userId === 'string' ? data.userId : null,
    createdAt: createdAtTs ?? Date.now(),
    updatedAt: updatedAtTs ?? undefined,
  };
};

export const addQuestion = async (
  title: string,
  description: string,
  options: string[],
  durationPreset: DurationPreset = '1m',
): Promise<Question> => {
  const optionObjects = options.map((label, idx) => normalizeOption(label, idx));
  const createdAt = serverTimestamp();
  const expiresAt = Timestamp.fromDate(addDuration(new Date(), durationPreset));
  const payload = {
    title,
    description,
    status: 'open',
    createdAt,
    durationPreset,
    expiresAt,
    options: optionObjects,
    voteTotals: optionObjects.reduce<Record<string, number>>((totals, option) => {
      totals[option.id] = 0;
      return totals;
    }, {}),
  };
  const ref = await addDoc(collection(db, QUESTIONS_COLLECTION), payload);
  const [newQuestion] = await getQuestions();
  // Fallback to basic return if fetch fails
  return newQuestion ?? {
    id: ref.id,
    title,
    description,
    status: 'open',
    createdAt: Date.now(),
    durationPreset,
    expiresAt: expiresAt.toDate?.() ?? null,
    options: payload.options,
    voteTotals: payload.voteTotals,
  };
};

export const deleteQuestion = async (questionId: string): Promise<void> => {
  const batch = writeBatch(db);
  batch.delete(doc(db, QUESTIONS_COLLECTION, questionId));
  const votesSnap = await getDocs(query(collection(db, VOTES_COLLECTION), where('questionId', '==', questionId)));
  votesSnap.forEach((voteDoc) => batch.delete(voteDoc.ref));
  await batch.commit();
};

export const getVotes = async (questionId?: string): Promise<Vote[]> => {
  const voteQuery = questionId
    ? query(collection(db, VOTES_COLLECTION), where('questionId', '==', questionId), orderBy('createdAt', 'desc'))
    : query(collection(db, VOTES_COLLECTION), orderBy('createdAt', 'desc'));

  const votesSnap = await getDocs(voteQuery);
  return votesSnap.docs.map(mapVoteDoc);
};

const findExistingVoteDoc = async (questionId: string, userId?: string | null, flat?: string) => {
  const normalizedFlat = flat ? normalizeFlat(flat) : '';
  if (userId) {
    const byUserQuery = query(
      collection(db, VOTES_COLLECTION),
      where('questionId', '==', questionId),
      where('userId', '==', userId),
    );
    const byUserSnapshot = await getDocs(byUserQuery);
    if (!byUserSnapshot.empty) {
      return byUserSnapshot.docs[0];
    }
  }

  if (normalizedFlat) {
    const byFlatQuery = query(
      collection(db, VOTES_COLLECTION),
      where('questionId', '==', questionId),
      where('flat', '==', normalizedFlat),
    );
    const byFlatSnapshot = await getDocs(byFlatQuery);
    if (!byFlatSnapshot.empty) {
      return byFlatSnapshot.docs[0];
    }
  }

  return null;
};

export const submitVote = async (
  questionId: string,
  optionId: string,
  userName: string,
  flat: string,
  userId: string,
): Promise<Vote> => {
  const trimmedName = userName.trim();
  const trimmedFlat = normalizeFlat(flat);

  if (!userId) {
    throw new Error('You need to be signed in to cast a vote.');
  }

  if (!trimmedName) {
    throw new Error('Please provide your name to vote.');
  }

  if (!trimmedFlat) {
    throw new Error('Please provide your flat number to vote.');
  }

  const payload = {
    questionId,
    optionId,
    userName: trimmedName,
    voterName: trimmedName,
    userNameLower: trimmedName.toLowerCase(),
    flat: trimmedFlat,
    userId,
    createdAt: serverTimestamp(),
  };

  const existing = await findExistingVoteDoc(questionId, userId, trimmedFlat);

  if (existing) {
    await updateDoc(existing.ref, {
      ...payload,
      createdAt: existing.data()?.createdAt ?? serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return mapVoteDoc({
      id: existing.id,
      data: () => ({
        ...existing.data(),
        ...payload,
        createdAt: (existing.data() as Record<string, unknown>).createdAt,
        updatedAt: Date.now(),
      }),
    });
  }

  const ref = await addDoc(collection(db, VOTES_COLLECTION), payload);

  return {
    id: ref.id,
    questionId,
    optionId,
    userName: trimmedName,
    userNameLower: trimmedName.toLowerCase(),
    flat: trimmedFlat,
    userId,
    createdAt: Date.now(),
  };
};

export const hasExistingVoteForFlat = async (questionId: string, flat: string): Promise<boolean> => {
  const normalizedFlat = normalizeFlat(flat);

  if (!normalizedFlat) return false;

  const voteQuery = query(
    collection(db, VOTES_COLLECTION),
    where('questionId', '==', questionId),
    where('flat', '==', normalizedFlat),
  );

  const snapshot = await getDocs(voteQuery);
  return !snapshot.empty;
};

export const getExistingVoteForUser = async (
  questionId: string,
  userId?: string | null,
  flat?: string,
): Promise<Vote | null> => {
  const existing = await findExistingVoteDoc(questionId, userId, flat);
  if (!existing) return null;
  return mapVoteDoc(existing);
};
