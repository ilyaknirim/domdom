# 📁 Структура проекта Israeli Real Estate Mini App

## 🌳 Полное дерево файлов

```
israeli-realestate-miniapp/
│
├── 📄 README.md                          # Главная документация
├── 📄 QUICKSTART.md                      # Быстрый старт за 10 минут
├── 📄 DEPLOY.md                          # Инструкция по развертыванию
├── 📄 TELEGRAM_BOT_SETUP.md              # Настройка Telegram бота
├── 📄 API_DOCUMENTATION.md               # API документация
├── 📄 FEATURES.md                        # Полный список фич
├── 📄 PROJECT_STRUCTURE.md               # Этот файл
├── 📄 .gitignore                         # Git игнорируемые файлы
├── 📄 docker-compose.yml                 # Docker Compose конфигурация
│
├── 📁 backend/                           # Backend (Node.js + Express)
│   ├── 📄 package.json                   # NPM зависимости backend
│   ├── 📄 tsconfig.json                  # TypeScript конфигурация
│   ├── 📄 Dockerfile                     # Docker образ для backend
│   ├── 📄 .env.example                   # Пример переменных окружения
│   │
│   ├── 📁 prisma/                        # Prisma ORM
│   │   └── 📄 schema.prisma              # Схема базы данных
│   │
│   ├── 📁 src/                           # Исходный код backend
│   │   ├── 📄 server.ts                  # Главный файл сервера
│   │   │
│   │   ├── 📁 config/                    # Конфигурация
│   │   │   └── 📄 database.ts            # Подключение к БД (Prisma)
│   │   │
│   │   ├── 📁 middleware/                # Express middleware
│   │   │   ├── 📄 telegramAuth.ts        # Telegram Web App аутентификация
│   │   │   └── 📄 errorHandler.ts        # Обработка ошибок
│   │   │
│   │   ├── 📁 controllers/               # Контроллеры (обработка запросов)
│   │   │   ├── 📄 property.controller.ts # Контроллер недвижимости
│   │   │   ├── 📄 booking.controller.ts  # Контроллер бронирований
│   │   │   └── 📄 user.controller.ts     # Контроллер пользователей
│   │   │
│   │   ├── 📁 services/                  # Бизнес-логика
│   │   │   ├── 📄 property.service.ts    # Логика недвижимости
│   │   │   ├── 📄 booking.service.ts     # Логика бронирований
│   │   │   └── 📄 user.service.ts        # Логика пользователей
│   │   │
│   │   ├── 📁 routes/                    # API роуты
│   │   │   ├── 📄 property.routes.ts     # /api/properties
│   │   │   ├── 📄 booking.routes.ts      # /api/bookings
│   │   │   ├── 📄 user.routes.ts         # /api/users
│   │   │   ├── 📄 payment.routes.ts      # /api/payments
│   │   │   ├── 📄 review.routes.ts       # /api/reviews
│   │   │   ├── 📄 favorite.routes.ts     # /api/favorites
│   │   │   ├── 📄 notification.routes.ts # /api/notifications
│   │   │   └── 📄 chat.routes.ts         # /api/chat
│   │   │
│   │   └── 📁 utils/                     # Утилиты
│   │       └── 📄 logger.ts              # Winston логирование
│   │
│   └── 📁 logs/                          # Логи (создается автоматически)
│
├── 📁 frontend/                          # Frontend (React + TypeScript)
│   ├── 📄 package.json                   # NPM зависимости frontend
│   ├── 📄 tsconfig.json                  # TypeScript конфигурация
│   ├── 📄 tsconfig.node.json             # TypeScript для Vite
│   ├── 📄 vite.config.ts                 # Vite конфигурация
│   ├── 📄 tailwind.config.js             # Tailwind CSS конфигурация
│   ├── 📄 postcss.config.js              # PostCSS конфигурация
│   ├── 📄 Dockerfile                     # Docker образ для frontend
│   ├── 📄 nginx.conf                     # Nginx конфигурация для production
│   ├── 📄 .env.example                   # Пример переменных окружения
│   ├── 📄 index.html                     # HTML шаблон
│   │
│   └── 📁 src/                           # Исходный код frontend
│       ├── 📄 main.tsx                   # Точка входа
│       ├── 📄 App.tsx                    # Главный компонент + роутинг
│       ├── 📄 index.css                  # Глобальные стили (Tailwind)
│       │
│       ├── 📁 components/                # React компоненты
│       │   ├── 📄 Layout.tsx             # Общий Layout с навигацией
│       │   ├── 📄 PropertyCard.tsx       # Карточка недвижимости
│       │   ├── 📄 SearchBar.tsx          # Поисковая строка
│       │   ├── 📄 FilterButton.tsx       # Кнопка фильтров
│       │   └── 📄 Calendar.tsx           # Календарь для выбора дат
│       │
│       ├── 📁 pages/                     # Страницы приложения
│       │   ├── 📄 HomePage.tsx           # Главная страница
│       │   ├── 📄 SearchPage.tsx         # Страница поиска
│       │   ├── 📄 PropertyDetailPage.tsx # Детали объекта
│       │   ├── 📄 FavoritesPage.tsx      # Избранное
│       │   ├── 📄 MyPropertiesPage.tsx   # Мои объявления
│       │   ├── 📄 CreatePropertyPage.tsx # Создание объявления
│       │   ├── 📄 BookingsPage.tsx       # Мои бронирования
│       │   ├── 📄 BookingDetailPage.tsx  # Детали бронирования
│       │   ├── 📄 ProfilePage.tsx        # Профиль
│       │   └── 📄 ChatPage.tsx           # Чат с пользователем
│       │
│       ├── 📁 services/                  # API сервисы
│       │   └── 📄 api.ts                 # Axios клиент + методы API
│       │
│       ├── 📁 utils/                     # Утилиты
│       │   └── 📄 telegram.ts            # Telegram Mini App SDK утилиты
│       │
│       └── 📁 i18n/                      # Интернационализация
│           ├── 📄 index.ts               # i18next конфигурация
│           └── 📁 locales/               # Переводы
│               ├── 📄 ru.json            # Русский
│               ├── 📄 en.json            # English
│               └── 📄 he.json            # עברית
│
└── 📁 .github/                           # GitHub Actions (опционально)
    └── 📁 workflows/
        └── 📄 deploy.yml                 # CI/CD pipeline
```

