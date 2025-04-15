"use client"

import { Owl } from "@/components/owl"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/useAuth"
import Link from "next/link"

export default function LoginPage() {
  const {
    isLoading,
    message,
    error,
    loginFormik,
    registerFormik,
    handleGoogleLogin,
    handleFacebookLogin
  } = useAuth();

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
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

          {/* ĐĂNG NHẬP */}
          <TabsContent value="login">
            <form onSubmit={loginFormik.handleSubmit}>
              <CardHeader>
                <CardTitle>Đăng nhập</CardTitle>
                <CardDescription>Nhập thông tin đăng nhập của bạn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Tên đăng nhập</Label>
                  <Input id="username" type="username" {...loginFormik.getFieldProps("username")} />
                  {loginFormik.touched.username && loginFormik.errors.username && (
                    <p className="text-red-500 text-sm">{loginFormik.errors.username}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Mật khẩu</Label>
                    <Link href="/forgot-password" className="text-primary text-xs hover:underline">
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <Input id="password" type="password" {...loginFormik.getFieldProps("password")} />
                  {loginFormik.touched.password && loginFormik.errors.password && (
                    <p className="text-red-500 text-sm">{loginFormik.errors.password}</p>
                  )}
                </div>
                {message && <p className="text-green-500">{message}</p>}
                {error && <p className="text-red-500">{error}</p>}
              </CardContent>
              
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>
                
                <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300"></span>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-background px-2 text-sm text-muted-foreground">
                      Hoặc đăng nhập với
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 w-full">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="flex items-center gap-2 w-full h-10"
                  >
                    <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                    </svg>
                    Đăng nhập với Google
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleFacebookLogin}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                      <path fill="#039be5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"/>
                      <path fill="#fff" d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"/>
                    </svg>
                    Facebook
                  </Button>
                </div>
              </CardFooter>
            </form>
          </TabsContent>

          {/* ĐĂNG KÝ */}
          <TabsContent value="register">
            <form onSubmit={registerFormik.handleSubmit}>
              <CardHeader>
                <CardTitle>Tạo tài khoản</CardTitle>
                <CardDescription>Nhập thông tin để tạo tài khoản mới</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên đăng nhập</Label>
                  <Input id="username" {...registerFormik.getFieldProps("username")} />
                  {registerFormik.touched.username && registerFormik.errors.username && (
                    <p className="text-red-500 text-sm">{registerFormik.errors.username}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...registerFormik.getFieldProps("email")} />
                  {registerFormik.touched.email && registerFormik.errors.email && (
                    <p className="text-red-500 text-sm">{registerFormik.errors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Input id="password" type="password" {...registerFormik.getFieldProps("password")} />
                  {registerFormik.touched.password && registerFormik.errors.password && (
                    <p className="text-red-500 text-sm">{registerFormik.errors.password}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                  <Input id="confirmPassword" type="password" {...registerFormik.getFieldProps("confirmPassword")} />
                  {registerFormik.touched.confirmPassword && registerFormik.errors.confirmPassword && (
                    <p className="text-red-500 text-sm">{registerFormik.errors.confirmPassword}</p>
                  )}
                </div>
                {message && <p className="text-green-500">{message}</p>}
                {error && <p className="text-red-500">{error}</p>}
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
                </Button>
                
                <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300"></span>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-background px-2 text-sm text-muted-foreground">
                      Hoặc đăng ký với
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 w-full">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="flex items-center gap-2 w-full h-10"
                  >
                    <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                    </svg>
                    Đăng ký với Google
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleFacebookLogin}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                      <path fill="#039be5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"/>
                      <path fill="#fff" d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"/>
                    </svg>
                    Facebook
                  </Button>
                </div>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
