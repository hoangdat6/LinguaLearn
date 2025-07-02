import { Word } from "@/types/lesson-types"
import type { QuestionType, ReviewResultTemp, ReviewSessionResults, WordReviewResult, WordReviewState } from "@/types/review"
import { createLogger } from '@/lib/logger';
import api from "./api"
import { USER_VOCABULARY } from "@/constants/api-endpoints";

const logger = createLogger('ReviewService');

export const QUESTION_TYPES: QuestionType[] = ["L1", "L2", "L3", "L4", "L5"]

// tạo 1 list word tạm để tránh trường hợp chỉ ôn 1 từ mà không có từ nào khác
export const TEMP_WORD_LIST: Word[] = [
  {
    word: "hello", meaning: "xin chào",
    id: 0,
    example: "",
    example_vi: "",
    audio: "",
    image: "",
    pronunciation: "",
    pos: "",
    cefr: "",
  },
  {
    word: "goodbye", meaning: "tạm biệt",
    id: 0,
    example: "",
    example_vi: "",
    audio: "",
    image: "",
    pronunciation: "",
    pos: "",
    cefr: "",
  },
  {
    word: "thank you", meaning: "cảm ơn",
    id: 0,
    example: "",
    example_vi: "",
    audio: "",
    image: "",
    pronunciation: "",
    pos: "",
    cefr: "",
  },
  {
    word: "sorry", meaning: "xin lỗi",
    id: 0,
    example: "",
    example_vi: "",
    audio: "",
    image: "",
    pronunciation: "",
    pos: "",
    cefr: "",
  },
  {
    word: "please", meaning: "làm ơn",
    id: 0,
    example: "",
    example_vi: "",
    audio: "",
    image: "",
    pronunciation: "",
    pos: "",
    cefr: "",
  },
]


export const ReviewService = {
  async fetchReviewWords(): Promise<WordReviewState[]> {
    try {
      const response = await api.get(USER_VOCABULARY.GET_REVIEW_WORDS)
      return response.data.words
    } catch (error) {
      logger.error("Error fetching review words:", error)
      return []
    }
  },

  async submitReviewSession(results: ReviewSessionResults): Promise<boolean> {
    try {
      await api.post(USER_VOCABULARY.SUBMIT_LEARNED_WORDS, results)
      return true
    } catch (error) {
      logger.error("Error submitting review session results:", error)
      return false
    }
  },

  createEmptyResults(): ReviewResultTemp {
    return {
      correct: 0,
      incorrect: 0,
      skipped: 0,
      totalTime: 0,
      questionResults: [],
    }
  },

  getRandomQuestionType(): QuestionType {
    const randomIndex = Math.floor(Math.random() * QUESTION_TYPES.length)
    return QUESTION_TYPES[randomIndex]
  },

  getQuestionTypeByLevel(level: number): QuestionType {
    if (level <= 2) {
      return Math.random() > 0.5 ? "L1" : "L2"
    } else if (level <= 4) {
      return Math.random() > 0.5 ? "L3" : "L4";
    } else {
      return QUESTION_TYPES[Math.floor(Math.random() * QUESTION_TYPES.length)]
    }
  },

  generateMultipleChoiceOptions(correctWord: Word, reviewWords: WordReviewState[]): Word[] {
    const filteredWords = reviewWords.filter((word) => word.word.word !== correctWord.word)
    const randomWords = filteredWords
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((word) => word.word)
    randomWords.push(correctWord)
    const shuffled = randomWords.sort(() => Math.random() - 0.5)
    
    return shuffled.sort(() => Math.random() - 0.5)
  },

  calculateMasteryLevel(accuracy: number): { level: string; color: string } {
    if (accuracy >= 90) return { level: "Xuất sắc", color: "text-purple-600" }
    if (accuracy >= 80) return { level: "Giỏi", color: "text-blue-600" }
    if (accuracy >= 70) return { level: "Khá", color: "text-green-600" }
    if (accuracy >= 60) return { level: "Trung bình", color: "text-yellow-600" }
    return { level: "Cần cải thiện", color: "text-red-600" }
  },

  // Check if an answer is correct based on question type
  checkAnswer(questionType: QuestionType, answer: string, vocabularyItem: Word): boolean {
    switch (questionType) {
      case "L1":
        return answer === vocabularyItem.meaning
      case "L3":
        return answer.toLowerCase().trim() === vocabularyItem.meaning.toLowerCase().trim()
      case "L4":
      case "L2":
        return answer.toLowerCase().trim() === vocabularyItem.word.toLowerCase().trim()
      default:
        return false
    }
  },
}

