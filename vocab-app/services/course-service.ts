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
// lấy danh sách khóa học (có phân trang)
export async function getCoursesByPage(page: number = 1): Promise<PaginatedResponse<Course>> {
  try {
    const response = await api.get<PaginatedResponse<Course>>("user-courses", { params: { page } });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách khóa học:", error);
    return { count: 0, next: null, previous: null, results: [] };
  }
}

//lấy danh sách bài học theo khóa học (có phân trang)
export async function getLessonsByCourseId(courseId: string | null, page: number = 1): Promise<PaginatedResponse<Lesson>> {
  if (!courseId) return { count: 0, next: null, previous: null, results: [] };
  try {
    const response = await api.get<PaginatedResponse<Lesson>>(`user-courses/${courseId}/lessons`, { 
      params: { page } 
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bài học:", error);
    return { count: 0, next: null, previous: null, results: [] };
  }
}

// lấy danh sách từ vựng theo bài học không có phân trang
export async function getWordsByLessonId(lessonId: string): Promise<WordsResponse> {
  try {
    const response = await api.get<WordsResponse>(`user-lessons/${lessonId}/words`);
    //console.log("Lấy danh sách từ vựng thành công:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách từ vựng:", error);
    return { lessonId, lesson_title: "", lesson_description: "", words: [] };
  }
}

