// FillInBlankQuestion.tsx
"use client";

import { BaseQuestion, BaseQuestionProps } from "./base-question";
import FillInBlankQuestionContent from "./contents/fill-in-black-question-content";

export function FillInBlankQuestion({ vocabularyItem, onAnswer, onSkip }: BaseQuestionProps) {

  // Tạo câu với chỗ trống

  return (
    <BaseQuestion
      vocabularyItem={vocabularyItem}
      onAnswer={onAnswer}
      onSkip={onSkip}
      validateAnswer={(answer) => answer.toLowerCase().trim() === vocabularyItem.word.toLowerCase().trim()}
      correctAnswer={vocabularyItem.word}
    >
      <FillInBlankQuestionContent vocabularyItem={vocabularyItem} />
    </BaseQuestion>
  );

}
