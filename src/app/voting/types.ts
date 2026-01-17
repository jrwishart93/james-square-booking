import type { DurationPreset } from '@/lib/voteExpiry';

export type QuestionStatus = 'open' | 'closed' | 'scheduled';

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
  createdAt?: number | Date | string;
  durationPreset?: DurationPreset;
  expiresAt?: number | Date | string | null;
  startsAt?: number | Date | string | null;
  showLiveResults?: boolean;
  specialType?: 'factor_vote_2026' | string;
  documents?: {
    myreside?: { label: string; href: string }[];
    newton?: { label: string; href: string }[];
  };
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
  updatedAt?: number;
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
