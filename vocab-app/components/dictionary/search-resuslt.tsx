"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Volume2, ArrowRight } from 'lucide-react'

interface SearchResultsProps {
  results: any[]
  onSelectWord: (word: string) => void
}

export function DictionarySearchResults({ results, onSelectWord }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Không tìm thấy kết quả phù hợp.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {results.map((result, index) => (
        <motion.div
          key={result.word}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{result.word}</h3>
                <Badge variant="outline" className="text-xs">
                  {result.partOfSpeech}
                </Badge>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Volume2 className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {result.definitions[0]}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs"
              onClick={() => onSelectWord(result.word)}
            >
              Chi tiết
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  )
}