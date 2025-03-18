"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Owl } from "@/components/owl"
import { Home, BookOpen, Dumbbell, Book, Edit } from "lucide-react"

const navItems = [
  { name: "Trang chủ", href: "/", icon: Home },
  { name: "Học", href: "/lessons", icon: BookOpen },
  { name: "Ôn tập", href: "/review", icon: Dumbbell },
  // { name: "Cửa hàng", href: "/shop", icon: ShoppingBag },
  { name: "Từ điển", href: "/dictionary", icon: Book },
  { name: "Luyện viết", href: "/writing", icon: Edit },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="flex items-center space-x-4 lg:space-x-6">
      <Link href="/" className="flex items-center space-x-2">
        <Owl className="h-8 w-8" />
        <span className="font-bold hidden sm:inline-block">LinguaLearn</span>
      </Link>
      <nav className="flex items-center space-x-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent",
              pathname === item.href ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <item.icon className="w-4 h-4 mr-2" />
            <span className="hidden lg:inline">{item.name}</span>
            {pathname === item.href && (
              <motion.div className="absolute bottom-0 left-0 h-1 w-full bg-primary" layoutId="navbar-indicator" />
            )}
          </Link>
        ))}
      </nav>
    </div>
  )
}

