"use client"

import { CourseCard } from "@/components/CourseCard"
import { useCourses } from "@/hooks/useCourse"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"


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
      <div className="text-center mt-4">
        <Link href="/lessons">
          <button className="btn">Xem tất cả chủ đề</button>
        </Link>
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
