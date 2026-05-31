// Страница "О проекте" (ленивая загрузка)
export default function About() {
  return (
    <div className="fade-in" style={{
      minHeight: 'calc(100vh - 73px)',
      padding: '40px 20px',
      background: 'var(--bg-primary)',
      textAlign: 'center'
    }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{
          background: 'var(--gradient-primary)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '24px'
        }}>
          О проекте Task Manager
        </h1>
        
        <div className="card" style={{ marginBottom: '24px' }}>
          <h2 style={{ marginBottom: '16px' }}>📚 Стек технологий</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            textAlign: 'left'
          }}>
            <div>
              <h3>Frontend</h3>
              <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                <li>React 18</li>
                <li>Vite</li>
                <li>React Router</li>
                <li>Axios</li>
              </ul>
            </div>
            <div>
              <h3>Backend</h3>
              <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                <li>Node.js</li>
                <li>Express</li>
                <li>PostgreSQL</li>
                <li>JWT + RBAC</li>
              </ul>
            </div>
            <div>
              <h3>DevOps</h3>
              <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                <li>Docker</li>
                <li>RabbitMQ</li>
                <li>Jest (тесты)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 style={{ marginBottom: '16px' }}>🎯 Функциональность</h2>
          <ul style={{ 
            color: 'var(--text-secondary)', 
            lineHeight: '2',
            listStyle: 'none',
            padding: 0
          }}>
            <li>✅ Регистрация и авторизация (JWT)</li>
            <li>✅ Ролевая модель (Admin/User)</li>
            <li>✅ CRUD операции с задачами</li>
            <li>✅ Асинхронная обработка (RabbitMQ)</li>
            <li>✅ Retry Logic с экспоненциальной задержкой</li>
            <li>✅ Dead Letter Queue</li>
            <li>✅ Тёмная/светлая тема</li>
            <li>✅ Lazy Loading компонентов</li>
          </ul>
        </div>
      </div>
    </div>
  );
}