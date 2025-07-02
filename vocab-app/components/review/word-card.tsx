"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { playAudioByUrl } from "@/lib/utils"
import { WordReviewState } from "@/types/review"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUpRight, Bookmark, Volume2 } from "lucide-react"
import { forwardRef } from "react"

interface LevelInfo {
  color: string
  bg: string
  name: string
}

interface WordCardProps {
  wordState: WordReviewState
  expandedWord: string | null
  toggleExpand: (word: string) => void
  levelInfo: LevelInfo
  selectedLevel: number
}

export const WordCard = forwardRef<HTMLDivElement, WordCardProps>(
  ({ wordState, expandedWord, toggleExpand, levelInfo, selectedLevel }, ref) => {
    const isExpanded = expandedWord === wordState.word.word

    const handlePlayAudio = (e: React.MouseEvent) => {
      e.stopPropagation()
      if (wordState.word.audio) {
        playAudioByUrl(wordState.word.audio)
      } else {
        console.error("Audio URL is not available")
      }
    }

    const handleBookmark = (e: React.MouseEvent) => {
      e.stopPropagation()
      // Toggle bookmark functionality
    }

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className={`
            p-4 rounded-lg border bg-card hover:bg-accent/50 
            transition-colors cursor-pointer ${isExpanded ? "bg-accent/50" : ""}`}
          onClick={() => toggleExpand(wordState.word.word)}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-lg">{wordState.word.word}</h4>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handlePlayAudio}
                >
                  <Volume2 className="h-4 w-4" />
                </Button>

                <span className="text-sm text-muted-foreground">{wordState.word.pronunciation}</span>
              </div>
              <p className="text-muted-foreground">{wordState.word.meaning}</p>
              <p className="text-sm italic">{wordState.word.example}</p>
              <div className="flex items-center gap-2 pt-2">
                <Badge
                  variant="outline"
                  className={`${levelInfo.color} ${levelInfo.bg}`}
                >
                  Cấp {selectedLevel}: {levelInfo.name}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleBookmark}
              >
                <Bookmark className={`h-4 w-4 ${true ? "fill-primary text-primary" : ""}`} />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-sm font-medium mb-2">Từ đồng nghĩa</h5>
                    <div className="flex flex-wrap gap-2">
                      {/* Synonyms would go here */}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium mb-2">Ghi chú</h5>
                    {/* Notes would go here */}
                  </div>
                </div>
                <div className="flex justify-between mt-4">
                  <Button variant="outline" size="sm">
                    Thêm vào bộ thẻ
                  </Button>
                  <Button size="sm">Luyện tập ngay</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    )
  }
)

WordCard.displayName = "WordCard"
