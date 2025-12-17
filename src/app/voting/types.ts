export type QuestionStatus = 'open' | 'closed';

export interface Option {
  id: string;
  label: string;
}

export interface Question {
  id: string;
  title: string;
  description?: string;
  options: Option[];
  status: QuestionStatus;
  createdAt: number;
  voteTotals?: Record<string, number>;
}

export interface Vote {
  id: string;
  questionId: string;
  optionId: string;
  userName: string;
  userNameLower?: string;
  flat: string;
  userId?: string | null; // Prepared for Firebase Auth
  createdAt: number;
}

export interface QuestionStats {
  question: Question;
  totalVotes: number;
  results: {
    option: Option;
    count: number;
    percentage: number;
  }[];
}
