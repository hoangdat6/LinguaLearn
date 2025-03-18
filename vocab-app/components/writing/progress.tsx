"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart, TrendingUp, Award, Calendar, CheckCircle, Clock } from 'lucide-react'
import { motion } from "framer-motion"

export function WritingProgress() {
  // Mock data
  const stats = {
    streak: 5,
    wordsWritten: 1240,
    exercisesCompleted: 24,
    averageScore: 82
  }
  
  const recentActivity = [
    { date: "10/03", exercises: 3, words: 120, score: 85 },
    { date: "09/03", exercises: 2, words: 95, score: 78 },
    { date: "08/03", exercises: 4, words: 150, score: 90 },
    { date: "07/03", exercises: 1, words: 60, score: 75 },
    { date: "06/03", exercises: 2, words: 85, score: 82 }
  ]

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-medium flex items-center mb-4">
          <BarChart className="h-5 w-5 mr-2 text-primary" />
          Tiến độ luyện viết
        </h3>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-primary/10 p-3 rounded-lg"
          >
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm">Chuỗi ngày</span>
            </div>
            <div className="text-2xl font-bold">{stats.streak} ngày</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-primary/10 p-3 rounded-lg"
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm">Từ đã viết</span>
            </div>
            <div className="text-2xl font-bold">{stats.wordsWritten}</div>
          </motion.div>
        </div>
        
        <div className="space-y-4 mb-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm flex items-center">
                <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                Bài tập đã hoàn thành
              </span>
              <span className="text-sm font-medium">{stats.exercisesCompleted}</span>
            </div>
            <Progress value={80} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm flex items-center">
                <Award className="h-4 w-4 mr-1 text-amber-500" />
                Điểm trung bình
              </span>
              <span className="text-sm font-medium">{stats.averageScore}%</span>
            </div>
            <Progress value={stats.averageScore} className="h-2" />
          </div>
        </div>
        
        <h4 className="text-sm font-medium mb-2">Hoạt động gần đây</h4>
        <div className="space-y-2">
          {recentActivity.map((day, index) => (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center justify-between text-sm p-2 hover:bg-muted/50 rounded-md transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{day.date}</span>
                <Badge variant="outline" className="text-xs">
                  {day.exercises} bài
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {day.words}
                </span>
                <span className="flex items-center text-xs text-muted-foreground">
                  <Award className="h-3 w-3 mr-1" />
                  {day.score}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}