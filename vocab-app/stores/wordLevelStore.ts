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
    // Thêm đối tượng để theo dõi trạng thái trang cho mỗi level
    paginationState: {
        level1Page: number;
        level2Page: number;
        level3Page: number;
        level4Page: number;
        level5Page: number;
    };
    setWordLevels: (levels: Partial<Omit<WordLevelState, "setWordLevels" | "fetchWordsByLevel">>) => void;
    setWords: (words: WordLevelState["words"]) => void;
    setRewordCount: (count: number) => void;
    setTimeUntilNextReview: (time: TimeUntilNextReview) => void;
    setTotalWords: (totalWords: number) => void;
    setWordByLevel: (level: number, words: WordReviewState[]) => void;
    // Thêm hàm để thêm từ mới vào một level cụ thể
    addWordsToLevel: (level: number, newWords: WordReviewState[]) => void;
    // Thêm hàm để tăng số trang cho một level
    incrementPage: (level: number) => void;
    // Thêm hàm để lấy số trang hiện tại của một level
    getPageForLevel: (level: number) => number;
}

export const useWordLevelStore = create<WordLevelState>((set, get) => ({
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
    // Khởi tạo trạng thái trang cho từng level
    paginationState: {
        level1Page: 2,
        level2Page: 2,
        level3Page: 2,
        level4Page: 2,
        level5Page: 2,
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
    setWordByLevel: (level: number, words: WordReviewState[]) =>
        set((state) => ({
            ...state,
            words: {
                ...state.words,
                [`words_by_level${level}`]: words,
            },
        })),
    // Thêm từ mới vào một level cụ thể
    addWordsToLevel: (level: number, newWords: WordReviewState[]) =>
        set((state) => ({
            ...state,
            words: {
                ...state.words,
                [`words_by_level${level}`]: [
                    ...state.words[`words_by_level${level}` as keyof typeof state.words],
                    ...newWords
                ],
            },
        })),
    // Tăng số trang cho một level cụ thể
    incrementPage: (level: number) =>
        set((state) => ({
            ...state,
            paginationState: {
                ...state.paginationState,
                [`level${level}Page`]: state.paginationState[`level${level}Page` as keyof typeof state.paginationState] + 1,
            },
        })),
    // Lấy số trang hiện tại của một level
    getPageForLevel: (level: number) => {
        const state = get();
        return state.paginationState[`level${level}Page` as keyof typeof state.paginationState] as number;
    },
}));