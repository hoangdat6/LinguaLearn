import { LEADERBOARD } from "@/constants/api-endpoints";
import { publicApi } from "./api";
import { PaginatedResponse } from "./course-service";

export interface UserScore {
    username: string;
    total_score: number;
    avatar: string;
}
export const getLeaderBoard = async (page: number = 1): Promise<PaginatedResponse<UserScore>> => {
    try {
        const response = await publicApi.get(LEADERBOARD.GET_LEADERBOARD, {
            params: { page }
        });
        return response.data;
    } catch (error) {
        return { count: 0, next: null, previous: null, results: [] };
    }
}

const leaderBoardService = {
    getLeaderBoard
}
export default leaderBoardService;