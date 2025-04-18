import { AUTH } from "@/constants/api-endpoints";
import { AUTH_ROUTES } from "@/constants/routes";
import { IS_LEARN_KEY, IS_PROFILE_CHANGED_KEY, USER_KEY, WORD_LEVELS_KEY } from "@/types/status";
import axios from "axios";
import { signOut } from "next-auth/react";
import api from "./api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api/";
const CSRF_TOKEN = process.env.NEXT_PUBLIC_CSRF_TOKEN || "";

// Hàm đăng nhập
const login = async (username: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(
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
  
  // 2. Xóa các dữ liệu ứng dụng cần thiết khác (không cần xóa cookies liên quan đến auth)
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(IS_LEARN_KEY);
  sessionStorage.removeItem(IS_PROFILE_CHANGED_KEY);
  sessionStorage.removeItem(WORD_LEVELS_KEY);
  
  // 3. Tùy chọn: Gọi API backend để invalidate token (nếu cần)
  // try {
  //   await api.post("users/logout/");
  // } catch (error) {
  //   console.error("Logout API error:", error);
  // }
};
const register = async (username: string, email: string, password: string, password2: string): Promise<void> => {
  try {
    await axios.post(
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


const authService = { login, register, logout, getUser, 
  // loginWithGoogle, loginWithFacebook 
};
export default authService;
