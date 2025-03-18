"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  BookOpen,
  MessageSquare,
  Settings,
  FileText,
  BarChart,
  PencilRuler,
  Globe,
  HelpCircle,
  Puzzle,
  LogOut,
} from "lucide-react"
import { Owl } from "@/components/owl"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Define menu items
const menuItems = [
  {
    title: "Tổng quan",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Người dùng",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Nội dung",
    icon: BookOpen,
    items: [
      {
        title: "Quản lý bài học",
        href: "/admin/lessons",
        icon: BookOpen,
      },
      {
        title: "Quản lý chủ đề",
        href: "/admin/topics",
        icon: Puzzle,
      },
      {
        title: "Từ vựng",
        href: "/admin/vocabulary",
        icon: MessageSquare,
      },
    ],
  },
  {
    title: "Báo cáo",
    icon: BarChart,
    items: [
      {
        title: "Thống kê người dùng",
        href: "/admin/reports/users",
        icon: Users,
      },
      {
        title: "Thống kê bài học",
        href: "/admin/reports/lessons",
        icon: BarChart,
      },
    ],
  },
  {
    title: "Thiết kế",
    href: "/admin/design",
    icon: PencilRuler,
  },
  {
    title: "Quản lý trang",
    href: "/admin/pages",
    icon: FileText,
  },
  {
    title: "Ngôn ngữ",
    href: "/admin/languages",
    icon: Globe,
  },
  {
    title: "Cài đặt",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden lg:flex h-screen w-64 flex-col border-r bg-card">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/admin" className="flex items-center space-x-2">
          <Owl className="h-6 w-6" />
          <span className="font-bold">Admin</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm">
          {menuItems.map((item, index) => {
            // Check if the menu item has sub-items
            if (item.items) {
              const isActive = item.items.some((subItem) => pathname === subItem.href)

              return (
                <Accordion key={index} type="single" collapsible defaultValue={isActive ? `item-${index}` : undefined}>
                  <AccordionItem value={`item-${index}`} className="border-none">
                    <AccordionTrigger
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent transition-all",
                        isActive && "text-primary",
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-1 pb-2 pl-12">
                      <div className="flex flex-col space-y-1">
                        {item.items.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            href={subItem.href}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent transition-all",
                              pathname === subItem.href && "bg-accent text-accent-foreground",
                            )}
                          >
                            <subItem.icon className="h-4 w-4" />
                            <span>{subItem.title}</span>
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )
            }

            // Regular menu item without sub-items
            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent transition-all",
                  pathname === item.href && "bg-accent text-accent-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="grid grid-cols-1 gap-2 p-4 border-t">
        <Button variant="outline" size="sm" className="justify-start">
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Trợ giúp</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="justify-start text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Đăng xuất</span>
        </Button>
      </div>
    </div>
  )
}

