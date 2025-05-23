"use client"

import { motion } from "framer-motion"
import { CheckCircle, XCircle, ArrowRight, Volume2, ChevronDown, ChevronUp } from "lucide-react"
import { Word } from "@/types/lesson-types"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import React from "react"

interface QuestionFeedbackProps {
  isCorrect: boolean
  correctAnswer: string
  vocabularyItem: Word
  onContinue: () => void
}

export function QuestionFeedback({
  isCorrect,
  correctAnswer,
  vocabularyItem,
  onContinue
}: QuestionFeedbackProps) {
  const [showTranslation, setShowTranslation] = useState(false);
  const continueButtonRef = React.useRef<HTMLButtonElement>(null);

  // // Auto-advance if the answer is correct
  // useEffect(() => {
  //   if (isCorrect) {
  //     const timer = setTimeout(() => {
  //       onContinue();
  //     }, 2000); // Auto advance after 2 seconds when correct

  //     return () => clearTimeout(timer);
  //   }
  // }, [isCorrect, onContinue]);

  useEffect(() => {
    // Focus the continue button when the component mounts
    setTimeout(() => {
      if (continueButtonRef.current) {
        continueButtonRef.current.focus();
      }
    }, 100); // Delay to ensure the button is rendered
  }, [correctAnswer]);

  // Handle Enter key press to continue
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only proceed if the Enter key is pressed
      if (e.key === 'Enter') {
        // Check if the continueButton is the active element or close to it in the focus tree
        if (document.activeElement === continueButtonRef.current || 
            document.activeElement?.tagName === 'BODY') {
          e.preventDefault();
          onContinue();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [onContinue]);

  const handlePlayAudio = () => {
    // Create a speech synthesis utterance for the word
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(vocabularyItem.word);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`p-5 rounded-lg shadow-md ${isCorrect
          ? "bg-green-50 border border-green-200 dark:bg-green-900/30 dark:border-green-800"
          : "bg-red-50 border border-red-200 dark:bg-red-900/30 dark:border-red-800"
        }`}
    >
      <div className="text-center mb-4">
        {isCorrect ? (
          <div className="flex flex-col items-center">
            <div className="bg-green-100 dark:bg-green-800/50 p-3 rounded-full mb-2">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <p className="font-bold text-lg text-green-700 dark:text-green-400">Chính xác!</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="bg-red-100 dark:bg-red-800/50 p-3 rounded-full mb-2">
              <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <p className="font-bold text-lg text-red-700 dark:text-red-400">Chưa đúng</p>
            <p className="text-red-600 dark:text-red-300">Đáp án đúng là: <span className="font-semibold">{correctAnswer}</span></p>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100">
            {vocabularyItem.word.charAt(0).toUpperCase() + vocabularyItem.word.slice(1)}
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePlayAudio}
            className="rounded-full h-8 w-8 p-0 flex items-center justify-center"
            title="Nghe phát âm"
          >
            <Volume2 className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-gray-700 dark:text-gray-300 text-md font-medium mb-3">{vocabularyItem.meaning}</p>

        {vocabularyItem.example && (
          <div className="mt-3 border-t border-gray-100 dark:border-gray-700 pt-3">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Ví dụ:</p>
            <div className="space-y-2">
              <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-md text-gray-700 dark:text-gray-300">
                <p className="italic">"{vocabularyItem.example}"</p>

                {vocabularyItem.example_vi && (
                  <div className="mt-2">
                    <div
                      className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 cursor-pointer"
                      onClick={() => setShowTranslation(!showTranslation)}
                    >
                      {showTranslation ? (
                        <>
                          <ChevronUp className="h-4 w-4" />
                          <span>Ẩn nghĩa</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4" />
                          <span>Xem nghĩa</span>
                        </>
                      )}
                    </div>

                    {showTranslation && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-2 text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-2"
                      >
                        {vocabularyItem.example_vi}
                      </motion.p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end mt-4">
        <Button
          onClick={onContinue}
          ref={continueButtonRef}
          className="flex items-center gap-1 px-4 py-2"
        >
          Tiếp tục <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* {isCorrect && (
        <motion.div 
          className="flex justify-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">Tự động chuyển tiếp sau 2 giây...</p>
        </motion.div>
      )} */}
    </motion.div>
  )
}

