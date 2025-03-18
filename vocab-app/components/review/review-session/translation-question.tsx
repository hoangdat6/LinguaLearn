"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { BaseQuestion, QuestionActions } from "@/components/review/review-session/base-question"
import { AudioButton } from "@/components/review/review-session/audio-button"
import type { BaseQuestionProps } from "@/components/review/review-session/base-question"
import { TranslationQuestionContent } from "./contents/translation-question-content"

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

