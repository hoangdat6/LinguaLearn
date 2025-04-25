"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import authService from "@/services/auth-service";
import { ACCESS_TOKEN_KEY, IS_PROFILE_CHANGED_KEY, USER_KEY } from "@/types/status";
import { Bell, Diamond, FlameIcon, Heart, HelpCircle, LogOut, Settings, Users } from "lucide-react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "../theme/theme-toggle";
import { Session } from "next-auth";
import { ACCOUNT_NAV_LINKS } from "@/data/navigation";


export function UserNav() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null); // Xác định kiểu dữ liệu cụ thể

  useEffect(() => {
    const fetchUser = async () => {
      const session: Session | null = await getSession();
      // Kiểm tra xem người dùng đã đăng nhập hay chưa
      if (!session || !session.accessToken) 
        return;

      // Nếu đã đăng nhập, gọi API để lấy thông tin người dùng
      const userData = localStorage.getItem(USER_KEY);
      const isProfileChanged = localStorage.getItem(IS_PROFILE_CHANGED_KEY);

      if (!userData && (!session || !session.user)) {
        // lấy ở seession
        const userFromSession = session.user;
        setUser(userFromSession);
        return;
      }

      if (isProfileChanged !== "true" && userData && userData !== "null") {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        return;
      }
      // Nếu có thay đổi thì gọi API để lấy thông tin người dùng
      try {
        const currentUser: User | null = await authService.getUser(); // API này phải trả về kiểu User hoặc null
        setUser(currentUser);
        // Lưu thông tin người dùng vào local storage
        localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
        // Reset trạng thái thay đổi profile
        localStorage.setItem(IS_PROFILE_CHANGED_KEY, "false");
      } catch (error) {
        router.replace("/auth");
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
      router.replace("/auth");
    } catch (error) {
      console.error("Đăng xuất thất bại:", error);
    }
  };

  return (
    <div className="flex items-center gap-3 md:gap-4">
      <ThemeToggle />

      {user ? (
        // Nếu đã đăng nhập
        <>
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1 text-sm font-bold">
              <FlameIcon className="h-5 w-5 duolingo-orange" />
              <span>7</span>
            </div>
            <div className="flex items-center gap-1 text-sm font-bold">
              <Heart className="h-5 w-5 duolingo-red" fill="currentColor" />
              <span>5</span>
            </div>
            <div className="flex items-center gap-1 text-sm font-bold">
              <Diamond className="h-5 w-5 duolingo-blue" fill="currentColor" />
              <span>345</span>
            </div>
          </div>

          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5 text-gray-500" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-full p-0 h-10 w-10">
                <Avatar className="h-10 w-10 border-2 border-duolingo-green">
                  <AvatarImage src={user.avatar || "/placeholder.svg?height=40&width=40"} alt="User" />
                  <AvatarFallback className="bg-duolingo-green text-white">
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
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
              <DropdownMenuItem className="flex items-center gap-2 text-duolingo-red cursor-pointer" onClick={handleLogout}>
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
