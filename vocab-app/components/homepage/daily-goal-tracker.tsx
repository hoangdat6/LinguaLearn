"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Calendar, CheckCircle2, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface DailyGoalTrackerProps {
  completed: number
  total: number
  streak: number
  className?: string
}

export function DailyGoalTracker({ completed, total, streak, className }: DailyGoalTrackerProps) {
  const [showCelebration, setShowCelebration] = useState(false)

  // Show celebration animation when goal is completed
  useEffect(() => {
    if (completed === total) {
      setShowCelebration(true)
      const timer = setTimeout(() => setShowCelebration(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [completed, total])

  // Generate the days of the week
  const daysOfWeek = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]
  const today = new Date().getDay()
  const adjustedToday = today === 0 ? 6 : today - 1 // Adjust Sunday (0) to be 6

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-amber-500" />
            Mục tiêu hàng ngày
          </h3>
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-1 text-primary" />
            <span className="font-medium">{streak} ngày liên tiếp</span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          {daysOfWeek.map((day, index) => (
            <div key={day} className="flex flex-col items-center">
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                  index < adjustedToday
                    ? "bg-primary text-primary-foreground"
                    : index === adjustedToday
                      ? "bg-amber-100 text-amber-700 border-2 border-amber-500"
                      : "bg-muted text-muted-foreground"
                }`}
                initial={{ scale: 0.8 }}
                animate={{ scale: index === adjustedToday ? [1, 1.1, 1] : 1 }}
                transition={{
                  duration: 0.5,
                  repeat: index === adjustedToday ? Number.POSITIVE_INFINITY : 0,
                  repeatType: "reverse",
                  repeatDelay: 1,
                }}
              >
                {index < adjustedToday ? <CheckCircle2 className="h-5 w-5" /> : day}
              </motion.div>
            </div>
          ))}
        </div>

        <div className="relative">
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: total }).map((_, index) => (
              <motion.div
                key={index}
                className={`h-12 rounded-lg flex items-center justify-center ${
                  index < completed ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <CheckCircle2 className={`h-6 w-6 ${index < completed ? "" : "opacity-30"}`} />
              </motion.div>
            ))}
          </div>

          <AnimatePresence>
            {showCelebration && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-primary/20 rounded-lg backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="text-center"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Trophy className="h-12 w-12 text-yellow-500 fill-yellow-500 mx-auto mb-2" />
                  <p className="text-lg font-bold">Mục tiêu hoàn thành!</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-between items-center mt-4 text-sm">
          <div className="flex items-center text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 mr-1" />
            <span>
              {completed}/{total} hoàn thành
            </span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            <span>Còn lại: {Math.max(0, total - completed)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

