/**
 * Các đường dẫn cho App Router trong ứng dụng
 * Sử dụng các hàm để tạo đường dẫn động khi cần
 */

// Auth routes
export const AUTH_ROUTES = {
    LOGIN: '/auth',
    REGISTER: '/auth?tab=register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: (token: string) => `/auth/reset-password/${token}`,
  };
  
  // Dashboard routes
  export const DASHBOARD_ROUTES = {
    HOME: '/',
    PROFILE: '/profile',
    SETTINGS: '/settings',
  };
  
  // Vocabulary routes
  export const VOCABULARY_ROUTES = {
    LIST: '/vocabulary',
    DETAILS: (id: string | number) => `/vocabulary/${id}`,
    ADD: '/vocabulary/add',
    EDIT: (id: string | number) => `/vocabulary/${id}/edit`,
  };
  
  // Lesson routes
  export const LESSON_ROUTES = {
    LIST: '/lessons',
    DETAILS: (id: string | number) => `/lessons/${id}`,
    START: (id: string | number) => `/lessons/${id}/learn`,
    REVIEW: '/review',
  };
  
  // Practice routes
  export const PRACTICE_ROUTES = {
    HOME: '/practice',
    FLASHCARDS: '/practice/flashcards',
    QUIZ: '/practice/quiz',
    MATCHING: '/practice/matching',
  };
  
  /**
   * Helper để tạo URL với query params
   */
  export const createUrl = (path: string, params: Record<string, string>) => {
    const url = new URL(path, window.location.origin);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    return url.toString();
  };