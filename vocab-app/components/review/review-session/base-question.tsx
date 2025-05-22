// BaseQuestion.tsx
"use client";

import { QuestionFeedback } from "@/components/review/review-session/question-feedback";
import { Button } from "@/components/ui/button";
import { BaseQuestionContext } from "@/contexts/BaseQuestionContext";
import { Word } from "@/types/lesson-types";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";

export interface BaseQuestionProps {
  vocabularyItem: Word;
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

  const handleSubmit = () => {
    const timeSpent = (Date.now() - startTime) / 1000;
    const correct = validateAnswer(answer);

    setIsCorrect(correct);
    setShowResult(true);
    
  };

  const handleContinue = () => {
    setShowResult(false);
    onAnswer(isCorrect, (Date.now() - startTime) / 1000);
    setAnswer("");
  };

  return (
    <BaseQuestionContext.Provider value={{ answer, setAnswer, handleSubmit }}>
      <div className="space-y-4">
        {children}

        <AnimatePresence>
          {showResult && (
            <QuestionFeedback 
              isCorrect={isCorrect} 
              correctAnswer={correctAnswer} 
              vocabularyItem={vocabularyItem}
              onContinue={handleContinue} 
            />
          )}
        </AnimatePresence>
        {!showResult && (
          <QuestionActions onSubmit={handleSubmit} onSkip={onSkip} disabled={!answer} />
        )}
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
      <Button 
        variant="outline" 
        onClick={onSkip}
        className="border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50"
      >
        Mình không nhớ từ này (^_^)
      </Button>
      <Button 
        onClick={onSubmit} 
        disabled={disabled}
        className="px-6 font-medium"
      >
        Kiểm tra
      </Button>
    </div>
  );
}
