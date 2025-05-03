import { useState } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, AlertTriangle, Lock } from "lucide-react"
import authService from "@/services/auth-service"

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

export function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  // Form validation
  const [passwordError, setPasswordError] = useState({
    current: "",
    new: "",
    confirm: ""
  })
  
  const validateForm = (): boolean => {
    let isValid = true
    const newErrors = {
      current: "",
      new: "",
      confirm: ""
    }
    
    // Validate current password
    if (!currentPassword) {
      newErrors.current = "Vui lòng nhập mật khẩu hiện tại"
      isValid = false
    }
    
    // Validate new password
    if (!newPassword) {
      newErrors.new = "Vui lòng nhập mật khẩu mới"
      isValid = false
    } else if (newPassword.length < 8) {
      newErrors.new = "Mật khẩu mới phải có ít nhất 8 ký tự"
      isValid = false
    }
    
    // Validate confirm password
    if (!confirmPassword) {
      newErrors.confirm = "Vui lòng xác nhận mật khẩu mới"
      isValid = false
    } else if (confirmPassword !== newPassword) {
      newErrors.confirm = "Mật khẩu xác nhận không khớp"
      isValid = false
    }
    
    setPasswordError(newErrors)
    return isValid
  }
  
  const handleChangePassword = async () => {
    // Clear previous messages
    setErrorMessage(null)
    setSuccessMessage(null)
    
    // Validate form
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    
    try {
      const result = await authService.changePassword(
        currentPassword, 
        newPassword, 
        confirmPassword
      )
      
      if (result.success) {
        setSuccessMessage(result.message)
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        setErrorMessage(result.message)
      }
    } catch (error) {
      setErrorMessage("Đã xảy ra lỗi khi đổi mật khẩu")
      console.error("Password change error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      key="security"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Bảo mật</CardTitle>
          <CardDescription>Quản lý mật khẩu và bảo mật tài khoản</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Hiển thị thông báo thành công hoặc lỗi */}
          {successMessage && (
            <Alert className="bg-green-50 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Thành công</AlertTitle>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}
          
          {errorMessage && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Lỗi</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          
          <motion.div 
            className="space-y-4"
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
          >
            <motion.h3 className="text-lg font-medium" variants={cardAnimation}>Đổi mật khẩu</motion.h3>
            <div className="grid gap-4">
              <motion.div className="space-y-2" variants={cardAnimation}>
                <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                <Input 
                  id="current-password" 
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                {passwordError.current && (
                  <p className="text-sm text-red-500">{passwordError.current}</p>
                )}
              </motion.div>
              <motion.div className="space-y-2" variants={cardAnimation}>
                <Label htmlFor="new-password">Mật khẩu mới</Label>
                <Input 
                  id="new-password" 
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                {passwordError.new && (
                  <p className="text-sm text-red-500">{passwordError.new}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Mật khẩu phải có ít nhất 8 ký tự và nên kết hợp chữ, số và ký tự đặc biệt.
                </p>
              </motion.div>
              <motion.div className="space-y-2" variants={cardAnimation}>
                <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                <Input 
                  id="confirm-password" 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {passwordError.confirm && (
                  <p className="text-sm text-red-500">{passwordError.confirm}</p>
                )}
              </motion.div>
              <motion.div variants={cardAnimation} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  className="w-full sm:w-auto"
                  onClick={handleChangePassword}
                  disabled={isLoading}
                >
                  {isLoading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
                </Button>
              </motion.div>
            </div>
          </motion.div>
          
          <Separator />
          
          <motion.div 
            className="space-y-4"
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <motion.h3 className="text-lg font-medium" variants={cardAnimation}>Xác thực hai yếu tố</motion.h3>
            <motion.div className="flex items-center justify-between" variants={cardAnimation}>
              <div className="space-y-0.5">
                <div className="font-medium">Xác thực hai yếu tố</div>
                <div className="text-sm text-muted-foreground">
                  Thêm một lớp bảo mật cho tài khoản của bạn
                </div>
              </div>
              <Switch />
            </motion.div>
          </motion.div>
          
          <Separator />
          
          <motion.div 
            className="space-y-4"
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <motion.h3 className="text-lg font-medium" variants={cardAnimation}>Phiên đăng nhập</motion.h3>
            <div className="space-y-4">
              <motion.div className="flex items-start justify-between" variants={cardAnimation}>
                <div className="space-y-0.5">
                  <div className="font-medium">Chrome trên Windows</div>
                  <div className="text-xs text-muted-foreground">
                    Hà Nội, Việt Nam • Hiện tại
                  </div>
                </div>
                <Badge>Hiện tại</Badge>
              </motion.div>
              <motion.div className="flex items-start justify-between" variants={cardAnimation}>
                <div className="space-y-0.5">
                  <div className="font-medium">Safari trên iPhone</div>
                  <div className="text-xs text-muted-foreground">
                    Hà Nội, Việt Nam • 2 giờ trước
                  </div>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm">Đăng xuất</Button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
