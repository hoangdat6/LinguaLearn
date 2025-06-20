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
            const wordsByLevel: WordsByLevel = await userWordService.fetchWordsLevel();

            setWords({
                words_by_level1: wordsByLevel.words_level1 || [],
                words_by_level2: wordsByLevel.words_level2 || [],
                words_by_level3: wordsByLevel.words_level3 || [],
                words_by_level4: wordsByLevel.words_level4 || [],
                words_by_level5: wordsByLevel.words_level5 || []
            });

            setWordLevels({
                countLevel1: wordsByLevel.level_counts.count_level1 ?? 0,
                countLevel2: wordsByLevel.level_counts.count_level2 ?? 0,
                countLevel3: wordsByLevel.level_counts.count_level3 ?? 0,
                countLevel4: wordsByLevel.level_counts.count_level4 ?? 0,
                countLevel5: wordsByLevel.level_counts.count_level5 ?? 0,
            });

            setRewordCount(wordsByLevel.review_word_count);
            setTimeUntilNextReview(wordsByLevel.time_until_next_review);

            setError(null);
        } catch (err: any) {
            setError(err.message || "Failed to fetch review data");
        } finally {
            setIsLoading(false);
        }
    }, [setWords, setWordLevels, setRewordCount, setTimeUntilNextReview]);

    useEffect(() => {
        fetchReviewData();
    }, []);

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