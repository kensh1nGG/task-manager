import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// Страница входа
export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  // Обработка формы входа
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', { username, password });
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert('Ошибка входа: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="fade-in" style={{
      minHeight: 'calc(100vh - 73px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'var(--bg-primary)'
    }}>
      <div className="card" style={{ 
        width: '100%', 
        maxWidth: '450px', 
        padding: '48px',
        background: 'var(--bg-card)'
      }}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '32px',
          fontSize: '2rem',
          background: 'var(--gradient-primary)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Вход в систему
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              fontSize: '14px'
            }}>
              Логин
            </label>
            <input 
              placeholder="Введите логин" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div style={{ marginBottom: '28px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              fontSize: '14px'
            }}>
              Пароль
            </label>
            <input 
              type="password" 
              placeholder="Введите пароль" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button 
            type="submit" 
            className="btn-primary" 
            style={{ 
              width: '100%', 
              padding: '14px',
              fontSize: '16px',
              fontWeight: '700'
            }}
          >
            Войти
          </button>
        </form>
        <p style={{ 
          textAlign: 'center', 
          marginTop: '28px', 
          color: 'var(--text-secondary)',
          fontSize: '14px'
        }}>
          Нет аккаунта? <Link to="/register" style={{ fontWeight: '600' }}>Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
}