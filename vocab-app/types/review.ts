import { SessionState } from "@/constants/status";
import { Word } from "./lesson-types";

/**
 * "L1" = multiple-choice 
 * "L2" = listening 
 * "L3" = translation 
 * "L4" = fill-in-blank 
 * "L5" = listening multiple-choice
 */
export type QuestionType = "L1" | "L2" | "L3" | "L4" | "L5"

export interface QuestionResult {
  word: string;
  correct: boolean;
  time: number;
  wordId?: number;
}

export interface ReviewResults {
  correct: number;
  incorrect: number;
  skipped: number;
  totalTime: number;
  questionResults: QuestionResult[];
}

export interface ReviewResultTemp {
  correct: number
  incorrect: number
  skipped: number
  totalTime: number
  questionResults: QuestionResult[]
}

export interface WordReviewResult {
  word_id: number;
  word_state_id: number;
  word_index: number;
  is_reviewed: boolean;
  is_correct: boolean | null;
  is_skipped: boolean;
  question_type: QuestionType;
}

export interface ReviewSession {
  session_state: SessionState
  progress: number
  session_start_time: number
  current_word_index: number
  reviewQueue: WordReviewResult[]
}

export interface ReviewSessionResults {
  is_review: boolean;
  lesson_id?: number; // Optional when is_review is true
  words: {
    word_id: number;
    level: number;
    streak: number;
    is_correct: boolean;
    question_type: QuestionType;
  }[];
}

// request trả về từ server thông tin của từ cần ôn tập - sẽ là 1 mảng các từ này
export interface WordReviewState {
  id: number;
  word: Word;
  next_review: string;
  last_review: string;
  learned_at: string;
  user: number;
  level: number;
  streak: number;
}

