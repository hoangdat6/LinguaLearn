"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { UserPlus, Edit, LogIn, BookOpen, MessageSquare, Trash2, Share, Flag } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ActivityProps {
  id: string
  user: {
    name: string
    avatar: string
  }
  action: string
  target?: string
  time: string
  type: "user" | "lesson" | "login" | "edit" | "delete" | "share" | "report"
}

const activities: ActivityProps[] = [
  {
    id: "a1",
    user: { name: "Nguyễn Văn A", avatar: "/placeholder.svg" },
    action: "đã đăng ký tài khoản",
    time: "5 phút trước",
    type: "user",
  },
  {
    id: "a2",
    user: { name: "Admin", avatar: "/placeholder.svg" },
    action: "đã tạo bài học mới",
    target: "Giao tiếp trong công sở",
    time: "20 phút trước",
    type: "lesson",
  },
  {
    id: "a3",
    user: { name: "Trần Thị B", avatar: "/placeholder.svg" },
    action: "đã đăng nhập",
    time: "1 giờ trước",
    type: "login",
  },
  {
    id: "a4",
    user: { name: "Lê Văn C", avatar: "/placeholder.svg" },
    action: "đã chỉnh sửa bài học",
    target: "Thuyết trình chuyên nghiệp",
    time: "2 giờ trước",
    type: "edit",
  },
  {
    id: "a5",
    user: { name: "Admin", avatar: "/placeholder.svg" },
    action: "đã xóa bài học",
    target: "Luyện phát âm cơ bản",
    time: "3 giờ trước",
    type: "delete",
  },
  {
    id: "a6",
    user: { name: "Phạm Thị D", avatar: "/placeholder.svg" },
    action: "đã báo cáo lỗi",
    target: "Bài tập ngữ pháp",
    time: "5 giờ trước",
    type: "report",
  },
  {
    id: "a7",
    user: { name: "Hoàng Văn E", avatar: "/placeholder.svg" },
    action: "đã chia sẻ bài học",
    target: "Giao tiếp trong du lịch",
    time: "6 giờ trước",
    type: "share",
  },
]

const getIconForActivityType = (type: string) => {
  switch (type) {
    case "user":
      return <UserPlus className="h-4 w-4 text-blue-500" />
    case "lesson":
      return <BookOpen className="h-4 w-4 text-green-500" />
    case "login":
      return <LogIn className="h-4 w-4 text-purple-500" />
    case "edit":
      return <Edit className="h-4 w-4 text-amber-500" />
    case "delete":
      return <Trash2 className="h-4 w-4 text-red-500" />
    case "share":
      return <Share className="h-4 w-4 text-indigo-500" />
    case "report":
      return <Flag className="h-4 w-4 text-orange-500" />
    default:
      return <MessageSquare className="h-4 w-4 text-gray-500" />
  }
}

export function AdminRecentActivity() {
  return (
    <ScrollArea className="h-[350px] pr-4">
      <div className="space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4">
            <Avatar className="h-9 w-9">
              <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
              <AvatarFallback>
                {activity.user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{activity.user.name}</span>
                <span className="text-muted-foreground">{activity.action}</span>
                {activity.target && <span className="font-medium">"{activity.target}"</span>}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                {getIconForActivityType(activity.type)}
                <span className="ml-1">{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

