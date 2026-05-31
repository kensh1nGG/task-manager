# Task Manager

Полнофункциональное веб-приложение для управления задачами с real-time обработкой, GraphQL API и асинхронной очередью сообщений.

## Описание

Проект разработан в рамках курса "Фронтенд и бэкенд разработка" и демонстрирует современные подходы к созданию fullstack-приложений:

- **Микросервисная архитектура** с разделением ответственности
- **Асинхронная обработка** задач через RabbitMQ
- **GraphQL API** для гибких запросов данных
- **JWT-аутентификация** с ролевой моделью (RBAC)
- **Оптимизация сборки** с code splitting и lazy loading
- **Тёмная/светлая тема** интерфейса

##  Стек технологий

### Frontend
- **React 18** — библиотека UI
- **Vite** — сборщик проекта
- **React Router** — навигация
- **Axios** — HTTP-клиент
- **Rollup** — оптимизация бандла

### Backend
- **Node.js** — runtime окружение
- **Express** — веб-фреймворк
- **PostgreSQL** — реляционная БД
- **Apollo Server** — GraphQL сервер
- **RabbitMQ** — брокер сообщений
- **JWT** — токены авторизации
- **Bcrypt** — хеширование паролей

### DevOps & Tools
- **Docker & Docker Compose** — контейнеризация
- **Jest** — тестирование
- **ES Modules** — модульная система

## Функциональность

### Авторизация и безопасность
- ✅ Регистрация новых пользователей
- ✅ Вход с JWT-токенами
- ✅ Ролевая модель (Admin/User)
- ✅ Защищённые маршруты (RBAC)

### Управление задачами
- ✅ Создание, чтение, обновление, удаление (CRUD)
- ✅ Просмотр списка задач
- ✅ Фильтрация по статусам
- ✅ Асинхронная обработка через RabbitMQ

### GraphQL API
- ✅ Гибкие запросы данных
- ✅ Типизированная схема
- ✅ Вложенные запросы (Author → Books)
- ✅ Мутации для создания данных

### UI/UX
- ✅ Адаптивный дизайн
- ✅ Тёмная/светлая тема
- ✅ Ленивая загрузка компонентов (Lazy Loading)
- ✅ Анимации и transitions
- ✅ Responsive layout

### Оптимизация
- ✅ Code Splitting (разделение кода)
- ✅ Tree Shaking (удаление мёртвого кода)
- ✅ Bundle Analysis (анализ зависимостей)
- ✅ Production минификация

## Установка и запуск

### Требования
- Node.js >= 18.x
- PostgreSQL >= 15.x
- Docker & Docker Compose (опционально)

### Локальный запуск

#### 1. Клонирование репозитория
```bash
git clone https://github.com/your-username/task-manager.git
cd task-manager
```

#### 2. Настройка Backend
```bash
cd backend
npm install

# Создайте файл .env
cp .env.example .env

# Отредактируйте .env и укажите ваши данные:
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=taskdb
# DB_USER=postgres
# DB_PASS=your_password
# JWT_SECRET=your_secret_key
# RABBITMQ_URL=amqp://localhost:5672
```

#### 3. Настройка Frontend
```bash
cd ../frontend
npm install

# Создайте файл .env (опционально)
# VITE_API_URL=http://localhost:3000
```

#### 4. Запуск PostgreSQL
```bash
# Создайте базу данных
createdb taskdb

# Или через psql
psql -U postgres
CREATE DATABASE taskdb;
\q
```

#### 5. Запуск приложений

**Backend (терминал 1):**
```bash
cd backend
npm run dev
# Сервер запустится на http://localhost:3000
```

**GraphQL Server (терминал 2):**
```bash
cd backend
node graphql.js
# GraphQL запустится на http://localhost:4000
```

**Frontend (терминал 3):**
```bash
cd frontend
npm run dev
# Приложение откроется на http://localhost:5173
```

### Запуск через Docker

```bash
# В корне проекта
docker compose up --build

# Сервисы будут доступны:
# - Frontend: http://localhost:5173
# - Backend API: http://localhost:3000
# - PostgreSQL: localhost:5432
# - RabbitMQ: localhost:5672 (UI: http://localhost:15672)
# - GraphQL: http://localhost:4000
```

## Переменные окружения

### Backend (.env)
```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskdb
DB_USER=postgres
DB_PASS=postgres

# JWT
JWT_SECRET=super_secret_key_123
JWT_EXPIRES_IN=24h

# RabbitMQ
RABBITMQ_URL=amqp://localhost:5672
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
```

## API Endpoints

### Authentication
| Метод | Endpoint | Описание |
|-------|----------|----------|
| POST | `/api/auth/register` | Регистрация пользователя |
| POST | `/api/auth/login` | Вход в систему |

### Tasks (требует авторизации)
| Метод | Endpoint | Описание | Роль |
|-------|----------|----------|------|
| GET | `/api/tasks` | Получить все задачи | User/Admin |
| POST | `/api/tasks` | Создать задачу | Admin |
| PUT | `/api/tasks/:id` | Обновить задачу | Admin |
| DELETE | `/api/tasks/:id` | Удалить задачу | Admin |

