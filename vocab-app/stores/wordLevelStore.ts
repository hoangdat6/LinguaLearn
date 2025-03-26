import { TimeUntilNextReview } from "@/services/user-word-service";
import { VocabularyItem } from "@/types/lesson-types";
import { create } from "zustand";

interface WordLevelState {
    totalWords: number;
    countLevel1: number;
    countLevel2: number;
    countLevel3: number;
    countLevel4: number;
    countLevel5: number;
    reviewWordCount: number;
    timeUntilNextReview: TimeUntilNextReview;
    words: {
        words_by_level1: VocabularyItem[];
        words_by_level2: VocabularyItem[];
        words_by_level3: VocabularyItem[];
        words_by_level4: VocabularyItem[];
        words_by_level5: VocabularyItem[];
    };
    setWordLevels: (levels: Partial<Omit<WordLevelState, "setWordLevels" | "fetchWordsByLevel">>) => void;
    setWords: (words: WordLevelState["words"]) => void;
}

export const useWordLevelStore = create<WordLevelState>((set) => ({
    totalWords: 0,
    countLevel1: 0,
    countLevel2: 0,
    countLevel3: 0,
    countLevel4: 0,
    countLevel5: 0,
    reviewWordCount: 0,
    timeUntilNextReview: {} as TimeUntilNextReview,
    words: {
        words_by_level1: {} as VocabularyItem[],
        words_by_level2: {} as VocabularyItem[],
        words_by_level3: {} as VocabularyItem[],
        words_by_level4: {} as VocabularyItem[],
        words_by_level5: {} as VocabularyItem[],
    },
    setWordLevels: (levels) =>
        set((state) => ({
            ...state,
            ...levels,
        })),
    setWords: (words: WordLevelState["words"]) =>
        set((state) => ({
            ...state,
            words,
        })),
}));