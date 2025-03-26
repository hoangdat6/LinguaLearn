import userWordService, { DueWordsResponse, WordsByLevel } from "@/services/user-word-service";
import { useWordLevelStore } from "@/stores/wordLevelStore";
import { useEffect, useState } from "react";


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
    } = useWordLevelStore();
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const fetchReviewData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const wordsByLevel: WordsByLevel = await userWordService.fetchWordsLevel();
            
            setWords({
                words_by_level1: wordsByLevel.words_by_level1,
                words_by_level2: wordsByLevel.words_by_level2,
                words_by_level3: wordsByLevel.words_by_level3,
                words_by_level4: wordsByLevel.words_by_level4,
                words_by_level5: wordsByLevel.words_by_level5
            });

            // setWordLevels({
            //     countLevel1: wordsByLevel.count_level1,
            //     countLevel2: wordsByLevel.count_level2,
            //     countLevel3: wordsByLevel.count_level3,
            //     countLevel4: wordsByLevel.count_level4,
            //     countLevel5: wordsByLevel.count_level5,
            // });
        } catch (err: any) {
            setError(err.message || "Failed to fetch review data");
        } finally {
            setIsLoading(false);
        }
    };

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