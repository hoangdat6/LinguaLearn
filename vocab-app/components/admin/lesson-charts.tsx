"use client"

import { useTheme } from "next-themes"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Dữ liệu mẫu cho biểu đồ hoàn thành bài học
const completionData = [
  { name: "T1", completion: 62 },
  { name: "T2", completion: 64 },
  { name: "T3", completion: 65 },
  { name: "T4", completion: 67 },
  { name: "T5", completion: 68 },
  { name: "T6", completion: 69 },
  { name: "T7", completion: 70 },
  { name: "T8", completion: 72 },
  { name: "T9", completion: 73 },
  { name: "T10", completion: 75 },
  { name: "T11", completion: 76 },
  { name: "T12", completion: 78 },
]

// Dữ liệu mẫu cho biểu đồ bài học phổ biến
const popularityData = [
  { name: "Chào hỏi và giới thiệu", views: 1243 },
  { name: "Hỏi đường", views: 987 },
  { name: "Đặt phòng khách sạn", views: 876 },
  { name: "Gọi món ăn", views: 765 },
  { name: "Kể về kỳ nghỉ", views: 543 },
  { name: "Phỏng vấn xin việc", views: 432 },
  { name: "Thuyết trình", views: 321 },
  { name: "Mua sắm", views: 210 },
]

// Dữ liệu mẫu cho biểu đồ đánh giá bài học
const ratingData = [
  { name: "5 sao", value: 65 },
  { name: "4 sao", value: 25 },
  { name: "3 sao", value: 7 },
  { name: "2 sao", value: 2 },
  { name: "1 sao", value: 1 },
]

const COLORS = ["#22C55E", "#3B82F6", "#F59E0B", "#EF4444", "#6B7280"]

// Component cho biểu đồ hoàn thành bài học
export function LessonCompletionChart() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={completionData}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} />
          <XAxis
            dataKey="name"
            tick={{ fill: isDark ? "#9CA3AF" : "#6B7280" }}
            axisLine={{ stroke: isDark ? "#374151" : "#e5e7eb" }}
          />
          <YAxis
            tick={{ fill: isDark ? "#9CA3AF" : "#6B7280" }}
            axisLine={{ stroke: isDark ? "#374151" : "#e5e7eb" }}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
              borderColor: isDark ? "#374151" : "#E5E7EB",
              color: isDark ? "#F9FAFB" : "#111827",
            }}
            formatter={(value) => [`${value}%`, "Tỷ lệ hoàn thành"]}
          />
          <Line
            type="monotone"
            dataKey="completion"
            stroke="#10B981"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// Component cho biểu đồ bài học phổ biến
export function LessonPopularityChart() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={popularityData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} />
          <XAxis
            type="number"
            tick={{ fill: isDark ? "#9CA3AF" : "#6B7280" }}
            axisLine={{ stroke: isDark ? "#374151" : "#e5e7eb" }}
          />
          <YAxis
            dataKey="name"
            type="category"
            tick={{ fill: isDark ? "#9CA3AF" : "#6B7280" }}
            axisLine={{ stroke: isDark ? "#374151" : "#e5e7eb" }}
            width={150}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
              borderColor: isDark ? "#374151" : "#E5E7EB",
              color: isDark ? "#F9FAFB" : "#111827",
            }}
          />
          <Bar dataKey="views" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// Component cho biểu đồ đánh giá bài học
export function LessonRatingChart() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={ratingData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          >
            {ratingData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
              borderColor: isDark ? "#374151" : "#E5E7EB",
              color: isDark ? "#F9FAFB" : "#111827",
            }}
            formatter={(value) => [`${value}%`, "Tỷ lệ"]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

