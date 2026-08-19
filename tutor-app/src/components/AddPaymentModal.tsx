import { useState } from 'react'

interface AddPaymentModalProps {
  student: any
  onClose: () => void
  onAdd: (payment: any) => void
}

function AddPaymentModal({ student, onClose, onAdd }: AddPaymentModalProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [amount, setAmount] = useState('')
  const [lessonsCount, setLessonsCount] = useState('')
  const [comment, setComment] = useState('')

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const newPayment = {
      id: Date.now(),
      date,
      amount: parseInt(amount) || 0,
      lessonsCount: parseInt(lessonsCount) || 0,
      comment,
    }

    onAdd(newPayment)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Добавить оплату</h2>
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
              <span>Сумма *</span>
              <input
                type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="5000"
                required
              />
            </label>

            <label className="form-field">
              <span>Количество занятий *</span>
              <input
                type="number"
                min="1"
                value={lessonsCount}
                onChange={(e) => setLessonsCount(e.target.value)}
                placeholder="4"
                required
              />
            </label>

            <label className="form-field full">
              <span>Комментарий</span>
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Дополнительная информация..."
              />
            </label>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-button" onClick={onClose}>
              Отмена
            </button>

            <button type="submit" className="primary-button">
              Добавить оплату
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddPaymentModal