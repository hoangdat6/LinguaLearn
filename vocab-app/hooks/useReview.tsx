"use client"

import userWordService, { WordsByLevel } from "@/services/user-word-service";
import { useWordLevelStore } from "@/stores/wordLevelStore";
import { useEffect, useState, useCallback } from "react";


const useReview = () => {
    const {
        totalWords,
        countLevel1,
        countLevel2,
        countLevel3,
        countLevel4,
        countLevel5,
        timeUntilNextReview,
        reviewWordCount,
        words,
        setWordLevels,
        setWords,
        setRewordCount,
        setTimeUntilNextReview,
    } = useWordLevelStore();
    
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const fetchReviewData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {

            // Check if data is already in local storage and not expired
            const cachedData = localStorage.getItem("wordLevels");
            const cachedTime = localStorage.getItem("wordLevelsTime");
            const currentTime = Date.now();
            if (cachedData && cachedTime) {
                const parsedData = JSON.parse(cachedData);
                const parsedTime = parseInt(cachedTime, 10);
                if (currentTime - parsedTime < 0.5 * 60 * 1000 && parsedData.learnedWords) { // 30 minutes
                    setWordLevels(parsedData.countLevels);
                    setRewordCount(parsedData.reviewWordCount);
                    setTimeUntilNextReview(parsedData.timeUntilNextReview);
                    setWords(parsedData.learnedWords);
                    setError(null);
                    return;
                }
            }

            const wordsByLevel: WordsByLevel = await userWordService.fetchWordsLevel();
            const total = Object.values(wordsByLevel.level_counts).reduce((sum, count) => sum + count, 0);

            setWords({
                words_by_level1: wordsByLevel.words_level1,
                words_by_level2: wordsByLevel.words_level2,
                words_by_level3: wordsByLevel.words_level3,
                words_by_level4: wordsByLevel.words_level4,
                words_by_level5: wordsByLevel.words_level5
            });

            setWordLevels({
                countLevel1: wordsByLevel.level_counts.count_level1,
                countLevel2: wordsByLevel.level_counts.count_level2,
                countLevel3: wordsByLevel.level_counts.count_level3,
                countLevel4: wordsByLevel.level_counts.count_level4,
                countLevel5: wordsByLevel.level_counts.count_level5,
            });

            setRewordCount(wordsByLevel.review_word_count);
            setTimeUntilNextReview(wordsByLevel.time_until_next_review);

            // Update local storage with the new data
            localStorage.setItem("wordLevels", JSON.stringify({
                totalWords: total,
                countLevels : {
                    countLevel1: wordsByLevel.level_counts.count_level1,
                    countLevel2: wordsByLevel.level_counts.count_level2,
                    countLevel3: wordsByLevel.level_counts.count_level3,
                    countLevel4: wordsByLevel.level_counts.count_level4,
                    countLevel5: wordsByLevel.level_counts.count_level5,
                },
                reviewWordCount: wordsByLevel.review_word_count,
                timeUntilNextReview: wordsByLevel.time_until_next_review,
                learnedWords : {
                    words_by_level1: wordsByLevel.words_level1,
                    words_by_level2: wordsByLevel.words_level2,
                    words_by_level3: wordsByLevel.words_level3,
                    words_by_level4: wordsByLevel.words_level4,
                    words_by_level5: wordsByLevel.words_level5
                }
            }));

            localStorage.setItem("wordLevelsTime", Date.now().toString());
            setError(null);



        } catch (err: any) {
            setError(err.message || "Failed to fetch review data");
        } finally {
            setIsLoading(false);
        }
    }, [setWords, setWordLevels, setRewordCount, setTimeUntilNextReview]);

    useEffect(() => {
        fetchReviewData();
    }, [fetchReviewData]);

    return {
        totalWords,
        countLevel1,
        countLevel2,
        countLevel3,
        countLevel4,
        countLevel5,
        reviewWordCount,
        timeUntilNextReview,
        words,
        isLoading,
        error,
    }
}

export default useReview