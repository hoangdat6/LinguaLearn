"use client"

import React, { useMemo } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs } from "@/components/ui/tabs"

import { VocabularyLevels } from "@/components/homepage/vocabulary-levels"
import { ReviewWordList } from "@/components/review/review-word-list"
import { BookOpen } from "lucide-react"
import useReview from "@/hooks/useReview"

export default function ReviewPage() {
  const {
    totalWords,
    countLevel1,
    countLevel2,
    countLevel3,
    countLevel4,
    countLevel5,
    timeUntilNextReview,
    reviewWordCount,
    isLoading,
    error,
  } = useReview();

  const reviewData = useMemo(() => ({
    totalWords,
    countLevel1,
    countLevel2,
    countLevel3,
    countLevel4,
    countLevel5,
    timeUntilNextReview,
    reviewWordCount,
    isLoading,
    error,
  }), [totalWords, countLevel1, countLevel2, countLevel3, countLevel4, countLevel5, timeUntilNextReview, reviewWordCount, isLoading, error]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1">
        <div className="container py-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-1">Ôn tập từ vựng</h1>
                <p className="text-muted-foreground flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Tổng số từ đã học: {reviewData.totalWords} từ
                </p>
              </div>
              <Button size="lg" disabled={reviewData.isLoading}>
                {reviewData.isLoading ? "Đang tải..." : "Bắt đầu ôn tập"}
              </Button>
            </div>

            {reviewData.error && <p className="text-red-500 mb-4">{reviewData.error}</p>} {/* Display error if any */}

            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Phân bố từ vựng theo cấp độ</h2>
                <VocabularyLevels
                  wordLevel1={reviewData.countLevel1}
                  wordLevel2={reviewData.countLevel2}
                  wordLevel3={reviewData.countLevel3}
                  wordLevel4={reviewData.countLevel4}
                  wordLevel5={reviewData.countLevel5}
                  reviewWordCount={reviewData.reviewWordCount}
                  timeUntilNextReview={reviewData.timeUntilNextReview}
                  isLoading={reviewData.isLoading}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Tabs defaultValue="all">
                  <ReviewWordList />
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

