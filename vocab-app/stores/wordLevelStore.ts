"use client"

import { TimeUntilNextReview } from "@/services/user-word-service";
import { WordReviewState } from "@/types/review";
import { create } from "zustand";

interface WordLevelState {
    totalWords: number;
    countLevel1: number;
    countLevel2: number;
    countLevel3: number;
    countLevel4: number;
    countLevel5: number;
    reviewWordCount: number;
    cefrGroupCounts: {
        basic: number;
        intermediate: number;
        advanced: number;
    };
    timeUntilNextReview: TimeUntilNextReview;
    words: {
        words_by_level1: WordReviewState[];
        words_by_level2: WordReviewState[];
        words_by_level3: WordReviewState[];
        words_by_level4: WordReviewState[];
        words_by_level5: WordReviewState[];
    };
    setWordLevels: (levels: Partial<Omit<WordLevelState, "setWordLevels" | "fetchWordsByLevel">>) => void;
    setWords: (words: WordLevelState["words"]) => void;
    setRewordCount: (count: number) => void;
    setTimeUntilNextReview: (time: TimeUntilNextReview) => void;
    setTotalWords: (totalWords: number) => void;
}

export const useWordLevelStore = create<WordLevelState>((set) => ({
    totalWords: 0,
    countLevel1: 0,
    countLevel2: 0,
    countLevel3: 0,
    countLevel4: 0,
    countLevel5: 0,
    cefrGroupCounts: {
        basic: 0,
        intermediate: 0,
        advanced: 0,
    },
    reviewWordCount: 0,
    timeUntilNextReview: {} as TimeUntilNextReview,
    words: {
        words_by_level1: [] as WordReviewState[], 
        words_by_level2: [] as WordReviewState[],
        words_by_level3: [] as WordReviewState[],
        words_by_level4: [] as WordReviewState[],
        words_by_level5: [] as WordReviewState[],
    },
    setWordLevels: (levels) =>
        set((state) => ({
            ...state,
            ...levels,
        })),
    setWords: (words: WordLevelState["words"]) =>
        set((state) => ({
            ...state,
            words, // Cho phép truyền vào đối tượng cụ thể
        })),
    setRewordCount: (count: number) =>
        set((state) => ({
            ...state,
            reviewWordCount: count,
        })),
    setTimeUntilNextReview: (time: TimeUntilNextReview) =>
        set((state) => ({
            ...state,
            timeUntilNextReview: time,
        })),

    setTotalWords: (totalWords: number) =>
        set((state) => ({
            ...state,
            totalWords,
        })),

        
}));