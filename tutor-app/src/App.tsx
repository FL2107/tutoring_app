import { useState, useEffect } from 'react'
import './App.css'

import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import StudentProfile from './pages/StudentProfile'
import { storage } from './storage'

type Page = 'dashboard' | 'students' | 'student'

// Начальные данные
const defaultStudents = [
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

function App() {
  const [page, setPage] = useState<Page>('dashboard')
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null)
  const [students, setStudents] = useState(defaultStudents)
  const [isLoading, setIsLoading] = useState(true)

  // Загружаем данные при старте
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await storage.getAllStudents()
        if (data && data.length > 0) {
          setStudents(data)
        }
      } catch (error) {
        console.error('Error loading students:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  // Сохраняем данные при изменении
  useEffect(() => {
    if (!isLoading) {
      storage.saveStudents(students).catch(error => {
        console.error('Error saving students:', error)
      })
    }
  }, [students, isLoading])

  const handleOpenStudent = (id: number) => {
    setSelectedStudentId(id)
    setPage('student')
  }

  const handleBackToStudents = () => {
    setPage('students')
    setSelectedStudentId(null)
  }

  const handleAddStudent = (newStudent: any) => {
    const studentWithId = {
      ...newStudent,
      id: students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1,
      mocks: [],
      progress: {},
      dates: [],
      conductedLessons: 0,
      lastMock: 0,
    }
    setStudents([...students, studentWithId])
  }

  const handleUpdateStudent = (updatedStudent: any) => {
    setStudents(students.map(s =>
      s.id === updatedStudent.id ? updatedStudent : s
    ))
  }

  const handleDeleteStudent = (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этого ученика?')) {
      setStudents(students.filter(s => s.id !== id))
      if (selectedStudentId === id) {
        handleBackToStudents()
      }
    }
  }

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner">Загрузка...</div>
      </div>
    )
  }

  const selectedStudent = students.find(s => s.id === selectedStudentId)

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <span className="logo-icon">🎓</span>
          <span>Tutor</span>
        </div>

        <nav className="navigation">
          <button
            className={`nav-item ${page === 'dashboard' ? 'active' : ''}`}
            onClick={() => setPage('dashboard')}
          >
            <span>⌂</span>
            Дашборд
          </button>

          <button
            className={`nav-item ${page === 'students' || page === 'student' ? 'active' : ''}`}
            onClick={() => {
              setPage('students')
              setSelectedStudentId(null)
            }}
          >
            <span>♙</span>
            Ученики
          </button>

          <button className="nav-item">
            <span>▣</span>
            Расписание
          </button>

          <button className="nav-item">
            <span>₽</span>
            Финансы
          </button>

          <button className="nav-item">
            <span>↗</span>
            Аналитика
          </button>
        </nav>

        <button className="nav-item settings">
          <span>⚙</span>
          Настройки
        </button>
      </aside>

      {page === 'dashboard' && <Dashboard />}
      {page === 'students' && (
        <Students
          students={students}
          onOpenStudent={handleOpenStudent}
          onAddStudent={handleAddStudent}
        />
      )}
      {page === 'student' && selectedStudent && (
        <StudentProfile
          student={selectedStudent}
          onBack={handleBackToStudents}
          onUpdate={handleUpdateStudent}
          onDelete={handleDeleteStudent}
        />
      )}
    </div>
  )
}

export default App