"use client"

import { useState } from "react"
import { MultipleChoiceQuestion } from "@/components/review/review-session/multiple-choice-question"
import { TranslationQuestion } from "@/components/review/review-session/translation-question"
import { FillInBlankQuestion } from "@/components/review/review-session/fill-in-blank-question"
import { ListeningQuestion } from "@/components/review/review-session/listening-question"
import { ReviewService } from "@/services/review-service"
import type { QuestionType } from "@/types/review"
import { VocabularyItem } from "@/types/lesson-types"

interface ReviewQuestionProps {
  questionType: QuestionType
  vocabularyItem: VocabularyItem
  onAnswer: (isCorrect: boolean, timeSpent: number) => void
  onSkip: () => void
}

export function ReviewQuestion({ questionType, vocabularyItem, onAnswer, onSkip }: ReviewQuestionProps) {
  const [startTime] = useState(Date.now())

  // Generate options for multiple choice
  const options =
    questionType === "multiple-choice" ? ReviewService.generateMultipleChoiceOptions(vocabularyItem.meaning) : []

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

