import { useState, useEffect } from "react";
import { Course } from "@/types/lesson-types";
import { getCoursesByPage } from "@/services/course-service";

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredThemes, setFilteredThemes] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [isLoading, setIsLoading] = useState(true);

  // phân trang sử dụng số trang (page number)
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPage, setNextPage] = useState<number | null>(null);
  const [prevPage, setPrevPage] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      setIsLoading(true);
      try {
        const response = await getCoursesByPage(currentPage);
        setCourses(response.results);
    
        // Xử lý next/previous theo số trang
        setNextPage(response.next ? currentPage + 1 : null);
        setPrevPage(response.previous ? currentPage - 1 : null);
      } catch (error) {
        console.error("Lỗi khi lấy khoá học:", error);
      }
      setIsLoading(false);
    }

    fetchCourses();
  }, [currentPage]); // Cập nhật khi `currentPage` thay đổi

  useEffect(() => {
    let newFilteredThemes = [...courses];

    if (searchQuery.trim() !== "") {
      newFilteredThemes = newFilteredThemes.filter((course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredThemes(newFilteredThemes);
  }, [courses, searchQuery, difficulty, sortBy]);

  return {
    themes: courses,
    filteredThemes,
    searchQuery,
    setSearchQuery,
    difficulty,
    setDifficulty,
    sortBy,
    setSortBy,
    isLoading,
    nextPage,
    prevPage,
    currentPage,
    setCurrentPage, // Thay đổi trang bằng số trang
  };
}
