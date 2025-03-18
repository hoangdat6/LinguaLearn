"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Volume2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { VocabularyItem } from "@/types/lesson-types"

interface VocabularyAudioProps {
  word: VocabularyItem
  showFeedback: boolean
  isCorrect: boolean
  onAnswer: (correct: boolean) => void
}

export function VocabularyAudio({ word, showFeedback, isCorrect, onAnswer }: VocabularyAudioProps) {
  const [answer, setAnswer] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)

  const playAudio = () => {
    setIsPlaying(true)
    const utterance = new SpeechSynthesisUtterance(word.word)
    utterance.lang = "en-US"
    utterance.onend = () => setIsPlaying(false)
    window.speechSynthesis.speak(utterance)
  }

  const handleSubmit = () => {
    onAnswer(answer.toLowerCase().trim() === word.word.toLowerCase().trim())
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Nghe và nhập từ</h2>
        <motion.div whileTap={{ scale: 0.95 }} className="inline-block">
          <Button
            variant="outline"
            size="lg"
            className="gap-2 relative overflow-hidden group"
            onClick={playAudio}
            disabled={isPlaying}
          >
            <motion.div
              animate={
                isPlaying
                  ? {
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7],
                    }
                  : {}
              }
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 1.5,
              }}
            >
              <Volume2 className="h-5 w-5 text-primary" />
            </motion.div>
            <span>Nghe từ</span>
            <motion.div
              className="absolute inset-0 bg-primary/10 rounded-md"
              initial={{ scale: 0, opacity: 0 }}
              animate={
                isPlaying
                  ? {
                      scale: 1.5,
                      opacity: 0,
                    }
                  : {}
              }
              transition={{
                repeat: isPlaying ? Number.POSITIVE_INFINITY : 0,
                duration: 1.5,
              }}
            />
          </Button>
        </motion.div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Nhập từ bạn nghe được..."
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
              onClick={() => setAnswer("")}
              whileTap={{ scale: 0.9 }}
            >
              ✕
            </motion.button>
          )}
        </div>

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

