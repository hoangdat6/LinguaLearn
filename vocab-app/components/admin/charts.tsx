"use client"

import { useTheme } from "next-themes"
import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  type TooltipProps,
} from "recharts"
import { PieChart as RechartsPieChart, Pie, Cell, Legend, Tooltip as PieTooltip } from "recharts"

// Dữ liệu cho biểu đồ cột
const barData = [
  {
    name: "Thứ Hai",
    users: 4000,
  },
  {
    name: "Thứ Ba",
    users: 3500,
  },
  {
    name: "Thứ Tư",
    users: 4200,
  },
  {
    name: "Thứ Năm",
    users: 5100,
  },
  {
    name: "Thứ Sáu",
    users: 4800,
  },
  {
    name: "Thứ Bảy",
    users: 3800,
  },
  {
    name: "Chủ Nhật",
    users: 3200,
  },
]

// Dữ liệu cho biểu đồ tròn
const pieData = [
  { name: "Giao tiếp", value: 35 },
  { name: "Du lịch", value: 25 },
  { name: "Công sở", value: 15 },
  { name: "Công nghệ", value: 10 },
  { name: "Y tế", value: 8 },
  { name: "Khác", value: 7 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#A5D6A7"]

// Component cho biểu đồ cột
export function BarChart() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Custom tooltip cho biểu đồ cột
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border p-2 rounded-md shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-primary">
            <span className="font-medium">{payload[0].value?.toLocaleString()}</span> người dùng
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={barData}>
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
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="users" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}

// Component cho biểu đồ tròn
export function PieChart() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Custom tooltip cho biểu đồ tròn
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border p-2 rounded-md shadow-md">
          <p className="font-medium" style={{ color: payload[0].payload.fill }}>
            {payload[0].name}
          </p>
          <p className="text-sm text-primary">
            <span className="font-medium">{payload[0].value}%</span> người dùng
          </p>
        </div>
      )
    }
    return null
  }

  // Custom renderer cho legend
  const renderCustomizedLegend = (props: any) => {
    const { payload } = props

    return (
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-xs text-muted-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <PieTooltip content={<CustomTooltip />} />
          <Legend content={renderCustomizedLegend} />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  )
}

