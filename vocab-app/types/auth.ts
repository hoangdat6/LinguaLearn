interface AuthResponse {
    access: string;
    refresh: string;
    user: {
        id: string;
        name: string;
        email?: string;
        image?: string;
    }
}

// Định nghĩa kiểu dữ liệu cho người dùng
interface User {
    id: string;
    email: string;
    username: string;
    avatar?: string;
    joinedDate?: string;
    streak?: number;
}
