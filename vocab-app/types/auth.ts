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
    name: string;
    image?: string;
}
