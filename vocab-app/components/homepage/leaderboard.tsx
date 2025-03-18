import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Leaderboard() {
  const users = [
    { id: 1, name: "Nguyễn Văn A", points: 340, image: "/placeholder.svg" },
    { id: 2, name: "Trần Thị B", points: 310, image: "/placeholder.svg" },
    { id: 3, name: "Lê Văn C", points: 290, image: "/placeholder.svg" },
    { id: 4, name: "Phạm Thị D", points: 275, image: "/placeholder.svg" },
    { id: 5, name: "Hoàng Văn E", points: 250, image: "/placeholder.svg" },
  ]

  return (
    <div className="space-y-4">
      {users.map((user, index) => (
        <div key={user.id} className="flex items-center gap-3">
          <div
            className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold
            ${
              index === 0
                ? "bg-amber-100 text-amber-600 dark:bg-amber-900/60 dark:text-amber-300"
                : index === 1
                  ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  : index === 2
                    ? "bg-orange-100 text-orange-600 dark:bg-orange-900/60 dark:text-orange-300"
                    : "bg-muted text-muted-foreground"
            }`}
          >
            {index + 1}
          </div>
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback>
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.points} XP</p>
          </div>
          {index < 3 && (
            <div
              className={`text-xs font-medium px-2 py-1 rounded-full
              ${
                index === 0
                  ? "bg-amber-100 text-amber-600 dark:bg-amber-900/60 dark:text-amber-300"
                  : index === 1
                    ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    : "bg-orange-100 text-orange-600 dark:bg-orange-900/60 dark:text-orange-300"
              }`}
            >
              #{index + 1}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

