import { motion } from "framer-motion"
import { CheckCircle2, CreditCard } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { User } from "../../../../hooks/use-account"

interface BillingInfoProps {
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

export function BillingInfo({ user }: BillingInfoProps) {
  return (
    <motion.div
      key="billing"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Thanh toán</CardTitle>
          <CardDescription>Quản lý thông tin thanh toán và gói dịch vụ</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <motion.div 
            className="space-y-4"
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
          >
            <motion.h3 className="text-lg font-medium" variants={cardAnimation}>Gói hiện tại</motion.h3>
            <motion.div className="rounded-lg border p-4" variants={cardAnimation}>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">{user.subscription}</h4>
                  <p className="text-sm text-muted-foreground">Hết hạn: {user.subscriptionExpiry}</p>
                </div>
                <Badge variant="secondary">Đang hoạt động</Badge>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Truy cập tất cả bài học</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Không giới hạn bài tập</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Tải xuống tài liệu</span>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline">Nâng cấp gói</Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950">Hủy gói</Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
          
          <Separator />
          
          <motion.div 
            className="space-y-4"
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <motion.h3 className="text-lg font-medium" variants={cardAnimation}>Phương thức thanh toán</motion.h3>
            <motion.div className="rounded-lg border p-4" variants={cardAnimation}>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center mr-3">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">{user.paymentMethod}</h4>
                    <p className="text-xs text-muted-foreground">Hết hạn: 12/2025</p>
                  </div>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm">Chỉnh sửa</Button>
                </motion.div>
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline">Thêm phương thức thanh toán</Button>
            </motion.div>
          </motion.div>
          
          <Separator />
          
          <motion.div 
            className="space-y-4"
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
          >
            <motion.h3 className="text-lg font-medium" variants={cardAnimation}>Lịch sử thanh toán</motion.h3>
            <motion.div className="rounded-lg border" variants={cardAnimation}>
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Gia hạn Premium</h4>
                    <p className="text-xs text-muted-foreground">15/01/2023</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">599.000 VNĐ</p>
                    <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Thành công</Badge>
                  </div>
                </div>
              </div>
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Đăng ký Premium</h4>
                    <p className="text-xs text-muted-foreground">15/07/2022</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">599.000 VNĐ</p>
                    <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Thành công</Badge>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
