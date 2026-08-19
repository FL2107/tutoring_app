import { useState } from 'react'

interface StudentsProps {
  students: any[]
  onOpenStudent: (id: number) => void
  onAddStudent: (student: any) => void
}

function Students({ students, onOpenStudent, onAddStudent }: StudentsProps) {
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterExam, setFilterExam] = useState<string>('')
  const [filterFormat, setFilterFormat] = useState<string>('')

  // Фильтрация учеников
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.subject.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesExam = !filterExam || student.exam === filterExam
    const matchesFormat = !filterFormat || student.format === filterFormat

    return matchesSearch && matchesExam && matchesFormat
  })

  // Подсчет учеников с проблемами
  const studentsWithIssues = students.filter(s => s.balance < 0).length

  return (
    <main className="main-content">
      <header className="header">
        <div>
          <h1>Ученики</h1>
          <p>{students.length} активных учеников</p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() => setShowForm(true)}
        >
          + Новый ученик
        </button>
      </header>

      {/* Предупреждения */}
      {studentsWithIssues > 0 && (
        <div className="alert-banner warning">
          ⚠ {studentsWithIssues} ученик{studentsWithIssues > 1 ? 'а' : ''} с отрицательным балансом
        </div>
      )}

      <div className="students-toolbar">
        <input
          className="search-input"
          placeholder="🔍 Поиск ученика..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="filter-select"
          value={filterExam}
          onChange={(e) => setFilterExam(e.target.value)}
        >
          <option value="">Все экзамены</option>
          <option value="ЕГЭ профиль">ЕГЭ профиль</option>
          <option value="ЕГЭ база">ЕГЭ база</option>
          <option value="ЕГЭ">ЕГЭ</option>
          <option value="ОГЭ">ОГЭ</option>
          <option value="Олимпиада">Олимпиада</option>
        </select>

        <select
          className="filter-select"
          value={filterFormat}
          onChange={(e) => setFilterFormat(e.target.value)}
        >
          <option value="">Все форматы</option>
          <option value="Индивидуальный">Индивидуальный</option>
          <option value="Парный">Парный</option>
          <option value="Параллельный">Параллельный</option>
        </select>
      </div>

      {/* Быстрые фильтры */}
      <div className="quick-filters">
        <button
          className={`quick-filter ${!filterExam && !filterFormat ? 'active' : ''}`}
          onClick={() => { setFilterExam(''); setFilterFormat('') }}
        >
          Все ({students.length})
        </button>
        <button
          className={`quick-filter ${filterExam === 'ЕГЭ профиль' ? 'active' : ''}`}
          onClick={() => setFilterExam('ЕГЭ профиль')}
        >
          ЕГЭ профиль ({students.filter(s => s.exam === 'ЕГЭ профиль').length})
        </button>
        <button
          className={`quick-filter ${filterExam === 'ЕГЭ' ? 'active' : ''}`}
          onClick={() => setFilterExam('ЕГЭ')}
        >
          ЕГЭ ({students.filter(s => s.exam === 'ЕГЭ').length})
        </button>
        <button
          className={`quick-filter ${filterExam === 'ОГЭ' ? 'active' : ''}`}
          onClick={() => setFilterExam('ОГЭ')}
        >
          ОГЭ ({students.filter(s => s.exam === 'ОГЭ').length})
        </button>
        <button
          className={`quick-filter ${filterExam === 'Олимпиада' ? 'active' : ''}`}
          onClick={() => setFilterExam('Олимпиада')}
        >
          Олимпиада ({students.filter(s => s.exam === 'Олимпиада').length})
        </button>
      </div>

      <div className="students-list">
        {filteredStudents.map((student) => (
          <div
            className="student-card"
            key={student.id}
            onClick={() => onOpenStudent(student.id)}
            style={{ cursor: 'pointer' }}
          >
            <div className="student-main">
              <div className="student-avatar">
                {student.name.charAt(0)}
              </div>

              <div>
                <h3>{student.name}</h3>
                <p className="student-exam">
                  {student.exam} · {student.subject}
                </p>
                <span className="student-target">
                  🎯 Цель: {student.target} баллов ·
                  💰 {student.rate.toLocaleString('ru-RU')} ₽ / {student.duration} мин
                </span>
                <div className="student-meta">
                  <span>📚 Оплачено: {student.paidLessons}</span>
                  <span>📝 Проведено: {student.conductedLessons}</span>
                </div>
              </div>
            </div>

            <div className={`balance ${student.balance < 0 ? 'negative' : ''}`}>
              <strong>
                {student.balance > 0 ? '+' : ''}
                {student.balance}
              </strong>
              <span>занятий</span>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <StudentForm
          onClose={() => setShowForm(false)}
          onAdd={(newStudent) => {
            onAddStudent(newStudent)
            setShowForm(false)
          }}
        />
      )}
    </main>
  )
}

