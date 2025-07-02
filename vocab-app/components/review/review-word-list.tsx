"use client"

import { useWordLevelStore } from "@/stores/wordLevelStore"
import { WordReviewState } from "@/types/review"
import { AnimatePresence } from "framer-motion"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { VocabularyMasteryLevels } from "./vocabulary-mastery-levels"
import userWordService from "@/services/user-word-service"
import { WordCard } from "./word-card"
import { EmptyListState, ListCompletedIndicator, LoadingIndicator } from "./list-states"
import { useInfiniteQuery } from "@tanstack/react-query"

export const ReviewWordList = React.memo(function ReviewWordList() {
  const {
    countLevel1,
    countLevel2,
    countLevel3,
    countLevel4,
    countLevel5,
    words,
    addWordsToLevel,
  } = useWordLevelStore();

  const [selectedLevel, setSelectedLevel] = useState<number>(1)
  const [expandedWord, setExpandedWord] = useState<string | null>(null)
  const lastWordRef = useRef<HTMLDivElement | null>(null);

  // Get the total number of words for the selected level
  const totalWordsInLevel = useMemo(() =>
    [countLevel1, countLevel2, countLevel3, countLevel4, countLevel5][selectedLevel - 1],
    [countLevel1, countLevel2, countLevel3, countLevel4, countLevel5, selectedLevel]
  );

  // Setup React Query infinite query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  } = useInfiniteQuery({
    queryKey: ['words', selectedLevel],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await userWordService.fetchWordsLevelPagination(selectedLevel, pageParam, 10);
      // Update the store with new words
      addWordsToLevel(selectedLevel, result);
      return result;
    },
    getNextPageParam: (lastPage, allPages) => {
      const loadedWordsCount = allPages.flat().length;
      return loadedWordsCount < totalWordsInLevel ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    // Only fetch new data when switching levels
    staleTime: Infinity,
    // Initialize with words we already have in the store
    initialData: () => {
      const wordsMap = {
        1: words.words_by_level1,
        2: words.words_by_level2,
        3: words.words_by_level3,
        4: words.words_by_level4,
        5: words.words_by_level5,
      };
      
      const initialWords = wordsMap[selectedLevel as keyof typeof wordsMap] || [];
      
      if (initialWords.length === 0) return undefined;
      
      return {
        pages: [initialWords],
        pageParams: [1]
      };
    }
  });

  // Flatten the words array from all pages
  const selectedWords = useMemo(() => 
    data ? data.pages.flat() : [], 
    [data]
  );

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    if (!lastWordRef.current || isFetchingNextPage || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(lastWordRef.current);

    return () => {
      if (lastWordRef.current) {
        observer.unobserve(lastWordRef.current);
      }
      observer.disconnect();
    };
  }, [lastWordRef.current, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const toggleWordExpand = (word: string) => {
    setExpandedWord(expandedWord === word ? null : word);
  }

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
  
  const levelInfo = getLevelInfo(selectedLevel);
  const isLoading = status === 'pending';
  const isError = status === 'error';
  const isAllWordsLoaded = selectedWords.length >= totalWordsInLevel;

  return (
    <div className="space-y-6">
      {/* Level Selection */}
      <VocabularyMasteryLevels
        onLevelSelect={(level) => setSelectedLevel(level)}
        selectedLevel={selectedLevel}
        counts={[countLevel1, countLevel2, countLevel3, countLevel4, countLevel5]}
      />

      {/* Status Info */}
      {selectedLevel !== null && totalWordsInLevel > 0 && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Hiển thị {selectedWords.length}/{totalWordsInLevel} từ ở cấp độ {selectedLevel}
          </p>
        </div>
      )}

      {/* Word List */}
      <div className="flex gap-4 flex-col max-h-[850px] overflow-auto">
        <AnimatePresence>
          {selectedWords.map((wordState, index) => {
            const isLastItem = index === selectedWords.length - 1;

            return (
              <WordCard
                key={`${wordState.word.id}-${index}`}
                ref={isLastItem ? lastWordRef : null}
                wordState={wordState}
                expandedWord={expandedWord}
                toggleExpand={toggleWordExpand}
                levelInfo={levelInfo}
                selectedLevel={selectedLevel}
              />
            );
          })}
        </AnimatePresence>

        {/* Loading Indicator */}
        {(isLoading || isFetchingNextPage) && (
          <LoadingIndicator
            currentCount={selectedWords.length}
            totalCount={totalWordsInLevel}
          />
        )}

        {/* Empty State */}
        {!isLoading && selectedWords.length === 0 && (
          <EmptyListState
            selectedLevel={selectedLevel}
            levelName={levelInfo.name}
          />
        )}
      </div>

      {/* List End Indicator */}
      {!isFetchingNextPage && isAllWordsLoaded && selectedWords.length > 0 && (
        <ListCompletedIndicator
          currentCount={selectedWords.length}
          totalCount={totalWordsInLevel}
        />
      )}
    </div>
  )
})

