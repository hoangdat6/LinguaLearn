"use client";

import authService from "@/services/auth-service";
import { useFormik } from "formik";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import * as Yup from "yup";

function useAuth() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || "/";

  // Check if user is already logged in
  if (session) {
    router.push(callbackUrl);
  }

  // Schema kiểm tra dữ liệu với Yup
  const loginSchema = Yup.object().shape({
    username: Yup.string().required("Bắt buộc"),
    password: Yup.string()
      .min(8, "Mật khẩu ít nhất 8 ký tự")
      .matches(/[A-Za-z]/, "Phải chứa chữ cái")
      .matches(/\d/, "Phải chứa số")
      .required("Bắt buộc"),
  });

  const registerSchema = Yup.object().shape({
    // username: Yup.string().required("Bắt buộc"),
    email: Yup.string().email("Email không hợp lệ").required("Bắt buộc"),
    password: Yup.string()
      .min(8, "Mật khẩu ít nhất 8 ký tự")
      .matches(/[A-Za-z]/, "Phải chứa chữ cái")
      .matches(/\d/, "Phải chứa số")
      .required("Bắt buộc"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Mật khẩu không khớp")
      .required("Bắt buộc"),
  });

  // Xử lý đăng nhập thông thường
  const handleLogin = async (username: string, password: string) => {
    setIsLoading(true);
    setMessage("");
    setError("");
    try {
      console.log("Đang đăng nhập với username:", username, "và password đã được ẩn");
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });
      console.log("SignIn result:", result);
      if (result?.error) {
        setError(result.error || "Tài khoản hoặc mật khẩu không đúng");
        return false;
      }
      
      setMessage("Đăng nhập thành công! Đang chuyển hướng...");
      router.push(callbackUrl);
      return true;
    } catch (err) {
      setError("Tài khoản hoặc mật khẩu không đúng");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý đăng ký
  const handleRegister = async (email: string, password: string, confirmPassword: string) => {
    setIsLoading(true);
    setMessage("");
    setError("");
    try {
      await authService.register(email, password, confirmPassword);
      setMessage("Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.");
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || "Đã xảy ra lỗi. Vui lòng thử lại.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý đăng nhập với Google
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setMessage("Đang kết nối với Google...");
    setError("");
    try {
      await signIn('google', { callbackUrl });
      
      return true;
    } catch (err) {
      setError("Đăng nhập với Google thất bại. Vui lòng thử lại.");
      setIsLoading(false);
      return false;
    }
  };

  // Xử lý đăng nhập với Facebook
  const handleFacebookLogin = async () => {
    setIsLoading(true);
    setMessage("");
    setError("");
    try {
      await signIn('facebook', { callbackUrl });
      return true;
    } catch (err) {
      setError("Đăng nhập với Facebook thất bại. Vui lòng thử lại.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Khởi tạo formik cho đăng nhập
  const loginFormik = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      await handleLogin(values.username, values.password);
    },
  });

  // Khởi tạo formik cho đăng ký
  const registerFormik = useFormik({
    initialValues: { email: "", password: "", confirmPassword: "" },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      return await handleRegister(values.email, values.password, values.confirmPassword);
    },
  });

  // Helper functions to check if forms are valid and complete
  const isLoginFormValid = () => {
    return loginFormik.values.username.trim() !== "" && 
           loginFormik.values.password.trim() !== "" && 
           loginFormik.isValid;
  };

  const isRegisterFormValid = () => {
    return registerFormik.values.email.trim() !== "" && 
           registerFormik.values.password.trim() !== "" && 
           registerFormik.values.confirmPassword.trim() !== "" && 
           registerFormik.isValid;
  };

  return {
    isLoading,
    message,
    error,
    loginFormik,
    registerFormik,
    handleGoogleLogin,
    handleFacebookLogin,
    setMessage,
    setError,
    isLoginFormValid,
    isRegisterFormValid
  };
}

/**
 * Hook kiểm tra trạng thái xác thực của người dùng
 * Cung cấp thông tin về việc người dùng đã đăng nhập hay chưa
 */
const useAuthStatus = () => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(status === 'loading');
  
  const isAuthenticated = !!session;
  const userEmail = session?.user?.email || null;
  const userName = session?.user?.name || null;

  // Xử lý đăng xuất
  const logout = async (): Promise<void> => {
    try {
      await signOut({ callbackUrl: "/login" });
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  // Cập nhật trạng thái loading khi status thay đổi
  useEffect(() => {
    setIsLoading(status === 'loading');
  }, [status]);

  return {
    isAuthenticated,
    isLoading,
    userEmail,
    userName,
    logout
  };
};

export { useAuth, useAuthStatus };

