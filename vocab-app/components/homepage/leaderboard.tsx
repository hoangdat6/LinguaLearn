import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLeaderBoard } from "@/hooks/useLeaderBoard";
import PaginationCustom from "../ui/pagination-custom";
import { Clock } from "lucide-react"; // ⏱️ icon
import { Owl } from "../owl";

function getRankStyle(index: number) {
  if (index === 0) {
    return {
      rankBg: "bg-gradient-to-r from-yellow-300 to-amber-400 text-amber-900 shadow-lg",
      rankRing: "ring-2 ring-amber-400",
      rankText: "text-2xl font-extrabold"
    };
  } else if (index === 1) {
    return {
      rankBg: "bg-gradient-to-r from-slate-300 to-slate-400 text-slate-800 shadow",
      rankRing: "ring-2 ring-slate-400",
      rankText: "text-xl font-bold"
    };
  } else if (index === 2) {
    return {
      rankBg: "bg-gradient-to-r from-orange-200 to-orange-400 text-orange-900 shadow",
      rankRing: "ring-2 ring-orange-300",
      rankText: "text-lg font-bold"
    };
  }
  return {
    rankBg: "bg-muted text-muted-foreground",
    rankRing: "",
    rankText: ""
  };
}

export function Leaderboard() {
  const {
    users,
    loading,
    error,
    nextPage,
    prevPage,
    currentPage,
    setCurrentPage,
    totalPages
  } = useLeaderBoard();

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="flex-1">
              <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded mb-1" />
              <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800 rounded" />
            </div>
            <div className="h-6 w-10 rounded-full bg-slate-100 dark:bg-slate-800" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Đã xảy ra lỗi khi tải bảng xếp hạng.</div>;
  }

  return (
    <div className="space-y-4">
      {/* Updated status message */}


      {users.map((user, index) => {
        const { rankBg, rankRing, rankText } = getRankStyle(index);
        return (
          <div key={user.username || index} className="flex items-center gap-3">
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${rankBg} ${rankText}`}
            >
              {index + 1 + (currentPage - 1) * 10}
            </div>
            <Avatar className={`h-10 w-10 ${rankRing}`}>
              {user.avatar ? (
                <img src={user.avatar} alt={user.username} className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <Owl className="h-10 w-10" />
              )}
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium leading-none">{user.username}</p>
              <p className="text-xs text-muted-foreground">{user.total_score ?? 0} XP</p>
            </div>
            {index < 3 && (
              <div
                className={`text-xs font-semibold px-2 py-1 rounded-full ${rankBg} ${rankText} border border-white shadow`}
              >
                #{index + 1 + (currentPage - 1) * 10}
              </div>
            )}
          </div>
        );
      })}
      <div className="flex justify-center items-center text-sm text-muted-foreground gap-2 mb-2 mt-2">
        <Clock className="w-4 h-4 text-yellow-500 animate-pulse" />
        <span>Bảng xếp hạng được cập nhật mỗi 10 phút</span>
      </div>
      <PaginationCustom
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </div>
  );
}
