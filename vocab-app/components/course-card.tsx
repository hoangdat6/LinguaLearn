import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Course } from "@/types/lesson-types";
import { BookOpen, Users } from 'lucide-react';
import { useMemo } from 'react';

export function CourseCardSkeleton() {
  return (
    <Card className="h-full flex flex-col overflow-hidden">
      {/* Icon Section Skeleton */}
      <div className="h-40 bg-gray-200 animate-pulse" />

      {/* Header Skeleton */}
      <CardHeader className="flex-1 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="max-w-[250px] space-y-2">
            <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
            <div className="space-y-1">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
        
        {/* Progress Skeleton */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-2 w-full bg-gray-200 rounded animate-pulse" />
        </div>
      </CardHeader>

      {/* Footer Skeleton */}
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex items-center">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex items-center">
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
        </div>
      </CardFooter>
    </Card>
  );
}

interface CourseCardProps {
  theme: Course;
  onSelect: (id: string) => void;
  isAuthenticated: boolean;
}

export function CourseCard({ theme, onSelect, isAuthenticated }: CourseCardProps) {
  const generatePastelColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 80%, 90%)`;
  };

  // Generate stable color based on theme ID
  const backgroundColor = useMemo(() => generatePastelColor(), [theme.id]);

  return (
    <div onClick={() => onSelect(theme.id)} className="cursor-pointer">
      <Card className="h-full flex flex-col overflow-hidden">
        {/* Icon Section */}
        <div className="h-40 flex items-center justify-center relative overflow-hidden" style={{ backgroundColor }}>
          <div className="text-6xl">{theme.icon}</div>
        </div>

        {/* Header */}
        <CardHeader className="flex-1 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="max-w-[250px]">
              <h2 className="text-lg font-bold">{theme.title}</h2>
              <p className="text-muted-foreground mt-2 line-clamp-2 truncate">
                {theme.description}
              </p>
            </div>
            {/* <Badge className={`${theme.backgroundColor} ${theme.color}`}>
              {theme.difficulty === "beginner" ? "Cơ bản" : 
               theme.difficulty === "intermediate" ? "Trung cấp" : "Nâng cao"}
            </Badge> */}
          </div>
          
          {/* Only show progress when user is authenticated */}
          {isAuthenticated && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tiến độ</span>
                <span>{theme.progress}%</span>
              </div>
              <Progress value={theme.progress} className="h-2" />
            </div>
          )}
        </CardHeader>
        {/* Footer */}
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4 mr-1" />
            {theme.lesson_count} bài học
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            {theme.learner_count}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
