import userWordService, { CountWordsByLevel  } from "@/services/user-word-service";
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
    setTotalWords,
  } = useWordLevelStore();

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDueWords = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Check if data is already in local storage and not expired
      const cachedData = localStorage.getItem("wordLevels");
      const cachedTime = localStorage.getItem("wordLevelsTime");
      const currentTime = Date.now();
      if (cachedData && cachedTime) {
        const parsedData = JSON.parse(cachedData);
        const parsedTime = parseInt(cachedTime, 10);
        if (currentTime - parsedTime < 0.5 * 60 * 1000) { // 30 minutes
          setWordLevels(parsedData.countLevels);
          setTotalWords(parsedData.totalWords);
          return;
        }
      }

      const data: CountWordsByLevel  | null = await userWordService.getVocabLevels();
      if (!data) {
        throw new Error("Failed to fetch vocabulary levels");
      }
      
      const total = Object.values(data.level_counts).reduce((sum, count) => sum + count, 0);

      setWordLevels({
        totalWords: total,
        countLevel1: data.level_counts.count_level1,
        countLevel2: data.level_counts.count_level2,
        countLevel3: data.level_counts.count_level3,
        countLevel4: data.level_counts.count_level4,
        countLevel5: data.level_counts.count_level5,
        reviewWordCount: data.review_word_count,
        timeUntilNextReview: data.time_until_next_review
      });

      // Update local storage with the new data
      localStorage.setItem("wordLevels", JSON.stringify({
        totalWords: total,
        countLevels: {
          countLevel1: data.level_counts.count_level1,
          countLevel2: data.level_counts.count_level2,
          countLevel3: data.level_counts.count_level3,
          countLevel4: data.level_counts.count_level4,
          countLevel5: data.level_counts.count_level5,
        },
        reviewWordCount: data.review_word_count,
        timeUntilNextReview: data.time_until_next_review,
      }));

      localStorage.setItem("wordLevelsTime", Date.now().toString());
      
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