"use client"

import { BackConfirmDialog } from "@/components/review/back-confirm-dialog"
import { ReviewQuestion } from "@/components/review/review-question"
import { ReviewSessionResults } from "@/components/review-session/review-session-results"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SESSION_STATE } from "@/constants/status"
import { useReviewSession } from "@/hooks/useReviewSession"
import { QuestionResult } from "@/types/review"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, CheckCircle, Trophy, Volume2, XCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ReviewSessionPage() {
  const router = useRouter();

  // Ensure this useEffect is always called in the same order
  useEffect(() => {
    const title = "Ôn tập từ vựng"
    const description = "Ôn tập từ vựng tiếng Anh với các câu hỏi trắc nghiệm và nghe phát âm."
    const metaTags = [
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: window.location.href },
    ]

    // Set document title
    document.title = title
    
    // Set meta tags
    const addedMetaTags: HTMLMetaElement[] = []
    metaTags.forEach((tag) => {
      const metaTag = document.createElement("meta")
      if (tag.name) {
        metaTag.setAttribute("name", tag.name)
      } else if (tag.property) {
        metaTag.setAttribute("property", tag.property)
      }
      metaTag.content = tag.content
      document.head.appendChild(metaTag)
      addedMetaTags.push(metaTag)
    })
    
    // Clean up meta tags on component unmount
    return () => {
      // Remove only the exact meta elements we added
      addedMetaTags.forEach((metaTag) => {
        if (metaTag.parentNode) {
          metaTag.parentNode.removeChild(metaTag)
        }
      })
    }
  }, [])

  // Initialize review session with vocabulary data
  const {
    sessionState,
    progress,
    currentQuestionType,
    sessionStartTime,
    currentWord,
    reviewWords,
    isLoading,
    error,
    handleBack,
    handleAnswer,
    handleSkip,
    resetSession,
    results,
    learningQueueIndex
  } = useReviewSession()

  // Redirect to review page if there are no words to review
  useEffect(() => {
    if (!isLoading && reviewWords.length === 0) {
      router.push("/review");
    }
  }, [isLoading, reviewWords, router]); 

  // Show loading state
  if (isLoading) {
    return <ReviewSessionLoading />
  }

  // Show error state
  if (error && currentWord == null) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <main className="flex-1 container py-6">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-2xl font-bold mb-4">Đã xảy ra lỗi</h1>
            <p className="text-muted-foreground mb-6">{error.message}</p>
            <Button asChild>
              <Link href="/review">Quay lại</Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  // If no review words are available but we're not loading or showing an error,
  // show a message and link to review page
  if (reviewWords.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <main className="flex-1 container py-6">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-2xl font-bold mb-4">Không có từ vựng để ôn tập</h1>
            <p className="text-muted-foreground mb-6">Bạn chưa có từ vựng nào để ôn tập hoặc đã hoàn thành tất cả các bài ôn tập.</p>
            <Button asChild>
              <Link href="/review">Quay lại danh sách từ vựng</Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <main className="flex-1 container py-6">
      <div className="mx-auto max-w-3xl">
        <AnimatePresence mode="wait">
      
          {sessionState === SESSION_STATE.IN_PROGRESS ? (
            <motion.div key="in-progress" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="mb-8 space-y-4">
                <div className="flex items-center justify-between">
                  <BackConfirmDialog onBack={handleBack} />
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>
                    <CheckCircle className="inline-block h-4 w-4 mr-1 text-green-500" />
                    {results?.correct || 0}
                    <XCircle className="inline-block h-4 w-4 mx-1 text-red-500" />
                    {results?.incorrect || 0}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <Card className="mb-6 border-2 shadow-md">
                <CardContent className="p-6">
                  <ReviewQuestion
                    questionType={currentQuestionType}
                    vocabularyItem={currentWord?.word!}
                    reviewWords={reviewWords}
                    onAnswer={handleAnswer}
                    onSkip={handleSkip}
                  />
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div key="completed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <Link
                    href="/review"
                    className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Quay lại danh sách từ vựng
                  </Link>
                </div>
              </div>

              <Card className="mb-6 border-2 shadow-md overflow-hidden">
                <div className="bg-primary/10 p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Kết quả ôn tập</h1>
                    <Trophy className="h-8 w-8 text-yellow-500" />
                  </div>
                  <p className="text-muted-foreground">
                    Thời gian: {new Date(Date.now() - sessionStartTime).toISOString().substr(11, 8)}
                  </p>
                </div>

                <CardContent className="p-6">
                  <Tabs defaultValue="summary">
                    <TabsList className="mb-4">
                      <TabsTrigger value="summary">Tổng quan</TabsTrigger>
                      <TabsTrigger value="details">Chi tiết</TabsTrigger>
                    </TabsList>

                    <TabsContent value="summary">
                      <ReviewSessionResults 
                        results={results} 
                        learningQueue={learningQueueIndex} 
                        vocabularyItems={reviewWords.map(w => w.word)}
                      />
                    </TabsContent>

                    <TabsContent value="details">
                      <div className="space-y-6">
                        <h3 className="text-lg font-medium">Kết quả từng câu hỏi</h3>
                        <div className="space-y-3">
                          {results?.questionResults.map((result: QuestionResult, index) => (
                            <div
                              key={index}
                              className={`p-3 rounded-lg border flex items-center justify-between ${
                                result.correct
                                  ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                                  : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                              }`}
                            >
                              <div className="flex items-center">
                                {result.correct ? (
                                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-red-500 mr-3" />
                                )}
                                <div>
                                  <div className="font-medium">{result.word}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {result.time > 0 ? `${result.time.toFixed(1)} giây` : "Đã bỏ qua"}
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  // Play pronunciation
                                  const utterance = new SpeechSynthesisUtterance(result.word)
                                  utterance.lang = "en-US"
                                  window.speechSynthesis.speak(utterance)
                                }}
                              >
                                <Volume2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>

                        {learningQueueIndex.length > 0 && (
                          <div className="mt-6">
                            <h3 className="text-lg font-medium mb-3">Từ vựng cần ôn tập thêm</h3>
                            <div className="p-4 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
                              <p className="text-sm mb-3">
                                Những từ sau đây sẽ được thêm vào danh sách ôn tập ưu tiên cho buổi học tiếp theo:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {learningQueueIndex.map((wordIndex) => {
                                  const word = reviewWords[wordIndex]
                                  return word ? (
                                    <div
                                      key={wordIndex}
                                      className="px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-amber-300 dark:border-amber-700 text-sm flex items-center gap-1.5"
                                    >
                                      {word.word.word}
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-5 w-5 ml-1"
                                        onClick={() => {
                                          const utterance = new SpeechSynthesisUtterance(word.word.word)
                                          utterance.lang = "en-US"
                                          window.speechSynthesis.speak(utterance)
                                        }}
                                      >
                                        <Volume2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ) : null
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent> 
                  </Tabs>

                  <div className="flex justify-between mt-8">
                    <Button variant="outline" asChild>
                      <Link href="/review">Quay lại</Link>
                    </Button>
                    <Button onClick={resetSession}>Ôn tập lại</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}

function ReviewSessionLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 container py-6">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-6 rounded-full" />
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="text-center">
                  <Skeleton className="h-8 w-48 mx-auto mb-2" />
                  <div className="flex items-center justify-center gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>

                <div className="py-4 space-y-3">
                  <Skeleton className="h-6 w-48 mb-4" />
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-lg" />
                  ))}
                </div>

                <div className="flex justify-between">
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

