"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AUTH } from "@/constants/api-endpoints";
import { Loader2, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface PageProps {
  params: {
    uid: string;
    token: string;
  };
}

const formSchema = z
  .object({
    new_password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
    confirm_password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Mật khẩu không khớp",
    path: ["confirm_password"],
  });

export default function ResetPasswordPage({ params }: PageProps) {
  const { uid, token } = params;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      new_password: "",
      confirm_password: "",
    },
  });

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await fetch(AUTH.RESET_PASSWORD_VALIDATE(uid, token), {
          method: "GET",
        });

        const data = await response.json();

        if (response.ok) {
          setTokenValid(true);
        } else {
          setError(data.error || "Đường link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn");
        }
      } catch (err) {
        setError("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
        console.error(err);
      } finally {
        setValidating(false);
      }
    };

    validateToken();
  }, [uid, token]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(AUTH.RESET_PASSWORD_CONFIRM(uid, token), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Redirect to login after successful password reset
        setTimeout(() => {
          router.push("/auth");
        }, 3000);
      } else {
        setError(data.error || "Đã xảy ra lỗi khi đặt lại mật khẩu.");
      }
    } catch (err) {
      setError("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center  from-background to-muted px-4">
      <Card className="w-full max-w-md shadow-lg border-2">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Đặt lại mật khẩu</CardTitle>
          <CardDescription className="text-center">
            Nhập mật khẩu mới cho tài khoản của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          {validating ? (
            <div className="flex flex-col items-center text-center space-y-4 py-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p>Đang xác thực đường link...</p>
            </div>
          ) : success ? (
            <div className="flex flex-col items-center text-center space-y-4 py-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <h3 className="text-xl font-medium">Mật khẩu đã được đặt lại!</h3>
              <p className="text-muted-foreground">
                Bạn sẽ được chuyển đến trang đăng nhập sau vài giây.
              </p>
            </div>
          ) : tokenValid ? (
            <>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTitle>Lỗi</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="new_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mật khẩu mới</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} disabled={loading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirm_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Xác nhận mật khẩu</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} disabled={loading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      "Đặt lại mật khẩu"
                    )}
                  </Button>
                </form>
              </Form>
            </>
          ) : (
            <div className="flex flex-col items-center text-center space-y-4 py-4">
              <AlertCircle className="h-16 w-16 text-destructive" />
              <h3 className="text-xl font-medium">Đường link không hợp lệ</h3>
              <p className="text-muted-foreground">
                {error || "Đường link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn."}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="ghost" asChild className="text-sm">
            <Link href="/auth">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại đăng nhập
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
