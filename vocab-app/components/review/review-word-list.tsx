"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useWordLevelStore } from "@/stores/wordLevelStore"
import { WordReviewState } from "@/types/review"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUpRight, Bookmark, Volume2 } from "lucide-react"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { VocabularyMasteryLevels } from "./vocabulary-mastery-levels"
import userWordService from "@/services/user-word-service"

export const ReviewWordList = React.memo(function ReviewWordList() {
  const {
    countLevel1,
    countLevel2,
    countLevel3,
    countLevel4,
    countLevel5,
    words,
    addWordsToLevel,
    incrementPage,
    getPageForLevel
  } = useWordLevelStore();

  const [selectedLevel, setSelectedLevel] = useState<number>(1)
  const [expandedWord, setExpandedWord] = useState<string | null>(null)
  const [selectedWords, setSelectedWords] = useState<WordReviewState[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const lastWordRef = useRef<HTMLDivElement | null>(null);

  // Đưa totalWordsInLevel lên trước khi sử dụng trong useEffect
  const totalWordsInLevel = useMemo(() =>
    [countLevel1, countLevel2, countLevel3, countLevel4, countLevel5][selectedLevel - 1],
    [countLevel1, countLevel2, countLevel3, countLevel4, countLevel5, selectedLevel]
  );

  // Kiểm tra nếu đã tải tất cả các từ trong level
  const isAllWordsLoaded = selectedWords.length >= totalWordsInLevel;

  // Fetch additional words when reaching the bottom
  const fetchMoreWords = async () => {
    // Kiểm tra nếu đã tải hết từ vựng hoặc đang tải
    if (isLoading || selectedWords.length >= totalWordsInLevel) return;

    setIsLoading(true)
    try {
      // Lấy trang hiện tại từ store cho level đang chọn
      const currentPage = getPageForLevel(selectedLevel);

      const newWords = await userWordService.fetchWordsLevelPagination(selectedLevel, currentPage, 10)

      // Lưu từ mới vào store
      addWordsToLevel(selectedLevel, newWords);

      // Cập nhật state local
      setSelectedWords((prevWords) => [...prevWords, ...newWords])

      // Tăng số trang trong store
      incrementPage(selectedLevel);
    } catch (error) {
      console.error("Failed to fetch more words:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Khi thay đổi level, cập nhật selectedWords từ store
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

  const playAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl)
    audio.play()
  }

  // IntersectionObserver to detect when the user scrolls to the last word
  useEffect(() => {
    // Nếu không có từ nào, đang tải, hoặc đã tải hết, không cần thiết lập observer
    if (selectedWords.length === 0 || isLoading || selectedWords.length >= totalWordsInLevel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && selectedWords.length < totalWordsInLevel) {
          fetchMoreWords();
        }
      },
      { threshold: 0.5 }
    );

    if (lastWordRef.current) {
      observer.observe(lastWordRef.current);
    }

    return () => {
      if (lastWordRef.current) {
        observer.unobserve(lastWordRef.current);
      }
    };
  }, [isLoading, selectedWords, selectedLevel, totalWordsInLevel]);

  return (
    <div className="space-y-6">
      <VocabularyMasteryLevels
        onLevelSelect={setSelectedLevel}
        selectedLevel={selectedLevel}
        counts={[
          countLevel1,
          countLevel2,
          countLevel3,
          countLevel4,
          countLevel5,
        ]}
      />

      {selectedLevel !== null && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {totalWordsInLevel === 0
              ? ""
              : `Hiển thị ${selectedWords.length}/${totalWordsInLevel} từ ở cấp độ ${selectedLevel}`}
          </p>
        </div>
      )}

      <div className="flex gap-4 flex-col max-h-[850px] overflow-auto">
        <AnimatePresence>
          {selectedWords.map((word, index) => {
            const isLastItem = index === selectedWords.length - 1;

            return (
              <motion.div
                key={index}
                ref={isLastItem ? lastWordRef : null}
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
                            if (word.word.audio) {
                              playAudio(word.word.audio)
                            } else {
                              console.error("Audio URL is not available")
                            }
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
            );
          })}
        </AnimatePresence>

        {isLoading && (
          <div className="text-center py-4">
            <p className="mb-2">Đang tải thêm...</p>
            <Badge variant="outline" className="bg-primary/10 text-primary">
              {selectedWords.length} <span className="mx-1">/</span> {totalWordsInLevel}
            </Badge>
          </div>
        )}  

        {!isLoading && selectedWords.length === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center gap-3 py-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mb-2">
              <span className="text-3xl" role="img" aria-label="magnifying glass">🔍</span>
            </div>
            <h3 className="text-xl font-medium text-gray-700">Không tìm thấy từ vựng</h3>
            <p className="text-gray-500 text-center max-w-md">
              Cấp độ này chưa có từ vựng nào. Hãy học thêm để lấp đầy kho từ của bạn!
            </p>
            <Badge
              variant="outline"
              className="mt-2 px-3 py-1 bg-orange-50 text-orange-500 border-orange-200"
            >
              Cấp {selectedLevel}: {getLevelInfo(selectedLevel).name}
            </Badge>
          </motion.div>
        )}


      </div>
      {!isLoading && isAllWordsLoaded && selectedWords.length > 0 && (
        <div className="flex flex-col items-center py-4 gap-2">
          <Badge
            variant="outline"
            className="px-3 py-1 text-sm bg-green-50 text-green-600 border-green-200"
          >
            <span className="font-medium">{selectedWords.length}</span>
            <span className="mx-1">/</span>
            <span>{totalWordsInLevel}</span>
            <span className="ml-1 opacity-80">từ vựng</span>
          </Badge>
          <p className="text-center text-muted-foreground">Đã tải tất cả từ vựng ở cấp độ này</p>
        </div>
      )}
    </div>
  )
})

