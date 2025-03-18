import { Course, Lesson, VocabularyItem } from "@/types/lesson-types";

export const mockCourses: Course[] = [
  {
    id: "c1",
    title: "Giao tiếp hàng ngày",
    description: "Các cụm từ và từ vựng cần thiết để giao tiếp trong cuộc sống hàng ngày",
    image: "/placeholder.svg?height=200&width=400",
    backgroundColor: "bg-blue-100 dark:bg-blue-900/30",
    color: "text-blue-800 dark:text-blue-400",
    icon: "💬",
    lessonsCount: 10,
    completedLessons: 4,
    userCount: 5000,
    difficulty: "beginner",
    tags: ["daily", "communication", "essential"],
    lessons: [
      {
        id: "l1",
        title: "Chào hỏi và giới thiệu",
        description: "Học cách chào hỏi và giới thiệu bản thân",
        vocabCount: 20,
        completed: true,
        progress: 100,
        courseName: "Basic Communication",
        icon: "👋",
        themeColor: "bg-blue-200 dark:bg-blue-800",
        themeFontColor: "",
        difficulty: "easy",
        estimatedTime: "15 phút",
        vocabulary: [
          {
            id: 1,
            word: "Hello",
            meaning: "Xin chào",
            example: "Hello! How are you?",
            example_vi: "Xin chào! Bạn khỏe không?",
            audio: "/audio/hello.mp3",
            image: "/images/hello.png",
            pronunciation: "/həˈloʊ/",
            level: 1
          },
          {
            id: 2,
            word: "Good morning",
            meaning: "Chào buổi sáng",
            example: "Good morning! Have a nice day!",
            example_vi: "Chào buổi sáng! Chúc một ngày tốt lành!",
            audio: "/audio/good_morning.mp3",
            image: "/images/good_morning.png",
            pronunciation: "/ɡʊd ˈmɔːrnɪŋ/",
            level: 1
          }
        ]
      },
      {
        id: "l2",
        title: "Hỏi đường",
        description: "Cách hỏi đường khi đi du lịch",
        vocabCount: 25,
        completed: false,
        progress: 60,
        courseName: "Travel Communication",
        icon: "🗺️",
        themeColor: "bg-green-200 dark:bg-green-800",
        themeFontColor: "",
        difficulty: "medium",
        estimatedTime: "20 phút",
        vocabulary: [
          {
            id: 3,
            word: "Where is the hotel?",
            meaning: "Khách sạn ở đâu?",
            example: "Excuse me, where is the hotel?",
            example_vi: "Xin lỗi, khách sạn ở đâu?",
            audio: "/audio/where_is_the_hotel.mp3",
            image: "/images/hotel.png",
            pronunciation: "/wɛr ɪz ðə hoʊˈtɛl/",
            level: 2
          }
        ]
      }
    ]
  },
  {
    id: "c2",
    title: "Tiếng Anh công sở",
    description: "Từ vựng và cụm từ sử dụng trong môi trường làm việc",
    image: "/placeholder.svg?height=200&width=400",
    backgroundColor: "bg-purple-100 dark:bg-purple-900/30",
    color: "text-purple-800 dark:text-purple-400",
    icon: "💼",
    lessonsCount: 8,
    completedLessons: 2,
    userCount: 3200,
    difficulty: "intermediate",
    tags: ["office", "business", "professional"],
    lessons: [
      {
        id: "l3",
        title: "Viết email chuyên nghiệp",
        description: "Cách viết email công việc chuyên nghiệp",
        vocabCount: 30,
        completed: false,
        progress: 30,
        courseName: "Business Writing",
        icon: "📧",
        themeColor: "bg-gray-200 dark:bg-gray-800",
        themeFontColor: "",
        difficulty: "hard",
        estimatedTime: "30 phút",
        vocabulary: [
          {
            id: 4,
            word: "Dear Sir/Madam",
            meaning: "Kính gửi ông/bà",
            example: "Dear Sir/Madam, I am writing to inquire about...",
            example_vi: "Kính gửi ông/bà, tôi viết thư để hỏi về...",
            audio: "/audio/dear_sir_madam.mp3",
            image: "/images/email.png",
            pronunciation: "/dɪr sɜr ˈmædəm/",
            level: 3
          }
        ]
      }
    ]
  }
];




export function getCourses(): Course[] {
  return mockCourses;
}

export function getAllLesson(): Lesson[] {
  return mockCourses.map((item: Course) => item.lessons).flat();
}

export function fetchLessonById(lessonId: string): Lesson {
  return getAllLesson().filter((item: Lesson) => item.id == lessonId)[0]
}

export function getAllVocab(): VocabularyItem[] {
  return getAllLesson().map((item: Lesson) => item.vocabulary).flat()
}