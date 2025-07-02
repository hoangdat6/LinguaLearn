"use client"

import type { BaseQuestionProps } from "@/components/review-session/base-question"
import { BaseQuestion } from "@/components/review-session/base-question"
import { ListeningMultipleChoiceQuestionContent } from "../contents/listening-multiple-choice-content"
import { Word } from "@/types/lesson-types"

interface MultipleChoiceQuestionProps extends BaseQuestionProps {
  options: Word[]
}

export function ListeningMultipleChoiceQuestion({ vocabularyItem, options, onAnswer, onSkip }: MultipleChoiceQuestionProps) {

  return (
    <BaseQuestion
      vocabularyItem={vocabularyItem}
      onAnswer={onAnswer}
      onSkip={onSkip}
      validateAnswer={(answer) => answer === vocabularyItem.word}
      correctAnswer={vocabularyItem.word}
    >
      <ListeningMultipleChoiceQuestionContent vocabularyItem={vocabularyItem} options={options} />
    </BaseQuestion>
  )

}

