"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen } from "lucide-react"

interface VocabularyLevelsProps {
  showLabels?: boolean
}

export function VocabularyLevels({ showLabels = false }: VocabularyLevelsProps) {
  const levels = [
    { level: 1, count: 48, color: "bg-red-500" },
    { level: 2, count: 18, color: "bg-yellow-400" },
    { level: 3, count: 18, color: "bg-sky-400" },
    { level: 4, count: 23, color: "bg-blue-500" },
    { level: 5, count: 5, color: "bg-navy-800" },
  ]

  const totalWords = levels.reduce((sum, level) => sum + level.count, 0)
  const maxCount = Math.max(...levels.map((level) => level.count))

  return (
    <div className="space-y-6">
      <div className="relative h-[200px] flex items-end justify-between gap-4 pb-8 border-b">
        {levels.map((level) => (
          <div key={level.level} className="relative flex flex-col items-center flex-1">
            <span className="absolute -top-6 text-sm font-medium">{level.count} từ</span>
            <div
              className={`w-full ${level.color} rounded-t-lg transition-all duration-300 ease-out`}
              style={{
                height: `${(level.count / maxCount) * 160}px`,
              }}
            />
            <span className="absolute -bottom-8 text-base font-medium">{level.level}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-4">
        <p className="text-base">
          Chuẩn bị ôn tập: <span className="text-primary font-medium">{totalWords} từ</span>
        </p>
        <Button
          asChild
          className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-medium px-8 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Link href="/review-session" className="flex items-center">
            <BookOpen className="mr-2 h-5 w-5" />
            Ôn tập ngay
          </Link>
        </Button>
      </div>
    </div>
  )
}

