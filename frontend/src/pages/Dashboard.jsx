import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// Страница управления задачами
export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editingTask, setEditingTask] = useState(null);
  const navigate = useNavigate();

  // Загрузка задач при монтировании
  useEffect(() => {
    if (!user) navigate('/login');
    else loadTasks();
  }, [user]);

  // Получение списка задач с сервера
  const loadTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch (err) {
      console.error('Ошибка загрузки задач:', err);
    }
  };

  // Создание новой задачи
  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/tasks', newTask, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewTask({ title: '', description: '' });
      loadTasks();
    } catch (err) {
      alert('Ошибка: ' + (err.response?.data?.error || err.message));
    }
  };

  // Редактирование существующей задачи
  const handleEditTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/tasks/${editingTask.id}`, editingTask, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingTask(null);
      loadTasks();
    } catch (err) {
      alert('Ошибка: ' + (err.response?.data?.error || err.message));
    }
  };

  // Удаление задачи
  const handleDeleteTask = async (id) => {
    if (!confirm('Удалить задачу?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadTasks();
    } catch (err) {
      alert('Ошибка: ' + (err.response?.data?.error || err.message));
    }
  };

  if (!user) return null;

  return (
    <div className="fade-in" style={{
      minHeight: 'calc(100vh - 73px)',
      background: 'var(--bg-primary)',
      padding: '32px 24px'
    }}>
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Форма создания задачи (только для админов) */}
        {user.role === 'admin' && !editingTask && (
          <div className="card mb-4" style={{
            background: 'var(--gradient-success)',
            color: '#ffffff', /* Явно задаём белый цвет */
            padding: '28px',
            marginBottom: '28px',
            border: 'none'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#ffffff', fontSize: '1.4rem' }}>
               Создать новую задачу
            </h3>
            <form onSubmit={handleCreateTask}>
              <input
                placeholder="Название задачи"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                style={{ 
                  marginBottom: '12px', 
                  background: 'rgba(255,255,255,0.95)', 
                  border: 'none',
                  color: '#1a202c', /* Тёмный текст внутри инпута */
                  fontWeight: '500'
                }}
                required
              />
              <textarea
                placeholder="Описание"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                style={{ 
                  marginBottom: '16px', 
                  minHeight: '100px', 
                  background: 'rgba(255,255,255,0.95)', 
                  border: 'none',
                  color: '#1a202c', /* Тёмный текст внутри textarea */
                  resize: 'vertical'
                }}
              />
              <button type="submit" className="btn-primary" style={{ 
                background: '#ffffff', 
                color: '#11998e', /* Зелёный текст кнопки */
                fontWeight: '700',
                padding: '12px 24px'
              }}>
                Создать задачу
              </button>
            </form>
          </div>
        )}

        {/* Форма редактирования задачи */}
        {editingTask && (
          <div className="card mb-4" style={{
            background: 'var(--gradient-primary)',
            color: '#ffffff',
            padding: '28px',
            marginBottom: '28px',
            border: 'none'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#ffffff', fontSize: '1.4rem' }}>
              ✏️ Редактировать задачу
            </h3>
            <form onSubmit={handleEditTask}>
              <input
                placeholder="Название задачи"
                value={editingTask.title}
                onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                style={{ 
                  marginBottom: '12px', 
                  background: 'rgba(255,255,255,0.95)', 
                  border: 'none',
                  color: '#1a202c'
                }}
                required
              />
              <textarea
                placeholder="Описание"
                value={editingTask.description}
                onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                style={{ 
                  marginBottom: '16px', 
                  minHeight: '100px', 
                  background: 'rgba(255,255,255,0.95)', 
                  border: 'none',
                  color: '#1a202c',
                  resize: 'vertical'
                }}
              />
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn-primary" style={{ 
                  background: '#ffffff', 
                  color: '#667eea',
                  fontWeight: '700'
                }}>
                  Сохранить
                </button>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setEditingTask(null)} 
                  style={{ 
                    background: 'rgba(255,255,255,0.2)', 
                    color: '#ffffff', 
                    border: '1px solid #ffffff' 
                  }}
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Список задач */}
        <div>
          <h2 style={{ marginBottom: '24px', fontSize: '1.8rem', color: 'var(--text-primary)' }}>
            Задачи ({tasks.length})
          </h2>
          {tasks.length === 0 ? (
            <div className="card" style={{ 
              textAlign: 'center', 
              padding: '80px 40px',
              background: 'var(--bg-card)'
            }}>
              <div style={{ fontSize: '80px', marginBottom: '20px' }}>📋</div>
              <h3 style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Задач пока нет</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                {user.role === 'admin' ? 'Создайте первую задачу выше!' : 'Ожидайте появления задач'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  className="card fade-in" 
                  style={{ 
                    borderLeft: '4px solid var(--primary)',
                    background: 'var(--bg-card)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ 
                        marginBottom: '10px', 
                        fontSize: '1.3rem',
                        fontWeight: '700',
                        color: 'var(--text-primary)' /* Явно задаём цвет заголовка */
                      }}>
                        {task.title}
                      </h3>
                      <p style={{ 
                        color: 'var(--text-secondary)', 
                        marginBottom: '12px', 
                        lineHeight: '1.6',
                        fontSize: '15px'
                      }}>
                        {task.description || 'Без описания'}
                      </p>
                      <small style={{ 
                        color: 'var(--text-secondary)', 
                        fontSize: '13px',
                        display: 'block'
                      }}>
                        📅 Создана: {new Date(task.created_at).toLocaleString('ru-RU')}
                      </small>
                    </div>
                    {/* Кнопки управления (только для админов) */}
                    {user.role === 'admin' && (
                      <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                        <button
                          onClick={() => setEditingTask(task)}
                          className="btn-secondary"
                          style={{ padding: '8px 12px', fontSize: '13px' }}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="btn-danger"
                          style={{ padding: '8px 12px', fontSize: '13px' }}
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}