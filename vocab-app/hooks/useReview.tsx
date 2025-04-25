"use client"

import userWordService, { WordsByLevel } from "@/services/user-word-service";
import { useWordLevelStore } from "@/stores/wordLevelStore";
import { IS_LEARN_KEY, WORD_LEVELS_KEY } from "@/types/status";
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
            const isLearn = sessionStorage.getItem(IS_LEARN_KEY);
            if (isLearn !== "true") {
                const cachedData = sessionStorage.getItem("wordLevels");
                if (cachedData) {
                    const parsedData = JSON.parse(cachedData);
                    if (parsedData.learnedWords) {
                        setWordLevels(parsedData.countLevels);
                        setRewordCount(parsedData.reviewWordCount);
                        setTimeUntilNextReview(parsedData.timeUntilNextReview);
                        setWords(parsedData.learnedWords);
                        setError(null);
                        return;
                    }
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
            sessionStorage.setItem(WORD_LEVELS_KEY, JSON.stringify({
                totalWords: total,
                countLevels: {
                    countLevel1: wordsByLevel.level_counts.count_level1,
                    countLevel2: wordsByLevel.level_counts.count_level2,
                    countLevel3: wordsByLevel.level_counts.count_level3,
                    countLevel4: wordsByLevel.level_counts.count_level4,
                    countLevel5: wordsByLevel.level_counts.count_level5,
                },
                reviewWordCount: wordsByLevel.review_word_count,
                timeUntilNextReview: wordsByLevel.time_until_next_review,
                learnedWords: {
                    words_by_level1: wordsByLevel.words_level1,
                    words_by_level2: wordsByLevel.words_level2,
                    words_by_level3: wordsByLevel.words_level3,
                    words_by_level4: wordsByLevel.words_level4,
                    words_by_level5: wordsByLevel.words_level5
                }
            }));

            localStorage.setItem(IS_LEARN_KEY, "false");
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