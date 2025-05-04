import { WordReviewState } from "@/types/review";
import api from "./api";
import { USER_VOCABULARY } from "@/constants/api-endpoints";

export interface TimeUntilNextReview {
    hours: number;
    minutes: number;
    seconds: number;
}

export interface CountWordsByLevel  {
    level_counts: {
        count_level1?: number;
        count_level2?: number;
        count_level3?: number;
        count_level4?: number;
        count_level5?: number;
    };
    cefr_group_counts: {
        basic: number;
        intermediate: number;
        advanced: number;
    };
    time_until_next_review: TimeUntilNextReview;
    review_word_count: number;
}

export interface WordsByLevel {
    words_level1: WordReviewState[];
    words_level2: WordReviewState[];
    words_level3: WordReviewState[];
    words_level4: WordReviewState[];
    words_level5: WordReviewState[];
    level_counts: {
        count_level1?: number;
        count_level2?: number;
        count_level3?: number;
        count_level4?: number;
        count_level5?: number;
    };
    review_word_count: number;
    time_until_next_review: TimeUntilNextReview;
}

export interface UserWord {
    word_id: number;
    level?: number;
    streak?: number;
    is_correct?: boolean;
    question_type: string; 
}

const getVocabLevels = async () => {
    try {
        const response = await api.get<CountWordsByLevel>(USER_VOCABULARY.GET_VOCAB_LEVELS);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        return null;
    }
}

const fetchWordsLevel = async () => {
    try {
        const response = await api.get<WordsByLevel>(USER_VOCABULARY.GET_LEARNED_WORD);
        return response.data;
    } catch (error) {
        console.error("Error fetching words level:", error);
        throw error;
    }
};
const submitLearnedWords = async ({ lessonId, words }: { lessonId: number; words: UserWord[] }) => {
    try {
      const response = await api.post(USER_VOCABULARY.SUBMIT_LEARNED_WORDS, {
        is_review: false,
        lesson_id: lessonId,
        words: words,
      });
      return response;
    } catch (error) {
      console.error("Lỗi khi submit từ vựng:", error);
    }
  };
  
const userWordService = { getVocabLevels, fetchWordsLevel, submitLearnedWords };
export default userWordService;