import { Book, BookOpen, Dumbbell, Edit, HelpCircle, Home, Settings, Users } from "lucide-react";
/**
 * Các đường dẫn cho App Router trong ứng dụng
 * Sử dụng các hàm để tạo đường dẫn động khi cần
 */

// Auth routes
export const AUTH_ROUTES = {
  LOGIN: '/auth',
  REGISTER: '/auth?tab=register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: (token: string) => `/auth/reset-password/${token}`,
};

export const HEADER_NAV_LINKS = [
  { name: "Trang chủ", href: "/", icon: Home },
  { name: "Học", href: "/lessons", icon: BookOpen },
  { name: "Ôn tập", href: "/review", icon: Dumbbell },
  { name: "Từ điển", href: "/dictionary", icon: Book },
  { name: "Luyện viết", href: "/writing", icon: Edit },
]

export const ACCOUNT_NAV_LINKS = [
  { name: "Tài khoản", href: "/account", icon: Users },
  { name: "Cài đặt", href: "/settings", icon: Settings },
  { name: "Trợ giúp", href: "/help", icon: HelpCircle },
]
