"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { BaseQuestion } from "@/components/review/review-session/base-question"
import { AudioButton } from "@/components/review/review-session/audio-button"
import type { BaseQuestionProps } from "@/components/review/review-session/base-question"
import { useBaseQuestion } from "@/contexts/BaseQuestionContext"
import ListeningQuestionContent from "./contents/ListeningQuestionContent"

export function ListeningQuestion({ vocabularyItem, onAnswer, onSkip }: BaseQuestionProps) {
  
  return (
    <BaseQuestion
      vocabularyItem={vocabularyItem}
      onAnswer={onAnswer}
      onSkip={onSkip}
      validateAnswer={(answer) => answer.toLowerCase().trim() === vocabularyItem.word.toLowerCase().trim()}
      correctAnswer={vocabularyItem.word}
    >
      <ListeningQuestionContent vocabularyItem={vocabularyItem}/>
    </BaseQuestion>
  )
}
