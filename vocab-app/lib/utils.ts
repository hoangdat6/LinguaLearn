import { TimeUntilNextReview } from "@/services/user-word-service"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getTimeUntilNextReview = (timeUntilNextReview: TimeUntilNextReview) : string => {
  const { hours, minutes, seconds } = timeUntilNextReview
  
  if(hours == 0 && minutes == 0 && seconds == 0) {
    return '0'
  }
  
  return `${hours}h ${minutes}m ${seconds}s`
}