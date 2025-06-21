import { motion } from "framer-motion"
import { Award, BookOpen, CheckCircle2, AlertCircle, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { User } from "../../../../hooks/use-account"

interface LearningProgressProps {
  user: User
}

const cardAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.3
    } 
  }
}

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1
    } 
  }
}

export function LearningProgress({ user }: LearningProgressProps) {
  return (
    <motion.div
      key="progress"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Tiến độ học tập</CardTitle>
          <CardDescription>Theo dõi quá trình học tập của bạn</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={cardAnimation} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <Award className="h-8 w-8 text-amber-500 mb-2" />
                    <h3 className="text-2xl font-bold">{user.streak}</h3>
                    <p className="text-sm text-muted-foreground">Chuỗi ngày học liên tiếp</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={cardAnimation} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <BookOpen className="h-8 w-8 text-blue-500 mb-2" />
                    <h3 className="text-2xl font-bold">{user.completedLessons}/{user.totalLessons}</h3>
                    <p className="text-sm text-muted-foreground">Bài học đã hoàn thành</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={cardAnimation} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <Clock className="h-8 w-8 text-purple-500 mb-2" />
                    <h3 className="text-2xl font-bold">{user.learningTime}</h3>
                    <p className="text-sm text-muted-foreground">Thời gian học trung bình</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="space-y-4"
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <motion.h3 className="text-lg font-medium" variants={cardAnimation}>Tiến độ theo chủ đề</motion.h3>
            <div className="space-y-4">
              <motion.div variants={cardAnimation} whileHover={{ scale: 1.02 }}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Giao tiếp cơ bản</span>
                  <span className="text-sm text-muted-foreground">100%</span>
                </div>
                <Progress value={100} className="h-2" />
              </motion.div>
              <motion.div variants={cardAnimation} whileHover={{ scale: 1.02 }}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Du lịch</span>
                  <span className="text-sm text-muted-foreground">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </motion.div>
              <motion.div variants={cardAnimation} whileHover={{ scale: 1.02 }}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Công sở</span>
                  <span className="text-sm text-muted-foreground">65%</span>
                </div>
                <Progress value={65} className="h-2" />
              </motion.div>
              <motion.div variants={cardAnimation} whileHover={{ scale: 1.02 }}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Công nghệ</span>
                  <span className="text-sm text-muted-foreground">45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </motion.div>
              <motion.div variants={cardAnimation} whileHover={{ scale: 1.02 }}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Y tế</span>
                  <span className="text-sm text-muted-foreground">20%</span>
                </div>
                <Progress value={20} className="h-2" />
              </motion.div>
            </div>
          </motion.div>
          
          <Separator />
          
          <motion.div 
            className="space-y-4"
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <motion.h3 className="text-lg font-medium" variants={cardAnimation}>Thành tích</motion.h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div variants={cardAnimation} whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)" }}>
                <div className="border rounded-lg p-4 text-center">
                  <CheckCircle2 className="h-8 w-8 mx-auto text-green-500 mb-2" />
                  <h4 className="font-medium">Chuỗi 7 ngày</h4>
                  <p className="text-xs text-muted-foreground">Học 7 ngày liên tiếp</p>
                </div>
              </motion.div>
              <motion.div variants={cardAnimation} whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)" }}>
                <div className="border rounded-lg p-4 text-center">
                  <CheckCircle2 className="h-8 w-8 mx-auto text-green-500 mb-2" />
                  <h4 className="font-medium">Chuỗi 30 ngày</h4>
                  <p className="text-xs text-muted-foreground">Học 30 ngày liên tiếp</p>
                </div>
              </motion.div>
              <motion.div variants={cardAnimation} whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)" }}>
                <div className="border rounded-lg p-4 text-center">
                  <CheckCircle2 className="h-8 w-8 mx-auto text-green-500 mb-2" />
                  <h4 className="font-medium">Hoàn thành 50 bài</h4>
                  <p className="text-xs text-muted-foreground">Hoàn thành 50 bài học</p>
                </div>
              </motion.div>
              <motion.div variants={cardAnimation} whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)" }}>
                <div className="border rounded-lg p-4 text-center opacity-50">
                  <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <h4 className="font-medium">Hoàn thành 100 bài</h4>
                  <p className="text-xs text-muted-foreground">Hoàn thành 100 bài học</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          <Separator />
          
          <motion.div 
            className="space-y-4"
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
          >
            <motion.h3 className="text-lg font-medium" variants={cardAnimation}>Lịch sử học tập</motion.h3>
            <motion.div className="rounded-lg border" variants={cardAnimation}>
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Giao tiếp trong công sở</h4>
                    <p className="text-xs text-muted-foreground">Hoàn thành: 18/04/2023</p>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Hoàn thành</Badge>
                </div>
              </div>
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Đặt phòng khách sạn</h4>
                    <p className="text-xs text-muted-foreground">Hoàn thành: 15/04/2023</p>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Hoàn thành</Badge>
                </div>
              </div>
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Gọi món ăn</h4>
                    <p className="text-xs text-muted-foreground">Hoàn thành: 12/04/2023</p>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Hoàn thành</Badge>
                </div>
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="outline" className="w-full">Xem tất cả lịch sử</Button>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
