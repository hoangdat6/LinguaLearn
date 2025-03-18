// BaseQuestion.tsx
"use client";

import { QuestionFeedback } from "@/components/review/review-session/question-feedback";
import { Button } from "@/components/ui/button";
import { BaseQuestionContext } from "@/contexts/BaseQuestionContext";
import { VocabularyItem } from "@/types/lesson-types";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";

export interface BaseQuestionProps {
  vocabularyItem: VocabularyItem;
  onAnswer: (isCorrect: boolean, timeSpent: number) => void;
  onSkip: () => void;
}

export function BaseQuestion({
  children,
  vocabularyItem,
  correctAnswer,
  onAnswer,
  onSkip,
  validateAnswer,
}: BaseQuestionProps & {
   children: React.ReactNode;
  correctAnswer: string;
  validateAnswer: (answer: string) => boolean;
}) {
  const [answer, setAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [startTime] = useState(Date.now());
  console.log("Base")

  const handleSubmit = () => {
    const timeSpent = (Date.now() - startTime) / 1000;
    const correct = validateAnswer(answer);

    setIsCorrect(correct);
    setShowResult(true);

    setTimeout(() => {
      setShowResult(false);
      onAnswer(correct, timeSpent);
    }, 1500);
  };

  return (
    <BaseQuestionContext.Provider value={{ answer, setAnswer, handleSubmit }}>
      <div className="space-y-4">
        {children}

        <AnimatePresence>
          {showResult && <QuestionFeedback isCorrect={isCorrect} correctAnswer={correctAnswer} />}
        </AnimatePresence>
        <QuestionActions onSubmit={handleSubmit} onSkip={onSkip} disabled={!answer} />
      </div>
    </BaseQuestionContext.Provider>
  );
}

export function QuestionActions({
  onSkip,
  onSubmit,
  disabled = false,
}: {
  onSkip: () => void;
  onSubmit: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex justify-between mt-6">
      <Button variant="outline" onClick={onSkip}>
        Mình không nhớ từ này (^_^)
      </Button>
      <Button onClick={onSubmit} disabled={disabled}>
        Kiểm tra
      </Button>
    </div>
  );
}
