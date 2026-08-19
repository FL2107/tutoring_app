import { useState } from 'react'

interface AddMockModalProps {
  student: any
  onClose: () => void
  onAdd: (mock: any) => void
}

function AddMockModal({ student, onClose, onAdd }: AddMockModalProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [name, setName] = useState('')
  const [score, setScore] = useState('')

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const newMock = {
      id: Date.now(),
      date,
      name: name || `${student.exam} — вариант`,
      score: parseInt(score) || 0,
    }

    onAdd(newMock)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Добавить пробник</h2>
            <p>{student.name} · {student.subject}</p>
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
              <span>Балл *</span>
              <input
                type="number"
                min="0"
                max="100"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="85"
                required
              />
            </label>

            <label className="form-field full">
              <span>Название пробника</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={`${student.exam} — вариант №...`}
              />
            </label>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-button" onClick={onClose}>
              Отмена
            </button>

            <button type="submit" className="primary-button">
              Добавить пробник
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddMockModal