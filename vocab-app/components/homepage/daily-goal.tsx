import { Progress } from "@/components/ui/progress"
import { Trophy } from "lucide-react"

interface DailyGoalProps {
  completed: number
  total: number
}

export function DailyGoal({ completed, total }: DailyGoalProps) {
  const percentage = (completed / total) * 100

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          <h3 className="font-medium">Mục tiêu hàng ngày</h3>
        </div>
        <span className="text-sm font-medium">
          {completed}/{total} bài học
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  )
}

