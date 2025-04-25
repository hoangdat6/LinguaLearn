import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Course } from "@/types/lesson-types";
import { BookOpen } from 'lucide-react';
import { useMemo } from 'react';

interface CourseCardProps {
  theme: Course;
  onSelect: (id: string) => void;
}

export function CourseCard({ theme, onSelect }: CourseCardProps) {
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
        </CardHeader>

        {/* Footer */}
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4 mr-1" />
            {theme.lesson_count} bài học
          </div>
          {/* <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            {theme.userCount.toLocaleString()}
          </div> */}
        </CardFooter>
      </Card>
    </div>
  );
}
