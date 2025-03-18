"use client"

import { Clock, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface HistoryProps {
  searches: string[]
  onClearHistory: () => void
  onSelectWord: (word: string) => void
}

export function DictionaryHistory({ searches, onClearHistory, onSelectWord }: HistoryProps) {
  if (searches.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground text-sm">Chưa có lịch sử tìm kiếm.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {searches.map((word, index) => (
        <div 
          key={`${word}-${index}`}
          className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md transition-colors"
        >
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{word}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 text-xs"
            onClick={() => onSelectWord(word)}
          >
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      ))}
      
      <div className="pt-2 text-right">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs"
          onClick={onClearHistory}
        >
          Xóa lịch sử
        </Button>
      </div>
    </div>
  )
}