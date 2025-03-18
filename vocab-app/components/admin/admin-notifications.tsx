"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { UserPlus, BookOpen, MessageSquare, Bell, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface NotificationProps {
  id: string
  title: string
  description: string
  time: string
  read: boolean
  type: "user" | "lesson" | "message" | "system" | "report"
}

const notifications: NotificationProps[] = [
  {
    id: "n1",
    title: "Người dùng mới đăng ký",
    description: "Nguyễn Văn A đã đăng ký tài khoản mới",
    time: "5 phút trước",
    read: false,
    type: "user",
  },
  {
    id: "n2",
    title: "Bài học mới cần xét duyệt",
    description: "Bài học 'Giao tiếp cơ bản' cần được xét duyệt",
    time: "30 phút trước",
    read: false,
    type: "lesson",
  },
  {
    id: "n3",
    title: "Tin nhắn mới",
    description: "Trần Thị B đã gửi phản hồi về bài học",
    time: "2 giờ trước",
    read: true,
    type: "message",
  },
  {
    id: "n4",
    title: "Báo cáo hàng tuần",
    description: "Báo cáo hoạt động hàng tuần đã sẵn sàng",
    time: "1 ngày trước",
    read: true,
    type: "report",
  },
  {
    id: "n5",
    title: "Cập nhật hệ thống",
    description: "Hệ thống sẽ được bảo trì vào cuối tuần",
    time: "2 ngày trước",
    read: true,
    type: "system",
  },
]

const getIconForNotificationType = (type: string) => {
  switch (type) {
    case "user":
      return <UserPlus className="h-5 w-5 text-blue-500" />
    case "lesson":
      return <BookOpen className="h-5 w-5 text-green-500" />
    case "message":
      return <MessageSquare className="h-5 w-5 text-purple-500" />
    case "report":
      return <FileText className="h-5 w-5 text-amber-500" />
    default:
      return <Bell className="h-5 w-5 text-gray-500" />
  }
}

export function AdminNotifications() {
  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-1 p-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={cn(
              "flex items-start space-x-3 rounded-md p-3 transition-colors hover:bg-accent cursor-pointer",
              notification.read ? "" : "bg-accent/40",
            )}
          >
            <div className="flex-shrink-0 rounded-full p-1">{getIconForNotificationType(notification.type)}</div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className={cn("text-sm font-medium", !notification.read && "font-semibold")}>{notification.title}</p>
                <span className="text-xs text-muted-foreground">{notification.time}</span>
              </div>
              <p className="text-sm text-muted-foreground">{notification.description}</p>
            </div>
            {!notification.read && <div className="flex-shrink-0 rounded-full h-2 w-2 bg-primary"></div>}
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center h-20 text-center">
            <p className="text-sm text-muted-foreground">Không có thông báo nào</p>
          </div>
        )}
      </div>
      <div className="p-4 text-center">
        <Button variant="ghost" size="sm" className="w-full">
          Xem tất cả thông báo
        </Button>
      </div>
    </ScrollArea>
  )
}

