import { Book, BookOpen, Dumbbell, Edit, HelpCircle, Home, Settings, Users } from "lucide-react";

export const HEADER_NAV_LINKS = [
  { name: "Trang chủ", href: "/", icon: Home },
  { name: "Học", href: "/lessons", icon: BookOpen },
  { name: "Ôn tập", href: "/review", icon: Dumbbell },
  // { name: "Cửa hàng", href: "/shop", icon: ShoppingBag },
  { name: "Từ điển", href: "/dictionary", icon: Book },
  { name: "Luyện viết", href: "/writing", icon: Edit },
]

export const ACCOUNT_NAV_LINKS = [
  { name: "Tài khoản", href: "/account", icon: Users },
  { name: "Cài đặt", href: "/settings", icon: Settings },
  { name: "Trợ giúp", href: "/help", icon: HelpCircle },
]

export const FOOTER_NAV_LINKS = [
  { href: '/blog', title: 'Blog' },
  { href: '/snippets', title: 'Snippets' },
  { href: '/projects', title: 'Projects' },
  { href: '/tags', title: 'Tags' },
  { href: '/feed.xml', title: 'RSS Feed' },
]

