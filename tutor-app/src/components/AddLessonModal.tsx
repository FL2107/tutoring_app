import { useState } from 'react'

interface AddLessonModalProps {
  student: any
  onClose: () => void
  onAdd: (lesson: any) => void
}

function AddLessonModal({ student, onClose, onAdd }: AddLessonModalProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [duration, setDuration] = useState(student.duration)
  const [topics, setTopics] = useState('')
  const [subtopics, setSubtopics] = useState('')
  const [comment, setComment] = useState('')
  const [homework, setHomework] = useState('')
  const [status, setStatus] = useState('conducted')

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const newLesson = {
      id: Date.now(),
      date,
      duration: parseInt(duration),
      topics: topics.split(',').map(t => t.trim()).filter(Boolean),
      subtopics: subtopics.split(',').map(t => t.trim()).filter(Boolean),
      comment,
      homework,
      status,
    }

    onAdd(newLesson)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Добавить занятие</h2>
            <p>{student.name}</p>
          </div>

          <button type="button" className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <label className="form-field">
              <span>Дата *</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </label>

            <label className="form-field">
              <span>Длительность (мин)</span>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="10"
                max="180"
              />
            </label>

            <label className="form-field">
              <span>Статус</span>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="conducted">Проведено</option>
                <option value="planned">Запланировано</option>
                <option value="cancelled">Отменено</option>
              </select>
            </label>

            <label className="form-field full">
              <span>Темы (через запятую)</span>
              <input
                value={topics}
                onChange={(e) => setTopics(e.target.value)}
                placeholder="Например: Окружности, Вписанные углы"
              />
            </label>

            <label className="form-field full">
              <span>Подтемы (через запятую)</span>
              <input
                value={subtopics}
                onChange={(e) => setSubtopics(e.target.value)}
                placeholder="Например: Треугольники, Четырёхугольники"
              />
            </label>

            <label className="form-field full">
              <span>Комментарий</span>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Что делали, замечания..."
                rows={3}
              />
            </label>

            <label className="form-field full">
              <span>Домашнее задание</span>
              <textarea
                value={homework}
                onChange={(e) => setHomework(e.target.value)}
                placeholder="Что задано на дом..."
                rows={3}
              />
            </label>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-button" onClick={onClose}>
              Отмена
            </button>

            <button type="submit" className="primary-button">
              Добавить занятие
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddLessonModal