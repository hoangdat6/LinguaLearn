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
import { ACCOUNT_NAV_LINKS } from "@/constants/routes";
import authService from "@/services/auth-service";
import { Bell, Diamond, FlameIcon, Heart, LogOut } from "lucide-react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Owl2 } from "../owl2";
import { ThemeToggle } from "../theme/theme-toggle";


export function UserNav() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null); // Xác định kiểu dữ liệu cụ thể

  useEffect(() => {
    const fetchUser = async () => {
      const session = await getSession();
      if (!session || !session.accessToken)
        return;
      
      if (session && session.user) {
        const userFromSession = session.user as User;
        setUser(userFromSession);
        return;
      }

      try {
        const currentUser = await authService.getUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Không thể lấy thông tin người dùng:", error);
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
          </div>

          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5 text-gray-500" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-full p-0 h-10 w-10">
                <Avatar className="h-10 w-10 border-duolingo-green">
                  {
                    user.image != null  ? (
                      <AvatarImage src={user.image} alt="User" />
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
                Chào mừng, {user.name}!
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
