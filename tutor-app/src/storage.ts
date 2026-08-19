import { invoke } from '@tauri-apps/api/tauri'
import { appDir, join } from '@tauri-apps/api/path'
import { writeTextFile, readTextFile, exists } from '@tauri-apps/api/fs'

// Тип для ученика
export interface Student {
  id: number
  name: string
  exam: string
  subject: string
  target: number
  rate: number
  duration: number
  format: string
  payer: string
  platform: string
  balance: number
  paidLessons: number
  conductedLessons: number
  dates: string[]
  lastMock: number
  mocks: any[]
  progress: Record<string, number>
}

// Класс для работы с данными через файл JSON
class Storage {
  private filePath: string | null = null

  async init() {
    try {
      const dir = await appDir()
      this.filePath = await join(dir, 'students.json')
      console.log('Storage path:', this.filePath)
    } catch (error) {
      console.error('Error initializing storage:', error)
    }
  }

  async getAllStudents(): Promise<Student[]> {
    if (!this.filePath) await this.init()

    try {
      const existsFile = await exists(this.filePath!)
      if (!existsFile) {
        // Возвращаем начальные данные
        return this.getDefaultStudents()
      }

      const content = await readTextFile(this.filePath!)
      return JSON.parse(content)
    } catch (error) {
      console.error('Error reading students:', error)
      return this.getDefaultStudents()
    }
  }

  async saveStudents(students: Student[]): Promise<void> {
    if (!this.filePath) await this.init()

    try {
      await writeTextFile(this.filePath!, JSON.stringify(students, null, 2))
    } catch (error) {
      console.error('Error saving students:', error)
      throw error
    }
  }

  private getDefaultStudents(): Student[] {
    return [
      {
        id: 1,
        name: 'Иван Петров',
        exam: 'ЕГЭ профиль',
        subject: 'Математика',
        target: 85,
        rate: 2000,
        duration: 90,
        format: 'Индивидуальный',
        payer: 'Анна Петрова',
        platform: 'Zoom',
        balance: 3,
        paidLessons: 8,
        conductedLessons: 5,
        dates: ['2026-08-12', '2026-08-10', '2026-08-07', '2026-08-05', '2026-08-03'],
        lastMock: 78,
        mocks: [
          { date: '2026-08-05', name: 'ЕГЭ профиль №15', score: 84 },
          { date: '2026-08-01', name: 'ЕГЭ профиль №14', score: 81 },
          { date: '2026-07-25', name: 'ЕГЭ профиль №13', score: 78 },
          { date: '2026-07-18', name: 'ЕГЭ профиль №12', score: 76 },
        ],
        progress: {
          'Задача 1': 95,
          'Задача 2': 80,
          'Задача 3': 90,
          'Задача 17': 50,
          'Задача 18': 30,
          'Задача 19': 10,
        }
      },
      {
        id: 2,
        name: 'Мария Иванова',
        exam: 'ЕГЭ',
        subject: 'Информатика',
        target: 90,
        rate: 1500,
        duration: 50,
        format: 'Индивидуальный',
        payer: 'Иван Иванов',
        platform: 'Teams',
        balance: -1,
        paidLessons: 4,
        conductedLessons: 5,
        dates: ['2026-08-11', '2026-08-08', '2026-08-06', '2026-08-04', '2026-08-01'],
        lastMock: 65,
        mocks: [
          { date: '2026-08-04', name: 'ЕГЭ информатика №8', score: 68 },
          { date: '2026-07-28', name: 'ЕГЭ информатика №7', score: 65 },
          { date: '2026-07-21', name: 'ЕГЭ информатика №6', score: 60 },
        ],
        progress: {
          'Задача 1': 90,
          'Задача 2': 75,
          'Задача 27': 45,
        }
      },
      {
        id: 3,
        name: 'Алексей Смирнов',
        exam: 'ЕГЭ профиль',
        subject: 'Математика',
        target: 80,
        rate: 2000,
        duration: 90,
        format: 'Парный',
        payer: 'Елена Смирнова',
        platform: 'Zoom',
        balance: 6,
        paidLessons: 10,
        conductedLessons: 4,
        dates: ['2026-08-13', '2026-08-09', '2026-08-06', '2026-08-03'],
        lastMock: 72,
        mocks: [
          { date: '2026-08-07', name: 'ЕГЭ профиль №14', score: 72 },
          { date: '2026-07-31', name: 'ЕГЭ профиль №13', score: 68 },
        ],
        progress: {
          'Задача 1': 95,
          'Задача 2': 85,
          'Задача 17': 25,
        }
      },
    ]
  }
}

export const storage = new Storage()