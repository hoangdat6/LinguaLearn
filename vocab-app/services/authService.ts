import axios from "axios";
import Cookies from "js-cookie";
import api from "./api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api/users/";
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
    Cookies.set("access_token", response.data.access, { expires: 1, secure: true, sameSite: "Strict" });
    Cookies.set("refresh_token", response.data.refresh, { expires: 7, secure: true, sameSite: "Strict" });

    return response.data;
  } catch (error: any) {
    console.error("Login failed:", error.response?.data || error);
    throw error.response?.data || error;
  }
};

// Hàm đăng xuất
const logout = () => {
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
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
    const response = await api.get<User>("/users/profile");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    return null;
  }
};

const authService = { login, register, logout, getUser };
export default authService;