---

## 🗂️ Описание ключевых директорий

### 📁 Backend (`/backend`)

#### `/src/config`
Конфигурация приложения:
- **database.ts** - Prisma Client singleton, подключение к PostgreSQL

#### `/src/middleware`
Express middleware для обработки запросов:
- **telegramAuth.ts** - Проверка подписи Telegram Web App
- **errorHandler.ts** - Централизованная обработка ошибок

#### `/src/controllers`
Контроллеры обрабатывают HTTP запросы:
- Валидация входных данных
- Вызов сервисов
- Формирование ответов

#### `/src/services`
Бизнес-логика приложения:
- Работа с базой данных через Prisma
- Сложные операции (расчеты, проверки)
- Взаимодействие между моделями

#### `/src/routes`
Определение API endpoints:
- Группировка по ресурсам
- Привязка к контроллерам
- Применение middleware

---

### 📁 Frontend (`/frontend`)

#### `/src/components`
Переиспользуемые React компоненты:
- **Layout.tsx** - Общий макет с нижней навигацией
- **PropertyCard.tsx** - Карточка объекта с фото и информацией
- **Calendar.tsx** - Интерактивный календарь для выбора дат

#### `/src/pages`
Полноценные страницы приложения:
- Каждая страница = отдельный роут
- Использует компоненты из `/components`
- Работает с API через `/services`

#### `/src/services`
API клиент:
- **api.ts** - Axios instance с настроенной аутентификацией
- Методы для всех API endpoints
- Обработка ошибок

#### `/src/utils`
Вспомогательные функции:
- **telegram.ts** - Интеграция с Telegram Mini App SDK
- Haptic feedback, кнопки, алерты

#### `/src/i18n`
Мультиязычность:
- i18next конфигурация
- JSON файлы с переводами (ru, en, he)

---

## 🔄 Потоки данных

### 1️⃣ Пользователь открывает Mini App

```
Telegram App
    ↓
Frontend (React)
    ↓
Telegram SDK инициализация (telegram.ts)
    ↓
Получение initData
    ↓
API запрос с initData в заголовке
    ↓
Backend проверяет подпись (telegramAuth.ts)
    ↓
Создание/получение пользователя (user.service.ts)
    ↓
Ответ с данными пользователя
```

### 2️⃣ Просмотр объектов недвижимости

