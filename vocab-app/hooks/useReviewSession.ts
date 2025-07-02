"use client"

import { REVIEW_RESULT_KEY, REVIEW_SESSION_KEY, REVIEW_WORDS_KEY, SESSION_STATE, SessionState } from "@/constants/status"
import { QUESTION_TYPES, ReviewService } from "@/services/review-service"
import type { QuestionType, ReviewResults, QuestionResult, ReviewSession, ReviewSessionResults, WordReviewResult, WordReviewState } from "@/types/review"
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
  const [sessionState, setSessionState] = useState<SessionState>(SESSION_STATE.IN_PROGRESS)
  const [progress, setProgress] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [sessionStartTime] = useState(Date.now())

  // UI states
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Results state
  const [results, setResults] = useState<ReviewResults>({
    correct: 0,
    incorrect: 0,
    skipped: 0,
    totalTime: 0,
    questionResults: []
  });

  // ========== DATA FETCHING ==========

  /**
   * Fetches review words from API or cache
   */
  const fetchReviewWords = useCallback((): Promise<{ fromCache: boolean, words: WordReviewState[] }> => {
    return new Promise(async (resolve, reject) => {
      try {
        setIsLoading(true)
        const cachedWords = sessionStorage.getItem(REVIEW_WORDS_KEY)

        if (cachedWords) {
          const parsedWords = JSON.parse(cachedWords)
          setReviewWords(parsedWords)
          resolve({ fromCache: true, words: parsedWords })
          return
        }

        const items = await ReviewService.fetchReviewWords()
        sessionStorage.setItem(REVIEW_WORDS_KEY, JSON.stringify(items))
        setReviewWords(items)
        setError(null)
        resolve({ fromCache: false, words: items })
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
        word_id: words[index].word.id,
        word_state_id: words[index].id,
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
   * Updates results after each answer or skip
   */
  const updateResultsForAnswer = useCallback((isCorrect: boolean, isSkipped: boolean, wordId: number) => {
    const word = reviewWords.find(w => w.id === wordId);
    if (!word) return;

    setResults(prevResults => {
      // Create a new result entry for this word
      const newResult: QuestionResult = {
        word: word.word.word,
        correct: isCorrect,
        time: isSkipped ? 0 : 3.0, // Placeholder timing
        wordId: wordId
      };

      // Check if this word already exists in results (in case of re-answer)
      const existingIndex = prevResults.questionResults.findIndex(r => r.wordId === wordId);

      let newQuestionResults = [...prevResults.questionResults];
      if (existingIndex >= 0) {
        // Update existing result
        newQuestionResults[existingIndex] = newResult;
      } else {
        // Add new result
        newQuestionResults.push(newResult);
      }

      // Update correct/incorrect/skipped counts
      let correctCount = isCorrect ? prevResults.correct + 1 : prevResults.correct;
      let incorrectCount = (!isCorrect && !isSkipped) ? prevResults.incorrect + 1 : prevResults.incorrect;
      let skippedCount = isSkipped ? prevResults.skipped + 1 : prevResults.skipped;

      // If updating an existing entry, adjust the counts
      if (existingIndex >= 0) {
        const oldResult = prevResults.questionResults[existingIndex];
        if (oldResult.correct) correctCount--;
        else if (oldResult.time === 0) skippedCount--;
        else incorrectCount--;
      }

      const newResults: ReviewResults = {
        ...prevResults,
        correct: correctCount,
        incorrect: incorrectCount,
        skipped: skippedCount,
        totalTime: prevResults.totalTime + (existingIndex >= 0 ? 0 : 3.0), // Add time only for new entries
        questionResults: newQuestionResults
      };

      // Immediately update sessionStorage with the latest results
      sessionStorage.setItem(REVIEW_RESULT_KEY, JSON.stringify(newResults));

      return newResults;
    });
  }, [reviewWords]);

  /**
   * Calculates complete result statistics for the review session
   */
  const calculateResults = useCallback(() => {
    if (!reviewWords.length || !reviewQueue.length) return;

    // Create word ID to index map for faster lookups
    const wordIdToIndex = new Map(reviewWords.map(word => [word.id, word]));

    // Track unique words that have been answered
    const processedWords = new Set();
    const questionResults: QuestionResult[] = [];

    let correctCount = 0;
    let incorrectCount = 0;
    let skippedCount = 0;
    let totalTime = 0;

    // Process review queue to extract statistics
    reviewQueue.forEach(item => {
      if (!item.is_reviewed) return;

      const word = wordIdToIndex.get(item.word_state_id);
      if (!word) return;

      // For results display purposes, we want each unique word only once
      if (!processedWords.has(item.word_state_id)) {
        processedWords.add(item.word_state_id);

        // We don't have actual time tracking per word in the current implementation
        // Using a placeholder value (could be enhanced with actual timing)
        const timeSpent = 3.0; // Placeholder for per-word timing
        totalTime += timeSpent;

        questionResults.push({
          word: word.word.word,
          correct: item.is_correct === true,
          time: item.is_skipped ? 0 : timeSpent,
          wordId: item.word_state_id
        });

        if (item.is_correct === true) {
          correctCount++;
        } else if (item.is_skipped) {
          skippedCount++;
        } else {
          incorrectCount++;
        }
      }
    });

    const newResults: ReviewResults = {
      correct: correctCount,
      incorrect: incorrectCount,
      skipped: skippedCount,
      totalTime,
      questionResults
    };

    // Store results in session storage for persistence
    sessionStorage.setItem(REVIEW_RESULT_KEY, JSON.stringify(newResults));
    setResults(newResults);

    return newResults;
  }, [reviewWords, reviewQueue]);

  /**
   * Completes the session and calculates final results
   */
  const completeSession = useCallback(() => {
    // First update results to ensure they're complete
    const finalResults = calculateResults();

    // Use setTimeout to ensure state updates happen after the current execution context
    setTimeout(() => {
      setSessionState(SESSION_STATE.COMPLETED);
      setProgress(100);

      if (finalResults) {
        setResults(finalResults);
      }

    }, 100);
  }, [calculateResults]);

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

    sessionStorage.setItem(REVIEW_SESSION_KEY, JSON.stringify(sessionData))
  }, [reviewWords, reviewQueue, sessionState, sessionStartTime, progress, currentWordIndex])

  // Restore results from session storage if session is completed
  useEffect(() => {
    if (sessionState === SESSION_STATE.COMPLETED) {
      const storedResults = sessionStorage.getItem(REVIEW_RESULT_KEY);
      if (storedResults) {
        try {
          setResults(JSON.parse(storedResults));
        } catch (e) {
          console.error("Failed to parse stored results", e);
        }
      } else {
        calculateResults();
      }
    }
  }, [sessionState, calculateResults]);

  /**
   * Resets session to initial state
   */
  const resetSession = useCallback(() => {
    setSessionState(SESSION_STATE.IN_PROGRESS)
    setProgress(0)
    setCorrectAnswers(0)
    setCurrentQuestionType(QUESTION_TYPES[0])
  }, [])

  /**
   * Initializes a review session from stored data or creates a new one
   */
  const initReviewSession = useCallback((words: WordReviewState[], storedSession?: ReviewSession | null) => {
    // Don't proceed if no words available
    if (!words.length) {
      setIsLoading(false)
      console.warn("No review words available");
      return
    }

    // Set all state updates before setting current word to avoid flicker
    setReviewWords(words)

    // Check explicitly if storedSession exists and has a valid reviewQueue
    if (storedSession && storedSession.reviewQueue && storedSession.reviewQueue.length > 0) {
      // Load existing session
      setSessionState(storedSession.session_state as SessionState)
      setProgress(storedSession.progress)
      setReviewQueue(storedSession.reviewQueue)
      setCurrentWordIndex(storedSession.current_word_index)

      // Restore estimated correct answers count
      const estimatedCorrect = Math.round((storedSession.progress * storedSession.reviewQueue.length) / 100)
      setCorrectAnswers(estimatedCorrect)

      // Set current word as the last step
      const wordIndex = storedSession.reviewQueue[storedSession.current_word_index]?.word_index
      if (wordIndex !== undefined && words[wordIndex]) {
        setCurrentWord(words[wordIndex])
        setCurrentQuestionType(storedSession.reviewQueue[storedSession.current_word_index]?.question_type || QUESTION_TYPES[0])
      }
    } else {
      // Create a new session
      setSessionState(SESSION_STATE.IN_PROGRESS)
      setProgress(0)
      setCorrectAnswers(0)
      setCurrentWordIndex(0)

      // Create review queue first
      const newReviewQueue = createRandomReviewQueue(words)

      // Then set current word as the last step
      if (newReviewQueue.length > 0) {
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

    // Update results immediately
    updateResultsForAnswer(isCorrect, false, currentReviewItem.word_state_id);

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
    moveToNextWord,
    updateResultsForAnswer
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

    // Update results immediately
    updateResultsForAnswer(false, true, currentReviewItem.word_state_id);

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
    moveToNextWord,
    updateResultsForAnswer
  ])

  // ========== INITIALIZATION ==========

  // Load or initialize session on mount
  useEffect(() => {
    // Set loading state explicitly at the beginning
    setIsLoading(true)
    // Clear current word to prevent flashing of wrong word
    setCurrentWord(null)

    const loadSession = async () => {
      try {
        // Get stored session if exists
        const storedSession = sessionStorage.getItem(REVIEW_SESSION_KEY)
        const parsedSession = storedSession ? JSON.parse(storedSession) as ReviewSession : null

        // Get review words (from cache or API)
        const { words } = await fetchReviewWords()

        // Initialize session
        initReviewSession(words, parsedSession)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to initialize review session"))
        setIsLoading(false)
      }
    }

    loadSession()
  }, [fetchReviewWords, initReviewSession])

  // ========== STORAGE MANAGEMENT ==========
  /**
   * Clears review session data from sessionStorage
   */
  const clearReviewSessionStorage = useCallback(() => {
    sessionStorage.removeItem(REVIEW_SESSION_KEY);
    sessionStorage.removeItem(REVIEW_WORDS_KEY);
  }, []);

  // ========== RESULTS MANAGEMENT ==========
  /**
   * Submits the review session results
   */
  const prepareSessionResults = useCallback(() => {
    // Tạo map để tra cứu nhanh từ `reviewWords`
    const wordMap = new Map(reviewWords.map(item => [item.id, item]))

    let results: ReviewSessionResults = {
      is_review: true,
      lesson_id: undefined,
      words: [],
    }

    // Duyệt `reviewQueue` và lấy lần đầu tiên của mỗi từ
    results.words = reviewQueue.reduce((acc, reviewItem) => {
      if (!reviewItem.is_reviewed) return acc // Bỏ qua từ chưa được ôn tập
      if (!wordMap.has(reviewItem.word_state_id)) return acc // Bỏ qua từ không có trong danh sách ôn tập

      // Nếu từ chưa có trong kết quả, thêm vào
      if (!acc.some(entry => entry.word_id === reviewItem.word_id)) {
        const item = wordMap.get(reviewItem.word_state_id)!
        acc.push({
          word_id: item.word.id,
          level: item.level,
          streak: item.streak,
          is_correct: reviewItem.is_correct ?? false,
          question_type: reviewItem.question_type || QUESTION_TYPES[0],
        })
      }

      return acc
    }, [] as { word_id: number, level: number, streak: number, is_correct: boolean, question_type: QuestionType }[])

    return results
  }, [reviewQueue, reviewWords])

  // Submit results when session is completed
  useEffect(() => {
    if (sessionState === SESSION_STATE.COMPLETED) {
      const results = prepareSessionResults()
      // Check if there are words to submit
      if (!results.words.length) {
        clearReviewSessionStorage();
        console.warn("No words to submit")
        return
      }
      ReviewService.submitReviewSession(results)
        .then((success) => {
          if (success) {
            console.log("Review session submitted successfully")
          } else {
            console.error("Failed to submit review session")
          }
          // Clear session storage
          clearReviewSessionStorage();
          // Reset session state
        })
        .catch((error) => {
          console.error("Error submitting review session:", error)
        })
    }
  }, [sessionState, prepareSessionResults, clearReviewSessionStorage])

  /**
   * Handles back navigation while ensuring data is saved
   */
  const handleBack = useCallback(async () => {
    // First calculate final results
    const finalResults = calculateResults();
    if (finalResults) {
      // Update the results state directly
      setResults(finalResults);
    }

    // Only proceed if there are words to submit
    const results = prepareSessionResults();
    if (results.words.length) {
      try {
        // Submit results directly and wait for completion
        await ReviewService.submitReviewSession(results);
      } catch (error) {
        console.error("Error submitting review session:", error);
      }
    }

    clearReviewSessionStorage();

    // Update session state with a small delay to ensure results are displayed
    setTimeout(() => {
      setSessionState(SESSION_STATE.COMPLETED);
      setProgress(100);
    }, 100);
  }, [calculateResults, prepareSessionResults, clearReviewSessionStorage]);

  // ========== RETURN VALUES ==========

  return {
    // State
    sessionState,
    progress,
    currentQuestionType,
    sessionStartTime,
    currentWordIndex,
    currentWord,
    learningQueueIndex: reviewQueue
      .filter(item => item.is_reviewed && (!item.is_correct || item.is_skipped))
      .map(item => item.word_index),
    reviewWords,
    isLoading,
    error,
    results,

    // Actions
    handleBack,
    handleAnswer,
    handleSkip,
    resetSession,
  }
}