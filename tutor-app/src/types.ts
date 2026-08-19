// Типы данных для приложения

export interface Student {
  id: number
  name: string
  exam: string // 'ЕГЭ профиль' | 'ЕГЭ база' | 'ОГЭ' | 'Олимпиада'
  subjects: Subject[]
  rate: number
  duration: number // в минутах
  format: string // 'Индивидуальный' | 'Парный' | 'Параллельный'
  payer: string
  platform: string
  balance: number
  paidLessons: number
  conductedLessons: number
  lastActivity: string // дата последнего занятия
}

export interface Subject {
  id: number
  name: string // 'Математика' | 'Информатика'
  target: number // целевой балл
  mocks: Mock[]
  progress: ProgressItem[]
  lessons: Lesson[]
}

export interface Mock {
  id: number
  date: string
  name: string
  score: number
}

export interface ProgressItem {
  id: number
  task: string // 'Задача 1', 'Задача 17' и т.д.
  subtopics: Subtopic[]
  overallProgress: number // 0-100
}

export interface Subtopic {
  id: number
  name: string // 'Треугольники', 'Окружности' и т.д.
  progress: number // 0-100
  lessonsCount: number
  lastLesson: string | null
}

export interface Lesson {
  id: number
  date: string
  duration: number
  subjectId: number
  topics: string[] // названия тем
  subtopics: string[] // названия подтем
  comment: string
  homework: string
  status: 'planned' | 'conducted' | 'cancelled'
}

export interface Payment {
  id: number
  date: string
  amount: number
  lessonsCount: number
  comment?: string
}

export interface PlanItem {
  id: number
  topic: string
  subtopic: string
  priority: 'high' | 'medium' | 'low'
  estimatedLessons: number
  status: 'pending' | 'in_progress' | 'completed'
}

// Фильтры для списка учеников
export interface StudentFilters {
  exam?: string
  subject?: string
  format?: string
  status?: 'active' | 'all'
}

// Статистика дашборда
export interface DashboardStats {
  todayLessons: number
  todayIncome: number
  todayHours: number
  totalStudents: number
  activeStudents: number
  studentsByExam: Record<string, number>
  attentionStudents: AttentionStudent[]
}

export interface AttentionStudent {
  id: number
  name: string
  issue: string
  severity: 'high' | 'medium' | 'low'
}