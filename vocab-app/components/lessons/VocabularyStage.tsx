"use client"

import { useState } from "react"
import { VocabularyFlashcard } from "./VocabularyFlashcard"
import { VocabularyAudio } from "./VocabularyAudio"
import { VocabularyTyping } from "./VocabularyTyping"
import { VocabularyItem } from "@/types/lesson-types"

interface VocabularyStageProps {
  word: VocabularyItem
  stage: number
  onCorrect: () => void
  onIncorrect: () => void
  onNext: () => void
}

export function VocabularyStage({ word, stage, onCorrect, onIncorrect, onNext }: VocabularyStageProps) {
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleAnswer = (correct: boolean) => {
    setIsCorrect(correct)
    setShowFeedback(true)

    setTimeout(() => {
      setShowFeedback(false)
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

