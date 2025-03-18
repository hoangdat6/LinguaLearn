"use client"

import { useState, useEffect, useCallback } from "react"
import type { QuestionType, ReviewSessionResults, QuestionResult } from "@/types/review"
import { ReviewService, QUESTION_TYPES } from "@/services/review-service"
import { VocabularyItem } from "@/types/lesson-types"

interface UseReviewSessionProps {
  vocabularyItems: VocabularyItem[]
  totalQuestions?: number
  maxHearts?: number
}

export function useReviewSession({ vocabularyItems, totalQuestions = 10, maxHearts = 5 }: UseReviewSessionProps) {
  // Session state
  const [sessionState, setSessionState] = useState<"in-progress" | "completed">("in-progress")
  const [progress, setProgress] = useState(0)
  const [hearts, setHearts] = useState(maxHearts)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [currentQuestionType, setCurrentQuestionType] = useState<QuestionType>(QUESTION_TYPES[0])
  const [sessionStartTime] = useState(Date.now())
  const [currentWordIndex, setCurrentWordIndex] = useState(0)

  // Add learning queue for incorrectly answered or skipped words
  const [learningQueue, setLearningQueue] = useState<number[]>([])

  // Results state
  const [results, setResults] = useState<ReviewSessionResults>(ReviewService.createEmptyResults())

  // Select question type based on word proficiency level
  const selectQuestionTypeByLevel = useCallback((level: number): QuestionType => {
    // Level 1-2: Easier question types (multiple-choice, listening)
    // Level 3-4: Medium difficulty (translation, fill-in-blank)
    // Level 5: All question types

    if (level <= 2) {
      return Math.random() > 0.5 ? "multiple-choice" : "listening"
    } else if (level <= 4) {
      return Math.random() > 0.5 ? "translation" : "fill-in-blank"
    } else {
      return QUESTION_TYPES[Math.floor(Math.random() * QUESTION_TYPES.length)]
    }
  }, [])

  // Update question type and word index when question index changes
  useEffect(() => {
    if (vocabularyItems.length === 0) return

    // Check if there are words in the learning queue
    if (learningQueue.length > 0 && currentQuestionIndex >= totalQuestions / 2) {
      // After half the session, start incorporating words from the learning queue
      const useQueueItem = Math.random() > 0.5

      if (useQueueItem && learningQueue.length > 0) {
        // Use a word from the learning queue
        const queueIndex = Math.floor(Math.random() * learningQueue.length)
        setCurrentWordIndex(learningQueue[queueIndex])

        // Remove the word from the queue to avoid immediate repetition
        setLearningQueue((prev) => prev.filter((_, i) => i !== queueIndex))
      } else {
        // Use a regular word
        setCurrentWordIndex(currentQuestionIndex % vocabularyItems.length)
      }
    } else {
      // Regular word selection
      setCurrentWordIndex(currentQuestionIndex % vocabularyItems.length)
    }

    // Set question type based on word proficiency level
    const wordLevel = vocabularyItems[currentWordIndex]?.level || 1
    setCurrentQuestionType(selectQuestionTypeByLevel(wordLevel))
  }, [
    currentQuestionIndex,
    vocabularyItems,
    learningQueue,
    totalQuestions,
    selectQuestionTypeByLevel,
    currentWordIndex,
  ])

  // Get current vocabulary item
  const currentVocabularyItem = vocabularyItems[currentWordIndex] || {
    id: 0,
    word: "",
    meaning: "",
    example: "",
    pronunciation: "",
    level: 1,
  }

  // Handle answer
  const handleAnswer = (isCorrect: boolean, timeSpent: number) => {
    // Update results
    const newQuestionResult: QuestionResult = {
      word: currentVocabularyItem.word,
      correct: isCorrect,
      time: timeSpent,
    }

    setResults((prev) => ({
      ...prev,
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      incorrect: !isCorrect ? prev.incorrect + 1 : prev.incorrect,
      totalTime: prev.totalTime + timeSpent,
      questionResults: [...prev.questionResults, newQuestionResult],
    }))

    // If incorrect, add to learning queue
    if (!isCorrect) {
      setLearningQueue((prev) => [...prev, currentWordIndex])
      setHearts((prev) => Math.max(0, prev - 1))
    }

    // Update progress
    const newProgress = ((currentQuestionIndex + 1) / totalQuestions) * 100
    setProgress(newProgress)

    // Move to next question or end session
    if (currentQuestionIndex < totalQuestions - 1 && hearts > 0) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      // End session
      setSessionState("completed")
    }
  }

  // Handle skip
  const handleSkip = () => {
    const newQuestionResult: QuestionResult = {
      word: currentVocabularyItem.word,
      correct: false,
      time: 0,
    }

    setResults((prev) => ({
      ...prev,
      skipped: prev.skipped + 1,
      questionResults: [...prev.questionResults, newQuestionResult],
    }))

    // Add skipped word to learning queue
    setLearningQueue((prev) => [...prev, currentWordIndex])

    // Update progress
    const newProgress = ((currentQuestionIndex + 1) / totalQuestions) * 100
    setProgress(newProgress)

    // Move to next question or end session
    if (currentQuestionIndex < totalQuestions - 1 && hearts > 0) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      // End session
      setSessionState("completed")
    }
  }

  // Reset session
  const resetSession = () => {
    setSessionState("in-progress")
    setProgress(0)
    setHearts(maxHearts)
    setCurrentQuestionIndex(0)
    setCurrentQuestionType(QUESTION_TYPES[0])
    setResults(ReviewService.createEmptyResults())
    // Keep the learning queue for the next session
  }

  return {
    // State
    sessionState,
    progress,
    hearts,
    currentQuestionIndex,
    currentQuestionType,
    results,
    sessionStartTime,
    currentWordIndex,
    currentVocabularyItem,
    totalQuestions,
    maxHearts,
    learningQueue,

    // Actions
    handleAnswer,
    handleSkip,
    resetSession,
  }
}

