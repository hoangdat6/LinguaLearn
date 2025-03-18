"use client"

import { useState, useEffect } from "react"
import { Lesson, VocabularyItem } from "@/types/lesson-types"
import { fetchLessonById } from "@/services/course-service"

interface SpacedRepetitionData {
    wordId: number
    stage: number
    nextReview: number
    interval: number
}

export function useVocabularyProgress(lessonId: string) {
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [loading, setLoading] = useState(true);
    const [words, setWords] = useState<VocabularyItem[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [currentStage, setCurrentStage] = useState(1)
    const [progress, setProgress] = useState(0)
    const [correctCount, setCorrectCount] = useState(0)
    const [incorrectCount, setIncorrectCount] = useState(0)
    const [showCompletionDialog, setShowCompletionDialog] = useState(false);
    const [spacedRepetition, setSpacedRepetition] = useState<SpacedRepetitionData[]>([])

    // Initialize spaced repetition data
    useEffect(() => {
        const fetchedLesson = fetchLessonById(lessonId);
        setLesson(fetchedLesson);
        setWords(fetchedLesson.vocabulary)
        setLoading(false);
    }, [lessonId]);

    // Calculate progress
    useEffect(() => {
        const totalProgress = ((currentIndex * 3 + (currentStage - 1)) / (words.length * 3)) * 100
        setProgress(totalProgress)
    }, [currentIndex, currentStage, words.length])

    // Handle correct answer
    const handleCorrectAnswer = () => {
        setCorrectCount((prev) => prev + 1)
        updateSpacedRepetition(true)
    }

    // Handle incorrect answer
    const handleIncorrectAnswer = () => {
        setIncorrectCount((prev) => prev + 1)
        updateSpacedRepetition(false)
    }


    // Update spaced repetition data
    const updateSpacedRepetition = (correct: boolean) => {
        setSpacedRepetition((prev) => {
            const updated = [...prev]
            const currentItem = updated.find((item) => item.wordId === words[currentIndex].id)

            if (currentItem) {
                if (correct) {
                    // Double the interval for correct answers
                    currentItem.interval *= 2
                } else {
                    // Reset interval for incorrect answers
                    currentItem.interval = 1
                }

                currentItem.nextReview = Date.now() + currentItem.interval * 24 * 60 * 60 * 1000
            }

            return updated
        })
    }

    // Move to next word or stage
    const handleNextWord = () => {
        if (currentStage < 3) {
            setCurrentStage((prev) => prev + 1)
        } else {
            if (currentIndex < words.length - 1) {
                setCurrentIndex((prev) => prev + 1)
                setCurrentStage(1)
            } else {
                setShowCompletionDialog(true);
            }
        }
    }

    // Reset progress
    const handleReset = () => {
        setCurrentIndex(0)
        setCurrentStage(1)
        setProgress(0)
        setCorrectCount(0)
        setIncorrectCount(0)
        const initialData = words.map((word) => ({
            wordId: word.id,
            stage: 1,
            nextReview: Date.now(),
            interval: 1,
        }))
        setSpacedRepetition(initialData)
    }

    return {
        currentIndex,
        currentStage,
        progress,
        correctCount,
        incorrectCount,
        spacedRepetition,
        loading,
        lesson,
        showCompletionDialog,
        words,
        handleCorrectAnswer,
        handleIncorrectAnswer,
        handleNextWord,
        handleReset,
        setShowCompletionDialog,
    }
}

