import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
  writeBatch,
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
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
      : (data.createdAt as { toMillis?: () => number })?.toMillis?.();
  const startsAtValue =
    typeof data.startsAt === 'number'
      ? data.startsAt
      : (data.startsAt as { toMillis?: () => number })?.toMillis?.();
  const startsAt = typeof startsAtValue === 'number' ? new Date(startsAtValue) : null;
  const expiresAtValue =
    typeof data.expiresAt === 'number'
      ? data.expiresAt
      : (data.expiresAt as { toMillis?: () => number })?.toMillis?.();
  const expiresAt = typeof expiresAtValue === 'number' ? new Date(expiresAtValue) : null;
  const rawPreset = typeof data.durationPreset === 'string' ? data.durationPreset : null;
  const durationPreset = DURATION_PRESETS.some((p) => p.value === rawPreset)
    ? (rawPreset as DurationPreset)
    : undefined;
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
    status:
      typeof data.status === 'string' &&
      ['open', 'closed', 'scheduled'].includes(data.status.toLowerCase())
        ? (data.status.toLowerCase() as 'open' | 'closed' | 'scheduled')
        : 'closed',
    createdAt: createdAtTs ?? Date.now(),
    durationPreset,
    startsAt,
    expiresAt,
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
  durationPreset?: DurationPreset,
  customWindow?: { startsAt: Date; expiresAt: Date },
): Promise<Question> => {
  const optionObjects = options.map((label, idx) => normalizeOption(label, idx));
  const createdAt = serverTimestamp();
  const preset = durationPreset ?? '1m';
  const expiresAt = Timestamp.fromDate(
    customWindow ? customWindow.expiresAt : addDuration(new Date(), preset),
  );
  const startsAt = customWindow ? Timestamp.fromDate(customWindow.startsAt) : undefined;
  const payload = {
    title,
    description,
    status: customWindow ? 'scheduled' : 'open',
    createdAt,
    expiresAt,
    options: optionObjects,
    voteTotals: optionObjects.reduce<Record<string, number>>((totals, option) => {
      totals[option.id] = 0;
      return totals;
    }, {}),
    ...(customWindow ? { startsAt } : { durationPreset: preset }),
  };
  const ref = await addDoc(collection(db, QUESTIONS_COLLECTION), payload);
  const [newQuestion] = await getQuestions();
  // Fallback to basic return if fetch fails
  return newQuestion ?? {
    id: ref.id,
    title,
    description,
    status: customWindow ? 'scheduled' : 'open',
    createdAt: Date.now(),
    durationPreset: customWindow ? undefined : preset,
    startsAt: customWindow?.startsAt ?? null,
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

export const submitVote = async (
  questionId: string,
  optionId: string,
  userName: string,
  flat: string,
): Promise<Vote> => {
  const user = auth.currentUser;

  if (!user || !user.email) {
    throw new Error('User must be logged in with a valid email to vote.');
  }

  const voteRef = doc(db, VOTES_COLLECTION, `${questionId}_${user.uid}`);
  const existingSnap = await getDoc(voteRef);
  const votePayload = {
    questionId,
    optionId,
    userId: user.uid,
    userName,
    userEmail: user.email,
    flat,
    updatedAt: serverTimestamp(),
    ...(existingSnap.exists() ? {} : { createdAt: serverTimestamp() }),
  };

  await setDoc(voteRef, votePayload, { merge: true });

  return {
    id: voteRef.id,
    questionId,
    optionId,
    userName,
    flat,
    userId: user.uid,
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
): Promise<Vote | null> => {
  if (!userId) return null;
  const voteRef = doc(db, VOTES_COLLECTION, `${questionId}_${userId}`);
  const voteSnap = await getDoc(voteRef);
  if (!voteSnap.exists()) return null;
  return mapVoteDoc(voteSnap);
};
