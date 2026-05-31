import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

// Загрузка переменных окружения
dotenv.config();

// Создание пула подключений к PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

// Проверка подключения к БД
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Ошибка подключения к БД:', err.stack);
  } else {
    console.log('✅ База данных подключена');
    release();
  }
});

export default pool;