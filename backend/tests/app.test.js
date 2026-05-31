import { jest } from '@jest/globals';
import request from 'supertest';

// Мокаем базу данных
jest.mock('../src/config/db.js', () => ({
  __esModule: true,
  default: {
    query: jest.fn((sql, params) => {
      if (sql.includes('INSERT INTO users')) {
        return Promise.resolve({
          rows: [{ id: 1, username: params[0], role: params[2] || 'user' }]
        });
      }
      if (sql.includes('SELECT * FROM users')) {
        return Promise.resolve({
          rows: [{ id: 1, username: params[0], password: 'hashed_password', role: 'user' }]
        });
      }
      return Promise.resolve({ rows: [] });
    }),
    connect: jest.fn((cb) => cb(null, {}, jest.fn())),
  },
}));

// Мокаем bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(() => Promise.resolve('hashed_password')),
  compare: jest.fn(() => Promise.resolve(true)),
}));

// Мокаем RabbitMQ
jest.mock('../src/config/rabbitmq.js', () => ({
  connectRabbitMQ: jest.fn(() => Promise.resolve(null)),
  getChannel: jest.fn(() => null),
  sendToQueue: jest.fn(() => Promise.resolve()),
}));

// Мокаем воркер
jest.mock('../src/workers/taskWorker.js', () => ({
  startWorker: jest.fn(() => Promise.resolve()),
}));

// Импортируем app ПОСЛЕ всех моков
const app = (await import('../src/index.js')).default;

describe('Auth API', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test_secret_key_123';
  });

  test('POST /api/auth/register - создание пользователя', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', password: '123456' });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('username', 'testuser');
  });

  test('POST /api/auth/login - вход пользователя', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: '123456' });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});