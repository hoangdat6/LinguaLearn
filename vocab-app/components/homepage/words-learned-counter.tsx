"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BookOpen, Award, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface WordsLearnedCounterProps {
  totalWords: number
  weeklyWords: number
  className?: string
}

export function WordsLearnedCounter({ totalWords, weeklyWords, className }: WordsLearnedCounterProps) {
  const [count, setCount] = useState(0)

  // Animate the counter on mount
  useEffect(() => {
    const duration = 1500
    const interval = 20
    const steps = duration / interval
    const increment = totalWords / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= totalWords) {
        setCount(totalWords)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, interval)

    return () => clearInterval(timer)
  }, [totalWords])

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-primary" />
            Từ vựng đã học
          </h3>
          <div className="flex items-center text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
            <span>+{weeklyWords} tuần này</span>
          </div>
        </div>

        <div className="flex items-center justify-center py-6">
          <div className="relative">
            <motion.div
              className="text-6xl font-bold text-center text-primary"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {count}
            </motion.div>
            <motion.div
              className="absolute -top-2 -right-2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.3 }}
            >
              <Award className="h-6 w-6 text-yellow-500 fill-yellow-500" />
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-2">
          {[
            { label: "Cơ bản", count: Math.floor(totalWords * 0.5), color: "bg-blue-100 text-blue-700" },
            { label: "Trung cấp", count: Math.floor(totalWords * 0.3), color: "bg-green-100 text-green-700" },
            { label: "Nâng cao", count: Math.floor(totalWords * 0.2), color: "bg-purple-100 text-purple-700" },
          ].map((category, index) => (
            <motion.div
              key={index}
              className={`rounded-lg p-2 text-center ${category.color}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 * index + 0.5, duration: 0.3 }}
            >
              <div className="text-lg font-bold">{category.count}</div>
              <div className="text-xs">{category.label}</div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

