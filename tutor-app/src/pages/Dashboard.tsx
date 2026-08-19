function Dashboard() {
  return (
    <main className="main-content">
      <header className="header">
        <div>
          <h1>Добрый день 👋</h1>
          <p>Вот что происходит сегодня</p>
        </div>

        <div className="date">
          9 августа 2026
        </div>
      </header>

      <section className="stats">
        <div className="stat-card">
          <div className="stat-label">Занятия сегодня</div>
          <div className="stat-value">4</div>
          <div className="stat-description">2 уже проведено</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Доход сегодня</div>
          <div className="stat-value">8 000 ₽</div>
          <div className="stat-description">4 занятия</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Требуют внимания</div>
          <div className="stat-value">3</div>
          <div className="stat-description">ученика</div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <h2>Ближайшие занятия</h2>
            <p>Сегодня, 9 августа</p>
          </div>

          <button className="secondary-button">
            Все занятия →
          </button>
        </div>

        <div className="lessons">
          <div className="lesson-card">
            <div className="lesson-time">
              <strong>18:00</strong>
              <span>90 мин</span>
            </div>

            <div className="lesson-info">
              <strong>Иван Петров</strong>
              <span>Математика · ЕГЭ профиль</span>
            </div>

            <div className="lesson-topic">
              Окружности
            </div>
          </div>

          <div className="lesson-card">
            <div className="lesson-time">
              <strong>19:30</strong>
              <span>50 мин</span>
            </div>

            <div className="lesson-info">
              <strong>Мария Иванова</strong>
              <span>Информатика · ЕГЭ</span>
            </div>

            <div className="lesson-topic">
              Задача №27
            </div>
          </div>

          <div className="lesson-card">
            <div className="lesson-time">
              <strong>21:00</strong>
              <span>90 мин</span>
            </div>

            <div className="lesson-info">
              <strong>Алексей Смирнов</strong>
              <span>Математика · ЕГЭ профиль</span>
            </div>

            <div className="lesson-topic">
              Параметры
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <h2>Требуют внимания</h2>
            <p>Ученики, которым сейчас нужна твоя помощь</p>
          </div>
        </div>

        <div className="attention-grid">
          <div className="attention-card danger">
            <span className="attention-icon">!</span>
            <div>
              <strong>Иван Петров</strong>
              <p>Осталось −2 оплаченных занятия</p>
            </div>
          </div>

          <div className="attention-card warning">
            <span className="attention-icon">!</span>
            <div>
              <strong>Мария Иванова</strong>
              <p>Нет пробника больше 30 дней</p>
            </div>
          </div>

          <div className="attention-card warning">
            <span className="attention-icon">!</span>
            <div>
              <strong>Алексей Смирнов</strong>
              <p>Задача №17: прогресс 25%</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Dashboard