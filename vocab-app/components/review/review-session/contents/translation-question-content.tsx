"use client"

import { Input } from "@/components/ui/input"
import { useBaseQuestion } from "@/contexts/BaseQuestionContext"
import { VocabularyItem } from "@/types/lesson-types"
import { useEffect, useRef } from "react";

interface TranslationQuestionContentProps {
    vocabularyItem: VocabularyItem;

}

export function TranslationQuestionContent({ vocabularyItem }: TranslationQuestionContentProps) {
    const {answer, setAnswer, handleSubmit } = useBaseQuestion() // Lấy handleSubmit từ context
    const inputRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [])
    return (

        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">{vocabularyItem.meaning}</h2>
                {/* <div className="flex items-center justify-center gap-2">
            <span className="text-muted-foreground">{vocabularyItem.pronunciation}</span>
            <AudioButton text={vocabularyItem.word} />
          </div> */}
            </div>

            <div className="py-4">
                <h3 className="text-lg font-medium mb-4">Nhập từ:</h3>
                <Input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Nhập từ tiếng anh..."
                    className="text-lg"
                    ref={inputRef}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && answer.trim()) {
                            handleSubmit()
                        }
                    }}
                />
            </div>
        </div>
    )
}


