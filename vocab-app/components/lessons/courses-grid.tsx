import { motion } from "framer-motion"
import { CourseCard } from "@/components/course-card"
import { CourseCardSkeleton } from "@/components/course-card"
import { Course } from "@/types/lesson-types"

interface CoursesGridProps {
  courses: Course[];
  isLoading: boolean;
  onCourseSelect: (id: string) => void;
  isAuthenticated: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

export function CoursesGrid({ courses, isLoading, onCourseSelect, isAuthenticated }: CoursesGridProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
    >
      {isLoading ? (
        [...Array(6)].map((_, index) => (
          <CourseCardSkeleton key={index} />
        ))
      ) : (
        courses.map((course, index) => (
          <motion.div
            key={course.id}
            variants={itemVariants}
          >
            <CourseCard
              key={course.id}
              theme={course}
              onSelect={onCourseSelect}
              isAuthenticated={isAuthenticated}
            />
          </motion.div>
        ))
      )}
    </motion.div>
  )
} 