### Пример запроса
```bash
# Регистрация
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "username": "admin",
  "password": "password123",
  "role": "admin"
}

# Создание задачи (с токеном)
POST http://localhost:3000/api/tasks
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "Новая задача",
  "description": "Описание задачи"
}
```

## GraphQL API

### Запуск GraphQL Server
```bash
cd backend
node graphql.js
# Откройте http://localhost:4000 для доступа к Apollo Sandbox
```

### Примеры запросов

#### Query - Получить всех авторов
```graphql
query {
  authors {
    id
    name
    nationality
    books {
      title
      year
    }
  }
}
```

#### Mutation - Создать автора
```graphql
mutation {
  createAuthor(name: "Фёдор Достоевский", nationality: "Russian") {
    id
    name
  }
}
```

#### Mutation - Создать книгу
```graphql
mutation {
  createBook(title: "Преступление и наказание", year: 1866, authorId: "1") {
    id
    title
    author {
      name
    }
  }
}
```

## Тестирование

### Backend тесты
```bash
cd backend
npm test

# С покрытием
npm run test:coverage
```

Требование: покрытие кода не менее **50%**.

### Frontend сборка с анализом
```bash
cd frontend
npm run build

# Откроется bundle-report.html с визуализацией зависимостей
```

## Структура проекта

```
task-manager/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js           # Подключение к PostgreSQL
│   │   │   └── rabbitmq.js     # Настройка RabbitMQ
│   │   ├── middleware/
│   │   │   └── auth.js         # JWT middleware
│   │   ├── routes/
│   │   │   ├── auth.js         # Auth endpoints
│   │   │   └── tasks.js        # Tasks endpoints
│   │   ├── workers/
│   │   │   └── taskWorker.js   # RabbitMQ consumer
│   │   ├── index.js            # Express server
│   │   └── graphql.js          # Apollo GraphQL server
│   ├── tests/
│   │   └── app.test.js         # Unit & integration tests
│   ├── .env
│   ├── package.json
│   └── jest.config.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Header.jsx      # Шапка приложения
│   │   ├── context/
│   │   │   ├── AuthContext.jsx # Auth state
│   │   │   └── ThemeContext.jsx# Theme state
│   │   ├── pages/
│   │   │   ├── About.jsx       # О проекте (lazy)
│   │   │   ├── Dashboard.jsx   # Основная страница
│   │   │   ├── Login.jsx       # Вход
│   │   │   └── Register.jsx    # Регистрация
│   │   ├── App.jsx             # Главный компонент
│   │   ├── main.jsx            # Точка входа
│   │   └── index.css           # Глобальные стили
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js          # Конфиг Vite
│
├── docker-compose.yml          # Docker оркестрация
├── .gitignore
└── README.md
```

## Реализованные практики

### Практика 25: Инструменты сборки (Vite/Webpack)
- ✅ Настроен Vite для сборки
- ✅ Реализован Lazy Loading (React.lazy + Suspense)
- ✅ Code Splitting (vendor chunks)
- ✅ Bundle Analyzer (rollup-plugin-visualizer)
- ✅ Tree Shaking

### Практика 26: GraphQL и Apollo
- ✅ Apollo Server на порту 4000
- ✅ Схема с типами Book и Author
- ✅ Query и Mutation резолверы
- ✅ Вложенные связи между типами
- ✅ Apollo Sandbox для тестирования

### Практика 27: RabbitMQ
- ✅ Producer (отправка задач в очередь)
- ✅ Consumer (воркер для обработки)
- ✅ Retry Logic с экспоненциальной задержкой
- ✅ Dead Letter Queue (DLQ)
- ✅ Fallback режим без RabbitMQ

### Практика 28: Контрольная работа №5
- ✅ Fullstack приложение (React + Express)
- ✅ JWT + RBAC авторизация
- ✅ PostgreSQL база данных
- ✅ Docker контейнеризация
- ✅ Git репозиторий
- ✅ Тесты с покрытием >50%
- ✅ README документация

## Безопасность

- Пароли хешируются с помощью **bcrypt** (salt rounds: 10)
- JWT токены с ограниченным временем жизни
- CORS политика для защиты от CSRF
- Валидация входных данных
- Защищённые маршруты (middleware)

## Производительность

### Оптимизация Frontend
- **Lazy Loading**: компоненты загружаются по требованию
- **Code Splitting**: разделение на vendor и app chunks
- **Tree Shaking**: удаление неиспользуемого кода
- **Minification**: сжатие JS/CSS
- **Gzip/Brotli**: компрессия ответов

### Оптимизация Backend
- **Connection Pooling**: переиспользование подключений к БД
- **Асинхронная обработка**: RabbitMQ для тяжёлых задач
- **Кэширование**: (можно добавить Redis)

##  Известные ограничения

- RabbitMQ должен быть запущен для асинхронной обработки (иначе fallback режим)
- GraphQL сервер работает отдельно от REST API (порт 4000)
- Требуется PostgreSQL 15+

## Вклад

1. Fork репозиторий
2. Создайте feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit изменения (`git commit -m 'Add some AmazingFeature'`)
4. Push в branch (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

## Авторы

- **Баксаров Богдан** - [your-github](https://github.com/kensh1nGG)

## Полезные ссылки

- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
- [RabbitMQ Tutorials](https://www.rabbitmq.com/getstarted.html)
- [Express.js Guide](https://expressjs.com/)


