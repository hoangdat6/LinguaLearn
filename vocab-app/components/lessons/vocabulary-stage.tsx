"use client"

import { useState } from "react"
import { VocabularyFlashcard } from "./vocabulary-flashcard"
import { VocabularyAudio } from "./vocabulary-audio"
import { VocabularyTyping } from "./vocabulary-typing"
import { Word } from "@/types/lesson-types"

interface VocabularyStageProps {
  word: Word
  stage: number
  onCorrect: () => void
  onIncorrect: () => void
  onNext: () => void

  disableAutoPlay?: boolean // thêm prop này để kiểm soát auto play từ ngoài
}

export function VocabularyStage({ word, stage, onCorrect, onIncorrect, onNext, disableAutoPlay }: VocabularyStageProps) {
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [answered, setAnswered] = useState(false);

  const handleAnswer = (correct: boolean) => {
    setIsCorrect(correct)
    setShowFeedback(true)
    setAnswered(correct)
    if (!correct) {
      onIncorrect();
    }
  }

  const handleNext = () => {
    if (answered) {
      setShowFeedback(false);
      setAnswered(false);
      setIsCorrect(false);
      onCorrect();
      onNext();
    }
  }

  // Render different components based on the current stage
  switch (stage) {
    case 1:
      return <VocabularyFlashcard word={word} onNext={onNext} disableAutoPlay={disableAutoPlay} />
    case 2:
      return <VocabularyAudio word={word} onAnswer={handleAnswer} onNext={handleNext} disableAutoPlay={disableAutoPlay} />
    case 3:
      return <VocabularyTyping word={word} onAnswer={handleAnswer} onNext={handleNext} />
    default:
      return null
  }
}

