import { Input } from "@/components/ui/input"
import { useBaseQuestion } from "@/contexts/BaseQuestionContext"
import { Word } from "@/types/lesson-types"
import { useEffect, useRef } from "react"
import { AudioButton } from "../audio-button"


function ListeningQuestionContent({ vocabularyItem }: { vocabularyItem: Word }) {
    const { answer, setAnswer, handleSubmit } = useBaseQuestion() // Lấy handleSubmit từ context
    const inputRef = useRef<HTMLInputElement>(null)
    const audioButtonRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }

        // Add keyboard shortcut for playing audio (press key '1')
        const handleKeyDown = (e: KeyboardEvent) => {
            // Check if key is "1" and active element is not an input or textarea
            if (e.key === "1" && 
                !(document.activeElement instanceof HTMLInputElement || 
                  document.activeElement instanceof HTMLTextAreaElement)) {
                e.preventDefault();
                audioButtonRef.current?.click();
            }
        }

        window.addEventListener("keydown", handleKeyDown)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [])
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "1") {
            // Ngăn số 1 được nhập vào ô input
            e.preventDefault()
            audioButtonRef.current?.click()
            return
        }

        if (e.key === "Enter" && answer.trim()) {
            handleSubmit()
        }
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Nghe và nhập từ</h2>
                <AudioButton
                    audioUrl={vocabularyItem.audio}
                    word={vocabularyItem.word}
                    size="default"
                    variant="default"
                    className="mb-4"
                    ref={audioButtonRef}
                />
                <div className="text-muted-foreground text-sm space-y-1">
                    <p>Nhấn nút để nghe và nhập từ bạn nghe được</p>
                    <p className="font-medium">Nhấn phím <kbd className="px-2 py-1 bg-slate-100 rounded border">1</kbd> để nghe lại</p>
                </div>
            </div>

            <div className="py-4">
                <Input
                    ref={inputRef}
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Nhập từ tiếng Anh..."
                    className="text-lg"
                    onKeyDown={handleKeyDown}
                />
            </div>
        </div>
    )
}

export default ListeningQuestionContent