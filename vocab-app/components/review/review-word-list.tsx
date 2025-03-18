"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Volume2, Bookmark, Star, ArrowUpRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { VocabularyMasteryLevels } from "./vocabulary-mastery-levels"

interface ReviewWordListProps {
  type?: "all" | "saved" | "mastered" | "learning"
}

export function ReviewWordList({ type = "all" }: ReviewWordListProps) {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null)
  const [expandedWord, setExpandedWord] = useState<string | null>(null)

  const words = [
    {
      id: 1,
      word: "Accomplish",
      meaning: "Hoàn thành",
      example: "She accomplished her goal.",
      level: 4,
      saved: true,
      notes: "Thường dùng khi nói về việc hoàn thành một mục tiêu khó khăn",
      synonyms: ["achieve", "complete", "fulfill"],
      pronunciation: "/əˈkʌmplɪʃ/",
    },
    {
      id: 2,
      word: "Determine",
      meaning: "Quyết định",
      example: "We need to determine the cause.",
      level: 3,
      saved: false,
      notes: "Có thể dùng trong ngữ cảnh khoa học hoặc logic",
      synonyms: ["decide", "establish", "ascertain"],
      pronunciation: "/dɪˈtɜːmɪn/",
    },
    {
      id: 3,
      word: "Enhance",
      meaning: "Nâng cao",
      example: "This will enhance your skills.",
      level: 5,
      saved: true,
      notes: "Thường dùng trong ngữ cảnh cải thiện chất lượng",
      synonyms: ["improve", "augment", "boost"],
      pronunciation: "/ɪnˈhɑːns/",
    },
    {
      id: 4,
      word: "Facilitate",
      meaning: "Tạo điều kiện",
      example: "The program facilitates learning.",
      level: 2,
      saved: false,
      notes: "Thường dùng trong ngữ cảnh giáo dục hoặc kinh doanh",
      synonyms: ["enable", "ease", "assist"],
      pronunciation: "/fəˈsɪlɪteɪt/",
    },
    {
      id: 5,
      word: "Generate",
      meaning: "Tạo ra",
      example: "The solar panels generate electricity.",
      level: 1,
      saved: true,
      notes: "Thường dùng khi nói về việc tạo ra năng lượng hoặc ý tưởng",
      synonyms: ["produce", "create", "yield"],
      pronunciation: "/ˈdʒenəreɪt/",
    },
  ].filter((word) => {
    if (type === "saved") return word.saved
    if (type === "mastered") return word.level === 5
    if (type === "learning") return word.level < 4
    if (selectedLevel !== null) return word.level === selectedLevel
    return true
  })

  const getLevelInfo = (level: number) => {
    const levels = [
      { color: "text-[hsl(var(--level-1))]", bg: "bg-[hsl(var(--level-1))]/10", name: "Mới học" },
      { color: "text-[hsl(var(--level-2))]", bg: "bg-[hsl(var(--level-2))]/10", name: "Nhận biết" },
      { color: "text-[hsl(var(--level-3))]", bg: "bg-[hsl(var(--level-3))]/10", name: "Hiểu nghĩa" },
      { color: "text-[hsl(var(--level-4))]", bg: "bg-[hsl(var(--level-4))]/10", name: "Sử dụng được" },
      { color: "text-[hsl(var(--level-5))]", bg: "bg-[hsl(var(--level-5))]/10", name: "Thành thạo" },
    ]
    return levels[level - 1]
  }

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
        counts={[12, 24, 36, 28, 12]}
      />

      {selectedLevel !== null && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Hiển thị {words.length} từ ở cấp độ {selectedLevel}
          </p>
          <Button variant="ghost" size="sm" onClick={() => setSelectedLevel(null)}>
            Xem tất cả
          </Button>
        </div>
      )}

      <AnimatePresence>
        {words.map((word) => (
          <motion.div
            key={word.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className={`p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer ${
                expandedWord === word.word ? "bg-accent/50" : ""
              }`}
              onClick={() => toggleWordExpand(word.word)}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-lg">{word.word}</h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Play audio
                        const utterance = new SpeechSynthesisUtterance(word.word)
                        utterance.lang = "en-US"
                        window.speechSynthesis.speak(utterance)
                      }}
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">{word.pronunciation}</span>
                  </div>
                  <p className="text-muted-foreground">{word.meaning}</p>
                  <p className="text-sm italic">{word.example}</p>
                  <div className="flex items-center gap-2 pt-2">
                    <Badge
                      variant="outline"
                      className={`${getLevelInfo(word.level).color} ${getLevelInfo(word.level).bg}`}
                    >
                      Cấp {word.level}: {getLevelInfo(word.level).name}
                    </Badge>
                    {word.level === 5 && (
                      <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-400">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Thành thạo
                      </Badge>
                    )}
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
                    <Bookmark className={`h-4 w-4 ${word.saved ? "fill-primary text-primary" : ""}`} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <AnimatePresence>
                {expandedWord === word.word && (
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
                          {word.synonyms.map((synonym) => (
                            <Badge key={synonym} variant="secondary" className="text-xs">
                              {synonym}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-2">Ghi chú</h5>
                        <p className="text-sm text-muted-foreground">{word.notes}</p>
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
}

