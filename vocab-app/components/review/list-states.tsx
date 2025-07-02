import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

interface ListStatusProps {
  selectedLevel: number
  levelName: string
}

interface LoadingIndicatorProps {
  currentCount: number
  totalCount: number
}

interface ListCompletedProps {
  currentCount: number
  totalCount: number
}

export const EmptyListState = ({ selectedLevel, levelName }: ListStatusProps) => (
  <motion.div
    className="flex flex-col items-center justify-center gap-3 py-8"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mb-2">
      <span className="text-3xl" role="img" aria-label="magnifying glass">🔍</span>
    </div>
    <h3 className="text-xl font-medium text-gray-700">Không tìm thấy từ vựng</h3>
    <p className="text-gray-500 text-center max-w-md">
      Cấp độ này chưa có từ vựng nào. Hãy học thêm để lấp đầy kho từ của bạn!
    </p>
    <Badge
      variant="outline"
      className="mt-2 px-3 py-1 bg-orange-50 text-orange-500 border-orange-200"
    >
      Cấp {selectedLevel}: {levelName}
    </Badge>
  </motion.div>
)

export const LoadingIndicator = ({ currentCount, totalCount }: LoadingIndicatorProps) => (
  <div className="text-center py-4">
    <p className="mb-2">Đang tải thêm...</p>
    <Badge variant="outline" className="bg-primary/10 text-primary">
      {currentCount} <span className="mx-1">/</span> {totalCount}
    </Badge>
  </div>
)

export const ListCompletedIndicator = ({ currentCount, totalCount }: ListCompletedProps) => (
  <div className="flex flex-col items-center py-4 gap-2">
    <Badge
      variant="outline"
      className="px-3 py-1 text-sm bg-green-50 text-green-600 border-green-200"
    >
      <span className="font-medium">{currentCount}</span>
      <span className="mx-1">/</span>
      <span>{totalCount}</span>
      <span className="ml-1 opacity-80">từ vựng</span>
    </Badge>
    <p className="text-center text-muted-foreground">Đã tải tất cả từ vựng ở cấp độ này</p>
  </div>
)
