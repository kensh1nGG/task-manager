import express from 'express';
import pool from '../config/db.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import { sendToQueue } from '../config/rabbitmq.js';

const router = express.Router();

// Все маршруты требуют авторизации
router.use(authenticateToken);

// Получение всех задач
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Создание задачи (отправка в очередь)
router.post('/', isAdmin, async (req, res) => {
  try {
    const { title, description } = req.body;
    
    // Сохраняем в БД
    const result = await pool.query(
      'INSERT INTO tasks (title, description, status) VALUES ($1, $2, $3) RETURNING *',
      [title, description, 'new']
    );
    
    // Отправляем в очередь для асинхронной обработки
    await sendToQueue('task_queue', {
      id: result.rows[0].id,
      title: result.rows[0].title,
      description: result.rows[0].description,
      type: 'create_task'
    });
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Обновление задачи
router.put('/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    
    const result = await pool.query(
      'UPDATE tasks SET title = $1, description = $2, status = $3 WHERE id = $4 RETURNING *',
      [title, description, status || 'new', id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Задача не найдена' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Удаление задачи
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Задача не найдена' });
    }
    
    res.json({ message: 'Задача удалена', task: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;