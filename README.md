# 🏠 Israeli Real Estate Mini App

<div align="center">

**Профессиональное Telegram Mini App для продажи и аренды недвижимости в Израиле**

[![Made with React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)](https://www.prisma.io/)
[![Telegram](https://img.shields.io/badge/Telegram-Mini_App-blue?logo=telegram)](https://core.telegram.org/bots/webapps)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

[Быстрый старт](./QUICKSTART.md) • [Документация](./START_HERE.md) • [API](./API_DOCUMENTATION.md) • [Деплой](./DEPLOY.md)

</div>

---

## 🎯 Основной функционал

### 📱 Для пользователей (арендаторов/покупателей)
- Поиск квартир, комнат и домов с умными фильтрами
- Визуальный календарь для выбора сроков аренды
- Просмотр объектов на карте (интеграция с Google Maps)
- Галерея фото и виртуальные туры
- Избранное и история просмотров
- Встроенная оплата (Telegram Stars / Payment API)
- Чат с владельцем/агентом
- Рейтинги и отзывы
- Уведомления о новых объектах и сделках

### 🏢 Для владельцев/агентов
- Размещение объявлений с фото и описанием
- Управление статусами объектов
- Календарь бронирований
- Аналитика просмотров и интереса
- Управление ценами в зависимости от сезона
- Быстрые ответы на запросы
- Финансовая отчетность

### 🔐 Система верификации
- Подтверждение номера телефона
- Верификация документов для серьезных сделок
- Система рейтингов и доверия

### 🌍 Мультиязычность
- Русский (основной)
- עברית (иврит)
- English

## 🛠️ Технологический стек

### Backend
- **Node.js + Express** - основной сервер
- **PostgreSQL** - основная БД
- **Redis** - кэширование и сессии
- **Prisma** - ORM
- **WebSocket** - real-time чат

### Frontend (Mini App)
- **React + TypeScript**
- **Telegram Mini App SDK**
- **Tailwind CSS** - стилизация
- **React Query** - управление состоянием
- **Mapbox/Google Maps API** - карты

### Дополнительно
- **Cloudinary/AWS S3** - хранение изображений
- **Bull** - очереди для уведомлений
- **Jest** - тестирование
- **Docker** - контейнеризация

## 📁 Структура проекта

```
israeli-realestate-miniapp/
├── backend/
│   ├── src/
│   │   ├── config/         # Конфигурация
│   │   ├── controllers/    # Контроллеры
│   │   ├── models/         # Модели данных
│   │   ├── routes/         # API роуты
│   │   ├── services/       # Бизнес-логика
│   │   ├── middleware/     # Middleware
│   │   ├── utils/          # Утилиты
│   │   └── jobs/           # Фоновые задачи
│   ├── prisma/             # Схема БД
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React компоненты
│   │   ├── pages/          # Страницы
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API сервисы
│   │   ├── utils/          # Утилиты
│   │   ├── store/          # Состояние
│   │   └── i18n/           # Переводы
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🚀 Быстрый старт

```bash
# Клонирование репозитория
git clone <repository-url>

# Установка зависимостей
cd backend && npm install
cd ../frontend && npm install

# Настройка переменных окружения
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Запуск с Docker
docker-compose up -d

# Или локально
cd backend && npm run dev
cd frontend && npm run dev
```

## 📝 API Endpoints

### Объекты недвижимости
- `GET /api/properties` - Список объектов (с фильтрами)
- `GET /api/properties/:id` - Детали объекта
- `POST /api/properties` - Создание объявления
- `PUT /api/properties/:id` - Обновление
- `DELETE /api/properties/:id` - Удаление

### Бронирования
- `GET /api/bookings` - Список бронирований
- `POST /api/bookings` - Создание бронирования
- `PUT /api/bookings/:id/confirm` - Подтверждение
- `PUT /api/bookings/:id/cancel` - Отмена

### Пользователи
- `GET /api/users/me` - Текущий пользователь
- `PUT /api/users/me` - Обновление профиля
- `GET /api/users/:id/reviews` - Отзывы о пользователе

### Платежи
- `POST /api/payments/create` - Создание платежа
- `POST /api/payments/webhook` - Webhook от платежной системы

## 🔒 Безопасность

- Telegram Web App подпись проверяется на backend
- JWT токены для API
- Rate limiting
- Валидация всех входных данных
- Защита от SQL injection через Prisma
- CORS настроен только для Telegram

## 📱 Развертывание

Приложение готово к развертыванию на:
- Backend: VPS (DigitalOcean, AWS, Hetzner)
- Frontend: Vercel / Netlify / GitHub Pages
- База данных: PostgreSQL на Railway / Supabase
- Redis: Upstash / Redis Cloud

## 📄 Лицензия

MIT

## 👥 Поддержка

Для вопросов и предложений создавайте Issues в репозитории.
