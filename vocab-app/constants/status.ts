// các biến lưu trữ trong local storage

export const WORD_LEVELS_KEY = "wordLevels";

export const USER_INFO_KEY = "user_info";
export const IS_PROFILE_CHANGED_KEY = "is_profile_changed";


export const REVIEW_WORDS_KEY = "review_words";
export const REVIEW_SESSION_KEY = "review_session";
export const REVIEW_RESULT_KEY = "review_result";

// Session state constants
export const SESSION_STATE = {
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed"
} as const;

export type SessionState = typeof SESSION_STATE[keyof typeof SESSION_STATE];