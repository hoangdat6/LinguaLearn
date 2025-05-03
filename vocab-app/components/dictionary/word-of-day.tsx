"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, ChevronRight, Volume2 } from "lucide-react"
import { motion } from "framer-motion"
import { dailyWords, DailyWord } from "@/data/daily-words"

interface DictionaryWordOfDayProps {
  onSelectWord: (word: string) => void
}

export function DictionaryWordOfDay({ onSelectWord }: DictionaryWordOfDayProps) {
  // Function to get today's word based on the current date
  const getTodaysWord = (): DailyWord => {
    const today = new Date()
    const dayOfYear = getDayOfYear(today)
    
    // Use the day of the year to select a word
    // This ensures the same word is shown all day, but changes each day
    const wordIndex = dayOfYear % dailyWords.length
    return dailyWords[wordIndex]
  }
  
  // Helper function to get the day of the year (1-366)
  const getDayOfYear = (date: Date): number => {
    const start = new Date(date.getFullYear(), 0, 0)
    const diff = (date.getTime() - start.getTime()) + 
      ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000)
    const oneDay = 1000 * 60 * 60 * 24
    return Math.floor(diff / oneDay)
  }
  
  // Get today's word
  const todaysWord = getTodaysWord()
  
  // Format today's date
  const formatDate = (): string => {
    const today = new Date()
    return today.toLocaleDateString('vi-VN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  // Speak the word
  const speakWord = () => {
    const utterance = new SpeechSynthesisUtterance(todaysWord.word)
    utterance.lang = "en-US"
    window.speechSynthesis.speak(utterance)
  }
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium flex items-center">
            <CalendarDays className="h-5 w-5 mr-2 text-muted-foreground" />
            Từ vựng hôm nay
          </h3>
          <span className="text-xs text-muted-foreground">{formatDate()}</span>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="text-xl font-bold">{todaysWord.word}</h4>
              <Badge variant="outline" className="text-xs">
                {todaysWord.partOfSpeech}
              </Badge>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={speakWord}
              className="h-8 w-8"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="mt-2">
            <div className="text-sm text-muted-foreground mb-1">
              <span className="font-medium text-foreground">Định nghĩa: </span>
              {todaysWord.definition}
            </div>
            <div className="text-sm text-muted-foreground italic border-l-2 pl-2 mt-2">
              {todaysWord.example}
            </div>
          </div>
        </motion.div>
        
        <Button 
          variant="outline" 
          className="w-full mt-2 justify-between"
          onClick={() => onSelectWord(todaysWord.word)}
        >
          <span>Tra cứu chi tiết</span>
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  )
}