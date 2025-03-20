"use client"

import type React from "react"

import { Owl } from "@/components/owl"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { useState } from "react"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate login
    setTimeout(() => {
      setIsLoading(false)
      window.location.href = "/"
    }, 1500)
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate registration
    setTimeout(() => {
      setIsLoading(false)
      window.location.href = "/"
    }, 1500)
  }

  return (
    <div className="flex flex-col bg-muted/40 justify-center items-center min-h-screen">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="flex flex-col items-center mb-8">
        <Owl className="h-24 w-24 mb-2" />
        <h1 className="text-3xl text-primary font-bold">LinguaLearn</h1>
      </div>

      <Card className="w-full max-w-md">
        <Tabs defaultValue="login">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="login">Đăng nhập</TabsTrigger>
            <TabsTrigger value="register">Đăng ký</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin}>
              <CardHeader>
                <CardTitle>Đăng nhập</CardTitle>
                <CardDescription>Nhập thông tin đăng nhập của bạn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="m@example.com" required />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Mật khẩu</Label>
                    <Link href="/forgot-password" className="text-primary text-xs hover:underline">
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <Input id="password" type="password" required />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister}>
              <CardHeader>
                <CardTitle>Tạo tài khoản</CardTitle>
                <CardDescription>Nhập thông tin để tạo tài khoản mới</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên</Label>
                  <Input id="name" placeholder="Nguyễn Văn A" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="m@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Input id="password" type="password" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
                  <Input id="confirm-password" type="password" required />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}

