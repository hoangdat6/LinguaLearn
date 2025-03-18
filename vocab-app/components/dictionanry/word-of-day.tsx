"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Volume2, ArrowRight } from 'lucide-react'
import { motion } from "framer-motion"

interface WordOfDayProps {
  onSelectWord: (word: string) => void
}

export function DictionaryWordOfDay({ onSelectWord }: WordOfDayProps) {
  // Mock data for word of the day
  const wordOfDay = {
    word: "serendipity",
    phonetic: "/ˌser.ənˈdɪp.ə.ti/",
    partOfSpeech: "noun",
    definition: "the fact of finding interesting or valuable things by chance",
    example: "The discovery of penicillin was a serendipity."
  }

  const playAudio = () => {
    const utterance = new SpeechSynthesisUtterance(wordOfDay.word)
    utterance.lang = "en-US"
    window.speechSynthesis.speak(utterance)
  }

  const today = new Date().toLocaleDateString('vi-VN', { 
    day: 'numeric', 
    month: 'numeric', 
    year: 'numeric' 
  })

  return (
    <Card className="overflow-hidden border-2">
      <CardContent className="p-0">
        <div className="bg-primary/10 p-3 border-b flex items-center justify-between">
          <h3 className="font-medium flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Từ vựng hôm nay
          </h3>
          <span className="text-xs text-muted-foreground">{today}</span>
        </div>
        
        <div className="p-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-xl font-bold">{wordOfDay.word}</h4>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={playAudio}>
                <Volume2 className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm text-muted-foreground">{wordOfDay.phonetic}</span>
              <Badge variant="outline" className="text-xs">
                {wordOfDay.partOfSpeech}
              </Badge>
            </div>
            
            <p className="text-sm mb-2">{wordOfDay.definition}</p>
            <p className="text-sm italic text-muted-foreground mb-4">"{wordOfDay.example}"</p>
            
            <Button 
              variant="link" 
              className="p-0 h-auto text-sm"
              onClick={() => onSelectWord(wordOfDay.word)}
            >
              Xem chi tiết
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  )
}