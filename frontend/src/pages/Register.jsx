import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// Страница регистрации
export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const navigate = useNavigate();
  const { login } = useAuth();

  // Обработка формы регистрации
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/register', { username, password, role });
      const loginRes = await axios.post('/api/auth/login', { username, password });
      login(loginRes.data.user, loginRes.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert('Ошибка регистрации: ' + (err.response?.data?.error || err.message));
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
          Регистрация
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
              placeholder="Придумайте логин" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div style={{ marginBottom: '24px' }}>
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
              placeholder="Придумайте пароль" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
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
              Роль
            </label>
            <select 
              value={role} 
              onChange={e => setRole(e.target.value)}
            >
              <option value="user">Пользователь</option>
              <option value="admin">Администратор</option>
            </select>
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
            Зарегистрироваться
          </button>
        </form>
        <p style={{ 
          textAlign: 'center', 
          marginTop: '28px', 
          color: 'var(--text-secondary)',
          fontSize: '14px'
        }}>
          Уже есть аккаунт? <Link to="/login" style={{ fontWeight: '600' }}>Войти</Link>
        </p>
      </div>
    </div>
  );
}