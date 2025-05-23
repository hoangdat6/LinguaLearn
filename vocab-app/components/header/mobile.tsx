import { ACCOUNT_NAV_LINKS, HEADER_NAV_LINKS } from "@/constants/routes";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Owl } from "../owl";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import authService from "@/services/auth-service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";


const MobileSidebar = ({ pathname }: { pathname: string }) => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

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
        <div className="h-full flex flex-col py-6 pr-6 ">
            <div className="mb-8 flex items-center">
                <Link href="/" className="flex items-center gap-2">
                    <Owl className="h-8 w-8" />
                    <span className="font-bold text-lg font-space-grotesk">LinguaLearn</span>
                </Link>
            </div>
            <div className="border-t border-muted" />

            <nav className="flex-1">
                <div className="space-y-1">
                    {[...HEADER_NAV_LINKS].map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-3 text-base font-medium rounded-lg transition-colors hover:bg-muted",
                                ((item.href !== "/" && pathname?.startsWith(item.href)) || pathname === item.href)
                                    ? "bg-muted text-foreground"
                                    : "text-muted-foreground hover:text-foreground",
                            )}
                        >
                            <item.icon className="text-xl" aria-hidden="true" />
                            <span className="font-space-grotesk">{item.name}</span>
                        </Link>
                    ))}
                </div>
                <div className="border-t border-muted my-4" />
                <div className="mt-8">
                    <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">More</h3>
                    <div className="space-y-1">
                        {[...ACCOUNT_NAV_LINKS].map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-3 text-base font-medium rounded-lg transition-colors hover:bg-muted",
                                    ((item.href !== "/" && pathname?.startsWith(item.href)) || pathname === item.href)
                                        ? "bg-muted text-foreground"
                                        : "text-muted-foreground hover:text-foreground",
                                )}>
                                <item.icon className="text-xl" aria-hidden="true" />
                                <span className="font-space-grotesk">{item.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>

            <div className="mt-auto pt-6 border-t">
                {user ? (
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <Avatar className="h-10 w-10 border-2 border-duolingo-green">
                                <AvatarImage src={user.image || "/placeholder.svg?height=40&width=40"} alt="User" />
                                <AvatarFallback className="bg-duolingo-green text-white">
                                    {user.name?.charAt(0).toUpperCase() || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-bold text-sm">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                        </div>
                        <Button
                            variant="destructive"
                            className="w-full flex items-center gap-2 justify-center"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Đăng xuất</span>
                        </Button>
                    </div>
                ) : (
                    <div>
                        <Button
                            className="w-full bg-duolingo-green text-white"
                            onClick={() => router.push("/auth")}
                        >
                            Đăng nhập
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MobileSidebar;