"use client"

import { Button } from "@/components/ui/button";
import { getTimeUntilNextReview } from "@/lib/utils";
import { TimeUntilNextReview } from "@/services/user-word-service";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface VocabularyLevelsProps {
  showLabels?: boolean;
  wordLevel1?: number;
  wordLevel2?: number;
  wordLevel3?: number;
  wordLevel4?: number;
  wordLevel5?: number;
  reviewWordCount?: number;
  isLoading?: boolean;
  timeUntilNextReview?: TimeUntilNextReview;
}

// Enhanced loading skeleton component with growing animation
const VocabularyLevelsLoading = () => {
  const [heights, setHeights] = useState([0, 0, 0, 0, 0]);
  const finalHeights = [80, 120, 70, 100, 50]; // Different heights for each bar

  useEffect(() => {
    // Start with zero heights
    setHeights([0, 0, 0, 0, 0]);

    // Animate heights growing
    const growInterval = setInterval(() => {
      setHeights(prevHeights =>
        prevHeights.map((height, index) => {
          if (height < finalHeights[index]) {
            // Grow by a small amount each interval until reaching final height
            return Math.min(height + 2, finalHeights[index]);
          }
          return height;
        })
      );
    }, 30);

    // Clean up interval on unmount
    return () => clearInterval(growInterval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="relative h-[200px] flex items-end justify-between gap-4 pb-8 border-b">
        {[1, 2, 3, 4, 5].map((level, index) => (
          <div key={level} className="relative flex flex-col items-center flex-1">
            <span className="absolute -top-6 h-4 w-16 bg-gray-200 animate-pulse rounded"></span>
            <div
              className="w-full bg-gradient-to-t from-gray-300 to-gray-200 rounded-t-lg animate-pulse transition-all duration-300 ease-out"
              style={{
                height: `${heights[index]}px`,
                transition: "height 0.3s ease-out",
              }}
            />
            <span className="absolute -bottom-8 h-5 w-5 bg-gray-200 animate-pulse rounded-full"></span>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="h-6 w-48 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-10 w-36 bg-gradient-to-r from-gray-300 to-gray-200 animate-pulse rounded-full"></div>
      </div>
    </div>
  );
};

const ReviewTimeDisplay = ({ timeUntilNextReview }: { timeUntilNextReview: TimeUntilNextReview }) => {
  const { hours, minutes } = timeUntilNextReview;

  if (hours === 0 && minutes === 0) {
    return <span className="text-primary font-medium">vài giây nữa</span>;
  }

  return (
    <span className="text-primary font-medium">
      {hours > 0 && `${hours} giờ `}
      {minutes > 0 && `${minutes} phút`}
    </span> 
  );
};

const ReviewInfo = ({ reviewWordCount, timeUntilNextReview }: {
  reviewWordCount: number;
  timeUntilNextReview: TimeUntilNextReview;
}) => {
  const hasTimeUntilNextReview = getTimeUntilNextReview(timeUntilNextReview) !== '0';

  return (
    <>
      {reviewWordCount === 0 ? (
        hasTimeUntilNextReview ? (
          <p className="text-base text-muted-foreground">
            Tất cả từ đã được ôn. Đợt ôn tiếp theo sau{" "}
            <ReviewTimeDisplay timeUntilNextReview={timeUntilNextReview} />.
          </p>
        ) : (
          <p className="text-base text-muted-foreground">
            Tuyệt vời! Hiện không có từ nào cần ôn tập.
          </p>
        )
      ) : hasTimeUntilNextReview ? (
        <div className="flex flex-col items-center gap-4"> {/* Using a smaller space for a tighter look */}
          <p className="text-base">
            Chuẩn bị ôn tập: <span className="text-primary font-medium">{reviewWordCount} từ</span>
          </p>
          <p className="text-sm text-muted-foreground"> {/* Slightly smaller text for secondary info */}
            Thời gian chờ: <ReviewTimeDisplay timeUntilNextReview={timeUntilNextReview} />
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4"> {/* Using a smaller space for a tighter look */}
          <p className="text-base font-medium"> {/* Added font-medium for emphasis */}
            Đến lúc ôn tập: <span className="text-primary">{reviewWordCount} từ</span>
          </p>
          <Button
            asChild
            disabled={reviewWordCount === 0}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-medium px-8 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Link href="/review-session" className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Ôn tập ngay
            </Link>
          </Button>
        </div>
      )}
    </>
  );
};

export const VocabularyLevels = React.memo(function VocabularyLevels({
  showLabels = false,
  wordLevel1 = 0,
  wordLevel2 = 0,
  wordLevel3 = 0,
  wordLevel4 = 0,
  wordLevel5 = 0,
  reviewWordCount = 0,
  isLoading = false,
  timeUntilNextReview = { hours: 0, minutes: 0, seconds: 0 }
}: VocabularyLevelsProps) {
  const levels = [
    { level: 1, count: wordLevel1, color: "bg-red-500" },
    { level: 2, count: wordLevel2, color: "bg-yellow-400" },
    { level: 3, count: wordLevel3, color: "bg-sky-400" },
    { level: 4, count: wordLevel4, color: "bg-blue-500" },
    { level: 5, count: wordLevel5, color: "bg-navy-800" },
  ]

  const totalWords = levels.reduce((sum, level) => sum + level.count, 0)
  const maxCount = Math.max(...levels.map((level) => level.count), 1) // Ensure non-zero for division

  if (isLoading) {
    return <VocabularyLevelsLoading />
  }

  return (
    <div className="space-y-6">
      {totalWords === 0 ? (
        <div className="flex flex-col items-center gap-6 py-12">
          <p className="text-lg text-center">Bạn chưa học từ nào. Hãy bắt đầu học ngay!</p>
          <Button
            asChild
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-medium px-8 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Link href="/lessons" className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Học ngay
            </Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="relative h-[300px] flex items-end justify-between gap-4 pb-8 border-b">
            {levels.map((level) => (
              <div key={level.level} className="relative flex flex-col items-center flex-1">
                <span className="absolute -top-6 text-sm font-medium">{level.count} từ</span>
                <div
                  className={`w-full ${level.color} rounded-t-lg transition-all duration-300 ease-out`}
                  style={{
                    height: `${Math.max((level.count / maxCount) * 260, 5)}px`, // Minimum height for visibility
                  }}
                />
                <span className="absolute -bottom-8 text-base font-medium">{level.level}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-4">
            <ReviewInfo
              reviewWordCount={reviewWordCount}
              timeUntilNextReview={timeUntilNextReview}
            />

          </div>
        </>
      )}
    </div>
  )
})

