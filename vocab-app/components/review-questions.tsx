"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Volume2 } from "lucide-react"

interface QuestionProps {
  onAnswer: (isCorrect: boolean) => void
}

export function MultipleChoiceQuestion({ onAnswer }: QuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState("")

  const question = {
    word: "Accomplish",
    options: ["Hoàn thành", "Bắt đầu", "Từ bỏ", "Trì hoãn"],
    correctAnswer: "Hoàn thành",
  }

  const handleSubmit = () => {
    onAnswer(selectedAnswer === question.correctAnswer)
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">Chọn nghĩa đúng cho từ:</h2>
        <p className="text-3xl font-semibold mb-6 text-center">{question.word}</p>
        <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="space-y-3">
          {question.options.map((option) => (
            <div
              key={option}
              className="flex items-center space-x-2 rounded-lg border p-4 transition-colors hover:bg-accent"
            >
              <RadioGroupItem value={option} id={option} />
              <Label htmlFor={option} className="flex-1 cursor-pointer font-medium">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
        <Button onClick={handleSubmit} className="w-full mt-6" disabled={!selectedAnswer}>
          Kiểm tra
        </Button>
      </CardContent>
    </Card>
  )
}

export function FillInTheBlankQuestion({ onAnswer }: QuestionProps) {
  const [selectedWord, setSelectedWord] = useState("")

  const question = {
    sentence: "She ____ her goal of running a marathon.",
    options: ["accomplished", "started", "abandoned", "postponed"],
    correctAnswer: "accomplished",
  }

  const handleSubmit = () => {
    onAnswer(selectedWord === question.correctAnswer)
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">Chọn từ thích hợp để điền vào chỗ trống:</h2>
        <p className="text-xl mb-6 text-center">{question.sentence}</p>
        <div className="grid grid-cols-2 gap-3">
          {question.options.map((option) => (
            <Button
              key={option}
              variant={selectedWord === option ? "default" : "outline"}
              className="w-full"
              onClick={() => setSelectedWord(option)}
            >
              {option}
            </Button>
          ))}
        </div>
        <Button onClick={handleSubmit} className="w-full mt-6" disabled={!selectedWord}>
          Kiểm tra
        </Button>
      </CardContent>
    </Card>
  )
}

export function TypeAnswerQuestion({ onAnswer }: QuestionProps) {
  const [answer, setAnswer] = useState("")

  const question = {
    meaning: "Hoàn thành, đạt được (một mục tiêu hoặc nhiệm vụ)",
    correctAnswer: "accomplish",
  }

  const handleSubmit = () => {
    onAnswer(answer.toLowerCase().trim() === question.correctAnswer)
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">Nhập từ có nghĩa:</h2>
        <p className="text-xl mb-6 text-center italic">"{question.meaning}"</p>
        <Input
          type="text"
          placeholder="Nhập câu trả lời của bạn"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="mb-4"
        />
        <Button onClick={handleSubmit} className="w-full" disabled={!answer.trim()}>
          Kiểm tra
        </Button>
      </CardContent>
    </Card>
  )
}

export function ListenAndTypeQuestion({ onAnswer }: QuestionProps) {
  const [answer, setAnswer] = useState("")

  const question = {
    audioUrl: "/audio/accomplish.mp3",
    correctAnswer: "accomplish",
  }

  const handleSubmit = () => {
    onAnswer(answer.toLowerCase().trim() === question.correctAnswer)
  }

  const playAudio = () => {
    const audio = new Audio(question.audioUrl)
    audio.play()
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">Nghe và nhập từ bạn nghe được:</h2>
        <Button onClick={playAudio} className="w-full mb-6">
          <Volume2 className="mr-2 h-4 w-4" /> Nghe
        </Button>
        <Input
          type="text"
          placeholder="Nhập từ bạn nghe được"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="mb-4"
        />
        <Button onClick={handleSubmit} className="w-full" disabled={!answer.trim()}>
          Kiểm tra
        </Button>
      </CardContent>
    </Card>
  )
}

