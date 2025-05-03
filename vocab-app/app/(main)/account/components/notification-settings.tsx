import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

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

export function NotificationSettings() {
  return (
    <motion.div
      key="notifications"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Thông báo</CardTitle>
          <CardDescription>Quản lý cài đặt thông báo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <motion.div 
            className="space-y-4"
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
          >
            <motion.h3 className="text-lg font-medium" variants={cardAnimation}>Thông báo đẩy</motion.h3>
            <div className="space-y-4">
              <motion.div className="flex items-center justify-between" variants={cardAnimation}>
                <div className="space-y-0.5">
                  <div className="font-medium">Nhắc nhở học tập</div>
                  <div className="text-sm text-muted-foreground">
                    Nhận thông báo nhắc nhở học tập hàng ngày
                  </div>
                </div>
                <Switch defaultChecked />
              </motion.div>
              <motion.div className="flex items-center justify-between" variants={cardAnimation}>
                <div className="space-y-0.5">
                  <div className="font-medium">Thành tích</div>
                  <div className="text-sm text-muted-foreground">
                    Nhận thông báo khi đạt được thành tích mới
                  </div>
                </div>
                <Switch defaultChecked />
              </motion.div>
              <motion.div className="flex items-center justify-between" variants={cardAnimation}>
                <div className="space-y-0.5">
                  <div className="font-medium">Bài học mới</div>
                  <div className="text-sm text-muted-foreground">
                    Nhận thông báo khi có bài học mới
                  </div>
                </div>
                <Switch defaultChecked />
              </motion.div>
            </div>
          </motion.div>
          
          <Separator />
          
          <motion.div 
            className="space-y-4"
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <motion.h3 className="text-lg font-medium" variants={cardAnimation}>Thông báo email</motion.h3>
            <div className="space-y-4">
              <motion.div className="flex items-center justify-between" variants={cardAnimation}>
                <div className="space-y-0.5">
                  <div className="font-medium">Bản tin hàng tuần</div>
                  <div className="text-sm text-muted-foreground">
                    Nhận bản tin hàng tuần về tiến độ học tập
                  </div>
                </div>
                <Switch defaultChecked />
              </motion.div>
              <motion.div className="flex items-center justify-between" variants={cardAnimation}>
                <div className="space-y-0.5">
                  <div className="font-medium">Khuyến mãi</div>
                  <div className="text-sm text-muted-foreground">
                    Nhận thông tin về khuyến mãi và ưu đãi
                  </div>
                </div>
                <Switch />
              </motion.div>
              <motion.div className="flex items-center justify-between" variants={cardAnimation}>
                <div className="space-y-0.5">
                  <div className="font-medium">Cập nhật hệ thống</div>
                  <div className="text-sm text-muted-foreground">
                    Nhận thông báo về các cập nhật hệ thống
                  </div>
                </div>
                <Switch defaultChecked />
              </motion.div>
            </div>
          </motion.div>
        </CardContent>
        <CardFooter>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button>Lưu thay đổi</Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
