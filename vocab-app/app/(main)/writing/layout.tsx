import { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Luyện viết",
  description: "Trang bài học ứng dụng học từ vựng tiếng Anh",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
        <main className="flex-1">{children}</main>
  )
}

