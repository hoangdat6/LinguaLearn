interface AuthResponse {
    access: string;
    refresh: string;
    user: {
        id: string;
        username: string;
        email?: string;
        avatar?: string;
    }
}

// Định nghĩa kiểu dữ liệu cho người dùng
interface User {
    id: string;
    email: string;
    username: string;
    avatar?: string;
}
