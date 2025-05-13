import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Users } from 'lucide-react'
import { Course } from "@/types/lesson-types"

interface ThemeHeaderProps {
  theme: Course;
  backgroundColor: string;
  isAuthenticated: boolean;
  onBack: () => void;
}

export function ThemeHeader({ theme, backgroundColor, isAuthenticated, onBack }: ThemeHeaderProps) {
  return (
    <div className="mb-6">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-4"
      >
        ← Quay lại chủ đề
      </Button>

      <div className={`p-6 rounded-lg`} style={{ backgroundColor }}>
        <div className="flex items-center gap-4">
          <div className="text-4xl">{theme.icon}</div>
          <div>
            <h2 className="text-2xl font-bold">{theme.title}</h2>
            <p>{theme.description}</p>
          </div>
        </div>

        {isAuthenticated && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Tiến độ</span>
              <span>{theme.progress}%</span>
            </div>
            <Progress value={theme.progress} className="h-2" />
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-4">
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1" />
            <span>{theme.lesson_count} bài học</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{theme.learner_count} người học</span>
          </div>
        </div>
      </div>
    </div>
  )
} 