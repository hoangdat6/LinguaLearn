"use client"
import { motion } from "framer-motion"
import { CheckCircle, XCircle, Clock, SkipForward, Award, TrendingUp, BookOpen } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { VocabularyItem } from "@/types/vocabulary"

interface ResultsProps {
  results: {
    correct: number
    incorrect: number
    skipped: number
    totalTime: number
    questionResults: { word: string; correct: boolean; time: number }[]
  }
  learningQueue?: number[]
  vocabularyItems?: VocabularyItem[]
}

export function ReviewSessionResults({ results, learningQueue = [], vocabularyItems = [] }: ResultsProps) {
  const totalQuestions = results.correct + results.incorrect + results.skipped
  const accuracy = totalQuestions > 0 ? (results.correct / totalQuestions) * 100 : 0
  const averageTime =
    results.questionResults.filter((r) => r.time > 0).length > 0
      ? results.questionResults.filter((r) => r.time > 0).reduce((sum, r) => sum + r.time, 0) /
        results.questionResults.filter((r) => r.time > 0).length
      : 0

  // Calculate mastery level based on accuracy
  const getMasteryLevel = () => {
    if (accuracy >= 90) return { level: "Xuất sắc", color: "text-purple-600" }
    if (accuracy >= 80) return { level: "Giỏi", color: "text-blue-600" }
    if (accuracy >= 70) return { level: "Khá", color: "text-green-600" }
    if (accuracy >= 60) return { level: "Trung bình", color: "text-yellow-600" }
    return { level: "Cần cải thiện", color: "text-red-600" }
  }

  const masteryLevel = getMasteryLevel()

  // Calculate performance metrics
  const metrics = [
    {
      label: "Chính xác",
      value: `${accuracy.toFixed(0)}%`,
      icon: CheckCircle,
      color: "text-green-500",
      progress: accuracy,
    },
    {
      label: "Thời gian trung bình",
      value: `${averageTime.toFixed(1)}s`,
      icon: Clock,
      color: "text-blue-500",
      progress: Math.max(0, 100 - (averageTime / 10) * 100), // Lower time is better
    },
    {
      label: "Đã hoàn thành",
      value: `${totalQuestions}/10`,
      icon: TrendingUp,
      color: "text-purple-500",
      progress: (totalQuestions / 10) * 100,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-4"
        >
          <Award className="h-12 w-12 text-primary" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-1">Kết quả ôn tập</h2>
        <p className={`text-lg font-medium ${masteryLevel.color}`}>{masteryLevel.level}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="flex flex-col items-center justify-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20"
        >
          <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
          <span className="text-2xl font-bold">{results.correct}</span>
          <span className="text-sm text-muted-foreground">Đúng</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="flex flex-col items-center justify-center p-4 rounded-lg bg-red-50 dark:bg-red-900/20"
        >
          <XCircle className="h-8 w-8 text-red-500 mb-2" />
          <span className="text-2xl font-bold">{results.incorrect}</span>
          <span className="text-sm text-muted-foreground">Sai</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-50 dark:bg-gray-900/20"
        >
          <SkipForward className="h-8 w-8 text-gray-500 mb-2" />
          <span className="text-2xl font-bold">{results.skipped}</span>
          <span className="text-sm text-muted-foreground">Bỏ qua</span>
        </motion.div>
      </div>

      <div className="space-y-4 mt-6">
        <h3 className="text-lg font-medium">Chỉ số hiệu suất</h3>

        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
              className="space-y-2"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <metric.icon className={`h-5 w-5 mr-2 ${metric.color}`} />
                  <span className="font-medium">{metric.label}</span>
                </div>
                <span className="font-bold">{metric.value}</span>
              </div>
              <Progress value={metric.progress} className="h-2" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Learning Queue Summary */}
      {learningQueue.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="mt-4 p-4 rounded-lg border bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
        >
          <div className="flex items-center">
            <BookOpen className="h-5 w-5 text-amber-600 mr-2" />
            <h3 className="font-medium">Từ vựng cần ôn tập thêm ({learningQueue.length})</h3>
          </div>
          <p className="text-sm text-muted-foreground mt-2 mb-3">
            Những từ bạn trả lời sai hoặc bỏ qua sẽ được thêm vào danh sách ôn tập ưu tiên.
          </p>

          {vocabularyItems.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {learningQueue.map((wordIndex) => {
                const word = vocabularyItems[wordIndex]
                return word ? (
                  <div
                    key={wordIndex}
                    className="px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-amber-300 dark:border-amber-700 text-sm"
                  >
                    {word.word}
                  </div>
                ) : null
              })}
            </div>
          )}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.3 }}
        className="mt-6 p-4 rounded-lg border bg-primary/5"
      >
        <div className="flex items-center">
          <Award className="h-5 w-5 text-primary mr-2" />
          <h3 className="font-medium">Đề xuất tiếp theo</h3>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Dựa trên kết quả của bạn, chúng tôi đề xuất tập trung vào các từ vựng ở cấp độ 1-2 để nâng cao khả năng ghi
          nhớ.
        </p>
      </motion.div>
    </div>
  )
}

