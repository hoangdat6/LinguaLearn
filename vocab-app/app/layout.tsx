import { Inter } from "next/font/google"
import type React from "react"
import { Providers } from "./providers"
import type { Metadata } from 'next'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: 'LinguaLearn - Học từ vựng tiếng Anh',
    template: '%s | LinguaLearn - Học từ vựng tiếng Anh',
  },
  description: 'Ứng dụng học từ vựng tiếng Anh',
  icons: {
    icon: '/logo.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  )
}

