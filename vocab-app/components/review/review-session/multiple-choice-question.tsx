"use client"

import type { BaseQuestionProps } from "@/components/review/review-session/base-question"
import { BaseQuestion } from "@/components/review/review-session/base-question"
import { MultipleChoiceQuestionContent } from "./contents/multiple-choice-question-content"
import { Word } from "@/types/lesson-types"

interface MultipleChoiceQuestionProps extends BaseQuestionProps {
  options: Word[]
}

export function MultipleChoiceQuestion({ vocabularyItem, options, onAnswer, onSkip }: MultipleChoiceQuestionProps) {

  return (
    <BaseQuestion
      vocabularyItem={vocabularyItem}
      onAnswer={onAnswer}
      onSkip={onSkip}
      validateAnswer={(answer) => answer === vocabularyItem.word}
      correctAnswer={vocabularyItem.word}
    >
      <MultipleChoiceQuestionContent vocabularyItem={vocabularyItem} options={options} />
    </BaseQuestion>
  )

}

