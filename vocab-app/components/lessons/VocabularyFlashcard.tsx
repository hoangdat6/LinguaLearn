"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, RotateCw, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { VocabularyItem } from "@/types/lesson-types"

interface VocabularyFlashcardProps {
  word: VocabularyItem
  onNext: () => void
}

export function VocabularyFlashcard({ word, onNext }: VocabularyFlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const playAudio = () => {
    const utterance = new SpeechSynthesisUtterance(word.word)
    utterance.lang = "en-US"
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="space-y-6">
      <div
        className="perspective-1000 relative h-[300px] w-full mx-auto cursor-pointer"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <motion.div
          className="relative w-full h-full transform-style-3d transition-all duration-500"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
          onClick={handleFlip}
        >
          {/* Front of card */}
          <motion.div
            className="absolute w-full h-full backface-hidden rounded-xl overflow-hidden"
            animate={{
              scale: isHovering && !isFlipped ? 1.02 : 1,
              boxShadow:
                isHovering && !isFlipped
                  ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div className="h-full flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
              <motion.h2
                className="text-4xl font-bold mb-4 text-primary"
                animate={{ scale: isHovering && !isFlipped ? 1.05 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {word.word}
              </motion.h2>
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

              <motion.div
                className="absolute bottom-4 left-0 right-0 text-center text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovering && !isFlipped ? 1 : 0 }}
              >
                Click to flip
              </motion.div>
            </div>
          </motion.div>

          {/* Back of card */}
          <motion.div
            className="absolute w-full h-full backface-hidden rounded-xl overflow-hidden rotate-y-180"
            animate={{
              scale: isHovering && isFlipped ? 1.02 : 1,
              boxShadow:
                isHovering && isFlipped
                  ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div className="h-full flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/20">
              <motion.h3
                className="text-3xl font-bold mb-4 text-secondary"
                animate={{ scale: isHovering && isFlipped ? 1.05 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {word.meaning}
              </motion.h3>
              <p className="text-center text-muted-foreground">{word.example}</p>

              <motion.div
                className="absolute bottom-4 left-0 right-0 text-center text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovering && isFlipped ? 1 : 0 }}
              >
                Click to flip back
              </motion.div>
            </div>
          </motion.div>
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

