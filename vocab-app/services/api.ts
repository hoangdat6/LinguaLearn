import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/constants/status";
import axios from "axios";
import Cookies from "js-cookie";
import { getSession } from "next-auth/react";
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api/";
export const CSRF_TOKEN = process.env.NEXT_PUBLIC_CSRF_TOKEN || "";

// Tạo instance Axios
const api = axios.create({
    baseURL: API_BASE_URL, // Thay đổi base URL nếu cần
    headers: { "Content-Type": "application/json" },
});


// Biến lưu trạng thái refresh token đang được gọi
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Hàm đăng ký các request đang chờ token mới
const addRefreshSubscriber = (callback: (token: string) => void) => {
    refreshSubscribers.push(callback);
};

// Hàm xử lý refresh token
const refreshAccessToken = async () => {
    if (!isRefreshing) {
        isRefreshing = true;
        try {
            // lấy token từ session
            const session = await getSession();
            if (!session?.refreshToken) throw new Error("No refresh token available");
            const refreshToken = session.refreshToken;
            // const refreshToken = Cookies.get(REFRESH_TOKEN_KEY);
            if (!refreshToken) throw new Error("No refresh token available");

            const response = await axios.post(API_BASE_URL + "users/refresh-token/", { refresh: refreshToken });
            const newAccessToken = response.data.access;

            // Lưu lại token mới
            Cookies.set(ACCESS_TOKEN_KEY, newAccessToken);

            const newRefreshToken = response.data.refresh;
            if (newRefreshToken) {
                Cookies.set(REFRESH_TOKEN_KEY, newRefreshToken);
            }
            // Gọi lại tất cả request đang chờ token mới
            refreshSubscribers.forEach((callback) => callback(newAccessToken));
            refreshSubscribers = [];

            return newAccessToken;
        } catch (error) {
            console.error("Refresh token failed", error);
            return null;
        } finally {
            isRefreshing = false;
        }
    }
    return new Promise<string | null>((resolve) => {
        addRefreshSubscriber((token) => resolve(token));
    });
};

// **Interceptor Request**: Thêm Access Token vào Header
api.interceptors.request.use(async (config) => {
    const session = await getSession();
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return config;
  });

// **Interceptor Response**: Xử lý khi Access Token hết hạn (401)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Đánh dấu request đã được thử lại

            const newToken = await refreshAccessToken();
            if (newToken) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest); // Gửi lại request với token mới
            }
        }
        return Promise.reject(error);
    }
);

export default api;
