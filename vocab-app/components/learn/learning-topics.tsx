"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Book, Users2 } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useLessons } from "@/hooks/useLessons"
import { ThemeCard } from "@/components/ThemeCard"
import { useRouter } from "next/navigation"

export function ThemesOverview() {
  const router = useRouter()
  const { filteredThemes } = useLessons()

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

