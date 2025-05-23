"use client"

import { motion } from "framer-motion"
import { ArrowLeft, BookOpen, Check, X } from 'lucide-react'
import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import { VocabularyStage } from "@/components/lessons/vocabulary-stage"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useVocabularyProgress } from "@/hooks/use-vocabulary-progress"
import userWordService from "@/services/user-word-service"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Animation variants
const pageVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.5 }
  },
  exit: { opacity: 0 }
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  exit: {
    opacity: 0,
    y: -50,
    transition: { duration: 0.3 }
  }
};

const resultVariants = {
  correct: {
    scale: [1, 1.2, 1],
    backgroundColor: ["rgba(34, 197, 94, 0)", "rgba(34, 197, 94, 0.2)", "rgba(34, 197, 94, 0)"],
    transition: { duration: 0.5 }
  },
  incorrect: {
    scale: [1, 1.2, 1],
    backgroundColor: ["rgba(239, 68, 68, 0)", "rgba(239, 68, 68, 0.2)", "rgba(239, 68, 68, 0)"],
    transition: { duration: 0.5 }
  }
};

export default function Page() {
  const params = useParams()
  const lessonId = Array.isArray(params.lessonId) ? params.lessonId[0] : params.lessonId ?? ""
  const {
    lesson,
    currentIndex,
    currentStage,
    progress,
    correctCount,
    incorrectCount,
    loading,
    showCompletionDialog,
    words,
    handleCorrectAnswer,
    handleIncorrectAnswer,
    handleNextWord,
    handleReset,
    setShowCompletionDialog,
    setProgressState,
    queue, // destructure queue
    setQueue, // destructure setQueue
  } = useVocabularyProgress(lessonId) 

  const router = useRouter();
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);
  const [progressRestored, setProgressRestored] = useState(false);
  const [isLearn, setIsLearn] = useState(false);
  const completionDialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showCompletionDialog && words?.length > 0) {
      const learnedWords = words.map(word => ({
        word_id: word.id,
        question_type: "L1",
        level: 1,
        streak: 1,
      }));
      userWordService.submitLearnedWords({ lessonId: parseInt(lessonId), words: learnedWords });
    }
  }, [showCompletionDialog]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    if (!showCompletionDialog) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [showCompletionDialog]);
  console.log(currentIndex, currentStage)
  // Khôi phục tiến trình 
  useEffect(() => {
    const saved = sessionStorage.getItem(`vocab-progress-${lessonId}`);
    if (saved) {
      setIsLearn(true);
      try {
        const data = JSON.parse(saved);
        if (
          data &&
          words?.length > 0 &&
          typeof data.currentIndex === 'number' &&
          typeof data.correctCount === 'number' &&
          typeof data.incorrectCount === 'number' &&
          Array.isArray(data.queue)
        ) {
          if (data.currentIndex < words.length) {
            handleReset();
            setTimeout(() => {
              setProgressState({
                correctCount: data.correctCount,
                incorrectCount: data.incorrectCount,
              });
              if (typeof setQueue === 'function') setQueue(data.queue);
              if (data.queue && data.queue.length > 0) {
                setProgressState({
                  currentIndex: data.queue[0][0],
                  currentStage: data.queue[0][1],
                });
              }
            }, 0);
            // Chờ đến khi currentIndex cập nhật xong
            const interval = setInterval(() => {
              const current = document.querySelector('#progress-index')?.getAttribute('data-index');
              if (parseInt(current ?? '0') === data.currentIndex) {
                clearInterval(interval);
                setProgressRestored(true);
              }
            }, 500);

            return;
          } else {
            handleReset();
            setProgressRestored(true);
            return;
          }
        }
      } catch { }
    }

    setProgressRestored(true);
  }, [words]);

  // Lưu tiến trình học vào sessionStorage mỗi khi thay đổi
  useEffect(() => {
    if (words?.length > 0 && !showCompletionDialog && currentStage >= 0 && queue?.length > 0) {
      sessionStorage.setItem(
        `vocab-progress-${lessonId}`,
        JSON.stringify({
          currentIndex,
          correctCount,
          incorrectCount,
          queue
        })
      );
    }
    // xóa tiến trình
    if (showCompletionDialog) {
      sessionStorage.removeItem(`vocab-progress-${lessonId}`);
    }
  }, [currentIndex, correctCount, incorrectCount, showCompletionDialog, words, queue]);

  // Chặn Enter khi hiện dialog hoàn thành (dùng capture để chặn sớm nhất)
  useEffect(() => {
    if (showCompletionDialog && completionDialogRef.current) {
      const handler = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          e.stopPropagation();
          e.preventDefault();
        }
      };
      const node = completionDialogRef.current;
      node.addEventListener('keydown', handler, true);
      return () => {
        node.removeEventListener('keydown', handler, true);
      };
    }
  }, [showCompletionDialog]);

  if (loading || !progressRestored || words.length === 0) {
    return (
      <div className="container max-w-3xl py-20 flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải bài học...</p>
        </motion.div>
      </div>
    );

  } else if (!lesson) {
    router.push("/lessons");
    return null;
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="container max-w-4xl py-1"
    >
      <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rời khỏi bài học?</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn rời khỏi?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowLeaveDialog(false)}>
              Ở lại
            </Button>
            <Button
              onClick={() => {
                if (pendingRoute) router.push(pendingRoute);
              }}
            >
              Rời khỏi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => {
              setPendingRoute("/lessons");
              setShowLeaveDialog(true);
            }}
            className="gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>

          {/* <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleRestart}
                className="gap-1"
              >
                <RotateCcw className="h-4 w-4" />
                Học lại
              </Button>
            </div> */}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {/* <Badge className={`${lesson.themeColor} ${lesson.themeFontColor}`}>
                <span className="mr-1">{lesson.icon}</span> {lesson.courseName}
              </Badge> */}
            {/* <Badge variant="outline">
                {lesson.difficulty === "beginner" ? "Cơ bản" : 
                lesson.difficulty === "intermediate" ? "Trung cấp" : "Nâng cao"}
              </Badge> */}
          </div>
          <h1 className="text-3xl font-bold">{lesson.title}</h1>
          <p className="text-muted-foreground">{lesson.description}</p>

          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center text-sm text-muted-foreground gap-1">
              <BookOpen className="h-4 w-4" />
              {lesson.word_count} từ vựng
            </div>
            {/* <div className="flex items-center text-sm text-muted-foreground gap-1">
                <Clock className="h-4 w-4" />
                {lesson.estimatedTime}
              </div> */}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Tiến độ: {currentIndex + 1}/{words?.length} từ vựng
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="flex items-center text-green-500 gap-1">
                <Check className="h-4 w-4" /> {correctCount}
              </span>
              <span className="flex items-center text-red-500 gap-1">
                <X className="h-4 w-4" /> {incorrectCount}
              </span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardContent className="p-6">
            <VocabularyStage
              key={currentIndex + '-' + currentStage + '-' + queue.length + Date.now()}
              word={words[currentIndex]}
              stage={currentStage}
              onCorrect={handleCorrectAnswer}
              onIncorrect={handleIncorrectAnswer}
              onNext={handleNextWord}
              disableAutoPlay={isLearn && currentIndex === 0}
            />
          </CardContent>
        </Card>

      </div>

      {/* Completion Dialog */}
      {showCompletionDialog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          style={{ backdropFilter: 'blur(2px)' }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg max-w-md w-full p-6 relative"
            tabIndex={-1}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
          >
            <div className="mb-4">
              <div className="text-xl font-bold mb-1">Chúc mừng!</div>
              <div className="text-muted-foreground mb-2">
                Bạn đã hoàn thành bài học từ vựng "{lesson.title}"
              </div>
            </div>
            <div className="py-4">
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-500">{correctCount}</div>
                    <div className="text-sm text-muted-foreground">Đúng</div>
                  </div>
                  <Separator orientation="vertical" className="h-10" />
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-500">{incorrectCount}</div>
                    <div className="text-sm text-muted-foreground">Sai</div>
                  </div>
                  <Separator orientation="vertical" className="h-10" />
                  <div className="text-center">
                    <div className="text-3xl font-bold">{words?.length}</div>
                    <div className="text-sm text-muted-foreground">Đã lưu</div>
                  </div>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-center mb-4">Độ chính xác</p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${correctCount > 0 ? (correctCount / (correctCount + incorrectCount) * 100) : 0}%` }}
                    ></div>
                  </div>
                  <p className="text-center mt-2">
                    {correctCount > 0 ? Math.round((correctCount / (correctCount + incorrectCount) * 100)) : 0}%
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-6">
              <button
                className="sm:flex-1 flex items-center justify-center gap-2 border border-gray-300 dark:border-zinc-700 rounded px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 transition text-base"
                style={{ outline: 'none' }}
                type="button"
                tabIndex={-1}
                onClick={e => {
                  e.preventDefault();
                  setShowCompletionDialog(false);
                  setTimeout(() => router.push("/lessons"), 100);
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại danh sách
              </button>
              {/* <button className="sm:flex-1 ...">Học lại</button> */}
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}
