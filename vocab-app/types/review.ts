import { Word } from "./lesson-types"

export type QuestionType = "multiple-choice" | "translation" | "fill-in-blank" | "listening" 

export interface QuestionResult {
  word: string
  correct: boolean
  time: number
}

export interface ReviewSessionResults {
  correct: number
  incorrect: number
  skipped: number
  totalTime: number
  questionResults: QuestionResult[]
}

export interface ReviewSessionState {
  sessionState: "in-progress" | "completed"
  progress: number
  hearts: number
  currentQuestionIndex: number
  currentQuestionType: QuestionType
  results: ReviewSessionResults
  sessionStartTime: number
  currentWordIndex: number
  currentVocabularyItem: Word
  learningQueue: number[] // Add learning queue to the state
}

export interface ReviewWordState {
  id: number;
  word: Word;
  next_review: string;
  last_review: string;
  learned_at: string;
  user: number;
  level: number;
  streak: number;
  is_correct?: boolean;
  is_in_learning_queue?: boolean;
  is_reviewed?: boolean;
  question_type?: QuestionType;
}


