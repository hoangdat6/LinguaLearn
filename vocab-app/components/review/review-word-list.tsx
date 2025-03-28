"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Word } from "@/types/lesson-types"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUpRight, Bookmark, Volume2 } from "lucide-react"
import { useEffect, useState, useMemo } from "react"
import { VocabularyMasteryLevels } from "./vocabulary-mastery-levels"
import { useWordLevelStore } from "@/stores/wordLevelStore"
import { ReviewWordState } from "@/types/review"
import React from "react"

export const ReviewWordList = React.memo(function ReviewWordList() {
  const {
    words,
  } = useWordLevelStore();

  const [selectedLevel, setSelectedLevel] = useState<number>(1)
  const [expandedWord, setExpandedWord] = useState<string | null>(null)
  const [selectedWords, setSelectedWords] = useState<ReviewWordState[]>([])

  useEffect(() => {
    if (selectedLevel === 1) {
      setSelectedWords(words.words_by_level1)
    } else if (selectedLevel === 2) {
      setSelectedWords(words.words_by_level2)
    } else if (selectedLevel === 3) {
      setSelectedWords(words.words_by_level3)
    } else if (selectedLevel === 4) {
      setSelectedWords(words.words_by_level4)
    } else if (selectedLevel === 5) {
      setSelectedWords(words.words_by_level5)
    }
  }, [selectedLevel, words])

  const getLevelInfo = useMemo(() => (level: number) => {
    const levels = [
      { color: "text-[hsl(var(--level-1))]", bg: "bg-[hsl(var(--level-1))]/10", name: "Mới học" },
      { color: "text-[hsl(var(--level-2))]", bg: "bg-[hsl(var(--level-2))]/10", name: "Nhận biết" },
      { color: "text-[hsl(var(--level-3))]", bg: "bg-[hsl(var(--level-3))]/10", name: "Hiểu nghĩa" },
      { color: "text-[hsl(var(--level-4))]", bg: "bg-[hsl(var(--level-4))]/10", name: "Sử dụng được" },
      { color: "text-[hsl(var(--level-5))]", bg: "bg-[hsl(var(--level-5))]/10", name: "Thành thạo" },
    ]
    return levels[level - 1]
  }, [])

  const toggleWordExpand = (word: string) => {
    if (expandedWord === word) {
      setExpandedWord(null)
    } else {
      setExpandedWord(word)
    }
  }

  return (
    <div className="space-y-6">
      <VocabularyMasteryLevels
        onLevelSelect={setSelectedLevel}
        selectedLevel={selectedLevel}
        counts={[
          words.words_by_level1.length,
          words.words_by_level2.length,
          words.words_by_level3.length,
          words.words_by_level4.length,
          words.words_by_level5.length,
        ]}
      />

      {selectedLevel !== null && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Hiển thị {selectedWords.length} từ ở cấp độ {selectedLevel}
          </p>
        </div>
      )}

      <AnimatePresence>
        {selectedWords.map((word) => (
          <motion.div
            key={word.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className={`
                p-4 rounded-lg border bg-card hover:bg-accent/50 
                transition-colors cursor-pointer ${expandedWord === word.word.word ? "bg-accent/50" : ""
                }`}
              onClick={() => toggleWordExpand(word.word.word)}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-lg">{word.word.word}</h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Play audio
                        const utterance = new SpeechSynthesisUtterance(word.word.word)
                        utterance.lang = "en-US"
                        window.speechSynthesis.speak(utterance)
                      }}
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">{word.word.pronunciation}</span>
                  </div>
                  <p className="text-muted-foreground">{word.word.meaning}</p>
                  <p className="text-sm italic">{word.word.example}</p>
                  <div className="flex items-center gap-2 pt-2">
                    <Badge
                      variant="outline"
                      className={`${getLevelInfo(selectedLevel).color} ${getLevelInfo(selectedLevel).bg}`}
                    >
                      Cấp {selectedLevel}: {getLevelInfo(selectedLevel).name}
                    </Badge>
                    {/* {word.level === 5 && (
                      <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-400">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Thành thạo
                      </Badge>
                    )} */}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation()
                      // Toggle bookmark
                    }}
                  >
                    <Bookmark className={`h-4 w-4 ${true ? "fill-primary text-primary" : ""}`} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <AnimatePresence>
                {expandedWord === word.word.word && (
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
                          {/* {word.synonyms.map((synonym) => (
                            <Badge key={synonym} variant="secondary" className="text-xs">
                              {synonym}
                            </Badge>
                          ))} */}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-2">Ghi chú</h5>
                        {/* <p className="text-sm text-muted-foreground">{word.notes}</p> */}
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
        ))}
      </AnimatePresence>
    </div>
  )
})

