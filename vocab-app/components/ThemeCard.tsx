import { Course } from "@/types/lesson-types";
import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users } from 'lucide-react';

interface ThemeCardProps {
  theme: Course;
  onSelect: (id: string) => void;
}

export function ThemeCard({ theme, onSelect }: ThemeCardProps) {
  return (
    <div onClick={() => onSelect(theme.id)} className="cursor-pointer">
      <Card className="h-full overflow-hidden">
        <div className={`h-40 ${theme.backgroundColor} relative overflow-hidden`}>
          <div className="absolute inset-0 flex items-center justify-center text-6xl">
            {theme.icon}
          </div>
        </div>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="max-w-[250px]">
              <h2 className="text-lg font-bold">{theme.title}</h2>
              <p className="text-muted-foreground mt-2 line-clamp-2 ">{theme.description}</p>
            </div>
            <Badge className={`${theme.backgroundColor} ${theme.color}`}>
              {theme.difficulty === "beginner" ? "Cơ bản" : 
               theme.difficulty === "intermediate" ? "Trung cấp" : "Nâng cao"}
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4 mr-1" />
            {theme.lessonsCount} bài học
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            {theme.userCount.toLocaleString()}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}