"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen, LoaderCircle } from "lucide-react"
import { TimeUntilNextReview } from "@/services/user-word-service";

interface VocabularyLevelsProps {
  showLabels?: boolean;
  wordLevel1?: number;
  wordLevel2?: number;
  wordLevel3?: number;
  wordLevel4?: number;
  wordLevel5?: number;
  reviewWordCount?: number;
  isLoading?: boolean;
  timeUntilNextReview?: TimeUntilNextReview;
}

export function VocabularyLevels({
  showLabels = false,
  wordLevel1 = 0,
  wordLevel2 = 0,
  wordLevel3 = 0,
  wordLevel4 = 0,
  wordLevel5 = 0,
  reviewWordCount = 0,
  isLoading = false,
  timeUntilNextReview
}: VocabularyLevelsProps) {
  const levels = [
    { level: 1, count: wordLevel1, color: "bg-red-500" },
    { level: 2, count: wordLevel2, color: "bg-yellow-400" },
    { level: 3, count: wordLevel3, color: "bg-sky-400" },
    { level: 4, count: wordLevel4, color: "bg-blue-500" },
    { level: 5, count: wordLevel5, color: "bg-navy-800" },
  ]

  const totalWords = levels.reduce((sum, level) => sum + level.count, 0)
  const maxCount = Math.max(...levels.map((level) => level.count), 1) // Ensure non-zero for division

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {totalWords === 0 ? (
        <div className="flex flex-col items-center gap-6 py-12">
          <p className="text-lg text-center">Bạn chưa học từ nào. Hãy bắt đầu học ngay!</p>
          <Button
            asChild
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-medium px-8 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Link href="/vocabulary" className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Học ngay
            </Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="relative h-[200px] flex items-end justify-between gap-4 pb-8 border-b">
            {levels.map((level) => (
              <div key={level.level} className="relative flex flex-col items-center flex-1">
                <span className="absolute -top-6 text-sm font-medium">{level.count} từ</span>
                <div
                  className={`w-full ${level.color} rounded-t-lg transition-all duration-300 ease-out`}
                  style={{
                    height: `${Math.max((level.count / maxCount) * 160, 5)}px`, // Minimum height for visibility
                  }}
                />
                <span className="absolute -bottom-8 text-base font-medium">{level.level}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-4">
            {
              reviewWordCount === 0 && timeUntilNextReview ? 
              <p className="text-base">
                Tiếp tục ôn sau: <span className="text-primary font-medium">
                {timeUntilNextReview.hours > 0 ? `${timeUntilNextReview.hours} giờ ` : ''}
                {timeUntilNextReview.minutes > 0 ? `${timeUntilNextReview.minutes} phút` : ''}
                {timeUntilNextReview.hours === 0 && timeUntilNextReview.minutes === 0 ? 'vài giây nữa' : ''}
                </span>
              </p>
              : <p className="text-base">
                Chuẩn bị ôn tập: <span className="text-primary font-medium">{reviewWordCount} từ</span>
              </p>
            }
            <Button
              asChild
              disabled={reviewWordCount === 0}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-medium px-8 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="/review-session" className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Ôn tập ngay
              </Link>
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

