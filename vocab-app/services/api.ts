import axios from "axios";
import { getSession, signOut } from "next-auth/react";
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api/";
export const CSRF_TOKEN = process.env.NEXT_PUBLIC_CSRF_TOKEN || "";

// Tạo instance Axios cho API yêu cầu xác thực
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
});

// Tạo instance Axios hoàn toàn riêng biệt cho các API công khai
// Instance này không có interceptor xử lý authentication
const publicApi = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
});

// **Interceptor Request**: Thêm Access Token vào Header - CHỈ cho api, KHÔNG cho publicApi
api.interceptors.request.use(async (config) => {
    const session = await getSession();
    console.log("Current session:", session);
    if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return config;
});

// **Interceptor Response**: Xử lý khi Access Token hết hạn (401) - CHỈ cho api, KHÔNG cho publicApi
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // Handle 401 errors (unauthorized)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Đánh dấu request đã được thử lại
            
            // Check if the session has an error indicating token refresh failed
            const session = await getSession();
            console.log("Current session:", session);
            if (session?.error === "RefreshAccessTokenError") {
                console.error("Refresh token error, signing out...");
                signOut({ callbackUrl: '/auth?tab=login' });
                return Promise.reject(error);
            }
            
            // If there's no refresh error, try to get a new session with refreshed tokens
            // NextAuth will handle the token refresh in the JWT callback
            const newSession = await getSession();
            console.log("New session after refresh:", newSession);
            
            if (newSession?.accessToken) {
                originalRequest.headers.Authorization = `Bearer ${newSession.accessToken}`;
                return api(originalRequest); // Gửi lại request với token mới
            }
        }
        
        return Promise.reject(error);
    }
);

// Export hai instance riêng biệt
export { publicApi };
export default api;
