
export interface Course {
  id: string
  title: string
  description: string
  image: string
  backgroundColor: string
  color: string
  icon: string
  lessonsCount: number
  completedLessons: number
  userCount: number
  difficulty: string
  tags: string[]
  lessons: Lesson[]
}


export interface Lesson {
  id: string
  title: string
  description: string
  vocabCount: number
  completed: boolean
  progress: number
  courseName: string
  icon: string
  themeColor: string
  themeFontColor: string
  difficulty: string
  estimatedTime: string
  vocabulary: VocabularyItem[]
}


export interface VocabularyItem {
  id: number
  word: string
  meaning: string
  example: string
  example_vi: string
  audio: string
  image: string
  pronunciation: string
  level: number
}