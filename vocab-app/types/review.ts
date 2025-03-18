import { VocabularyItem } from "./lesson-types"

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
  currentVocabularyItem: VocabularyItem
  learningQueue: number[] // Add learning queue to the state
}

