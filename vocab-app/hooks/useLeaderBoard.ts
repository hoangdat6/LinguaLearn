import { useEffect, useState, useCallback } from "react";
import { getLeaderBoard, UserScore } from "@/services/leader-board-sevice";
import { PaginatedResponse } from "@/services/course-service";

const NUM_USERS_PER_PAGE = 10;

export function useLeaderBoard() {
  const [data, setData] = useState<UserScore[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPage, setNextPage] = useState<number | null>(null);
  const [prevPage, setPrevPage] = useState<number | null>(null);
  const [totalPages, setTotalPages] = useState(0);

  const fetchLeaderBoard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response: PaginatedResponse<UserScore> = await getLeaderBoard(currentPage);
      setData(response.results);
      setTotalPages(Math.ceil(response.count / NUM_USERS_PER_PAGE));
      setNextPage(response.next ? currentPage + 1 : null);
      setPrevPage(response.previous ? currentPage - 1 : null);
    } catch (err) {
      setError(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchLeaderBoard();
    // Đã bỏ interval tự động 10 phút
    // Không còn setInterval ở đây nữa
  }, [fetchLeaderBoard]);

  return {
    users: data,
    loading,
    error,
    nextPage,
    prevPage,
    currentPage,
    setCurrentPage,
    totalPages,
  };
}
