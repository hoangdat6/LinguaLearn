"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Word } from "@/types/lesson-types"
import { maskWordInExample } from "@/lib/calculate-similarity-word"

interface VocabularyTypingProps {
  word: Word
  onAnswer: (correct: boolean) => void
  onNext?: () => void // thêm prop này
}

export function VocabularyTyping({ word, onAnswer, onNext }: VocabularyTypingProps) {
  const [answer, setAnswer] = useState("");
  const [charCount, setCharCount] = useState<number[]>([]);
  const [hasAnsweredCorrect, setHasAnsweredCorrect] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false); // Thêm state này
  const [showLocalFeedback, setShowLocalFeedback] = useState<false | "correct" | "wrong">(false);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
    setHasAnsweredCorrect(false); // Reset khi sang từ mới
    setHasAnswered(false); // Reset khi sang từ mới
    setAnswer("");
    setCharCount([]);
    setShowLocalFeedback(false); // Reset feedback khi sang từ mới
    // Focus vào ô đầu tiên khi sang từ mới
    setTimeout(() => {
      const firstInput = document.getElementById('char-input-0');
      if (firstInput) (firstInput as HTMLInputElement).focus();
    }, 0);
  }, [word])
  // Create character boxes for visual feedback
  const updateCharCount = (value: string) => {
    const wordLength = word.word.length
    const chars = new Array(wordLength).fill(0)
    
    // Fill in the character count based on input length
    for (let i = 0; i < Math.min(value.length, wordLength); i++) {
      chars[i] = 1
    }

    setCharCount(chars)
  }

  // Sửa handleChange để giới hạn số ký tự nhập vào
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value.length > word.word.length) {
      value = value.slice(0, word.word.length);
    }
    setAnswer(value);
    updateCharCount(value);
    setShowLocalFeedback(false); // Ẩn feedback khi sửa đáp án
  };

  const handleSubmit = () => {
    if (!answer.trim()) return;
    const correct = answer.toLowerCase().trim() === word.word.toLowerCase().trim();
    onAnswer(correct);
    setShowLocalFeedback(correct ? "correct" : "wrong");
    setHasAnswered(true);
    if (correct) setHasAnsweredCorrect(true);
    else setHasAnsweredCorrect(false);
    // Không tự động chuyển tiếp khi sai
    if (correct && onNext) {
      setTimeout(() => onNext(), 600); // Tự động chuyển tiếp sau khi đúng
    }
  };

  // Sử dụng maskWordInExample để lấy cả example đã che và từ bị che
  const { masked, maskedWord } = maskWordInExample(word.example, word.word);
  // Tách mảng để render React element
  let exampleParts: Array<string | React.ReactNode> = [masked];
  if (showLocalFeedback === "correct" && maskedWord) {
    const idx = masked.indexOf("...");
    if (idx !== -1) {
      exampleParts = [
        masked.slice(0, idx),
        <b key="maskedWord" className="text-primary font-bold">{maskedWord}</b>,
        masked.slice(idx + 3)
      ];
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4">Nhập từ có nghĩa:</h2>
        <motion.p
          className="text-xl mb-2 text-primary"
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
          {exampleParts}
        </p>
        {showLocalFeedback && (
          <p className="text-muted-foreground ">{word.example_vi}</p>
        )}
      </motion.div>

      <div className="space-y-4">
        <div className="relative">
          {answer && (
            <motion.button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => {
                if (hasAnswered) return; // Không cho xóa khi đã trả lời
                setAnswer("");
                updateCharCount("");
              }}
              whileTap={{ scale: 0.9 }}
              disabled={hasAnswered}
            >
              ✕
            </motion.button>
          )}
        </div>

        <div className="flex justify-center gap-1 my-4">
          {word.word.split("").map((char, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={answer[index] || ""}
              onChange={e => {
                if (hasAnswered) return; // Không cho sửa khi đã trả lời
                let val = e.target.value;
                if (val.length > 1) val = val.slice(-1);
                const newAnswer = answer.split("");
                newAnswer[index] = val;
                const joined = newAnswer.join("").slice(0, word.word.length);
                setAnswer(joined);
                updateCharCount(joined);
                setShowLocalFeedback(false);
                // Tự động focus 
                if (val && index < word.word.length - 1) {
                  const next = document.getElementById(`char-input-${index + 1}`);
                  if (next) (next as HTMLInputElement).focus();
                }
              }}
              onKeyDown={e => {
                if (hasAnswered && e.key !== "Enter") {
                  e.preventDefault();
                  return;
                }
                if (e.key === "Backspace" && !answer[index] && index > 0) {
                  // Nếu xóa ở ô rỗng thì focus về ô trước
                  const prev = document.getElementById(`char-input-${index - 1}`);
                  if (prev) (prev as HTMLInputElement).focus();
                }
                if (e.key === "Enter") {
                  if (hasAnswered && onNext) onNext();
                  else handleSubmit();
                }
              }}
              id={`char-input-${index}`}
              className={`w-8 h-10 text-center text-lg rounded-md border-2 ${answer[index] ? "border-primary bg-primary/5" : "border-muted"}${hasAnswered ? " opacity-60 cursor-not-allowed" : ""}`}
              autoComplete="off"
              style={{ imeMode: "disabled" }}
            />
          ))}
        </div>

        <p className="text-sm text-center text-muted-foreground">Từ này có {word.word.length} ký tự</p>

        <AnimatePresence>
          {showLocalFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={`p-4 rounded-lg text-center ${showLocalFeedback === "correct"
                ? "bg-green-100 text-green-700 dark:bg-green-900/20"
                : "bg-red-100 text-red-700 dark:bg-red-900/20"
                }`}
            >
              {showLocalFeedback === "correct" ? (
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
          <Button
            onClick={hasAnswered ? onNext : handleSubmit}
            disabled={word.word.length !== answer.length || !answer.trim()}
            className="relative overflow-hidden"
          >
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

