export interface Course {
  id: string
  title: string
  en_title: string
  description: string
  image: string
  icon: string
  is_learned: boolean
  lesson_count: number
  progress: number
  learner_count: number
}

export interface Lesson {
  id: string
  title: string
  description: string
  image: string
  created_at: string
  updated_at: string
  is_learned: boolean
  word_count: number
}


export interface Word {
  id: number
  word: string
  pronunciation: string    
  pos: string
  meaning: string
  example: string
  example_vi: string
  audio: string
  image: string
  cefr: string
}