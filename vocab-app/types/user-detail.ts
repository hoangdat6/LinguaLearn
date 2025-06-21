export type UserDetail = {
  name: string
  email: string
  avatar: string
  phone: string
  birthday: string
  address: string
  bio: string
  language: string
  joinedDate: string
  level: string
  streak: number
  completedLessons: number
  totalLessons: number
  completedTopics: number
  totalTopics: number
  learningTime: string
  subscription: string
  subscriptionExpiry: string
  paymentMethod: string
}


export type UserProfile = {
  id: string
  username: string
  email: string
  avatar?: string
  joinedDate?: string
  streak?: string
}