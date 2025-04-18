import { MainNav } from "@/components/header/main-nav"
import { UserNav } from "@/components/header/user-nav"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { Inter } from "next/font/google"
import type React from "react"
import { Suspense } from "react"
import "../globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Suspense fallback={<div>Loading...</div>}>

    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <div className="flex min-h-screen flex-col ">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
            <MainNav />
            <div className="ml-auto flex items-center space-x-4">
              <UserNav />
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </ThemeProvider>
    </Suspense>
  )
}

