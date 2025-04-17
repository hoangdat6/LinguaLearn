"use client"

import { ThemeCard } from "@/components/ThemeCard"
import { useCourses } from "@/hooks/useCourse"
import { motion } from "framer-motion"
import { LoaderCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function ThemesOverview() {
  const router = useRouter()
  const { filteredThemes, isLoading } = useCourses()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredThemes.map((theme, index) => (
          <motion.div
            key={theme.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <ThemeCard
              theme={theme}
              onSelect={(id) => {
                router.push(`/lessons?theme=${id}`)
              }}
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

