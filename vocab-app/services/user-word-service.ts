import axios from "axios";
import Cookies from "js-cookie";
import api from "./api";
import { VocabularyItem } from "@/types/lesson-types";
import authService from "./auth-service";

export interface TimeUntilNextReview {
    hours: number;
    minutes: number;
    seconds: number;
}

export interface DueWordsResponse {
    count_level1: number;
    count_level2: number;
    count_level3: number;
    count_level4: number;
    count_level5: number;
    review_word_count: number;
    time_until_next_review: TimeUntilNextReview;
}

export interface WordsByLevel {
    words_by_level1: VocabularyItem[];
    words_by_level2: VocabularyItem[];
    words_by_level3: VocabularyItem[];
    words_by_level4: VocabularyItem[];
    words_by_level5: VocabularyItem[];
    count_level1: number;
    count_level2: number;
    count_level3: number;
    count_level4: number;
    count_level5: number;
};

const getVocabLevels = async () => {
    try {
        const response = await api.get<DueWordsResponse>("user-words/count_words-by-level");
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        return null;
    }
}

const fetchWordsLevel = async () => {
    try {
        const response = await api.get<WordsByLevel>("user-words/learned-words");
        return response.data;
    } catch (error) {
        console.error("Error fetching words level:", error);
        throw error;
    }
};

const userWordService = { getVocabLevels, fetchWordsLevel };
export default userWordService;