"use client"
import authService from "@/services/auth-service";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Owl } from "../owl";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { MainNav } from "./main-nav";
import MobileSidebar from "./mobile";
import { UserNav } from "./user-nav";
import { StreakCounter } from "../homepage/streak-counter";

const Header = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null); // Xác định kiểu dữ liệu cụ thể
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  useEffect(() => {
    const fetchUser = async () => {
      // const session = await getSession();
      // if (!session || !session.accessToken)
      //   return;

      // if (session && session.user) {
      //   const userFromSession = session.user as User;
      //   setUser(userFromSession);
      //   return;
      // }

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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setOpen(false)
      }
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container hidden md:flex h-16 items-center px-3 md:px-8">
        <MainNav pathname={pathname} />
        <div className="ml-auto flex items-center space-x-4">
          <UserNav user={user} onLogout={handleLogout} />
        </div>
      </div>
      <div className="container flex h-16 justify-between items-center px-3 md:px-8 md:hidden">
        <Link href="/" className="flex items-center gap-2">
          <Owl className="h-8 w-8" />
          <span className="font-bold text-lg font-space-grotesk">LinguaLearn</span>
        </Link>

        <div className="flex items-center gap-3">
          <StreakCounter days={user?.streak || 0} />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label={open ? "Close menu" : "Open menu"}>
                <Menu className="h-10 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px] pr-0">
              <MobileSidebar pathname={pathname} user={user} onLogout={handleLogout} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default Header;