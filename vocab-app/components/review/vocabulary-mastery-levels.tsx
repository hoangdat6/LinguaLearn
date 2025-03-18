"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, Brain, Lightbulb, Sparkles, BookOpen, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface VocabularyMasteryLevelsProps {
  onLevelSelect?: (level: number | null) => void
  selectedLevel?: number | null
  showCounts?: boolean
  counts?: number[]
}

export function VocabularyMasteryLevels({
  onLevelSelect,
  selectedLevel = null,
  showCounts = true,
  counts = [48, 18, 18, 23, 5],
}: VocabularyMasteryLevelsProps) {
  const [hoveredLevel, setHoveredLevel] = useState<number | null>(null)

  const levels = [
    {
      level: 1,
      name: "Mới học",
      description: "Từ vựng mới, chưa quen thuộc",
      icon: BookOpen,
      color: "bg-[hsl(var(--level-1))]",
      textColor: "text-[hsl(var(--level-1))]",
      borderColor: "border-[hsl(var(--level-1))]",
      lightBg: "bg-[hsl(var(--level-1))]/10",
    },
    {
      level: 2,
      name: "Nhận biết",
      description: "Có thể nhận ra từ nhưng chưa nhớ rõ nghĩa",
      icon: Eye,
      color: "bg-[hsl(var(--level-2))]",
      textColor: "text-[hsl(var(--level-2))]",
      borderColor: "border-[hsl(var(--level-2))]",
      lightBg: "bg-[hsl(var(--level-2))]/10",
    },
    {
      level: 3,
      name: "Hiểu nghĩa",
      description: "Hiểu nghĩa của từ nhưng cần thời gian để nhớ",
      icon: Brain,
      color: "bg-[hsl(var(--level-3))]",
      textColor: "text-[hsl(var(--level-3))]",
      borderColor: "border-[hsl(var(--level-3))]",
      lightBg: "bg-[hsl(var(--level-3))]/10",
    },
    {
      level: 4,
      name: "Sử dụng được",
      description: "Có thể sử dụng từ trong câu và nhớ nhanh",
      icon: Lightbulb,
      color: "bg-[hsl(var(--level-4))]",
      textColor: "text-[hsl(var(--level-4))]",
      borderColor: "border-[hsl(var(--level-4))]",
      lightBg: "bg-[hsl(var(--level-4))]/10",
    },
    {
      level: 5,
      name: "Thành thạo",
      description: "Sử dụng từ một cách tự nhiên và thành thạo",
      icon: Sparkles,
      color: "bg-[hsl(var(--level-5))]",
      textColor: "text-[hsl(var(--level-5))]",
      borderColor: "border-[hsl(var(--level-5))]",
      lightBg: "bg-[hsl(var(--level-5))]/10",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center">
          Cấp độ thành thạo
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 ml-2 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>Hệ thống 5 cấp độ giúp bạn theo dõi mức độ thành thạo của từng từ vựng trong quá trình học.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h3>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {levels.map((level) => (
          <TooltipProvider key={level.level}>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  className={`relative flex flex-col items-center p-3 rounded-lg cursor-pointer transition-all
                    ${selectedLevel === level.level ? level.lightBg : "hover:bg-muted/50"}
                    ${selectedLevel === level.level ? `border ${level.borderColor}` : "border border-transparent"}
                  `}
                  onMouseEnter={() => setHoveredLevel(level.level)}
                  onMouseLeave={() => setHoveredLevel(null)}
                  onClick={() => onLevelSelect?.(selectedLevel === level.level ? null : level.level)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {showCounts && (
                    <div
                      className={`absolute -top-2 -right-2 w-6 h-6 rounded-full ${level.color} text-white text-xs flex items-center justify-center font-bold`}
                    >
                      {counts[level.level - 1]}
                    </div>
                  )}

                  <div
                    className={`w-12 h-12 rounded-full ${level.color} text-white flex items-center justify-center mb-2`}
                  >
                    <level.icon className="h-6 w-6" />
                  </div>

                  <div className="text-center">
                    <div className={`text-sm font-semibold ${level.textColor}`}>Cấp {level.level}</div>
                    <div className="text-xs text-muted-foreground">{level.name}</div>
                  </div>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="font-medium">{level.name}</p>
                <p className="text-xs text-muted-foreground">{level.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  )
}

