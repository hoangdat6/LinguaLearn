import { motion } from "framer-motion"
import { LessonCard, LessonCardSkeleton } from "@/components/lesson-card"
import { Lesson } from "@/types/lesson-types"

interface LessonsGridProps {
  lessons: Lesson[];
  isLoading: boolean;
  onLessonClick: (id: string) => void;
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

export function LessonsGrid({ lessons, isLoading, onLessonClick }: LessonsGridProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <h3 className="text-xl font-bold">Bài học trong chủ đề này</h3>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          [...Array(6)].map((_, index) => (
            <LessonCardSkeleton key={index} />
          ))
        ) : lessons?.length > 0 ? (
          lessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              variants={itemVariants}
            >
              <LessonCard
                lesson={lesson}
                onSelect={onLessonClick}
              />
            </motion.div>
          ))
        ) : (
          <p>Không có bài học nào trong chủ đề này.</p>
        )}
      </div>
    </motion.div>
  )
} 