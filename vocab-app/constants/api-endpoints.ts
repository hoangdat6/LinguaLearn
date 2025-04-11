// Base URL from environment
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api/";

// Auth endpoints
export const AUTH = {
  LOGIN: `${API_BASE_URL}accounts/login/`,
  REGISTER: `${API_BASE_URL}accounts/register/`,
  LOGOUT: `${API_BASE_URL}accounts/logout/`,
  PROFILE: `${API_BASE_URL}accounts/profile`,
  GOOGLE_LOGIN: `${API_BASE_URL}accounts/google/login/`,
  FACEBOOK_LOGIN: `${API_BASE_URL}accounts/facebook/login/`,
};

// Vocabulary endpoints
export const VOCABULARY = {
  GET_WORDS: `${API_BASE_URL}vocabulary/words/`,
  GET_WORD_DETAILS: (id: number) => `${API_BASE_URL}vocabulary/words/${id}/`,
  ADD_WORD: `${API_BASE_URL}vocabulary/words/`,
  UPDATE_WORD: (id: number) => `${API_BASE_URL}vocabulary/words/${id}/`,
  DELETE_WORD: (id: number) => `${API_BASE_URL}vocabulary/words/${id}/`,
};

// User vocabulary endpoints
export const USER_VOCABULARY = {
  GET_USER_WORDS: `${API_BASE_URL}vocabulary/user-words/`,
  GET_USER_WORD: (id: number) => `${API_BASE_URL}vocabulary/user-words/${id}/`,
  UPDATE_USER_WORD: (id: number) => `${API_BASE_URL}vocabulary/user-words/${id}/`,
  GET_REVIEW_WORDS: `${API_BASE_URL}vocabulary/review-words/`,
  UPDATE_WORD_LEVEL: `${API_BASE_URL}vocabulary/update-word-level/`,
};

// Lessons endpoints
export const LESSONS = {
  GET_LESSONS: `${API_BASE_URL}lessons/`,
  GET_LESSON_DETAILS: (id: number) => `${API_BASE_URL}lessons/${id}/`,
  START_LESSON: (id: number) => `${API_BASE_URL}lessons/${id}/start/`,
  COMPLETE_LESSON: (id: number) => `${API_BASE_URL}lessons/${id}/complete/`,
};