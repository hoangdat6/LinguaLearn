"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, HelpCircle, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"

interface TextCompletionProps {
  onComplete: (stats: { correct: number; total: number; time: number }) => void
}

export function WritingTextCompletion({ onComplete }: TextCompletionProps) {
  const [currentExercise, setCurrentExercise] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [progress, setProgress] = useState(0)
  const [stats, setStats] = useState({ correct: 0, total: 0, time: 0 })
  const [startTime] = useState(Date.now())
  const [showHint, setShowHint] = useState(false)

  // Sample exercises
  const exercises = [
    {
      text: "Yesterday, I went to the supermarket to buy some groceries. I needed milk, bread, and eggs for breakfast. When I arrived at the store, I realized that I had forgotten my wallet at home. I had to ________ home to get it before I could do my shopping.",
      answer: "go back",
      hint: "return to"
    },
    {
      text: "Learning a new language requires dedication and practice. Many people find it difficult to ________ a regular study schedule, but consistency is key to making progress.",
      answer: "maintain",
      hint: "keep up"
    },
    {
      text: "Climate change is one of the biggest challenges facing our planet. Scientists warn that we need to ________ our carbon emissions to prevent further global warming.",
      answer: "reduce",
      hint: "decrease"
    },
    {
      text: "The company announced that they would ________ 100 new employees over the next six months due to rapid business growth.",
      answer: "hire",
      hint: "employ"
    },
    {
      text: "After graduating from university, many students struggle to ________ a job in their field of study due to lack of experience.",
      answer: "find",
      hint: "secure"
    }
  ]

  // Check answer
  const checkAnswer = () => {
    // Simple check - could be improved with more sophisticated matching
    const isCorrect = userAnswer.toLowerCase().trim() === exercises[currentExercise].answer.toLowerCase()
    
    setIsCorrect(isCorrect)
    setShowFeedback(true)
    setStats(prev => ({
      ...prev,
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }))

    setTimeout(() => {
      setShowFeedback(false)
      setShowHint(false)
      
      if (currentExercise < exercises.length - 1) {
        setCurrentExercise(prev => prev + 1)
        setProgress(((currentExercise + 1) / exercises.length) * 100)
        setUserAnswer("")
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

  // Toggle hint
  const toggleHint = () => {
    setShowHint(!showHint)
  }

  // Format text with blank
  const formatText = (text: string) => {
    return text.replace("________", 
      `<span class="inline-block min-w-[120px] px-2 py-1 mx-1 border-b-2 border-primary bg-primary/5 rounded">${userAnswer || "________"}</span>`
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Hoàn thành đoạn văn</h2>
        <div className="text-sm text-muted-foreground">
          {currentExercise + 1}/{exercises.length}
        </div>
      </div>

      <Progress value={progress} className="h-2" />

      <div className="space-y-4">
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-lg mb-4" dangerouslySetInnerHTML={{ __html: formatText(exercises[currentExercise].text) }}></p>
          
          <div className="mt-4">
            <label className="text-sm font-medium">Điền từ vào chỗ trống:</label>
            <div className="flex gap-2 mt-1">
              <Textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Nhập từ hoặc cụm từ..."
                className="min-h-[80px]"
              />
            </div>
          </div>
        </div>
        
        {/* Hint */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg"
            >
              <p className="flex items-center text-amber-700 dark:text-amber-400">
                <HelpCircle className="h-4 w-4 mr-2" />
                <span>Gợi ý: {exercises[currentExercise].hint}</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        
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
                      Chưa đúng. Đáp án đúng là: {exercises[currentExercise].answer}
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
          onClick={toggleHint}
          disabled={showFeedback}
        >
          <HelpCircle className="h-4 w-4 mr-2" />
          {showHint ? "Ẩn gợi ý" : "Hiện gợi ý"}
        </Button>
        
        <Button 
          onClick={checkAnswer}
          disabled={!userAnswer.trim() || showFeedback}
        >
          Kiểm tra
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}