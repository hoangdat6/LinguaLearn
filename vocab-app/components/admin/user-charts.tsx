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
  Legend,
  ResponsiveContainer,
} from "recharts"

// Dữ liệu mẫu cho biểu đồ đăng ký người dùng
const registrationData = [
  { name: "T1", users: 120 },
  { name: "T2", users: 150 },
  { name: "T3", users: 180 },
  { name: "T4", users: 220 },
  { name: "T5", users: 280 },
  { name: "T6", users: 350 },
  { name: "T7", users: 410 },
  { name: "T8", users: 450 },
  { name: "T9", users: 480 },
  { name: "T10", users: 520 },
  { name: "T11", users: 540 },
  { name: "T12", users: 580 },
]

// Dữ liệu mẫu cho biểu đồ hoạt động người dùng
const activityData = [
  { name: "T1", daily: 320, weekly: 480, monthly: 650 },
  { name: "T2", daily: 340, weekly: 490, monthly: 670 },
  { name: "T3", daily: 350, weekly: 500, monthly: 680 },
  { name: "T4", daily: 380, weekly: 520, monthly: 700 },
  { name: "T5", daily: 400, weekly: 530, monthly: 720 },
  { name: "T6", daily: 420, weekly: 550, monthly: 750 },
  { name: "T7", daily: 450, weekly: 580, monthly: 780 },
  { name: "T8", daily: 470, weekly: 600, monthly: 800 },
  { name: "T9", daily: 490, weekly: 620, monthly: 820 },
  { name: "T10", daily: 510, weekly: 640, monthly: 840 },
  { name: "T11", daily: 530, weekly: 660, monthly: 860 },
  { name: "T12", daily: 550, weekly: 680, monthly: 880 },
]

// Dữ liệu mẫu cho biểu đồ giữ chân người dùng
const retentionData = [
  { name: "Tuần 1", retention: 100 },
  { name: "Tuần 2", retention: 85 },
  { name: "Tuần 3", retention: 75 },
  { name: "Tuần 4", retention: 68 },
  { name: "Tuần 5", retention: 62 },
  { name: "Tuần 6", retention: 58 },
  { name: "Tuần 7", retention: 55 },
  { name: "Tuần 8", retention: 52 },
  { name: "Tuần 9", retention: 50 },
  { name: "Tuần 10", retention: 48 },
  { name: "Tuần 11", retention: 47 },
  { name: "Tuần 12", retention: 45 },
]

// Component cho biểu đồ đăng ký người dùng
export function UserRegistrationChart() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={registrationData}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} />
          <XAxis
            dataKey="name"
            tick={{ fill: isDark ? "#9CA3AF" : "#6B7280" }}
            axisLine={{ stroke: isDark ? "#374151" : "#e5e7eb" }}
          />
          <YAxis
            tick={{ fill: isDark ? "#9CA3AF" : "#6B7280" }}
            axisLine={{ stroke: isDark ? "#374151" : "#e5e7eb" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
              borderColor: isDark ? "#374151" : "#E5E7EB",
              color: isDark ? "#F9FAFB" : "#111827",
            }}
          />
          <Bar dataKey="users" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// Component cho biểu đồ hoạt động người dùng
export function UserActivityChart() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={activityData}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} />
          <XAxis
            dataKey="name"
            tick={{ fill: isDark ? "#9CA3AF" : "#6B7280" }}
            axisLine={{ stroke: isDark ? "#374151" : "#e5e7eb" }}
          />
          <YAxis
            tick={{ fill: isDark ? "#9CA3AF" : "#6B7280" }}
            axisLine={{ stroke: isDark ? "#374151" : "#e5e7eb" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
              borderColor: isDark ? "#374151" : "#E5E7EB",
              color: isDark ? "#F9FAFB" : "#111827",
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="daily" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="weekly" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          <Line
            type="monotone"
            dataKey="monthly"
            stroke="#8B5CF6"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// Component cho biểu đồ giữ chân người dùng
export function UserRetentionChart() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={retentionData}>
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
            formatter={(value) => [`${value}%`, "Tỷ lệ giữ chân"]}
          />
          <Line
            type="monotone"
            dataKey="retention"
            stroke="#F59E0B"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

