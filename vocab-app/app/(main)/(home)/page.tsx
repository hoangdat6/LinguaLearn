"use client"

import { DailyGoalTracker } from "@/components/homepage/daily-goal-tracker"
import { Leaderboard } from "@/components/homepage/leaderboard"
import { SavedWords } from "@/components/homepage/saved-words"
import { StreakCounter } from "@/components/homepage/streak-counter"
import { VocabularyLevels } from "@/components/homepage/vocabulary-levels"
import { WordsLearnedCounter } from "@/components/homepage/words-learned-counter"
import { CoursesOverview } from "@/components/learn/learning-topics"
import { Owl } from "@/components/owl"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuthStatus } from "@/hooks/useAuth"
import useHomePage from "@/hooks/useHomePage"
import { motion } from "framer-motion"
import { ArrowRight, LogIn } from "lucide-react"
import Link from "next/link"

export default function Home() {
  const {
    totalWords,
    countLevel1,
    countLevel2,
    countLevel3,
    countLevel4,
    countLevel5,
    cefrGroupCounts,
    reviewWordCount,
    timeUntilNextReview,
    isLoading,
  } = useHomePage();

  const { isAuthenticated, userName } = useAuthStatus();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1">
        <div className="container py-6 px-3 md:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="col-span-full lg:col-span-2"
            >
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold">Học tiếng Anh</h2>
                      <StreakCounter days={7} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <WordsLearnedCounter
                        totalWords={totalWords}
                        weeklyWords={23}
                        cefrGroupCounts={cefrGroupCounts}
                      />
                      <DailyGoalTracker
                        completed={3}
                        total={5}
                        streak={7}
                      />
                    </div>

                    <div className="pt-4">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold">Cấp độ từ vựng</h3>
                      </div>
                      <VocabularyLevels
                        wordLevel1={countLevel1}
                        wordLevel2={countLevel2}
                        wordLevel3={countLevel3}
                        wordLevel4={countLevel4}
                        wordLevel5={countLevel5}
                        reviewWordCount={reviewWordCount}
                        timeUntilNextReview={timeUntilNextReview}
                        isLoading={isLoading}
                      />
                    </div>

                    <div className="pt-4">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold">Chủ đề học</h3>
                      </div>
                      <CoursesOverview />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="col-span-full lg:col-span-1 space-y-6"
            >
              <Card className="overflow-hidden">
                <CardContent className="p-6 flex flex-col items-center">
                  <Owl className="w-32 h-32 mb-4" />
                  
                  {isAuthenticated ? (
                    // Đã đăng nhập - Hiển thị chào mừng và tổng số từ đã học
                    <>
                      <h3 className="text-lg font-bold mb-2">Chào mừng trở lại, {userName || "bạn"}!</h3>
                      <p className="text-center text-muted-foreground mb-4">
                        Bạn đã học được {totalWords} từ. Hãy tiếp tục!
                      </p>
                      <Button asChild className="w-full">
                        <Link href="/lessons" className="flex items-center justify-center">
                          Tiếp tục học
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </>
                  ) : (
                    // Chưa đăng nhập - Hiển thị hướng dẫn đăng nhập
                    <>
                      <h3 className="text-lg font-bold mb-2">Chào mừng đến với Vocab App!</h3>
                      <p className="text-center text-muted-foreground mb-4">
                        Đăng nhập để bắt đầu hành trình học tiếng Anh của bạn và theo dõi tiến trình.
                      </p>
                      <div className="flex gap-3 w-full">
                        <Button asChild variant="outline" className="flex-1">
                          <Link href="/auth?tab=register">Đăng ký</Link>
                        </Button>
                        <Button asChild className="flex-1">
                          <Link href="/auth?tab=login" className="flex items-center justify-center">
                            <LogIn className="mr-2 h-4 w-4" />
                            Đăng nhập
                          </Link>
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4">Bảng xếp hạng</h3>
                  <Leaderboard />
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4">Từ vựng đã lưu</h3>
                  <SavedWords />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}

