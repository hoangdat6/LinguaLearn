import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBaseQuestion } from "@/contexts/BaseQuestionContext";
import { createSentenceWithBlank } from "@/lib/utils";
import { Word } from "@/types/lesson-types";
import { useEffect, useRef } from "react";

function FillInBlankQuestionContent({ vocabularyItem }: { vocabularyItem: Word }) {
    // Cải thiện cách tìm và thay thế từ trong câu
    const sentenceWithBlank = createSentenceWithBlank(
        vocabularyItem.example, 
        vocabularyItem.word
    );
    
    const { answer, setAnswer, handleSubmit } = useBaseQuestion()
    const inputRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [])
    return (
        <div className="space-y-6">
            <div className="text-center">
                <p className="text-xl mb-2">Điền từ thích hợp vào chỗ trống:</p>
                <p className="text-lg italic mb-4">{sentenceWithBlank}</p>
            </div>

            <div className="py-4">
                <div className="mb-4 p-3 bg-muted/30 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Gợi ý: Chọn từ thích hợp</h3>
                    <div className="flex flex-wrap gap-2">
                        {getWordOptions().map((word, index) => (
                            <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => setAnswer(word)}
                                className={answer === word ? "border-primary bg-primary/5" : ""}
                            >
                                {word}
                            </Button>
                        ))}
                    </div>
                </div>
                <Input
                    ref={inputRef}
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Nhập từ tiếng Anh..."
                    className="text-lg"
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && answer.trim()) {
                            handleSubmit(); // Gọi hàm từ BaseQuestion
                        }
                    }}
                />
            </div>
        </div>
    )

    function getWordOptions() {
        return [vocabularyItem.word, "example", "different", "another", "word"].sort(() => Math.random() - 0.5);
    }
}

export default FillInBlankQuestionContent