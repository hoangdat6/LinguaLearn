"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ACCOUNT_NAV_LINKS } from "@/constants/routers";
import { Bell, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { StreakCounter } from "../homepage/streak-counter";
import { Owl2 } from "../owl2";
import { ThemeToggle } from "../theme/theme-toggle";


export function UserNav({ user, onLogout }: {
  user: User | null, onLogout: () => void
}) {
  const router = useRouter();


  return (
    <div className="flex items-center gap-3 md:gap-4">
      <ThemeToggle />

      {user ? (
        <>
          <div className="hidden md:flex items-center gap-3">
            <StreakCounter days={user?.streak || 0} />
          </div>

          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5 text-gray-500" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-full p-0 h-10 w-10">
                <Avatar className="h-10 w-10 border-duolingo-green">
                  {
                    user.avatar != null ? (
                      <AvatarImage src={user.avatar} alt="User" />
                    ) : (
                      <Owl2 className="h-10 w-10" />
                    )
                  }
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {/* chào người dùng */}
              <DropdownMenuLabel className="font-bold text-sm">
                Chào mừng, {user.username}!
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {[...ACCOUNT_NAV_LINKS].map((item, index) => (
                <DropdownMenuItem className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <a href={item.href}>{item.name}</a>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2 text-duolingo-red cursor-pointer" onClick={onLogout}>
                <LogOut className="h-4 w-4" />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        // Nếu chưa đăng nhập
        <Button onClick={() => router.push("/auth")} className="bg-duolingo-green text-white px-4 py-2 rounded-lg">
          Đăng nhập
        </Button>
      )}
    </div>
  );
}
