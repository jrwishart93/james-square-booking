import { Question, Vote } from '../types';

const hasStorage = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const STORAGE_KEYS = {
  QUESTIONS: 'ovh_questions',
  VOTES: 'ovh_votes',
};

// --- Mock Data Seeding (client-only) ---

const seedData = () => {
  if (!hasStorage) return;
  if (localStorage.getItem(STORAGE_KEYS.QUESTIONS)) return;

  const now = Date.now();
  
  const questions: Question[] = [
    {
      id: 'q1',
      title: 'Should we repaint the hallway?',
      description: 'The current paint is peeling. Choosing a neutral color.',
      status: 'open',
      createdAt: now,
      options: [
        { id: 'o1', label: 'Yes, repaint immediately' },
        { id: 'o2', label: 'Wait until next year' },
        { id: 'o3', label: 'No, it looks fine' },
      ],
    },
    {
      id: 'q2',
      title: 'Annual Meeting Date',
      description: 'Please select your preferred month for the AGM.',
      status: 'open',
      createdAt: now - 10000,
      options: [
        { id: 'o4', label: 'October' },
        { id: 'o5', label: 'November' },
        { id: 'o6', label: 'December' },
      ],
    },
  ];

  // Random votes for demo purposes
  const votes: Vote[] = [
    { id: 'v1', questionId: 'q1', optionId: 'o1', userName: 'Alice', createdAt: now },
    { id: 'v2', questionId: 'q1', optionId: 'o1', userName: 'Bob', createdAt: now },
    { id: 'v3', questionId: 'q1', optionId: 'o2', userName: 'Charlie', createdAt: now },
  ];

  localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify(votes));
};

seedData();

// --- Service Methods ---

export const getQuestions = async (): Promise<Question[]> => {
  // FIREBASE MIGRATION:
  // const querySnapshot = await getDocs(collection(db, "questions"));
  // return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Question));
  
  if (!hasStorage) return [];
  const data = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
  return data ? JSON.parse(data) : [];
};

export const addQuestion = async (
  title: string, 
  description: string, 
  options: string[]
): Promise<Question> => {
  // FIREBASE MIGRATION:
  // await addDoc(collection(db, "questions"), newQuestion);
  
  if (!hasStorage) return Promise.reject(new Error('Storage unavailable'));

  const questions = await getQuestions();
  const newQuestion: Question = {
    id: Date.now().toString(),
    title,
    description,
    status: 'open',
    createdAt: Date.now(),
    options: options.map((label, index) => ({
      id: `${Date.now()}-${index}`,
      label,
    })),
  };

  questions.unshift(newQuestion); // Add to top
  localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  return newQuestion;
};

export const deleteQuestion = async (questionId: string): Promise<void> => {
  if (!hasStorage) return;
  const questions = await getQuestions();
  const remainingQuestions = questions.filter((q) => q.id !== questionId);
  const votes = await getVotes();
  const remainingVotes = votes.filter((v) => v.questionId !== questionId);
  localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(remainingQuestions));
  localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify(remainingVotes));
};

export const getVotes = async (): Promise<Vote[]> => {
  // FIREBASE MIGRATION:
  // const querySnapshot = await getDocs(collection(db, "votes"));
  
  if (!hasStorage) return [];
  const data = localStorage.getItem(STORAGE_KEYS.VOTES);
  return data ? JSON.parse(data) : [];
};

export const submitVote = async (
  questionId: string,
  optionId: string,
  userName: string,
  userId: string | null = null
): Promise<Vote> => {
  // Check for duplicate locally (Firebase would use security rules or a transaction)
  if (!hasStorage) return Promise.reject(new Error('Storage unavailable'));

  const allVotes = await getVotes();
  const hasVoted = allVotes.some(v => v.questionId === questionId && v.userName.toLowerCase() === userName.toLowerCase());

  if (hasVoted) {
    throw new Error("You have already voted on this question.");
  }

  // FIREBASE MIGRATION:
  // await addDoc(collection(db, "votes"), newVote);

  const newVote: Vote = {
    id: Date.now().toString(),
    questionId,
    optionId,
    userName,
    userId,
    createdAt: Date.now(),
  };

  allVotes.push(newVote);
  localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify(allVotes));
  return newVote;
};

export const hasUserVoted = async (questionId: string, userName: string): Promise<boolean> => {
  const allVotes = await getVotes();
  return allVotes.some(v => v.questionId === questionId && v.userName.toLowerCase() === userName.toLowerCase());
};
