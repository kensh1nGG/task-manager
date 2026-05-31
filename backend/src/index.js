import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db.js';
import { connectRabbitMQ, closeRabbitMQ } from './config/rabbitmq.js';
import { startWorker } from './workers/taskWorker.js';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';

// Загрузка переменных окружения
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Подключение маршрутов
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Инициализация таблиц БД
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user'
      )
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'new',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    console.log('✅ Таблицы созданы/проверены');
  } catch (err) {
    console.error('❌ Ошибка инициализации БД:', err);
  }
};

// Инициализация приложения
const initApp = async () => {
  await initDB();
  await connectRabbitMQ();
  await startWorker();
};

initApp();

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});

// Корректное завершение работы
process.on('SIGINT', async () => {
  console.log('\n🛑 Завершение работы...');
  await closeRabbitMQ();
  process.exit(0);
});

export default app;