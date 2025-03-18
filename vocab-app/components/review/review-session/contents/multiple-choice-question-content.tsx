"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup } from "@/components/ui/radio-group"
import { useBaseQuestion } from "@/contexts/BaseQuestionContext"
import { VocabularyItem } from "@/types/lesson-types"
import { motion } from "framer-motion"

interface MultipleChoiceQuestionContentProps {
    vocabularyItem: VocabularyItem
    options: string[]
}

import { Badge } from "@/components/ui/badge"
import { useEffect } from "react"

export function MultipleChoiceQuestionContent({ vocabularyItem, options }: MultipleChoiceQuestionContentProps) {
    const { answer, setAnswer, handleSubmit } = useBaseQuestion();

    // Lắng nghe sự kiện bàn phím trên toàn bộ window
    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            const key = event.key;
            if (["1", "2", "3", "4"].includes(key)) {
                const index = parseInt(key, 10) - 1;
                if (index >= 0 && index < options.length) {
                    setAnswer(options[index]);
                }
            }
            if (event.key === "Enter" && answer) {
                handleSubmit();
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [answer, options, setAnswer, handleSubmit]);

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">{vocabularyItem.meaning}</h2>
            </div>

            <div className="py-4">
                <h3 className="text-md font-medium mb-4">Chọn từ đúng:</h3>
                <RadioGroup value={answer || ""} onValueChange={setAnswer} className="space-y-3">
                    {options.map((option, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.1 }}
                            className={`flex items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-accent ${
                                answer === option ? "border-primary bg-primary/10 shadow-md" : ""
                            }`}
                        >
                            {/* Hiển thị số thứ tự với Badge */}
                            <Badge
                                variant={answer === option ? "default" : "outline"}
                                className={`w-6 h-6 flex items-center justify-center  font-bold rounded-full ${
                                    answer === option ? "bg-primary text-white" : "bg-gray-200 text-gray-800"
                                }`}
                            >
                                {index + 1}
                            </Badge>
                            <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer font-medium">
                                {option}
                            </Label>
                        </motion.div>
                    ))}
                </RadioGroup>
            </div>
        </div>
    );
}



