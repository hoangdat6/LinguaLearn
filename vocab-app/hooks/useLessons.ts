import { useState, useEffect, use } from "react";
import { Course, Lesson } from "@/types/lesson-types";
import { getCoursesByPage, getLessonsByCourseId } from "@/services/course-service";

export function useLessons(themeId: string | null) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nextPage, setNextPage] = useState<number | null>(null);
  const [prevPage, setPrevPage] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);


  useEffect(() => {
    if (!themeId) {
      setLessons([]); // Nếu không có chủ đề, đặt danh sách bài học rỗng
      setIsLoading(false);
      return;
    }
    async function fetchLessons() {
      setIsLoading(true);
      try {
        const response = await getLessonsByCourseId(themeId, currentPage); 
        setLessons(response.results);
        setNextPage(response.next ? currentPage + 1 : null); // cập nhật trang tiếp theo
        setPrevPage(response.previous ? currentPage - 1 : null); // cập nhật trang trước đó
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bài học:", error);
      }
      setIsLoading(false);
    }

    fetchLessons();
  }, [themeId, currentPage]); 

  return { lessons, isLoading, nextPage, prevPage, currentPage, setCurrentPage, setPrevPage };
}
