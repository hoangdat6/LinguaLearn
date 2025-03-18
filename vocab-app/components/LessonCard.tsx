import { Lesson } from "@/types/lesson-types";
import { Card, CardHeader, CardFooter, CardContent } from "@/components/ui/card";
import { BookOpen, Clock } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CardTitle, CardDescription } from "@/components/ui/card";

interface LessonCardProps {
  lesson: Lesson;
  onSelect: (id: string) => void;
}

export function LessonCard({ lesson, onSelect }: LessonCardProps) {
  return (
    <div onClick={() => onSelect(lesson.id)} className="cursor-pointer">
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <Badge className={`${lesson.themeColor} mb-2`}>
                <span className="mr-1">{lesson.icon}</span> {lesson.courseName}
              </Badge>
              <CardTitle className="text-lg">{lesson.title}</CardTitle>
            </div>
            {lesson.completed && (
              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                Hoàn thành
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>{lesson.description}</CardDescription>
          <div className="mt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tiến độ</span>
              <span className="font-medium">{lesson.progress}%</span>
            </div>
            <Progress value={lesson.progress} className="h-2" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4 mr-1" />
            {lesson.vocabCount} từ
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            {lesson.estimatedTime}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}