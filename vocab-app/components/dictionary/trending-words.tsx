"use client"

import { TrendingUp, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface TrendingWordsProps {
  onSelectWord: (word: string) => void
}

export function DictionaryTrendingWords({ onSelectWord }: TrendingWordsProps) {
  // Mock data for trending words
  const trendingWords = [
    { word: "resilience", count: 1240 },
    { word: "sustainable", count: 980 },
    { word: "algorithm", count: 850 },
    { word: "cryptocurrency", count: 720 },
    { word: "pandemic", count: 650 }
  ]

  return (
    <div className="space-y-2">
      {trendingWords.map((item, index) => (
        <motion.div
          key={item.word}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md transition-colors"
        >
          <div className="flex items-center">
            <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center mr-2 text-xs">
              {index + 1}
            </span>
            <span>{item.word}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{item.count}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0"
              onClick={() => onSelectWord(item.word)}
            >
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  )
}