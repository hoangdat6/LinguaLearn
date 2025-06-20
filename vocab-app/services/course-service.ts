import { COURSES, LESSONS } from "@/constants/api-endpoints";
import { Course, Lesson, Word } from "@/types/lesson-types";
import api from "./api";

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface WordsResponse {
  lessonId: string;
  lesson_title: string;
  lesson_description: string;
  words: Word[];
}

export const getCoursesByPage = async (page: number = 1, page_size: number = 6): Promise<PaginatedResponse<Course>> => {
  try {
    const response = await api.get<PaginatedResponse<Course>>(COURSES.GET_COURSES, { params: { page, page_size } });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách khóa học:", error);
    return { count: 0, next: null, previous: null, results: [] };
  }
} 

//lấy danh sách bài học theo khóa học (có phân trang)
export const getLessonsByCourseId = async (courseId: string | null, page: number = 1, page_size: number = 6): Promise<PaginatedResponse<Lesson>> => {
  if (!courseId) return { count: 0, next: null, previous: null, results: [] };
  try {
    const response = await api.get<PaginatedResponse<Lesson>>(COURSES.GET_LESSONS_BY_COURSE(courseId), {
      params: { page, page_size }
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bài học:", error);
    return { count: 0, next: null, previous: null, results: [] };
  }
}

// lấy danh sách từ vựng theo bài học không có phân trang
export const getWordsByLessonId = async (lessonId: string): Promise<WordsResponse> => {
  try {
    const response = await api.get<WordsResponse>(LESSONS.GET_WORDS_BY_LESSON_ID(lessonId));
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách từ vựng:", error);
    return { lessonId, lesson_title: "", lesson_description: "", words: [] };
  }
}

