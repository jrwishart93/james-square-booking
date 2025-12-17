import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Question, Vote } from '../types';

const QUESTIONS_COLLECTION = 'voting_questions';
const VOTES_COLLECTION = 'voting_votes';

const normalizeOption = (label: string, index: number) => ({
  id: `${Date.now()}-${index}`,
  label,
});

const mapQuestionDoc = (snap: { id: string; data: () => Record<string, unknown> }): Question => {
  const data = snap.data();
  const createdAtTs = (data.createdAt as { toMillis?: () => number })?.toMillis?.();
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
    status: typeof data.status === 'string' && data.status.toLowerCase() === 'open' ? 'open' : 'closed',
    createdAt: createdAtTs ?? Date.now(),
    options,
    voteTotals,
  };
};

export const getQuestions = async (): Promise<Question[]> => {
  const qs = query(collection(db, QUESTIONS_COLLECTION), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(qs);
  return snapshot.docs.map(mapQuestionDoc);
};

export const addQuestion = async (
  title: string,
  description: string,
  options: string[],
): Promise<Question> => {
  const optionObjects = options.map((label, idx) => normalizeOption(label, idx));
  const payload = {
    title,
    description,
    status: 'open',
    createdAt: serverTimestamp(),
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
  return votesSnap.docs.map((snap) => {
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
  });
};

export const submitVote = async (
  questionId: string,
  optionId: string,
  voterName: string,
  flat: string,
  userId: string | null = null,
): Promise<Vote> => {
  const trimmedName = voterName.trim();
  const trimmedFlat = flat.trim();

  if (!trimmedName) {
    throw new Error('Please provide your name to vote.');
  }

  if (!trimmedFlat) {
    throw new Error('Please provide your flat number to vote.');
  }

  const payload = {
    questionId,
    optionId,
    voterName: trimmedName,
    flat: trimmedFlat,
    userId,
    createdAt: serverTimestamp(),
  };

  const ref = await addDoc(collection(db, VOTES_COLLECTION), payload);

  return {
    id: ref.id,
    questionId,
    optionId,
    voterName: trimmedName,
    flat: trimmedFlat,
    userId,
    createdAt: Date.now(),
  };
};
