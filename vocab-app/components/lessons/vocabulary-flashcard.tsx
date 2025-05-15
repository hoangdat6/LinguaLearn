"use client"

import { use, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, RotateCw, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { Word } from "@/types/lesson-types"

interface VocabularyFlashcardProps {
  word: Word
  onNext: () => void
  disableAutoPlay?: boolean //kiểm soát phát âm tự động
}

export function VocabularyFlashcard({ word, onNext, disableAutoPlay }: VocabularyFlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  // phát âm từ vựng khi component được mount hoặc khi từ vựng thay đổi
  useEffect(() => {
    if (!disableAutoPlay) {
      playAudio()
    }
  }, [word, disableAutoPlay])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        setIsFlipped((prev) => !prev)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const playAudio = () => {
    const utterance = new SpeechSynthesisUtterance(word.word)
    utterance.lang = "en-US"
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="space-y-6">
      <div className="perspective-1000 relative h-[300px] w-full mx-auto cursor-pointer" onClick={handleFlip}>
        <motion.div
          className="relative w-full h-full transform-style-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Front of card */}
          <div
            className="absolute w-full h-full flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 shadow-md"
            style={{ backfaceVisibility: "hidden", zIndex: isFlipped ? 1 : 2 }}
          >
            <h2 className="text-4xl font-bold mb-4 text-primary">{word.word}</h2>
            <p className="text-muted-foreground text-sm mb-2">{word.pronunciation}</p>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 opacity-80 hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation()
                playAudio()
              }}
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Back of card */}
          <div
            className="absolute w-full h-full flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/20 shadow-md"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", zIndex: isFlipped ? 2 : 1 }}
          >
            <h3 className="text-3xl font-bold mb-4 text-secondary">{word.meaning}</h3>
            <p className="text-center text-muted-foreground">{word.example}</p>
          </div>
        </motion.div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" size="icon" onClick={handleFlip} className="hover:bg-primary/5 transition-colors">
          <RotateCw className="h-4 w-4" />
        </Button>
        <Button onClick={onNext} className="transition-all hover:translate-x-1">
          Tiếp theo <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
