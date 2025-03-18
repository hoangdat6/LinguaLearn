import { VocabularyItem } from "@/types/lesson-types"
import type { QuestionType, ReviewSessionResults } from "@/types/review"

// Question types
export const QUESTION_TYPES: QuestionType[] = ["multiple-choice", "translation", "fill-in-blank", "listening"]

export const ReviewService = {
  // Initialize empty results
  createEmptyResults(): ReviewSessionResults {
    return {
      correct: 0,
      incorrect: 0,
      skipped: 0,
      totalTime: 0,
      questionResults: [],
    }
  },

  // Get a random question type
  getRandomQuestionType(): QuestionType {
    const randomIndex = Math.floor(Math.random() * QUESTION_TYPES.length)
    return QUESTION_TYPES[randomIndex]
  },

  // Get question type based on word proficiency level
  getQuestionTypeByLevel(level: number): QuestionType {
    if (level <= 2) {
      // For beginner levels, use simpler question types
      return Math.random() > 0.5 ? "multiple-choice" : "listening"
    } else if (level <= 4) {
      // For intermediate levels, use medium difficulty
      return Math.random() > 0.5 ? "translation" : "fill-in-blank"
    } else {
      // For advanced levels, use any question type
      return QUESTION_TYPES[Math.floor(Math.random() * QUESTION_TYPES.length)]
    }
  },

  // Generate options for multiple choice questions
  generateMultipleChoiceOptions(correctMeaning: string): string[] {
    const options = [correctMeaning, "Tạm biệt", "Cảm ơn", "Xin lỗi", "Không có gì", "Hẹn gặp lại"]

    const shuffled = options
      .filter((opt) => opt !== correctMeaning)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)

    shuffled.push(correctMeaning)
    return shuffled.sort(() => Math.random() - 0.5)
  },

  // Calculate mastery level based on accuracy
  calculateMasteryLevel(accuracy: number): { level: string; color: string } {
    if (accuracy >= 90) return { level: "Xuất sắc", color: "text-purple-600" }
    if (accuracy >= 80) return { level: "Giỏi", color: "text-blue-600" }
    if (accuracy >= 70) return { level: "Khá", color: "text-green-600" }
    if (accuracy >= 60) return { level: "Trung bình", color: "text-yellow-600" }
    return { level: "Cần cải thiện", color: "text-red-600" }
  },

  // Check if an answer is correct based on question type
  checkAnswer(questionType: QuestionType, answer: string, vocabularyItem: VocabularyItem): boolean {
    switch (questionType) {
      case "multiple-choice":
        return answer === vocabularyItem.meaning
      case "translation":
        return answer.toLowerCase().trim() === vocabularyItem.meaning.toLowerCase().trim()
      case "fill-in-blank":
      case "listening":
        return answer.toLowerCase().trim() === vocabularyItem.word.toLowerCase().trim()
      default:
        return false
    }
  },
}

