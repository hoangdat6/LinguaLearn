"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Mail, UserCheck, XCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface RecentUsersProps {
  type: "new" | "active"
}

const newUsers = [
  {
    id: "u_7",
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    avatar: "/placeholder.svg",
    joinedDate: "2023-04-15",
    status: "pending",
  },
  {
    id: "u_8",
    name: "Trần Thị B",
    email: "tranthib@example.com",
    avatar: "/placeholder.svg",
    joinedDate: "2023-04-14",
    status: "pending",
  },
  {
    id: "u_9",
    name: "Lê Văn C",
    email: "levanc@example.com",
    avatar: "/placeholder.svg",
    joinedDate: "2023-04-13",
    status: "approved",
  },
  {
    id: "u_10",
    name: "Phạm Thị D",
    email: "phamthid@example.com",
    avatar: "/placeholder.svg",
    joinedDate: "2023-04-12",
    status: "pending",
  },
  {
    id: "u_11",
    name: "Hoàng Văn E",
    email: "hoangvane@example.com",
    avatar: "/placeholder.svg",
    joinedDate: "2023-04-11",
    status: "approved",
  },
]

const activeUsers = [
  {
    id: "u_1",
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    avatar: "/placeholder.svg",
    lastActive: "5 phút trước",
    completedLessons: 45,
  },
  {
    id: "u_2",
    name: "Trần Thị B",
    email: "tranthib@example.com",
    avatar: "/placeholder.svg",
    lastActive: "15 phút trước",
    completedLessons: 32,
  },
  {
    id: "u_3",
    name: "Lê Văn C",
    email: "levanc@example.com",
    avatar: "/placeholder.svg",
    lastActive: "30 phút trước",
    completedLessons: 28,
  },
  {
    id: "u_4",
    name: "Phạm Thị D",
    email: "phamthid@example.com",
    avatar: "/placeholder.svg",
    lastActive: "1 giờ trước",
    completedLessons: 56,
  },
  {
    id: "u_5",
    name: "Hoàng Văn E",
    email: "hoangvane@example.com",
    avatar: "/placeholder.svg",
    lastActive: "2 giờ trước",
    completedLessons: 38,
  },
]

export function RecentUsers({ type }: RecentUsersProps) {
  const renderNewUsers = () => (
    <div className="space-y-3">
      {newUsers.map((user) => (
        <div key={user.id} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground">
                Đăng ký: {new Date(user.joinedDate).toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {user.status === "pending" ? (
              <>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-green-500">
                  <UserCheck className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                  <XCircle className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                Đã duyệt
              </Badge>
            )}
          </div>
        </div>
      ))}
    </div>
  )

  const renderActiveUsers = () => (
    <div className="space-y-3">
      {activeUsers.map((user) => (
        <div key={user.id} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.lastActive}</p>
              <p className="text-xs text-muted-foreground">{user.completedLessons} bài học đã hoàn thành</p>
            </div>
          </div>
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Thao tác</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Mail className="mr-2 h-4 w-4" />
                  <span>Gửi thông báo</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <UserCheck className="mr-2 h-4 w-4" />
                  <span>Xem hồ sơ</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  )

  return type === "new" ? renderNewUsers() : renderActiveUsers()
}

