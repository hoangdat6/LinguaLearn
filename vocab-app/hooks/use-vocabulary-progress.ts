"use client"

import { useState, useEffect } from "react"
import { Lesson, Word } from "@/types/lesson-types"
import { getWordsByLessonId } from "@/services/course-service"
import next from "next"

interface SpacedRepetitionData {
    wordId: number
    stage: number
    nextReview: number
    interval: number
}

type WordStagePair = [number, number]

export function useVocabularyProgress(lessonId: string) {
    const [lesson, setLesson] = useState<Lesson | null>(null)
    const [loading, setLoading] = useState(true)
    const [words, setWords] = useState<Word[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [currentStage, setCurrentStage] = useState(1)
    const [progress, setProgress] = useState(0)
    const [correctCount, setCorrectCount] = useState(0)
    const [incorrectCount, setIncorrectCount] = useState(0)
    const [showCompletionDialog, setShowCompletionDialog] = useState(false)
    const [spacedRepetition, setSpacedRepetition] = useState<SpacedRepetitionData[]>([])
    const [queue, setQueue] = useState<WordStagePair[]>([])


    useEffect(() => {
        async function fetchWords() {
            setLoading(true)
            try {
                const response = await getWordsByLessonId(lessonId)
                const fetchedWords = response.words || []

                setWords(fetchedWords)
                setLesson({
                    id: response.lessonId,
                    title: response.lesson_title,
                    description: response.lesson_description,
                    word_count: fetchedWords.length,
                    image: "",
                    created_at: "",
                    updated_at: "",
                    is_learned: false,
                })


                const initialData = fetchedWords.map((word) => ({
                    wordId: word.id,
                    stage: 1,
                    nextReview: Date.now(),
                    interval: 1,
                }))
                setSpacedRepetition(initialData)


                const stageCount = 3
                const newQueue: WordStagePair[] = []
                for (let i = 0; i < fetchedWords.length; i++) {
                    for (let stage = 1; stage <= stageCount; stage++) {
                        newQueue.push([i, stage])
                    }
                }
                setQueue(newQueue)

            } catch (error) {
                console.error("Error fetching words:", error)
            }
            setLoading(false)
        }
        fetchWords()
    }, [lessonId])
    // Update current index and stage when queue changes
    useEffect(() => {
        if (!loading && queue.length === 0) {
            setShowCompletionDialog(true)
        }
        const totalPairs = words.length * 3
        const progressPercent = ((totalPairs - queue.length) / totalPairs) * 100
        setProgress(progressPercent)
    }, [queue, words.length, loading])

    const handleCorrectAnswer = () => {
        setCorrectCount((prev) => prev + 1)
        setQueue((prev) => {
            const newQueue = prev.slice(1)
            if (newQueue.length > 0) {
                const [nextIndex, nextStage] = newQueue[0]
                console.log(nextIndex, nextStage)
                setCurrentIndex(nextIndex)
                setCurrentStage(nextStage)
            }
            console.log("Queue after correct answer:", newQueue)
            return newQueue
        })
    }

    const handleIncorrectAnswer = () => {
        setIncorrectCount((prev) => prev + 1)
        setQueue((prev) => {
            if (prev.length > 0) {
                const [first, ...rest] = prev
                const newQueue = [...rest, first]
                const [nextIndex, nextStage] = newQueue[0]
                console.log(nextIndex, nextStage)
                setCurrentIndex(nextIndex)
                setCurrentStage(nextStage)
                console.log("Queue after incorrect answer:", newQueue)
                return newQueue
            }
            return prev
        })
    }

    const handleNextWord = () => {
        setQueue((prev) => {
            const newQueue = prev.slice(1)
            if (newQueue.length > 0) {
                const [nextIndex, nextStage] = newQueue[0]
                setCurrentIndex(nextIndex)
                setCurrentStage(nextStage)
            }
            console.log("Queue after incorrect answer:", newQueue)
            return newQueue
        })
    }

    const handleReset = () => {
        const newQueue: WordStagePair[] = []
        for (let i = 0; i < words.length; i++) {
            for (let stage = 1; stage <= 3; stage++) {
                newQueue.push([i, stage])
            }
        }
        setQueue(newQueue)
        setCurrentIndex(0)
        setCurrentStage(1)
        setProgress(0)
        setCorrectCount(0)
        setIncorrectCount(0)
    }
    const setProgressState = (progress: {
        currentIndex?: number,
        currentStage?: number,
        correctCount?: number,
        incorrectCount?: number,
    }) => {
        if (typeof progress.currentIndex === 'number') setCurrentIndex(progress.currentIndex)
        if (typeof progress.currentStage === 'number') setCurrentStage(progress.currentStage)
        if (typeof progress.correctCount === 'number') setCorrectCount(progress.correctCount)
        if (typeof progress.incorrectCount === 'number') setIncorrectCount(progress.incorrectCount)
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
        setProgressState,
        setCurrentStage,
        queue,
        setQueue,
    }
}
