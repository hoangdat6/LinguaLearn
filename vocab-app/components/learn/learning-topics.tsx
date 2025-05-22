"use client"

import { CourseCard } from "@/components/course-card"
import { useCourses } from "@/hooks/useCourse"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"


export function CoursesOverview() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const router = useRouter()
  const { filteredCourses, isLoading } = useCourses()

  if (isLoading) {
    return <CoursesOverviewLoading />
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((theme, index) => (
          <motion.div
            key={theme.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <CourseCard
              theme={theme}
              onSelect={(id) => {
                router.push(`/lessons?theme=${id}`)
              }}
              isAuthenticated={isAuthenticated}
            />
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Button 
          asChild 
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 
                     text-white font-medium px-8 py-6 rounded-full shadow-md hover:shadow-lg 
                     transform transition-all duration-300 hover:scale-105"
          size="lg"
        >
          <Link href="/lessons" className="flex items-center justify-center space-x-2">
            <span>Xem tất cả chủ đề</span>
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="ml-1 transition-transform duration-300 group-hover:translate-x-1"
            >
              <path 
                d="M13.5 19L20 12L13.5 5M4 19L10.5 12L4 5" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </Button>
      </div>
    </div>
  )
}


const SkeletonCard = () => {
  return (
    <div className="animate-pulse bg-gray-200 rounded-lg h-40 w-full"></div>
  )
}

const CoursesOverviewLoading = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <SkeletonCard />
          </motion.div>
        ))}
      </div>
      <div className="text-center mt-4">
        <div className="animate-pulse bg-gray-200 rounded-lg h-10 w-40 mx-auto"></div>
      </div>
    </div>
  )
}
