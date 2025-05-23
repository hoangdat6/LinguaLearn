"use client"

import { useState, useEffect, use } from "react"
import { Lesson, Word } from "@/types/lesson-types"
import { getWordsByLessonId } from "@/services/course-service"
import { set } from "date-fns"

interface SpacedRepetitionData {
    wordId: number
    stage: number
    nextReview: number
    interval: number
}

export function useVocabularyProgress(lessonId: string) {
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [loading, setLoading] = useState(true);
    const [words, setWords] = useState<Word[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [currentStage, setCurrentStage] = useState(1)
    const [progress, setProgress] = useState(0)
    const [correctCount, setCorrectCount] = useState(0)
    const [incorrectCount, setIncorrectCount] = useState(0)
    const [showCompletionDialog, setShowCompletionDialog] = useState(false);
    const [spacedRepetition, setSpacedRepetition] = useState<SpacedRepetitionData[]>([])
    
    // Initialize spaced repetition data
    useEffect(() => {
        async function fetchWords() {
            setLoading(true)
            try {
                const response = await getWordsByLessonId(lessonId)
                setWords(response.words)
                console.log
                setLesson({
                    id: response.lessonId,
                    title: response.lesson_title,
                    description: response.lesson_description,
                    word_count: response.words?.length,
                    image: "",
                    created_at: "",
                    updated_at: "",
                    is_learned: false,
                })
                const initialData = response.words?.map((word) => ({
                    wordId: word.id,
                    stage: 1,
                    nextReview: Date.now(),
                    interval: 1,
                }))
                setSpacedRepetition(initialData)
            } catch (error) {
                console.error("Error fetching words:", error)
            }
            setLoading(false)
        }
        fetchWords()
    }, [lessonId]);

    // Calculate progress
    useEffect(() => {
        const totalProgress = ((currentIndex * 3 + (currentStage - 1)) / (words?.length * 3)) * 100
        setProgress(totalProgress)
    }, [currentIndex, currentStage, words?.length])

    // Handle correct answer
    const handleCorrectAnswer = () => {
        setCorrectCount((prev) => prev + 1)
        if (currentStage < 3) {
            setCurrentStage((prev) => prev + 1)
        } else {
            // Khi đã đạt stage 3, chuyển sang từ tiếp theo và reset stage về 1
            if (currentIndex < words.length - 1) {
                setCurrentIndex((prev) => prev + 1)
                setCurrentStage(1)
            } else {
                setShowCompletionDialog(true);
            }
        }
        updateSpacedRepetition(true)
    }

    // Handle incorrect answer
    const handleIncorrectAnswer = () => {
        setIncorrectCount((prev) => prev + 1);
        setWords((prevWords) => {
            const wordToCopy = prevWords[currentIndex];
            const newWords = [...prevWords, wordToCopy];
            // Đảm bảo currentIndex luôn trỏ đúng từ tiếp theo sau khi thêm bản sao
            setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, newWords.length - 1));
            return newWords;
        });
        setCurrentStage(1);
        updateSpacedRepetition(false);
    }
    console.log(words)
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

    // cho phép set lại tiến trình từ bên ngoài
    const setProgressState = (progress: {
        currentIndex?: number,
        currentStage?: number,
        correctCount?: number,
        incorrectCount?: number
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
    }
}

