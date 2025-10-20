# 🔧 Backend - Israeli Real Estate API

Node.js + Express + TypeScript + PostgreSQL backend для Telegram Mini App.

## 🚀 Быстрый старт

```bash
# Установка зависимостей
npm install

# Настройка .env
cp .env.example .env
# Отредактируйте .env файл

# Генерация Prisma Client
npx prisma generate

# Применение миграций
npx prisma migrate dev

# Запуск dev сервера
npm run dev
```

## 📁 Структура

```
backend/
├── src/
│   ├── server.ts              # Главный файл
│   ├── config/                # Конфигурация
│   ├── middleware/            # Express middleware
│   ├── controllers/           # HTTP handlers
│   ├── services/              # Бизнес-логика
│   ├── routes/                # API routes
│   └── utils/                 # Утилиты
├── prisma/
│   └── schema.prisma          # Схема БД
└── package.json
```

## 🔌 API Endpoints

Полная документация: [API_DOCUMENTATION.md](../API_DOCUMENTATION.md)

### Properties
- `GET /api/properties` - Список объектов
- `GET /api/properties/:id` - Детали объекта
- `POST /api/properties` - Создание
- `PUT /api/properties/:id` - Обновление
- `DELETE /api/properties/:id` - Удаление

### Bookings
- `GET /api/bookings` - Мои бронирования
- `POST /api/bookings` - Создать бронирование
- `PUT /api/bookings/:id/confirm` - Подтвердить
- `PUT /api/bookings/:id/cancel` - Отменить

### Users
- `GET /api/users/me` - Текущий пользователь
- `PUT /api/users/me` - Обновить профиль

## 🗄️ База данных

### Модели
- **User** - Пользователи
- **Property** - Недвижимость
- **Booking** - Бронирования
- **Payment** - Платежи
- **Review** - Отзывы
- **Favorite** - Избранное
- **Notification** - Уведомления
- **Message** - Сообщения
- **BlockedDate** - Заблокированные даты

### Prisma команды
```bash
npx prisma studio          # Открыть БД в браузере
npx prisma migrate dev     # Создать миграцию
npx prisma migrate deploy  # Применить в production
npx prisma generate        # Сгенерировать Prisma Client
```

## 🔐 Аутентификация

Telegram Web App signature проверяется через HMAC-SHA256:

```typescript
// В каждом запросе
headers: {
  'x-telegram-init-data': telegramInitData
}
```

## 🧪 Тестирование

```bash
npm run test              # Запуск тестов
npm run test:watch        # Watch mode
npm run test:coverage     # С покрытием
```

## 📦 Сборка

```bash
npm run build    # TypeScript → JavaScript в /dist
npm start        # Запуск production версии
```

## 🐳 Docker

```bash
docker build -t israeli-realestate-backend .
docker run -p 3000:3000 israeli-realestate-backend
```

## 📝 Environment Variables

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
TELEGRAM_BOT_TOKEN=...
JWT_SECRET=...
FRONTEND_URL=http://localhost:5173
```

## 🔧 Development

### Hot Reload
```bash
npm run dev    # nodemon автоматически перезагружает
```

### Логирование
Winston logger в `/logs`:
- `combined.log` - все логи
- `error.log` - только ошибки

### WebSocket
Socket.IO для real-time чата:
```typescript
io.on('connection', (socket) => {
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
  });
});
```

## 📚 Дополнительно

- [Главная документация](../README.md)
- [API документация](../API_DOCUMENTATION.md)
- [Деплой](../DEPLOY.md)
