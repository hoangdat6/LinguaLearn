"use client"

import { motion } from "framer-motion"
import { CheckCircle, XCircle } from "lucide-react"

interface QuestionFeedbackProps {
  isCorrect: boolean
  correctAnswer: string
}

export function QuestionFeedback({ isCorrect, correctAnswer }: QuestionFeedbackProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`p-4 rounded-lg text-center ${
        isCorrect
          ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
          : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
      }`}
    >
      {isCorrect ? (
        <p className="font-medium flex items-center justify-center gap-2">
          <CheckCircle className="h-5 w-5" />
          <span>Chính xác!</span>
        </p>
      ) : (
        <p className="font-medium flex items-center justify-center gap-2">
          <XCircle className="h-5 w-5" />
          <span>Chưa đúng. Đáp án đúng là: {correctAnswer}</span>
        </p>
      )}
    </motion.div>
  )
}

