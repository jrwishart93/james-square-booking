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

  return {
    id: snap.id,
    title: typeof data.title === 'string' ? data.title : 'Untitled question',
    description: typeof data.description === 'string' ? data.description : undefined,
    status: typeof data.status === 'string' && data.status.toLowerCase() === 'open' ? 'open' : 'closed',
    createdAt: createdAtTs ?? Date.now(),
    options,
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
  const payload = {
    title,
    description,
    status: 'open',
    createdAt: serverTimestamp(),
    options: options.map((label, idx) => normalizeOption(label, idx)),
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
  };
};

export const deleteQuestion = async (questionId: string): Promise<void> => {
  const batch = writeBatch(db);
  batch.delete(doc(db, QUESTIONS_COLLECTION, questionId));
  const votesSnap = await getDocs(query(collection(db, VOTES_COLLECTION), where('questionId', '==', questionId)));
  votesSnap.forEach((voteDoc) => batch.delete(voteDoc.ref));
  await batch.commit();
};

export const getVotes = async (): Promise<Vote[]> => {
  const votesSnap = await getDocs(collection(db, VOTES_COLLECTION));
  return votesSnap.docs.map((snap) => {
    const data = snap.data() as Record<string, unknown>;
    const createdAtTs = (data.createdAt as { toMillis?: () => number })?.toMillis?.();
    return {
      id: snap.id,
      questionId: typeof data.questionId === 'string' ? data.questionId : '',
      optionId: typeof data.optionId === 'string' ? data.optionId : '',
      userName: typeof data.userName === 'string' ? data.userName : 'Unknown',
      userId: typeof data.userId === 'string' ? data.userId : null,
      createdAt: createdAtTs ?? Date.now(),
    };
  });
};

export const submitVote = async (
  questionId: string,
  optionId: string,
  userName: string,
  userId: string | null = null,
): Promise<Vote> => {
  const trimmedName = userName.trim();
  const nameLower = trimmedName.toLowerCase();

  const existing = await getDocs(
    query(
      collection(db, VOTES_COLLECTION),
      where('questionId', '==', questionId),
      where('userNameLower', '==', nameLower),
    ),
  );

  if (!existing.empty) {
    throw new Error('You have already voted on this question.');
  }

  const payload = {
    questionId,
    optionId,
    userName: trimmedName,
    userNameLower: nameLower,
    userId,
    createdAt: serverTimestamp(),
  };

  const ref = await addDoc(collection(db, VOTES_COLLECTION), payload);

  return {
    id: ref.id,
    questionId,
    optionId,
    userName: trimmedName,
    userId,
    createdAt: Date.now(),
  };
};

export const hasUserVoted = async (questionId: string, userName: string): Promise<boolean> => {
  const nameLower = userName.trim().toLowerCase();
  const existing = await getDocs(
    query(
      collection(db, VOTES_COLLECTION),
      where('questionId', '==', questionId),
      where('userNameLower', '==', nameLower),
    ),
  );
  return !existing.empty;
};
