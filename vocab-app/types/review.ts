import { Word } from "./lesson-types";

// export type QuestionType = "multiple-choice" | "listening"  | "translation" | "fill-in-blank" 
export type QuestionType = "L1" | "L2" | "L3" | "L4" | "L5"
// "L1" = multiple-choice
// "L2" = listening
// "L3" = translation
// "L4" = fill-in-blank
// "L5" = listening multiple-choice

/**
 * Đầu tiên sẽ lưu lại ReviewSessionState 
 * 
 */

// kết quả ôn tập
export interface QuestionResult {
  word: string
  correct: boolean
  time: number
}

// kết quả ôn tập tạm thời để hiển thị lên giao diện
export interface ReviewResultTemp {
  correct: number
  incorrect: number
  skipped: number
  totalTime: number
  questionResults: QuestionResult[]
}

// Lưu lại trạng thái ôn tập của từ trong review queue
export interface WordReviewResult {
  word_id: number;
  word_state_id : number;
  word_index: number;
  is_correct?: boolean | null;
  is_reviewed?: boolean | null;
  question_type?: QuestionType;
  is_skipped?: boolean | null;
}

// lưu lại trạng thái của phiên ôn tập
export interface ReviewSession {
  session_state: "in-progress" | "completed"
  progress: number
  session_start_time: number
  current_word_index: number
  reviewQueue: WordReviewResult[]
}

// kết quả trả về khi ôn tập xong
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

