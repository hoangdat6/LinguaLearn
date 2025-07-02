"use client"

import type { BaseQuestionProps } from "@/components/review-session/base-question"
import { BaseQuestion } from "@/components/review-session/base-question"
import { TranslationQuestionContent } from "../contents/translation-question-content"

export function TranslationQuestion({ vocabularyItem, onAnswer, onSkip }: BaseQuestionProps) {

  return (
    <BaseQuestion
      vocabularyItem={vocabularyItem}
      onAnswer={onAnswer}
      onSkip={onSkip}
      validateAnswer={(answer) => answer.toLowerCase().trim() === vocabularyItem.word.toLowerCase().trim()}
      correctAnswer={vocabularyItem.word}
    >
      <TranslationQuestionContent vocabularyItem={vocabularyItem}/>
    </BaseQuestion>
  )
}

