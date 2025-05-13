"use client"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCourses } from "@/hooks/useCourse"
import { useLessons } from "@/hooks/useLessons"
import { motion } from "framer-motion"
import { BookOpen } from 'lucide-react'
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { LessonsHeader } from "@/components/lessons/lessons-header"
import { ThemeHeader } from "@/components/lessons/theme-header"
import { LessonsGrid } from "@/components/lessons/lessons-grid"
import { CoursesGrid } from "@/components/lessons/courses-grid"
import PaginationCustom from "@/components/ui/pagination-custom"

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6
    }
  }
};

export default function LessonsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  
  const {
    themes,
    filteredCourses,
    searchQuery,
    setSearchQuery,
    difficulty,
    setDifficulty,
    sortBy,
    setSortBy,
    isLoading,
    nextPage,
    prevPage,
    setCurrentPage,
    currentPage,
    totalPages
  } = useCourses();

  const [currentTab, setCurrentTab] = useState("themes");
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  const {
    lessons,
    isLoading: isLessonsLoading,
    currentPage: curPage,
    nextPage: nxPage,
    prevPage: pvPage,
    setCurrentPage: sCurPage,
    setPrevPage: sPrevPage,
    totalPages: totalPagesLessons,
  } = useLessons(selectedTheme);

  useEffect(() => {
    if (selectedTheme) {
      setCurrentTab("selectedTheme")
      sCurPage(1)
      sPrevPage(null)
    }
  }, [selectedTheme])

  useEffect(() => {
    const theme = searchParams.get("theme")
    if (theme) {
      setSelectedTheme(theme)
      setCurrentTab("selectedTheme")
      sCurPage(1)
      sPrevPage(null)
    }
  }, [searchParams])

  const handleLessonClick = (lessonId: string) => {
    router.push(`/vocabulary-learning/${lessonId}`);
  };

  const generatePastelColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 80%, 90%)`;
  };

  const backgroundColor = useMemo(() => generatePastelColor(), [selectedTheme]);

  return (
    <div className="container max-w-7xl py-10">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="space-y-6"
      >
        <LessonsHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="themes" className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              Chủ đề
            </TabsTrigger>
            {selectedTheme && (
              <TabsTrigger value="selectedTheme" className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                {themes.find(t => t.id == selectedTheme)?.title || "Chủ đề"}
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="themes">
            <CoursesGrid
              courses={filteredCourses}
              isLoading={isLoading}
              onCourseSelect={(id) => {
                setSelectedTheme(id);
                setCurrentTab("selectedTheme");
              }}
              isAuthenticated={isAuthenticated}
            />
            <PaginationCustom
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            />
          </TabsContent>

          <TabsContent value="selectedTheme">
            {selectedTheme && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {themes.filter(t => t.id == selectedTheme).map(theme => (
                  <div key={theme.id} className="space-y-6">
                    <ThemeHeader
                      theme={theme}
                      backgroundColor={backgroundColor}
                      isAuthenticated={isAuthenticated}
                      onBack={() => setCurrentTab("themes")}
                    />

                    <LessonsGrid
                      lessons={lessons}
                      isLoading={isLessonsLoading}
                      onLessonClick={handleLessonClick}
                    />
                  </div>
                ))}
                <div className="flex justify-center mt-6">
                  <PaginationCustom
                    currentPage={curPage}
                    totalPages={totalPagesLessons}
                    onPageChange={(page) => {
                      sCurPage(page)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                  />
                </div>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
