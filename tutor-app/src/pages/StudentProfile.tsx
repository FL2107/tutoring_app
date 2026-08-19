import { useState } from 'react'
import AddLessonModal from '../components/AddLessonModal'
import AddMockModal from '../components/AddMockModal'
import AddPaymentModal from '../components/AddPaymentModal'

interface StudentProfileProps {
  student: any
  onBack: () => void
  onUpdate: (student: any) => void
  onDelete: (id: number) => void
}

type Tab = 'overview' | 'lessons' | 'mocks' | 'progress' | 'finance'

function StudentProfile({ student, onBack, onUpdate, onDelete }: StudentProfileProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [showAddLesson, setShowAddLesson] = useState(false)
  const [showAddMock, setShowAddMock] = useState(false)
  const [showAddPayment, setShowAddPayment] = useState(false)

  const getProgressColor = (value: number) => {
    if (value >= 80) return 'high'
    if (value >= 50) return 'medium'
    return 'low'
  }

  const getOverallProgress = () => {
    if (!student.progress || Object.keys(student.progress).length === 0) return 0
    const values = Object.values(student.progress) as number[]
    const total = values.reduce((sum, v) => sum + v, 0)
    return Math.round(total / values.length)
  }

  const getMockAverage = () => {
    if (!student.mocks || student.mocks.length === 0) return 0
    const total = student.mocks.reduce((sum: number, m: any) => sum + m.score, 0)
    return Math.round(total / student.mocks.length)
  }

  const getLastMock = () => {
    if (!student.mocks || student.mocks.length === 0) return null
    const sorted = [...student.mocks].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    return sorted[0]
  }

  // Обработчики добавления
  const handleAddLesson = (lesson: any) => {
    const updatedStudent = {
      ...student,
      dates: [...(student.dates || []), lesson.date],
      conductedLessons: (student.conductedLessons || 0) + 1,
      balance: (student.balance || 0) - 1,
    }
    onUpdate(updatedStudent)
    setShowAddLesson(false)
  }

  const handleAddMock = (mock: any) => {
    const updatedStudent = {
      ...student,
      mocks: [...(student.mocks || []), mock],
      lastMock: mock.score,
    }
    onUpdate(updatedStudent)
    setShowAddMock(false)
  }

  const handleAddPayment = (payment: any) => {
    const updatedStudent = {
      ...student,
      paidLessons: (student.paidLessons || 0) + payment.lessonsCount,
      balance: (student.balance || 0) + payment.lessonsCount,
      payments: [...(student.payments || []), payment],
    }
    onUpdate(updatedStudent)
    setShowAddPayment(false)
  }

  return (
    <main className="main-content">
      {/* Шапка профиля */}
      <div className="profile-header">
        <button className="back-button" onClick={onBack}>
          ← Назад
        </button>

        <div className="profile-info">
          <div className="profile-name">
            <h1>{student.name}</h1>
            <span className="profile-badge active">Активен</span>
          </div>
          <p className="profile-subject">
            {student.exam} · {student.subject} · 🎯 {student.target} баллов
          </p>
        </div>

        <div className="profile-actions">
          <div className="profile-stats-mini">
            <div className="stat-mini">
              <span className="stat-mini-value">{student.balance > 0 ? '+' : ''}{student.balance}</span>
              <span className="stat-mini-label">занятий</span>
            </div>
            <div className="stat-mini">
              <span className="stat-mini-value">{student.rate} ₽</span>
              <span className="stat-mini-label">за урок</span>
            </div>
          </div>
          <button
            className="delete-button"
            onClick={() => onDelete(student.id)}
          >
            🗑 Удалить
          </button>
        </div>
      </div>

      {/* Вкладки */}
      <div className="profile-tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Обзор
        </button>
        <button
          className={`tab ${activeTab === 'lessons' ? 'active' : ''}`}
          onClick={() => setActiveTab('lessons')}
        >
          Занятия
        </button>
        <button
          className={`tab ${activeTab === 'mocks' ? 'active' : ''}`}
          onClick={() => setActiveTab('mocks')}
        >
          Пробники
        </button>
        <button
          className={`tab ${activeTab === 'progress' ? 'active' : ''}`}
          onClick={() => setActiveTab('progress')}
        >
          Прогресс
        </button>
        <button
          className={`tab ${activeTab === 'finance' ? 'active' : ''}`}
          onClick={() => setActiveTab('finance')}
        >
          Финансы
        </button>
      </div>

      {/* Содержимое вкладок */}
      <div className="profile-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            {/* Карточки статистики */}
            <div className="overview-stats">
              <div className="stat-card">
                <div className="stat-label">🎯 Целевой балл</div>
                <div className="stat-value">{student.target}</div>
                <div className="stat-description">из 100</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">📈 Последний пробник</div>
                <div className="stat-value">{getLastMock()?.score || '—'}</div>
                <div className="stat-description">
                  {getLastMock() ? (
                    getLastMock().score >= student.target ? '✅ Цель достигнута' : `Осталось ${student.target - getLastMock().score} баллов`
                  ) : 'Нет пробников'}
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">💰 Занятий</div>
                <div className={`stat-value ${student.balance < 0 ? 'negative' : ''}`}>
                  {student.balance > 0 ? '+' : ''}{student.balance}
                </div>
                <div className="stat-description">
                  {student.balance < 0 ? '🔴 Требуется оплата' : '✅ Оплачено'}
                </div>
              </div>
            </div>

            {/* Следующее занятие */}
            <div className="overview-next-lesson">
              <h3>Следующее занятие</h3>
              {student.dates && student.dates.length > 0 ? (
                <div className="next-lesson-card">
                  <div className="next-lesson-date">
                    <strong>{new Date(student.dates[0]).toLocaleDateString('ru-RU')}</strong>
                    <span>18:00</span>
                  </div>
                  <div className="next-lesson-info">
                    <span>{student.duration} минут · {student.format}</span>
                    <span>📱 {student.platform}</span>
                  </div>
                  <div className="next-lesson-topic">
                    {student.subject} → Основные темы
                  </div>
                </div>
              ) : (
                <p className="no-data">Нет запланированных занятий</p>
              )}
            </div>

            {/* Прогресс */}
            <div className="overview-progress">
              <h3>Прогресс</h3>
              <div className="progress-overview">
                <div className="progress-item-large">
                  <div className="progress-label">
                    <span>Пробники</span>
                    <span>{getLastMock()?.score || 0} / {student.target}</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className={`progress-fill ${getProgressColor((getLastMock()?.score || 0) / student.target * 100)}`}
                      style={{ width: `${Math.min((getLastMock()?.score || 0) / student.target * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="progress-item-large">
                  <div className="progress-label">
                    <span>Программа</span>
                    <span>{getOverallProgress()}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className={`progress-fill ${getProgressColor(getOverallProgress())}`}
                      style={{ width: `${getOverallProgress()}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Что требует внимания */}
            <div className="overview-attention">
              <h3>⚠ Что требует внимания</h3>
              <div className="attention-list">
                {student.progress && Object.entries(student.progress)
                  .filter(([_, value]) => (value as number) < 50)
                  .slice(0, 3)
                  .map(([task, value]) => (
                    <div key={task} className="attention-item danger">
                      <span className="attention-icon">!</span>
                      <div>
                        <strong>{task}</strong>
                        <p>Прогресс: {value}%</p>
                      </div>
                    </div>
                  ))}
                {student.balance < 0 && (
                  <div className="attention-item danger">
                    <span className="attention-icon">!</span>
                    <div>
                      <strong>Отрицательный баланс</strong>
                      <p>Осталось {student.balance} занятий</p>
                    </div>
                  </div>
                )}
                {(!student.progress || Object.keys(student.progress).length === 0) && (
                  <div className="attention-item warning">
                    <span className="attention-icon">!</span>
                    <div>
                      <strong>Нет данных о прогрессе</strong>
                      <p>Добавьте информацию о задачах</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lessons' && (
          <div className="lessons-tab">
            <div className="tab-header">
              <h2>Журнал занятий</h2>
              <button className="primary-button" onClick={() => setShowAddLesson(true)}>
                + Добавить занятие
              </button>
            </div>
            <div className="lessons-list">
              {student.dates && student.dates.length > 0 ? (
                student.dates.map((date: string, index: number) => (
                  <div key={index} className="lesson-item">
                    <div className="lesson-item-date">
                      <strong>{new Date(date).toLocaleDateString('ru-RU')}</strong>
                      <span>18:00</span>
                    </div>
                    <div className="lesson-item-info">
                      <span>{student.duration} минут</span>
                      <span className="lesson-status conducted">● Проведено</span>
                    </div>
                    <div className="lesson-item-topics">
                      <span className="topic-tag">{student.subject}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data">Нет проведенных занятий</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'mocks' && (
          <div className="mocks-tab">
            <div className="tab-header">
              <h2>Пробники</h2>
              <button className="primary-button" onClick={() => setShowAddMock(true)}>
                + Добавить пробник
              </button>
            </div>

            {student.mocks && student.mocks.length > 0 ? (
              <>
                {/* Статистика */}
                <div className="mock-stats">
                  <div className="mock-stat">
                    <span className="mock-stat-label">Средний балл</span>
                    <span className="mock-stat-value">{getMockAverage()}</span>
                  </div>
                  <div className="mock-stat">
                    <span className="mock-stat-label">Лучший результат</span>
                    <span className="mock-stat-value">
                      {Math.max(...student.mocks.map((m: any) => m.score))}
                    </span>
                  </div>
                  <div className="mock-stat">
                    <span className="mock-stat-label">Цель</span>
                    <span className="mock-stat-value">{student.target}</span>
                  </div>
                </div>

                {/* График динамики */}
                <div className="mock-chart">
                  <div className="chart-header">
                    <span>Динамика пробников</span>
                    <span className="chart-target">Цель: {student.target}</span>
                  </div>
                  <div className="chart-container">
                    {student.mocks
                      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .map((mock: any, index: number) => (
                        <div key={index} className="chart-bar-wrapper">
                          <div className="chart-bar-label">
                            {new Date(mock.date).toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' })}
                          </div>
                          <div className="chart-bar-container">
                            <div
                              className={`chart-bar ${mock.score >= student.target ? 'achieved' : ''}`}
                              style={{ height: `${Math.min(mock.score, 100)}%` }}
                            />
                          </div>
                          <div className="chart-bar-value">{mock.score}</div>
                        </div>
                      ))}
                    <div className="chart-target-line" style={{ bottom: `${Math.min(student.target, 100)}%` }}>
                      <span className="chart-target-label">Цель {student.target}</span>
                    </div>
                  </div>
                </div>

                {/* Таблица */}
                <div className="mocks-table">
                  <div className="table-header">
                    <span>Дата</span>
                    <span>Название</span>
                    <span>Балл</span>
                  </div>
                  {student.mocks
                    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((mock: any, index: number) => (
                      <div key={index} className="table-row">
                        <span>{new Date(mock.date).toLocaleDateString('ru-RU')}</span>
                        <span>{mock.name}</span>
                        <span className={`mock-score ${mock.score >= student.target ? 'achieved' : ''}`}>
                          {mock.score}
                        </span>
                      </div>
                    ))}
                </div>
              </>
            ) : (
              <p className="no-data">Нет данных о пробниках</p>
            )}
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="progress-tab">
            <div className="tab-header">
              <h2>Прогресс по задачам</h2>
              <div className="overall-progress-badge">
                Общий прогресс: {getOverallProgress()}%
              </div>
            </div>
            <div className="progress-list">
              {student.progress && Object.keys(student.progress).length > 0 ? (
                Object.entries(student.progress).map(([task, value]) => (
                  <div key={task} className="progress-item">
                    <div className="progress-label">
                      <span>{task}</span>
                      <span className="progress-percent">{value}%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className={`progress-fill ${getProgressColor(value as number)}`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data">Нет данных о прогрессе</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'finance' && (
          <div className="finance-tab">
            <div className="finance-summary">
              <div className="finance-card">
                <div className="finance-label">💰 Ставка за урок</div>
                <div className="finance-value">{student.rate} ₽</div>
                <div className="finance-detail">{student.duration} минут</div>
              </div>
              <div className="finance-card">
                <div className="finance-label">📚 Оплачено занятий</div>
                <div className="finance-value">{student.paidLessons}</div>
                <div className="finance-detail">Всего оплачено</div>
              </div>
              <div className="finance-card">
                <div className="finance-label">📝 Проведено занятий</div>
                <div className="finance-value">{student.conductedLessons}</div>
                <div className="finance-detail">Всего проведено</div>
              </div>
              <div className="finance-card">
                <div className="finance-label">📊 Баланс</div>
                <div className={`finance-value ${student.balance < 0 ? 'negative' : ''}`}>
                  {student.balance > 0 ? '+' : ''}{student.balance}
                </div>
                <div className="finance-detail">
                  {student.balance < 0 ? '🔴 Долг' : '✅ Остаток'}
                </div>
              </div>
            </div>

            <div className="finance-details">
              <div className="finance-info">
                <div className="info-row">
                  <span className="info-label">Формат:</span>
                  <span>{student.format}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Плательщик:</span>
                  <span>{student.payer}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Платформа:</span>
                  <span>{student.platform}</span>
                </div>
              </div>
              <button className="secondary-button" onClick={() => setShowAddPayment(true)}>
                + Добавить оплату
              </button>
            </div>

            {/* История платежей */}
            <div className="payment-history">
              <h4>История платежей</h4>
              <div className="payments-list">
                {student.payments && student.payments.length > 0 ? (
                  student.payments
                    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((payment: any) => (
                      <div key={payment.id} className="payment-item">
                        <span className="payment-date">{new Date(payment.date).toLocaleDateString('ru-RU')}</span>
                        <span className="payment-amount positive">+{payment.amount} ₽</span>
                        <span className="payment-lessons">{payment.lessonsCount} занятий</span>
                        {payment.comment && <span className="payment-comment">{payment.comment}</span>}
                      </div>
                    ))
                ) : (
                  <p className="no-data">Нет платежей</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Модальные окна */}
      {showAddLesson && (
        <AddLessonModal
          student={student}
          onClose={() => setShowAddLesson(false)}
          onAdd={handleAddLesson}
        />
      )}
      {showAddMock && (
        <AddMockModal
          student={student}
          onClose={() => setShowAddMock(false)}
          onAdd={handleAddMock}
        />
      )}
      {showAddPayment && (
        <AddPaymentModal
          student={student}
          onClose={() => setShowAddPayment(false)}
          onAdd={handleAddPayment}
        />
      )}
    </main>
  )
}

export default StudentProfile