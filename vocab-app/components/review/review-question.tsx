"use client"

import { FillInBlankQuestion } from "@/components/review/review-session/fill-in-blank-question"
import { ListeningQuestion } from "@/components/review/review-session/listening-question"
import { MultipleChoiceQuestion } from "@/components/review/review-session/multiple-choice-question"
import { TranslationQuestion } from "@/components/review/review-session/translation-question"
import { ReviewService } from "@/services/review-service"
import { Word } from "@/types/lesson-types"
import type { QuestionType, WordReviewState as ReviewWord } from "@/types/review"
import { ListeningMultipleChoiceQuestion } from "./review-session/listening-multiple-choice-question"

interface ReviewQuestionProps {
  questionType: QuestionType
  vocabularyItem: Word 
  reviewWords: ReviewWord[]
  onAnswer: (isCorrect: boolean, timeSpent: number) => void
  onSkip: () => void
}

export function ReviewQuestion({ questionType, vocabularyItem, reviewWords , onAnswer, onSkip }: ReviewQuestionProps) {
  // Generate options for multiple choice

  // Check if the vocabulary item is null
  if (!vocabularyItem) {
    return null
  }

  const options =
    questionType === "L1" 
    ? ReviewService.generateMultipleChoiceOptions(vocabularyItem, reviewWords) 
    : []

  // Render the appropriate question component based on type
  switch (questionType) {
    case "L1":
      return <MultipleChoiceQuestion vocabularyItem={vocabularyItem} options={options} onAnswer={onAnswer} onSkip={onSkip} />
    case "L3":
      return <TranslationQuestion vocabularyItem={vocabularyItem} onAnswer={onAnswer} onSkip={onSkip} />
    case "L4":
      return <FillInBlankQuestion vocabularyItem={vocabularyItem} onAnswer={onAnswer} onSkip={onSkip} />
    case "L2":
      return <ListeningQuestion vocabularyItem={vocabularyItem} onAnswer={onAnswer} onSkip={onSkip} />
    case "L5":
      return <ListeningMultipleChoiceQuestion vocabularyItem={vocabularyItem} options={options} onAnswer={onAnswer} onSkip={onSkip} />
    default:
      return null
  }
}

