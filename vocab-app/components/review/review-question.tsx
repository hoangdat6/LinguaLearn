"use client"

import { FillInBlankQuestion } from "@/components/review/review-session/fill-in-blank-question"
import { ListeningQuestion } from "@/components/review/review-session/listening-question"
import { MultipleChoiceQuestion } from "@/components/review/review-session/multiple-choice-question"
import { TranslationQuestion } from "@/components/review/review-session/translation-question"
import { ReviewService } from "@/services/review-service"
import { Word } from "@/types/lesson-types"
import type { QuestionType, ReviewWordState as ReviewWord } from "@/types/review"

interface ReviewQuestionProps {
  questionType: QuestionType
  vocabularyItem: Word
  reviewWords: ReviewWord[]
  onAnswer: (isCorrect: boolean, timeSpent: number) => void
  onSkip: () => void
}

export function ReviewQuestion({ questionType, vocabularyItem, reviewWords , onAnswer, onSkip }: ReviewQuestionProps) {
  // Generate options for multiple choice
  const options =
    questionType === "multiple-choice" ? ReviewService.generateMultipleChoiceOptions(vocabularyItem.word, reviewWords) : []

  // Render the appropriate question component based on type
  switch (questionType) {
    case "multiple-choice":
      return <MultipleChoiceQuestion vocabularyItem={vocabularyItem} options={options} onAnswer={onAnswer} onSkip={onSkip} />
    case "translation":
      return <TranslationQuestion vocabularyItem={vocabularyItem} onAnswer={onAnswer} onSkip={onSkip} />
    case "fill-in-blank":
      return <FillInBlankQuestion vocabularyItem={vocabularyItem} onAnswer={onAnswer} onSkip={onSkip} />
    case "listening":
      return <ListeningQuestion vocabularyItem={vocabularyItem} onAnswer={onAnswer} onSkip={onSkip} />
    default:
      return null
  }
}

