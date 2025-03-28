"use client"

import { ReviewService } from "@/services/review-service"
import { ReviewWordState } from "@/types/review"
import { useEffect, useState } from "react"

export function useReviewSessionData() {
  const [reviewWords, setReviewWords] = useState<ReviewWordState[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchReviewWords = async () => {
      try {
        setIsLoading(true)
        const cachedWords = localStorage.getItem("reviewWords")
        if (cachedWords) {
          setReviewWords(JSON.parse(cachedWords))
          setIsLoading(false)
          return
        } 
        // Fetch review words from the API
        // and store them in local storage
        // to avoid unnecessary API calls
        const items = await ReviewService.fetchReviewWords()
        localStorage.setItem("reviewWords", JSON.stringify(items))
        setReviewWords(items)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch vocabulary items"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchReviewWords()
  }, [])

  return {
    reviewWords,
    isLoading,
    error,
  }
}