```
HomePage.tsx
    ↓
api.getProperties() (api.ts)
    ↓
GET /api/properties (property.routes.ts)
    ↓
propertyController.getAll (property.controller.ts)
    ↓
propertyService.getProperties (property.service.ts)
    ↓
prisma.property.findMany()
    ↓
Ответ с массивом объектов
    ↓
Отображение в PropertyCard.tsx
```

### 3️⃣ Создание бронирования

```
BookingDetailPage.tsx
    ↓
Выбор дат в Calendar.tsx
    ↓
api.createBooking() (api.ts)
    ↓
POST /api/bookings (booking.routes.ts)
    ↓
bookingController.create (booking.controller.ts)
    ↓
bookingService.createBooking (booking.service.ts)
    ↓
Проверка доступности
    ↓
prisma.booking.create()
    ↓
Создание уведомления владельцу
    ↓
WebSocket событие через Socket.IO
    ↓
Владелец получает real-time уведомление
```

---

## 🗄️ Модели базы данных

### User (Пользователь)
```typescript
- id, telegramId, username, firstName, lastName
- phone, email, languageCode
- isVerified, role, rating, reviewCount
- Связи: properties, bookings, favorites, reviews, messages
```

### Property (Недвижимость)
```typescript
- id, ownerId, title, description, type, dealType, status
- address, city, latitude, longitude
- rooms, bedrooms, bathrooms, area, floor
- price, currency, images, amenities
- Связи: owner, bookings, favorites, reviews, blockedDates
```

### Booking (Бронирование)
```typescript
- id, propertyId, userId, checkIn, checkOut
- totalPrice, depositAmount, status, guestCount
- Связи: property, user, payments, notifications
```

### Payment (Платеж)
```typescript
- id, userId, bookingId, amount, currency
- telegramPaymentId, status, paymentMethod
- Связи: user, booking
```

### Review (Отзыв)
```typescript
- id, authorId, targetId, propertyId
- rating, comment, cleanRating, locationRating
- Связи: author, target, property
```

### Notification (Уведомление)
```typescript
- id, userId, type, title, message
- isRead, isSent, data
- Связи: user, booking
```

### Message (Сообщение)
```typescript
- id, senderId, receiverId, chatRoomId
- content, attachments, isRead
- Связи: sender
```

---

## 🔐 Безопасность

### Аутентификация
1. Frontend получает `initData` от Telegram
2. Backend проверяет подпись HMAC-SHA256
3. Извлекает данные пользователя
4. Создает/обновляет пользователя в БД

### Авторизация
- Проверка владельца объекта перед редактированием
- Проверка участника бронирования
- Role-based access (USER, AGENT, ADMIN)

### Защита API
- Rate limiting (100 req/15min)
- CORS только для Telegram
- Валидация всех входных данных
- Prisma защита от SQL injection

---

## 🚀 Развертывание

### Development
```bash
docker-compose up -d    # Все сервисы локально
```

### Production

**Backend:**
- Railway / Heroku / VPS
- PostgreSQL (Railway / Supabase)
- Redis (Upstash / Redis Cloud)

**Frontend:**
- Vercel / Netlify / GitHub Pages
- Автоматический деплой из Git

---

## 📊 Размер проекта

```
Backend:
  - TypeScript файлов: ~15
  - Строк кода: ~2500
  - NPM пакетов: ~25

Frontend:
  - TypeScript/TSX файлов: ~20
  - Строк кода: ~3000
  - NPM пакетов: ~20

База данных:
  - Таблиц: 9
  - Индексов: 15+
  - Связей: 20+

Всего:
  - Файлов: 50+
  - Строк кода: 5500+
  - Документация: 1000+ строк
```

---

## 🎯 Точки расширения

### Backend
- `/src/jobs/` - фоновые задачи (cron)
- `/src/bot/` - Telegram Bot команды
- `/src/validators/` - валидация схем
- `/src/types/` - TypeScript типы

### Frontend
- `/src/hooks/` - custom React hooks
- `/src/store/` - глобальное состояние (Zustand)
- `/src/contexts/` - React Context API
- `/src/animations/` - анимации

---

## 📚 Дополнительные ресурсы

- [README.md](./README.md) - Обзор проекта
- [QUICKSTART.md](./QUICKSTART.md) - Запуск за 10 минут
- [DEPLOY.md](./DEPLOY.md) - Детальный деплой
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API endpoints
- [FEATURES.md](./FEATURES.md) - Полный список фич

---

**Проект готов к разработке и деплою! 🚀**
