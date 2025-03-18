import { Flame } from "lucide-react"

interface StreakCounterProps {
  days: number
}

export function StreakCounter({ days }: StreakCounterProps) {
  return (
    <div className="flex items-center gap-1.5 bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full">
      <span className="bounce">
        <Flame className="h-5 w-5 text-amber-500 dark:text-amber-400" />
      </span>
      <span className="font-bold">{days} ngày</span>
    </div>
  )
}

