"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Volume2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Word } from "@/types/lesson-types"
import { maskWordInExample } from "@/lib/calculate-similarity-word"

interface VocabularyAudioProps {
  word: Word
  onAnswer: (correct: boolean) => void
  onNext?: () => void // thêm prop này
  disableAutoPlay?: boolean // kiểm soát phát âm tự động
}

export function VocabularyAudio({ word, onAnswer, onNext, disableAutoPlay = false }: VocabularyAudioProps) {
  const [answer, setAnswer] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasAnsweredCorrect, setHasAnsweredCorrect] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false); // Thêm state này
  const [showLocalFeedback, setShowLocalFeedback] = useState(false); // Thêm state này
  const inputRef = useRef<HTMLInputElement>(null)
  const {masked ,maskedWord } = maskWordInExample(word.example, word.word)
  useEffect(() => {
    if (!disableAutoPlay) {
      playAudio()
    }
  }, [word, disableAutoPlay])
  useEffect(() => {
    inputRef.current?.focus()
    setShowLocalFeedback(false); // Reset feedback khi sang từ mới
  }, [word])

  const playAudio = () => {
    setIsPlaying(true)
    const utterance = new SpeechSynthesisUtterance(word.word)
    utterance.lang = "en-US"
    utterance.onend = () => setIsPlaying(false)
    window.speechSynthesis.speak(utterance)
  }

  const handleSubmit = () => {
    if (!answer.trim()) return;
    const correct = answer.toLowerCase().trim() === word.word.toLowerCase().trim();
    onAnswer(correct);
    setShowLocalFeedback(true); // Hiện feedback local
    setHasAnswered(true); // Đánh dấu đã trả lời
    if (correct) setHasAnsweredCorrect(true);
    else setHasAnsweredCorrect(false);
    // Không tự động chuyển tiếp khi sai
    if (correct && onNext) {
      setTimeout(() => onNext(), 600); // Tự động chuyển tiếp sau khi đúng
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Nghe và nhập từ</h2>
        <motion.div whileTap={{ scale: 0.95 }} className="inline-block">
          <Button
            variant="outline"
            size="lg"
            className="gap-2 relative overflow-hidden group"
            onClick={playAudio}
            disabled={isPlaying}
          >
            <motion.div
              animate={
                isPlaying
                  ? {
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7],
                  }
                  : {}
              }
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 1.5,
              }}
            >
              <Volume2 className="h-5 w-5 text-primary" />
            </motion.div>
            <span>Nghe từ</span>
            <motion.div
              className="absolute inset-0 bg-primary/10 rounded-md"
              initial={{ scale: 0, opacity: 0 }}
              animate={
                isPlaying
                  ? {
                    scale: 1.5,
                    opacity: 0,
                  }
                  : {}
              }
              transition={{
                repeat: isPlaying ? Number.POSITIVE_INFINITY : 0,
                duration: 1.5,
              }}
            />
          </Button>
        </motion.div>
        <motion.p
          className="text-xl mb-2 text-primary mt-3"
          animate={{
            scale: [1, 1.03, 1],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          {word.meaning}
        </motion.p>
        <p className="text-muted-foreground italic">
          {hasAnsweredCorrect && maskedWord
            ? (
                <>
                  {(() => {
                    const idx = masked.indexOf("...");
                    if (idx !== -1) {
                      return <>
                        {masked.slice(0, idx)}
                        <b className="text-primary font-bold">{maskedWord}</b>
                        {masked.slice(idx + 3)}
                      </>;
                    }
                    return masked;
                  })()}
                </>
              )
            : masked}
        </p>
        {showLocalFeedback && (
          <p className="text-muted-foreground ">{word.example_vi}</p>
        )}
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Input
            type="text"
            value={answer}
            onChange={(e) => { if (hasAnswered) return; setAnswer(e.target.value); setShowLocalFeedback(false); }}
            placeholder="Nhập từ bạn nghe được..."
            className={`text-lg pr-10${hasAnswered ? " opacity-60 cursor-not-allowed" : ""}`}
            onKeyDown={(e) => {
              if (hasAnswered && e.key !== "Enter") {
                e.preventDefault();
                return;
              }
              if (e.key === "Enter") {
                if (hasAnswered && onNext) onNext();
                else handleSubmit();
              }
            }}
            ref={inputRef}
          />
          {answer && (
            <motion.button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => { if (hasAnswered) return; setAnswer(""); }}
              whileTap={{ scale: 0.9 }}
              disabled={hasAnswered}
            >
              ✕
            </motion.button>
          )}
        </div>

        <AnimatePresence>
          {(showLocalFeedback) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={`p-4 rounded-lg text-center ${hasAnsweredCorrect
                  ? "bg-green-100 text-green-700 dark:bg-green-900/20"
                  : "bg-red-100 text-red-700 dark:bg-red-900/20"
                }`}
            >
              {hasAnsweredCorrect ? (
                <motion.p
                  className="font-medium"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  Chính xác! 🎉
                </motion.p>
              ) : (
                <motion.p
                  className="font-medium"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  Chưa đúng. Đáp án đúng là: <span className="font-bold">{word.word}</span>
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-end">
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button onClick={hasAnswered ? onNext : handleSubmit} disabled={!answer.trim()} className="relative overflow-hidden">
            <span>{hasAnswered ? "Tiếp tục" : "Kiểm tra"}</span>
            <motion.span
              className="absolute inset-0 bg-white/20 rounded-md"
              initial={{ x: "-100%", opacity: 0.5 }}
              animate={{ x: "100%" }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 1.5,
                repeatDelay: 1,
              }}
            />
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

