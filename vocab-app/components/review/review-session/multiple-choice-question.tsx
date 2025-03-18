"use client"

import type { BaseQuestionProps } from "@/components/review/review-session/base-question"
import { BaseQuestion } from "@/components/review/review-session/base-question"
import { MultipleChoiceQuestionContent } from "./contents/multiple-choice-question-content"

interface MultipleChoiceQuestionProps extends BaseQuestionProps {
  options: string[]
}

export function MultipleChoiceQuestion({ vocabularyItem, options, onAnswer, onSkip }: MultipleChoiceQuestionProps) {

  return (
    <BaseQuestion
      vocabularyItem={vocabularyItem}
      onAnswer={onAnswer}
      onSkip={onSkip}
      validateAnswer={(answer) => answer === vocabularyItem.meaning}
      correctAnswer={vocabularyItem.meaning}
    >
      <MultipleChoiceQuestionContent vocabularyItem={vocabularyItem} options={options} />
    </BaseQuestion>
  )

}

