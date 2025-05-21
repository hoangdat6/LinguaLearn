import { LEADERBOARD } from "@/constants/api-endpoints";
import api from "./api";
import { PaginatedResponse } from "./course-service";

export interface UserScore {
    username: string;
    total_score: number;
}
export const getLeaderBoard = async (page: number = 1): Promise<PaginatedResponse<UserScore>> => {
    try {
        const response = await api.get(LEADERBOARD.GET_LEADERBOARD, {
            params: { page }
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách từ vựng:", error);
        return { count: 0, next: null, previous: null, results: [] };
    }
}

const leaderBoardService = {
    getLeaderBoard
}
export default leaderBoardService;