interface StudentFormProps {
  onClose: () => void
  onAdd: (student: any) => void
}

function StudentForm({ onClose, onAdd }: StudentFormProps) {
  const [name, setName] = useState('')
  const [goal, setGoal] = useState('ЕГЭ профиль')
  const [subject, setSubject] = useState('Математика')
  const [targetScore, setTargetScore] = useState('')
  const [rate, setRate] = useState('')
  const [duration, setDuration] = useState('90')
  const [format, setFormat] = useState('Индивидуальный')
  const [payer, setPayer] = useState('')
  const [platform, setPlatform] = useState('Zoom')
  const [paidLessons, setPaidLessons] = useState('')

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const newStudent = {
      name,
      exam: goal,
      subject,
      target: parseInt(targetScore) || 0,
      rate: parseInt(rate) || 0,
      duration: parseInt(duration),
      format,
      payer: payer || 'Не указан',
      platform,
      balance: parseInt(paidLessons) || 0,
      paidLessons: parseInt(paidLessons) || 0,
      conductedLessons: 0,
      dates: [],
      lastMock: 0,
      mocks: [],
      progress: {},
    }

    onAdd(newStudent)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Новый ученик</h2>
            <p>Основная информация об ученике</p>
          </div>

          <button type="button" className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <label className="form-field full">
              <span>Имя ученика *</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Например, Иван Петров"
                autoFocus
                required
              />
            </label>

            <label className="form-field">
              <span>Цель</span>
              <select value={goal} onChange={(event) => setGoal(event.target.value)}>
                <option>ЕГЭ профиль</option>
                <option>ЕГЭ база</option>
                <option>ЕГЭ</option>
                <option>ОГЭ</option>
                <option>Олимпиада</option>
              </select>
            </label>

            <label className="form-field">
              <span>Предмет</span>
              <select value={subject} onChange={(event) => setSubject(event.target.value)}>
                <option>Математика</option>
                <option>Информатика</option>
                <option>Физика</option>
                <option>Другой</option>
              </select>
            </label>

            <label className="form-field">
              <span>Целевой балл</span>
              <input
                type="number"
                min="0"
                max="100"
                value={targetScore}
                onChange={(event) => setTargetScore(event.target.value)}
                placeholder="85"
              />
            </label>

            <label className="form-field">
              <span>Ставка за урок *</span>
              <input
                type="number"
                min="0"
                value={rate}
                onChange={(event) => setRate(event.target.value)}
                placeholder="2000"
                required
              />
            </label>

            <label className="form-field">
              <span>Длительность</span>
              <select value={duration} onChange={(event) => setDuration(event.target.value)}>
                <option value="50">50 минут</option>
                <option value="60">60 минут</option>
                <option value="90">90 минут</option>
                <option value="120">120 минут</option>
              </select>
            </label>

            <label className="form-field">
              <span>Формат</span>
              <select value={format} onChange={(event) => setFormat(event.target.value)}>
                <option>Индивидуальный</option>
                <option>Парный</option>
                <option>Параллельный</option>
              </select>
            </label>

            <label className="form-field">
              <span>Оплата от</span>
              <input
                value={payer}
                onChange={(event) => setPayer(event.target.value)}
                placeholder="Например, Анна Иванова"
              />
            </label>

            <label className="form-field">
              <span>Платформа</span>
              <select value={platform} onChange={(event) => setPlatform(event.target.value)}>
                <option>Zoom</option>
                <option>Microsoft Teams</option>
                <option>Google Meet</option>
                <option>Другое</option>
              </select>
            </label>

            <label className="form-field">
              <span>Оплачено занятий</span>
              <input
                type="number"
                min="0"
                value={paidLessons}
                onChange={(event) => setPaidLessons(event.target.value)}
                placeholder="0"
              />
            </label>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-button" onClick={onClose}>
              Отмена
            </button>

            <button type="submit" className="primary-button">
              Создать ученика
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Students