"use client"

import { QUESTION_TYPES, ReviewService } from "@/services/review-service"
import type { QuestionType, ReviewSession, WordReviewResult, WordReviewState } from "@/types/review"
import { useCallback, useEffect, useState } from "react"

export function useReviewSession() {
  // ========== STATE DECLARATIONS ==========
  
  // Data states
  const [reviewWords, setReviewWords] = useState<WordReviewState[]>([])
  const [reviewQueue, setReviewQueue] = useState<WordReviewResult[]>([])
  
  // Current item states
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentWord, setCurrentWord] = useState<WordReviewState | null>(null)
  const [currentQuestionType, setCurrentQuestionType] = useState<QuestionType>(QUESTION_TYPES[0])
  
  // Progress states
  const [sessionState, setSessionState] = useState<"in-progress" | "completed">("in-progress")
  const [progress, setProgress] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [sessionStartTime] = useState(Date.now())
  
  // UI states
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // ========== DATA FETCHING ==========
  
  /**
   * Fetches review words from API or cache
   */
  const fetchReviewWords = useCallback((): Promise<{fromCache: boolean, words: WordReviewState[]}> => {
    return new Promise(async (resolve, reject) => {
      try {
        setIsLoading(true)
        const cachedWords = sessionStorage.getItem("reviewWords")
        
        if (cachedWords) {
          const parsedWords = JSON.parse(cachedWords)
          setReviewWords(parsedWords)
          resolve({fromCache: true, words: parsedWords})
          return
        }
        
        const items = await ReviewService.fetchReviewWords()
        sessionStorage.setItem("reviewWords", JSON.stringify(items))
        setReviewWords(items)
        setError(null)
        resolve({fromCache: false, words: items})
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to fetch vocabulary items")
        setError(error)
        reject(error)
      } finally {
        setIsLoading(false)
      }
    })
  }, [])

  // ========== QUEUE MANAGEMENT ==========
  
  /**
   * Creates a randomized review queue from words
   */
  const createRandomReviewQueue = useCallback((words: WordReviewState[]) => {
    const randomQueue = words
      .map((_, index) => index)
      .sort(() => Math.random() - 0.5)
      .slice(0, words.length)

    const newReviewQueue = randomQueue.map((index) => {
      return {
        word_id: words[index].id,
        word_index: index,
        is_reviewed: false,
        is_correct: null,
        is_skipped: false,
        question_type: ReviewService.getQuestionTypeByLevel(words[index].level),
      }
    })
    
    setReviewQueue(newReviewQueue)
    return newReviewQueue
  }, [])
  
  /**
   * Creates a new word review for reinsertion into queue
   */
  const createWordForReinsert = useCallback((wordReviewResult: WordReviewResult) => {
    const word = reviewWords[wordReviewResult.word_index]
    
    return {
      ...wordReviewResult,
      is_reviewed: false,
      is_correct: null,
      is_skipped: false,
      question_type: ReviewService.getQuestionTypeByLevel(word.level),
    }
  }, [reviewWords])

  /**
   * Inserts a word back into review queue at a randomized position
   */
  const insertWordReview = useCallback((updatedQueue: WordReviewResult[], wordReviewResult: WordReviewResult) => {
    const updatedWord = createWordForReinsert(wordReviewResult)
    
    // randomize position of the word in the review queue after the current word from 3 to 5 words
    const randomPosition = Math.floor(Math.random() * (5 - 3 + 1)) + 3
    const insertPosition = Math.min(currentWordIndex + randomPosition, updatedQueue.length)
    
    // Insert at the random position
    updatedQueue.splice(insertPosition, 0, updatedWord)
    
    return updatedQueue
  }, [createWordForReinsert, currentWordIndex])

  // ========== PROGRESS MANAGEMENT ==========
  
  /**
   * Calculates progress percentage
   */
  const calculateProgress = useCallback((correct: number, total: number) => {
    return Math.floor((correct / total) * 100) || 0
  }, [])
  
  /**
   * Updates progress state after correct answer
   */
  const updateProgressForCorrectAnswer = useCallback((newCorrectAnswers: number, queueLength: number) => {
    setCorrectAnswers(newCorrectAnswers)
    const newProgress = calculateProgress(newCorrectAnswers, queueLength)
    setProgress(prevProgress => Math.max(prevProgress, newProgress))
  }, [calculateProgress])
  
  /**
   * Completes the session and sets final progress
   */
  const completeSession = useCallback(() => {
    setSessionState("completed")
    setProgress(100)
  }, [])

  // ========== WORD TRANSITION ==========
  
  /**
   * Moves to next word in queue
   */
  const moveToNextWord = useCallback((queue: WordReviewResult[], nextIndex: number) => {
    setCurrentWordIndex(nextIndex)
    
    const nextWordInfo = queue[nextIndex]
    if (nextWordInfo) {
      const nextWord = reviewWords[nextWordInfo.word_index]
      if (nextWord) {
        setCurrentWord(nextWord)
        setCurrentQuestionType(nextWordInfo.question_type || QUESTION_TYPES[0])
      }
    }
  }, [reviewWords])

  /**
   * Check if we're at the last word
   */
  const isLastWordInQueue = useCallback((index: number, queue: WordReviewResult[]) => {
    return index + 1 >= queue.length
  }, [])

  // ========== SESSION MANAGEMENT ==========
  
  /**
   * Saves current session state to sessionStorage
   */
  useEffect(() => {
    if (!reviewWords.length || !reviewQueue.length) return
    
    const sessionData: ReviewSession = {
      session_state: sessionState,
      session_start_time: sessionStartTime,
      progress,
      current_word_index: currentWordIndex,
      reviewQueue,
    }
    
    sessionStorage.setItem("reviewSession", JSON.stringify(sessionData))
  }, [reviewWords, reviewQueue, sessionState, sessionStartTime, progress, currentWordIndex])
  
  /**
   * Resets session to initial state
   */
  const resetSession = useCallback(() => {
    setSessionState("in-progress")
    setProgress(0)
    setCorrectAnswers(0)
    setCurrentQuestionType(QUESTION_TYPES[0])
  }, [])

  /**
   * Initializes a review session from stored data or creates a new one
   */
  const initReviewSession = useCallback((words: WordReviewState[], storedSession?: ReviewSession | null) => {
    setReviewWords(words)
    
    // Check explicitly if storedSession exists and has a valid reviewQueue
    if (storedSession && storedSession.reviewQueue && storedSession.reviewQueue.length > 0) {
      // Load existing session
      setSessionState(storedSession.session_state)
      setProgress(storedSession.progress)
      
      // Restore estimated correct answers count
      const estimatedCorrect = Math.round((storedSession.progress * storedSession.reviewQueue.length) / 100)
      setCorrectAnswers(estimatedCorrect)
      
      setCurrentWordIndex(storedSession.current_word_index)
      setReviewQueue(storedSession.reviewQueue)
      
      // Set current word
      const wordIndex = storedSession.reviewQueue[storedSession.current_word_index]?.word_index
      if (wordIndex !== undefined && words[wordIndex]) {
        setCurrentWord(words[wordIndex])
        setCurrentQuestionType(storedSession.reviewQueue[storedSession.current_word_index]?.question_type || QUESTION_TYPES[0])
      }
    } else {
      // Create a new session
      setSessionState("in-progress")
      setProgress(0)
      setCorrectAnswers(0)
      setCurrentWordIndex(0)
      
      // Create and initialize review queue
      const newReviewQueue = createRandomReviewQueue(words)
      
      // Set first word
      if (words.length > 0 && newReviewQueue.length > 0) {
        const firstWordIndex = newReviewQueue[0]?.word_index
        if (firstWordIndex !== undefined) {
          setCurrentWord(words[firstWordIndex])
          setCurrentQuestionType(newReviewQueue[0]?.question_type || QUESTION_TYPES[0])
        }
      }
    }
    
    setIsLoading(false)
  }, [createRandomReviewQueue])

  // ========== USER INTERACTION HANDLERS ==========
  
  /**
   * Handles answer submission
   */
  const handleAnswer = useCallback((isCorrect: boolean) => {
    // Update the current word in review queue
    const currentReviewItem = reviewQueue[currentWordIndex]
    
    const updatedWord = {
      ...currentReviewItem,
      is_reviewed: true,
      is_correct: isCorrect,
      question_type: currentQuestionType,
    }

    // Update queue
    const updatedQueue = [...reviewQueue]
    updatedQueue[currentWordIndex] = updatedWord
    
    // Check for session completion
    if (isLastWordInQueue(currentWordIndex, updatedQueue)) {
      setReviewQueue(updatedQueue)
      completeSession()
      return
    }
    
    // Process answer
    if (isCorrect) {
      // Update correct answers and progress
      updateProgressForCorrectAnswer(correctAnswers + 1, updatedQueue.length)
    } else {
      // Re-insert word for review
      insertWordReview(updatedQueue, updatedWord)
    }
    
    setReviewQueue(updatedQueue)
    moveToNextWord(updatedQueue, currentWordIndex + 1)
  }, [
    reviewQueue, 
    currentWordIndex, 
    currentQuestionType, 
    isLastWordInQueue, 
    completeSession,
    updateProgressForCorrectAnswer,
    correctAnswers,
    insertWordReview,
    moveToNextWord
  ])

  /**
   * Handles skipping a word
   */
  const handleSkip = useCallback(() => {
    const currentReviewItem = reviewQueue[currentWordIndex]
    
    const updatedWord = {
      ...currentReviewItem,
      is_reviewed: true,
      is_correct: false,
      is_skipped: true,
      question_type: currentQuestionType,
    }

    const updatedQueue = [...reviewQueue]
    updatedQueue[currentWordIndex] = updatedWord
    
    // Check for session completion
    if (isLastWordInQueue(currentWordIndex, updatedQueue)) {
      setReviewQueue(updatedQueue)
      completeSession()
      return
    }

    // Add word back to queue for later review
    insertWordReview(updatedQueue, updatedWord)
    
    setReviewQueue(updatedQueue)
    moveToNextWord(updatedQueue, currentWordIndex + 1)
  }, [
    reviewQueue, 
    currentWordIndex, 
    currentQuestionType,
    isLastWordInQueue,
    completeSession,
    insertWordReview,
    moveToNextWord
  ])

  // ========== INITIALIZATION ==========
  
  // Load or initialize session on mount
  useEffect(() => {
    const loadSession = async () => {
      try {
        // Get stored session if exists
        const storedSession = sessionStorage.getItem("reviewSession")
        const parsedSession = storedSession ? JSON.parse(storedSession) as ReviewSession : null
        
        // Get review words (from cache or API)
        const { words } = await fetchReviewWords()
        
        // Initialize session
        initReviewSession(words, parsedSession)
      } catch (err) {
        console.error("Error initializing review session", err)
        setError(err instanceof Error ? err : new Error("Failed to initialize review session"))
        setIsLoading(false)
      }
    }
    
    loadSession()
  }, [fetchReviewWords, initReviewSession])

  // ========== RETURN VALUES ==========
  
  return {
    // State
    sessionState,
    progress,
    currentQuestionType,
    sessionStartTime,
    currentWordIndex,
    currentWord,
    learningQueue: reviewQueue,
    reviewWords,
    isLoading,
    error,

    // Actions
    handleAnswer,
    handleSkip,
    resetSession,
  }
}
