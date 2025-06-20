import { AUTH } from "@/constants/api-endpoints";
import { AUTH_ROUTES } from "@/constants/routes";
import axios from "axios";
import { signOut } from "next-auth/react";
import api, { publicApi } from "./api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api/";
const CSRF_TOKEN = process.env.NEXT_PUBLIC_CSRF_TOKEN || "";

// Hàm đăng nhập
const login = async (username: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await publicApi.post<AuthResponse>(
      AUTH.LOGIN,
      { username, password },
      {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "X-CSRFTOKEN": CSRF_TOKEN,
        },
      }
    );
    
    return response.data;
  } catch (error: any) {
    console.error("Login failed:", error.response?.data || error);
    throw error.response?.data || error;
  }
};

// Hàm đăng xuất
const logout = async () => {
  // 1. Hủy session NextAuth
  await signOut({ 
    callbackUrl: AUTH_ROUTES.LOGIN, // URL chuyển hướng sau khi đăng xuất
    redirect: false 
  });
};


const register = async (username: string, email: string, password: string, password2: string): Promise<void> => {
  try {
    await publicApi.post(
      AUTH.REGISTER,
      { username, email, password, password2 },
      {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "X-CSRFTOKEN": CSRF_TOKEN,
        },
      }
    );
  } catch (error: any) {
    console.error("Registration failed:", error.response?.data || error);
    throw error.response?.data || error;
  }
};

const getUser = async (): Promise<User | null> => {
  try {
    const response = await api.get<User>(AUTH.PROFILE);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    return null;
  }
};

const changePassword = async (
  old_password: string, 
  new_password: string, 
  new_password2: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.post(AUTH.CHANGE_PASSWORD, {
      old_password,
      new_password,
      confirm_new_password: new_password2,
    });
    
    return {
      success: true,
      message: response.data.message || "Đổi mật khẩu thành công!"
    };
  } catch (error: any) {
    console.error("Lỗi khi đổi mật khẩu:", error);
    const errorMessage = error.response?.data?.non_field_errors || 
                         error.response?.data?.old_password || 
                         error.response?.data?.new_password ||
                         error.response?.data?.new_password2 ||
                         "Đổi mật khẩu thất bại";
    return {
      success: false,
      message: Array.isArray(errorMessage) ? errorMessage[0] : errorMessage
    };
  }
};

const authService = { 
  login, 
  register, 
  logout, 
  getUser, 
  changePassword,
  // loginWithGoogle, loginWithFacebook 
};
export default authService;