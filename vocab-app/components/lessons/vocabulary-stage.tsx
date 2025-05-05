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
}

export function VocabularyStage({ word, stage, onCorrect, onIncorrect, onNext }: VocabularyStageProps) {
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [isLocked, setIsLocked] = useState(false) // chặn click khi submit đáp án
  const handleAnswer = (correct: boolean) => {
    setIsCorrect(correct)
    setShowFeedback(true)
    // chặn click khi submit đáp án
    if (isLocked) return;
    setIsLocked(true)

    setTimeout(() => {
      setShowFeedback(false)
      setIsLocked(false) // mở khóa click sau 1.5s
      if (correct) {
        onCorrect()
        onNext()
      } else {
        onIncorrect()
      }
    }, 1500)
  }

  // Render different components based on the current stage
  switch (stage) {
    case 1:
      return <VocabularyFlashcard word={word} onNext={onNext} />
    case 2:
      return <VocabularyAudio word={word} showFeedback={showFeedback} isCorrect={isCorrect} onAnswer={handleAnswer} />
    case 3:
      return <VocabularyTyping word={word} showFeedback={showFeedback} isCorrect={isCorrect} onAnswer={handleAnswer} />
    default:
      return null
  }
}

