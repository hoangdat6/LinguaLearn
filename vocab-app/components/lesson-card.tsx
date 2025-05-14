import { Lesson } from "@/types/lesson-types";
import { Card, CardHeader, CardFooter, CardContent } from "@/components/ui/card";
import { BookOpen, Clock } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CardTitle, CardDescription } from "@/components/ui/card";

export function LessonCardSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-3">
        <div className="flex items-center">
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex items-center">
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
        </div>
      </CardFooter>
    </Card>
  );
}

interface LessonCardProps {
  lesson: Lesson;
  onSelect: (id: string) => void;
}

export function LessonCard({ lesson, onSelect }: LessonCardProps) {
  const isCompleted = lesson.is_learned;

  return (
    <div
      onClick={() => {
        if (!isCompleted) onSelect(lesson.id);
      }}
      className={`cursor-pointer ${isCompleted ? 'opacity-60 pointer-events-none' : ''}`}
    >
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              {/* <Badge className={`${lesson.themeColor} mb-2`}>
                <span className="mr-1">{lesson.icon}</span> {lesson.courseName}
              </Badge> */}
              <CardTitle className="text-lg">{lesson.title}</CardTitle>
            </div>
            {isCompleted && (
              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                Hoàn thành
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>{lesson.description}</CardDescription>
          {/* <div className="mt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tiến độ</span>
              <span className="font-medium">{lesson.progress}%</span>
            </div>
            <Progress value={lesson.progress} className="h-2" />
          </div> */}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4 mr-1" />
            {lesson.word_count} từ
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            {/* <Clock className="h-4 w-4 mr-1" />
            {lesson.estimatedTime} */}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
