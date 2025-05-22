"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup } from "@/components/ui/radio-group"
import { useBaseQuestion } from "@/contexts/BaseQuestionContext"
import { Word } from "@/types/lesson-types"
import { motion } from "framer-motion"
import { createSentenceWithBlank, playAudioByUrl, playAudioByWord } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { Volume2 } from "lucide-react"

interface ListeningMultipleChoiceQuestionContentProps {
    vocabularyItem: Word
    options: Word[]
}

export function ListeningMultipleChoiceQuestionContent({ vocabularyItem, options }: ListeningMultipleChoiceQuestionContentProps) {
    const sentenceWithBlank = createSentenceWithBlank(
        vocabularyItem.example, 
        vocabularyItem.word
    );
    const { answer, setAnswer, handleSubmit } = useBaseQuestion();
    const [playingIndex, setPlayingIndex] = useState<number | null>(null);

    // Lắng nghe sự kiện bàn phím trên toàn bộ window
    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            const key = event.key;
            if (["1", "2", "3", "4"].includes(key)) {
                const index = parseInt(key, 10) - 1;
                if (index >= 0 && index < options.length) {
                    playAudio(index);
                    setAnswer(options[index].word);
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

    const playAudio = async (index: number) => {
        setPlayingIndex(index);
        try {
            if (options[index].audio) {
                playAudioByUrl(options[index].audio);
                return
            }
            playAudioByWord(options[index].word);
        } finally {
            setPlayingIndex(null);
        }
    }

    const handleOptionClick = (optionWord: string, index: number) => {
        playAudio(index);
        setAnswer(optionWord);
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <p className="text-xl mb-2">Nghe và điền từ thích hợp vào chỗ trống:</p>
                <p className="text-lg italic mb-4">{sentenceWithBlank}</p>
                <p className="text-muted-foreground text-sm font-medium">
                    Nhấn phím <kbd className="px-2 py-1 bg-slate-100 rounded border">1</kbd> -
                    <kbd className="px-2 py-1 bg-slate-100 rounded border">4</kbd> để nghe và chọn
                </p>
            </div>

            <div className="py-4">
                <RadioGroup value={answer || ""} onValueChange={setAnswer} className="space-y-3">
                    {options.map((option, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.1 }}
                            className={`flex items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-accent ${answer === option.word ? "border-primary bg-primary/10 shadow-md" : ""
                                }`}
                            onClick={() => handleOptionClick(option.word, index)}
                        >
                            {/* Hiển thị số thứ tự với Badge */}
                            <Badge
                                variant={answer === option.word ? "default" : "outline"}
                                className={`w-6 h-6 flex items-center justify-center font-bold rounded-full ${answer === option.word ? "bg-primary text-white" : "bg-gray-200 text-gray-800"
                                    }`}
                            >
                                {index + 1}
                            </Badge>

                            <div className="flex-1 flex items-center justify-center">
                                <Volume2
                                    className={`h-6  w-6  mr-2 ${playingIndex === index ? "text-primary animate-pulse" : "text-gray-500"
                                        }`}
                                />
                            </div>
                        </motion.div>
                    ))}
                </RadioGroup>
            </div>
        </div>
    );
}



