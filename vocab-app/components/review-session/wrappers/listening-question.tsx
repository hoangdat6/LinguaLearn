"use client"

import type { BaseQuestionProps } from "@/components/review-session/base-question"
import { BaseQuestion } from "@/components/review-session/base-question"
import ListeningQuestionContent from "../contents/listening-question-content"

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
