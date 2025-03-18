import { Progress } from "@/components/ui/progress"
import { Trophy } from "lucide-react"

interface TotalProgressProps {
  learned: number
}

export function TotalProgress({ learned }: TotalProgressProps) {
  const nextMilestone = Math.ceil(learned / 100) * 100
  const progress = (learned / nextMilestone) * 100

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          <h3 className="font-medium">Tổng số từ đã học</h3>
        </div>
        <div className="text-sm font-medium">
          <span className="text-primary">{learned}</span>
          <span className="text-muted-foreground">/{nextMilestone} từ</span>
        </div>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  )
}

