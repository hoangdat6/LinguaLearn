import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Save, Trash2, Upload } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { User } from "../hooks/use-account"

interface UserProfileProps {
  user: User
  isEditing: boolean
  setIsEditing: (value: boolean) => void
  handleSaveProfile: (formData: Partial<User>) => void
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

export function UserProfile({ user, isEditing, setIsEditing, handleSaveProfile }: UserProfileProps) {
  // State to track form field values
  const [formData, setFormData] = useState<Partial<User>>({
    name: user.name,
    email: user.email,
    phone: user.phone,
    birthday: user.birthday,
    address: user.address,
    language: user.language,
    bio: user.bio
  });

  // Update form data when user prop changes
  useEffect(() => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      birthday: user.birthday,
      address: user.address,
      language: user.language,
      bio: user.bio
    });
  }, [user]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // Handle language select change
  const handleLanguageChange = (value: string) => {
    setFormData(prev => ({ ...prev, language: value }));
  };

  // Handle form submission
  const onSave = () => {
    // Format birthday to YYYY-MM-DD
    const formattedData = { ...formData };
    
    // Check if birthday is valid and format it correctly
    if (formData.birthday) {
      try {
        // Make sure it's in YYYY-MM-DD format
        const dateObj = new Date(formData.birthday);
        if (!isNaN(dateObj.getTime())) {
          const year = dateObj.getFullYear();
          const month = String(dateObj.getMonth() + 1).padStart(2, '0');
          const day = String(dateObj.getDate()).padStart(2, '0');
          formattedData.birthday = `${year}-${month}-${day}`;
        }
      } catch (error) {
        console.error("Invalid date format:", error);
        alert("Birthday date format is invalid. Please use YYYY-MM-DD format.");
        return;
      }
    }
    
    handleSaveProfile(formattedData);
  };

  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Thông tin cá nhân</CardTitle>
              <CardDescription>Quản lý thông tin cá nhân của bạn</CardDescription>
            </div>
            {isEditing ? (
              <div className="flex space-x-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Hủy</Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button onClick={onSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Lưu thay đổi
                  </Button>
                </motion.div>
              </div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={() => setIsEditing(true)}>Chỉnh sửa</Button>
              </motion.div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <motion.div 
            className="space-y-4"
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div className="space-y-2" variants={cardAnimation}>
                <Label htmlFor="name">Họ và tên</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={handleChange}
                  readOnly={!isEditing} 
                />
              </motion.div>
              <motion.div className="space-y-2" variants={cardAnimation}>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  value={formData.email} 
                  onChange={handleChange}
                  readOnly={!isEditing} 
                />
              </motion.div>
              <motion.div className="space-y-2" variants={cardAnimation}>
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input 
                  id="phone" 
                  value={formData.phone} 
                  onChange={handleChange}
                  readOnly={!isEditing} 
                />
              </motion.div>
              <motion.div className="space-y-2" variants={cardAnimation}>
                <Label htmlFor="birthday">Ngày sinh</Label>
                <Input 
                  id="birthday" 
                  type="date" 
                  value={formData.birthday || ''} 
                  onChange={handleChange}
                  readOnly={!isEditing} 
                  placeholder="YYYY-MM-DD"
                  max={new Date().toISOString().split('T')[0]} // Prevents future dates
                />
                {isEditing && (
                  <p className="text-xs text-muted-foreground">
                    Format: YYYY-MM-DD (năm-tháng-ngày)
                  </p>
                )}
              </motion.div>
              <motion.div className="space-y-2" variants={cardAnimation}>
                <Label htmlFor="address">Địa chỉ</Label>
                <Input 
                  id="address" 
                  value={formData.address} 
                  onChange={handleChange}
                  readOnly={!isEditing} 
                />
              </motion.div>
              <motion.div className="space-y-2" variants={cardAnimation}>
                <Label htmlFor="language">Ngôn ngữ</Label>
                {isEditing ? (
                  <Select 
                    value={formData.language} 
                    onValueChange={handleLanguageChange}
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Chọn ngôn ngữ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tiếng Việt">Tiếng Việt</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Français">Français</SelectItem>
                      <SelectItem value="Español">Español</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input id="language" value={formData.language} readOnly />
                )}
              </motion.div>
            </div>
            <motion.div className="space-y-2" variants={cardAnimation}>
              <Label htmlFor="bio">Giới thiệu</Label>
              <Textarea 
                id="bio" 
                value={formData.bio} 
                onChange={handleChange}
                readOnly={!isEditing} 
                rows={4} 
              />
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
            <motion.h3 className="text-lg font-medium" variants={cardAnimation}>Ảnh đại diện</motion.h3>
            <div className="flex items-center space-x-4">
              <motion.div variants={cardAnimation} whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 300, damping: 10 }}>
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                </Avatar>
              </motion.div>
              <div className="space-y-2">
                {isEditing && (
                  <motion.div variants={cardAnimation} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Tải ảnh lên
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      JPG, GIF hoặc PNG. Kích thước tối đa 1MB.
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <p className="text-sm text-muted-foreground">
            Tham gia từ: {user.joinedDate}
          </p>
          {isEditing && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa tài khoản
              </Button>
            </motion.div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}
