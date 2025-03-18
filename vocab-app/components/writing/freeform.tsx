"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, ArrowRight, Lightbulb, AlertCircle, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"

interface FreeformProps {
  onComplete: (stats: { correct: number; total: number; time: number }) => void
}

export function WritingFreeform({ onComplete }: FreeformProps) {
  const [userText, setUserText] = useState("")
  const [wordCount, setWordCount] = useState(0)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
  const [isActive, setIsActive] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [feedback, setFeedback] = useState<string[]>([])
  const [showPrompt, setShowPrompt] = useState(true)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Sample writing prompts
  const prompts = [
    "Describe your ideal vacation destination and explain why you would like to visit it.",
    "Write about a person who has influenced your life in a positive way.",
    "Discuss the advantages and disadvantages of social media in modern society.",
    "Explain how technology has changed education in the last decade.",
    "Write about a challenge you have overcome and what you learned from the experience."
  ]
  
  const [currentPrompt] = useState(prompts[Math.floor(Math.random() * prompts.length)])

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false)
      handleSubmit()
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft])

  // Count words
  useEffect(() => {
    const words = userText.trim() ? userText.trim().split(/\s+/).length : 0
    setWordCount(words)
  }, [userText])

  // Start writing
  const startWriting = () => {
    setIsActive(true)
    setShowPrompt(false)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  // Submit writing
  const handleSubmit = () => {
    setIsActive(false)
    setIsComplete(true)
    
    // Generate feedback (in a real app, this would come from an API)
    const generatedFeedback = [
      "Good use of vocabulary and sentence structure.",
      "Consider adding more specific examples to support your points.",
      "Pay attention to verb tense consistency throughout your writing."
    ]
    
    setFeedback(generatedFeedback)
    
    // Calculate stats
    const timeSpent = 300 - timeLeft
    onComplete({
      correct: 1, // Not applicable for freeform writing
      total: 1,
      time: timeSpent
    })
  }

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Viết tự do</h2>
        <div className="flex items-center gap-2">
          <Badge variant={isActive ? "default" : "outline"} className="gap-1">
            <Clock className="h-4 w-4" />
            {formatTime(timeLeft)}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <CheckCircle className="h-4 w-4" />
            {wordCount} từ
          </Badge>
        </div>
      </div>

      <Progress value={(300 - timeLeft) / 3} className="h-2" />

      <AnimatePresence mode="wait">
        {showPrompt ? (
          <motion.div
            key="prompt"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 border-2 border-dashed rounded-lg text-center"
          >
            <Lightbulb className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Chủ đề viết</h3>
            <p className="text-lg mb-6">{currentPrompt}</p>
            <div className="flex flex-col gap-2">
              <p className="text-sm text-muted-foreground mb-4">
                Bạn có 5 phút để viết. Hãy cố gắng viết ít nhất 100 từ.
              </p>
              <Button onClick={startWriting}>
                Bắt đầu viết
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        ) : isComplete ? (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="p-4 bg-primary/10 rounded-lg">
              <h3 className="text-lg font-medium mb-2 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-primary" />
                Bài viết của bạn
              </h3>
              <div className="p-4 bg-background rounded-lg whitespace-pre-wrap">
                {userText || "Bạn chưa viết gì."}
              </div>
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="text-lg font-medium mb-2 flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-amber-500" />
                Nhận xét
              </h3>
              <ul className="space-y-2">
                {feedback.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start"
                  >
                    <AlertCircle className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowPrompt(true)
                  setUserText("")
                  setTimeLeft(300)
                  setIsComplete(false)
                  setFeedback([])
                }}
              >
                Chủ đề mới
              </Button>
              
              <Button>
                Lưu bài viết
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="writing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">Chủ đề:</p>
              <p>{currentPrompt}</p>
            </div>
            
            <Textarea
              ref={textareaRef}
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              placeholder="Viết bài của bạn ở đây..."
              className="min-h-[200px] text-base"
              disabled={!isActive}
            />
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowPrompt(true)
                  setIsActive(false)
                }}
                disabled={!isActive}
              >
                Hủy
              </Button>
              
              <Button 
                onClick={handleSubmit}
                disabled={!isActive || wordCount < 10}
              >
                Nộp bài
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}