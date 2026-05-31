import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// Компонент шапки сайта
export default function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Проверяем, находится ли пользователь на странице авторизации
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <header style={{
      padding: '16px 32px',
      background: 'var(--bg-card)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: 'var(--shadow)'
    }}>
      {/* Логотип */}
      <h1 
        style={{ 
          cursor: 'pointer',
          background: 'var(--gradient-primary)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '1.8rem',
          fontWeight: '800'
        }}
        onClick={() => navigate(user ? '/dashboard' : '/login')}
      >
        Task Manager
      </h1>

      {/* Кнопки управления */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        
        {/* ✅ НОВАЯ КНОПКА: О проекте */}
        {!isAuthPage && (
          <button
            onClick={() => navigate('/about')}
            className="btn-secondary"
            style={{ padding: '8px 16px', fontSize: '14px' }}
          >
            ℹ️ О проекте
          </button>
        )}

        {/* Переключатель темы */}
        <button
          onClick={toggleTheme}
          className="btn-secondary"
          style={{
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {theme === 'light' ? '🌙' : '☀️'}
          {theme === 'light' ? 'Тёмная' : 'Светлая'}
        </button>

        {/* Кнопка выхода (только для авторизованных) */}
        {!isAuthPage && user && (
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="btn-danger"
            style={{ padding: '8px 16px' }}
          >
            Выйти
          </button>
        )}
      </div>
    </header>
  );
}