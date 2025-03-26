import userWordService, { DueWordsResponse } from "@/services/user-word-service";
import { useWordLevelStore } from "@/stores/wordLevelStore";
import { useEffect, useState } from "react";

const useHomePage = () => {
  const {
    totalWords,
    countLevel1,
    countLevel2,
    countLevel3,
    countLevel4,
    countLevel5,
    timeUntilNextReview,
    reviewWordCount,
    setWordLevels,
  } = useWordLevelStore();

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDueWords = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data: DueWordsResponse | null = await userWordService.getVocabLevels();
      if (!data) {
        throw new Error("Failed to fetch vocabulary levels");
      }
      const total = data.count_level1 + data.count_level2 + data.count_level3 +
        data.count_level4 + data.count_level5

      setWordLevels({
        totalWords: total,
        countLevel1: data.count_level1,
        countLevel2: data.count_level2,
        countLevel3: data.count_level3,
        countLevel4: data.count_level4,
        countLevel5: data.count_level5,
        reviewWordCount: data.review_word_count,
        timeUntilNextReview: data.time_until_next_review
      });

      console.log("Đã set word level", {
        totalWords: total,
        countLevel1: data.count_level1,
        countLevel2: data.count_level2,
        countLevel3: data.count_level3,
        countLevel4: data.count_level4,
        countLevel5: data.count_level5,
        reviewWordCount: data.review_word_count,
        timeUntilNextReview: data.time_until_next_review
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDueWords()
  }, [])

  return {
    totalWords,
    countLevel1,
    countLevel2,
    countLevel3,
    countLevel4,
    countLevel5,
    reviewWordCount,
    timeUntilNextReview,
    isLoading,
    error,
    refreshData: fetchDueWords
  }
}

export default useHomePage