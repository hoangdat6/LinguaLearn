import { useBaseQuestion } from "@/contexts/BaseQuestionContext"
import { useEffect, useRef, useState } from "react"
import { AudioButton } from "../audio-button"
import { Input } from "@/components/ui/input"
import { VocabularyItem } from "@/types/lesson-types"


function ListeningQuestionContent({ vocabularyItem }: { vocabularyItem: VocabularyItem }) {
    const { answer, setAnswer, handleSubmit } = useBaseQuestion() // Lấy handleSubmit từ context
    const inputRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [])
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Nghe và nhập từ</h2>
                <AudioButton text={vocabularyItem.word} size="default" variant="default" className="mb-4" />
                <p className="text-muted-foreground text-sm">Nhấn nút để nghe và nhập từ bạn nghe được</p>
            </div>

            <div className="py-4">
                <Input
                    ref={inputRef}
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Nhập từ tiếng Anh..."
                    className="text-lg"
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

export default ListeningQuestionContent