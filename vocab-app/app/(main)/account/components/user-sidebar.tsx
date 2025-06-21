import { motion } from "framer-motion"
import { LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { User } from "../../../../hooks/use-account"

interface UserSidebarProps {
  user: User
  handleLogout: () => void
}

const cardAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5, 
      ease: "easeOut" 
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

export function UserSidebar({ user, handleLogout }: UserSidebarProps) {
  return (
    <>
      <Card>
        <CardContent className="p-6">
          <motion.div 
            className="flex flex-col items-center space-y-4"
            variants={staggerChildren}
          >
            <motion.div variants={cardAnimation}>
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
              </Avatar>
            </motion.div>
            <motion.div className="text-center" variants={cardAnimation}>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Badge className="mt-2" variant="outline">{user.level}</Badge>
            </motion.div>
            <motion.div className="w-full" variants={cardAnimation}>
              <div className="flex justify-between text-sm mb-1">
                <span>Tiến độ học tập</span>
                <span className="font-medium">{user.totalLessons ? Math.round((user.completedLessons / user.totalLessons) * 100) : 0}%</span>
              </div>
              <Progress value={user.totalLessons ? (user.completedLessons / user.totalLessons) * 100 : 0} className="h-2" />
            </motion.div>
            <motion.div className="grid grid-cols-2 gap-4 w-full text-center" variants={cardAnimation}>
              <div className="flex flex-col">
                <span className="text-2xl font-bold">{user.streak}</span>
                <span className="text-xs text-muted-foreground">Chuỗi ngày</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold">{user.completedLessons}</span>
                <span className="text-xs text-muted-foreground">Bài học</span>
              </div>
            </motion.div>
            <motion.div variants={cardAnimation} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="destructive" className="w-full" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Đăng xuất
              </Button>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
      
      <motion.div variants={cardAnimation} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="mt-4">
          <CardHeader className="pb-3">
            <CardTitle>Thông tin gói</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Gói hiện tại:</span>
                <Badge variant="secondary">{user.subscription}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Hết hạn:</span>
                <span className="text-sm font-medium">{user.subscriptionExpiry}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Phương thức thanh toán:</span>
                <span className="text-sm font-medium">{user.paymentMethod}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full">
              <Button variant="outline" size="sm" className="w-full">
                Nâng cấp gói
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </>
  )
}
