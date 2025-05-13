import { ThemeProvider } from "@/components/theme/theme-provider"
import { Inter } from "next/font/google"
import type React from "react"
import "../globals.css"
import Header from "@/components/header"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Suspense >
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        <div className="flex min-h-screen flex-col ">
          <Header />
          <main className="flex-1">{children}</main>
        </div>
      </ThemeProvider>
    </Suspense>
  )
}

