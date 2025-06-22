// Base URL from environment
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api/";

// Auth endpoints
export const AUTH = {
  LOGIN: `${API_BASE_URL}accounts/login/`,
  REGISTER: `${API_BASE_URL}accounts/register/`,
  LOGOUT: `${API_BASE_URL}accounts/logout/`,
  PROFILE: `${API_BASE_URL}accounts/user-detail/profile`,
  GOOGLE_LOGIN: `${API_BASE_URL}accounts/google/login/`,
  FACEBOOK_LOGIN: `${API_BASE_URL}accounts/facebook/login/`,
  FORGOT_PASSWORD: `${API_BASE_URL}accounts/reset-password/`,
  RESET_PASSWORD_CONFIRM: (uid: string, token: string) => 
    `${API_BASE_URL}accounts/reset-password-confirm/${uid}/${token}/`,
  RESET_PASSWORD_VALIDATE: (uid: string, token: string) => 
    `${API_BASE_URL}accounts/reset-password-validate/${uid}/${token}/`,
  CHANGE_PASSWORD: `${API_BASE_URL}accounts/change-password/`,
  UPDATE_PROFILE: `${API_BASE_URL}accounts/update-profile/`,
  VERIFY_EMAIL: (token: string) => `${API_BASE_URL}accounts/verify-email/${token}/`,
  REFRESH_TOKEN: `${API_BASE_URL}accounts/token/refresh/`,
};

// User vocabulary endpoints
export const USER_VOCABULARY = {
  GET_VOCAB_LEVELS: `${API_BASE_URL}progress/vocabularies/count_words-by-level`,
  GET_LEARNED_WORD: `${API_BASE_URL}progress/vocabularies/learned-words`,
  GET_LEARNED_WORD_PAGINATION: (level: number, page: number, page_size: number) =>
    `${API_BASE_URL}progress/vocabularies/learned-words-pagination?level=${level}&page=${page}&page_size=${page_size}`,
  GET_REVIEW_WORDS: `${API_BASE_URL}progress/vocabularies/review-words/`,
  SUBMIT_LEARNED_WORDS: `${API_BASE_URL}progress/vocabularies/submit-words/`,
};

// Lessons endpoints
export const LESSONS = {
  GET_LESSONS: `${API_BASE_URL}progress/lessons/`,
  GET_LESSON_DETAILS: (id: string) => `${API_BASE_URL}progress/lessons/${id}/`,
  GET_WORDS_BY_LESSON_ID: (id: string) => `${API_BASE_URL}progress/lessons/${id}/words/`,
};

export const COURSES = {
  GET_COURSES: `${API_BASE_URL}progress/courses`,
  GET_LESSONS_BY_COURSE: (courseId: string) => `${API_BASE_URL}progress/courses/${courseId}/lessons`,
};

export const LEADERBOARD = {
  GET_LEADERBOARD: `${API_BASE_URL}gamification/leaderboard/`,
}

export const USER_PROFILE = {
  GET_PROFILE: `${API_BASE_URL}accounts/user-detail/me/`,
  UPDATE_PROFILE: `${API_BASE_URL}accounts/user-detail/me/`,
  GET_USER_STATS: `${API_BASE_URL}accounts/user-detail/stats/`,
};