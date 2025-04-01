import axios from "axios";
import Cookies from "js-cookie";
import api from "./api";
import { ACCESS_TOKEN_KEY, IS_LEARN_KEY, IS_PROFILE_CHANGED_KEY, REFRESH_TOKEN_KEY, USER_KEY, WORD_LEVELS_KEY } from "@/types/status";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api/";
const CSRF_TOKEN = process.env.NEXT_PUBLIC_CSRF_TOKEN || "";

// Hàm đăng nhập
const login = async (username: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(
      `${API_BASE_URL}users/login/`,
      { username, password },
      {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "X-CSRFTOKEN": CSRF_TOKEN,
        },
      }
    );

    // Lưu token vào Cookie (thời gian sống 1 giờ)
    Cookies.set(ACCESS_TOKEN_KEY, response.data.access, { expires: 1, secure: true, sameSite: "Strict" });
    Cookies.set(REFRESH_TOKEN_KEY, response.data.refresh, { expires: 7, secure: true, sameSite: "Strict" });

    return response.data;
  } catch (error: any) {
    console.error("Login failed:", error.response?.data || error);
    throw error.response?.data || error;
  }
};

// Hàm đăng xuất
const logout = () => {
  Cookies.remove(ACCESS_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(IS_LEARN_KEY);
  localStorage.removeItem(IS_PROFILE_CHANGED_KEY);
  localStorage.removeItem(WORD_LEVELS_KEY);
  
};

const register = async (username: string, email: string, password: string, password2: string): Promise<void> => {
  try {
    await axios.post(
      `${API_BASE_URL}users/register/`,
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
    const response = await api.get<User>("users/profile");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    return null;
  }
};

const authService = { login, register, logout, getUser };
export default authService;
