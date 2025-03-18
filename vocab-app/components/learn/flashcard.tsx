"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, RotateCw } from "lucide-react"

interface FlashcardProps {
  frontContent: string
  backContent: string
  onNext: () => void
}

export function Flashcard({ frontContent, backContent, onNext }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleNext = () => {
    setIsFlipped(false)
    onNext()
  }

  return (
    <div className="space-y-6">
      <motion.div
        className="flashcard cursor-pointer"
        onClick={handleFlip}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <Card className="flashcard-front absolute w-full h-full backface-hidden bg-primary/5 dark:bg-primary/10 flex items-center justify-center p-6">
          <div className="text-center">
            <h3 className="text-4xl font-bold mb-2">{frontContent}</h3>
            <p className="text-muted-foreground">Click to reveal translation</p>
          </div>
        </Card>
        <Card
          className="flashcard-back absolute w-full h-full backface-hidden bg-secondary/50 dark:bg-secondary/30 flex items-center justify-center p-6"
          style={{ transform: "rotateY(180deg)" }}
        >
          <div className="text-center">
            <h3 className="text-4xl font-bold mb-2">{backContent}</h3>
            <p className="text-muted-foreground">Translation</p>
          </div>
        </Card>
      </motion.div>

      <div className="flex justify-between">
        <Button variant="outline" size="icon" onClick={handleFlip}>
          <RotateCw className="h-4 w-4" />
          <span className="sr-only">Flip card</span>
        </Button>
        <Button onClick={handleNext}>
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

