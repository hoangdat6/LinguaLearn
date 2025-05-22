"use client";

import { AUTH } from "@/constants/api-endpoints";
import { IS_LEARN_KEY, IS_PROFILE_CHANGED_KEY } from "@/constants/status";
import axios from "axios";
import { useFormik } from "formik";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import * as Yup from "yup";

const CSRF_TOKEN = process.env.NEXT_PUBLIC_CSRF_TOKEN || "";

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
    username: Yup.string().required("Bắt buộc"),
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
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error || "Tài khoản hoặc mật khẩu không đúng");
        return false;
      }
      
      // Set local storage items
      sessionStorage.setItem(IS_PROFILE_CHANGED_KEY, "true");
      sessionStorage.setItem(IS_LEARN_KEY, "true");
      
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
  const handleRegister = async (username: string, email: string, password: string, confirmPassword: string) => {
    setIsLoading(true);
    setMessage("");
    setError("");
    try {
      await axios.post(
        AUTH.REGISTER,
        { username, email, password, password2: confirmPassword },
        {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-CSRFTOKEN": CSRF_TOKEN,
          },
        }
      );
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
      
      // Note: we don't set these manually since the redirect will happen automatically
      // and we'll handle these on successful login callback in NextAuth
      sessionStorage.setItem(IS_PROFILE_CHANGED_KEY, "true");
      sessionStorage.setItem(IS_LEARN_KEY, "true");
      
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
      
      sessionStorage.setItem(IS_PROFILE_CHANGED_KEY, "true");
      sessionStorage.setItem(IS_LEARN_KEY, "true");
      
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
    initialValues: { username: "", email: "", password: "", confirmPassword: "" },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      await handleRegister(values.username, values.email, values.password, values.confirmPassword);
    },
  });

  return {
    isLoading,
    message,
    error,
    loginFormik,
    registerFormik,
    handleGoogleLogin,
    handleFacebookLogin,
    setMessage,
    setError
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

