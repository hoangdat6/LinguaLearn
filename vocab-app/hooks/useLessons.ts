import { useState, useEffect } from "react";
import { Course, Lesson } from "@/types/lesson-types";
import { getCourses } from "@/services/course-service";

export function useLessons() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [filteredThemes, setFilteredThemes] = useState<Course[]>([]);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    const data = getCourses();
    setCourses(data);
    const all = data.flatMap((theme) =>
      theme.lessons.map((lesson) => ({
        ...lesson,
        difficulty: theme.difficulty,
        themeId: theme.id,
        themeName: theme.title,
        themeColor: theme.color,
        themeIcon: theme.icon
      }))
    );
    setAllLessons(all);
  }, []);

  useEffect(() => {
    let newFilteredThemes = [...courses];

    // Filter by search query
    if (searchQuery.trim() !== "") {
      newFilteredThemes = newFilteredThemes.filter((theme) =>
        theme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        theme.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by difficulty
    if (difficulty !== "all") {
      newFilteredThemes = newFilteredThemes.filter(
        (theme) => theme.difficulty === difficulty
      );
    }

    // (Optional) Sort themes by some criterion if needed
    // ...sorting logic...

    setFilteredThemes(newFilteredThemes);
  }, [courses, searchQuery, difficulty, sortBy]);

  return {
    themes: courses,
    allLessons,
    filteredThemes,
    searchQuery,
    setSearchQuery,
    difficulty,
    setDifficulty,
    sortBy,
    setSortBy,
  };
}
