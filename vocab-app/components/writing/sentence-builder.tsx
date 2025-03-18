"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, HelpCircle, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"

interface SentenceBuilderProps {
  onComplete: (stats: { correct: number; total: number; time: number }) => void
}

export function WritingSentenceBuilder({ onComplete }: SentenceBuilderProps) {
  const [currentExercise, setCurrentExercise] = useState(0)
  const [selectedWords, setSelectedWords] = useState<string[]>([])
  const [availableWords, setAvailableWords] = useState<string[]>([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [progress, setProgress] = useState(0)
  const [stats, setStats] = useState({ correct: 0, total: 0, time: 0 })
  const [startTime] = useState(Date.now())

  // Sample exercises
  const exercises = [
    {
      instruction: "Sắp xếp các từ để tạo thành câu hoàn chỉnh:",
      words: ["I", "am", "learning", "English", "to", "improve", "my", "skills"],
      correctSentence: "I am learning English to improve my skills"
    },
    {
      instruction: "Sắp xếp các từ để tạo thành câu hoàn chỉnh:",
      words: ["She", "enjoys", "reading", "books", "in", "her", "free", "time"],
      correctSentence: "She enjoys reading books in her free time"
    },
    {
      instruction: "Sắp xếp các từ để tạo thành câu hoàn chỉnh:",
      words: ["They", "will", "travel", "to", "Paris", "next", "summer", "for", "vacation"],
      correctSentence: "They will travel to Paris next summer for vacation"
    },
    {
      instruction: "Sắp xếp các từ để tạo thành câu hoàn chỉnh:",
      words: ["The", "company", "has", "developed", "a", "new", "product", "for", "customers"],
      correctSentence: "The company has developed a new product for customers"
    },
    {
      instruction: "Sắp xếp các từ để tạo thành câu hoàn chỉnh:",
      words: ["We", "should", "protect", "the", "environment", "for", "future", "generations"],
      correctSentence: "We should protect the environment for future generations"
    }
  ]

  // Initialize the first exercise
  useEffect(() => {
    if (exercises.length > 0) {
      const shuffledWords = [...exercises[currentExercise].words].sort(() => Math.random() - 0.5)
      setAvailableWords(shuffledWords)
      setSelectedWords([])
    }
  }, [currentExercise])

  // Handle word selection
  const selectWord = (word: string, index: number) => {
    setSelectedWords([...selectedWords, word])
    setAvailableWords(availableWords.filter((_, i) => i !== index))
  }

  // Handle word removal
  const removeWord = (index: number) => {
    const word = selectedWords[index]
    setSelectedWords(selectedWords.filter((_, i) => i !== index))
    setAvailableWords([...availableWords, word])
  }

  // Check answer
  const checkAnswer = () => {
    const userSentence = selectedWords.join(" ")
    const isCorrect = userSentence === exercises[currentExercise].correctSentence
    
    setIsCorrect(isCorrect)
    setShowFeedback(true)
    setStats(prev => ({
      ...prev,
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }))

    setTimeout(() => {
      setShowFeedback(false)
      
      if (currentExercise < exercises.length - 1) {
        setCurrentExercise(prev => prev + 1)
        setProgress(((currentExercise + 1) / exercises.length) * 100)
      } else {
        // Exercise complete
        const totalTime = Math.floor((Date.now() - startTime) / 1000)
        onComplete({
          correct: stats.correct + (isCorrect ? 1 : 0),
          total: stats.total + 1,
          time: totalTime
        })
      }
    }, 2000)
  }

  // Get hint
  const getHint = () => {
    const correctWords = exercises[currentExercise].correctSentence.split(" ")
    const nextCorrectWord = correctWords[selectedWords.length]
    
    if (nextCorrectWord) {
      const indexInAvailable = availableWords.findIndex(word => word === nextCorrectWord)
      if (indexInAvailable !== -1) {
        selectWord(nextCorrectWord, indexInAvailable)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Xây dựng câu</h2>
        <div className="text-sm text-muted-foreground">
          {currentExercise + 1}/{exercises.length}
        </div>
      </div>

      <Progress value={progress} className="h-2" />

      <div className="space-y-4">
        <p className="text-lg">{exercises[currentExercise].instruction}</p>
        
        {/* Selected words area */}
        <div className="min-h-[60px] p-4 border-2 border-dashed rounded-lg flex flex-wrap gap-2 items-center">
          {selectedWords.length === 0 ? (
            <span className="text-muted-foreground">Chọn các từ bên dưới để tạo câu</span>
          ) : (
            selectedWords.map((word, index) => (
              <motion.div
                key={`selected-${index}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Badge 
                  className="px-3 py-1.5 text-base cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => removeWord(index)}
                >
                  {word}
                </Badge>
              </motion.div>
            ))
          )}
        </div>
        
        {/* Available words */}
        <div className="flex flex-wrap gap-2 mt-4">
          {availableWords.map((word, index) => (
            <motion.div
              key={`available-${index}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Badge 
                variant="outline"
                className="px-3 py-1.5 text-base cursor-pointer hover:bg-primary hover:text-primary-foreground"
                onClick={() => selectWord(word, index)}
              >
                {word}
              </Badge>
            </motion.div>
          ))}
        </div>
        
        {/* Feedback */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-lg ${
                isCorrect 
                  ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" 
                  : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
              }`}
            >
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Chính xác!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5" />
                    <span className="font-medium">
                      Chưa đúng. Câu đúng là: {exercises[currentExercise].correctSentence}
                    </span>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={getHint}
          disabled={availableWords.length === 0 || showFeedback}
        >
          <HelpCircle className="h-4 w-4 mr-2" />
          Gợi ý
        </Button>
        
        <Button 
          onClick={checkAnswer}
          disabled={selectedWords.length === 0 || showFeedback}
        >
          Kiểm tra
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}