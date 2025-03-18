"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { VocabularyItem } from "@/types/lesson-types"

interface VocabularyTypingProps {
  word: VocabularyItem
  showFeedback: boolean
  isCorrect: boolean
  onAnswer: (correct: boolean) => void
}

export function VocabularyTyping({ word, showFeedback, isCorrect, onAnswer }: VocabularyTypingProps) {
  const [answer, setAnswer] = useState("")
  const [charCount, setCharCount] = useState<number[]>([])

  // Create character boxes for visual feedback
  const updateCharCount = (value: string) => {
    const wordLength = word.word.length
    const chars = new Array(wordLength).fill(0)

    // Fill in the character count based on input length
    for (let i = 0; i < Math.min(value.length, wordLength); i++) {
      chars[i] = 1
    }

    setCharCount(chars)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value)
    updateCharCount(e.target.value)
  }

  const handleSubmit = () => {
    onAnswer(answer.toLowerCase().trim() === word.word.toLowerCase().trim())
  }

  return (
    <div className="space-y-6">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4">Nhập từ có nghĩa:</h2>
        <motion.p
          className="text-xl mb-2 text-primary"
          animate={{
            scale: [1, 1.03, 1],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          {word.meaning}
        </motion.p>
        <p className="text-muted-foreground italic">{word.example}</p>
      </motion.div>

      <div className="space-y-4">
        <div className="relative">
          <Input
            type="text"
            value={answer}
            onChange={handleChange}
            placeholder="Nhập từ tiếng Anh..."
            className="text-lg pr-10"
            onKeyDown={(e) => {
              if (e.key === "Enter" && answer.trim()) {
                handleSubmit()
              }
            }}
          />
          {answer && (
            <motion.button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => {
                setAnswer("")
                updateCharCount("")
              }}
              whileTap={{ scale: 0.9 }}
            >
              ✕
            </motion.button>
          )}
        </div>

        {/* Character boxes for visual feedback */}
        <div className="flex justify-center gap-1 my-4">
          {word.word.split("").map((_, index) => (
            <motion.div
              key={index}
              className={`w-8 h-10 flex items-center justify-center rounded-md border-2 ${
                charCount[index] ? "border-primary bg-primary/5" : "border-muted"
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                borderColor: charCount[index] ? "hsl(var(--primary))" : "hsl(var(--muted))",
                backgroundColor: charCount[index] ? "hsla(var(--primary), 0.05)" : "transparent",
              }}
              transition={{ delay: index * 0.05 }}
            >
              {charCount[index] ? answer[index] || "" : ""}
            </motion.div>
          ))}
        </div>

        <p className="text-sm text-center text-muted-foreground">Từ này có {word.word.length} ký tự</p>

        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={`p-4 rounded-lg text-center ${
                isCorrect
                  ? "bg-green-100 text-green-700 dark:bg-green-900/20"
                  : "bg-red-100 text-red-700 dark:bg-red-900/20"
              }`}
            >
              {isCorrect ? (
                <motion.p
                  className="font-medium"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  Chính xác! 🎉
                </motion.p>
              ) : (
                <motion.p
                  className="font-medium"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  Chưa đúng. Đáp án đúng là: <span className="font-bold">{word.word}</span>
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-end">
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button onClick={handleSubmit} disabled={!answer.trim() || showFeedback} className="relative overflow-hidden">
            <span>Kiểm tra</span>
            <motion.span
              className="absolute inset-0 bg-white/20 rounded-md"
              initial={{ x: "-100%", opacity: 0.5 }}
              animate={{ x: "100%" }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 1.5,
                repeatDelay: 1,
              }}
            />
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

