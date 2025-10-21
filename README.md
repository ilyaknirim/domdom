# 🏠 Israeli Real Estate Mini App

<div align="center">

**Профессиональное Telegram Mini App для продажи и аренды недвижимости в Израиле**

[![Made with React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)](https://www.prisma.io/)
[![Telegram](https://img.shields.io/badge/Telegram-Mini_App-blue?logo=telegram)](https://core.telegram.org/bots/webapps)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?logo=github-actions)](https://github.com/features/actions)

[Быстрый старт](./QUICKSTART.md) • [Документация](./START_HERE.md) • [API](./API_DOCUMENTATION.md) • [Деплой](./DEPLOY.md) • [Contributing](./CONTRIBUTING.md)

**[📦 GitHub](https://github.com/ilyaknirim/domdom) | [📖 Документация](./START_HERE.md) | [🐛 Issues](https://github.com/ilyaknirim/domdom/issues)**

</div>

---

## 📸 Скриншоты

<div align="center">
  <img src="./docs/screenshots/home.png" width="200" alt="Главная">
  <img src="./docs/screenshots/search.png" width="200" alt="Поиск">
  <img src="./docs/screenshots/property.png" width="200" alt="Объект">
  <img src="./docs/screenshots/chat.png" width="200" alt="Чат">
</div>

<sub>*Скриншоты демонстрационные. Добавьте реальные скриншоты вашего приложения.*</sub>

---

## ✨ Особенности

- 🚀 **Полностью функциональное приложение** - готово к использованию из коробки
- 📱 **Telegram Mini App** - встроено прямо в Telegram, без установки
- 🔒 **Безопасность** - JWT, rate limiting, валидация данных
- 🌍 **Мультиязычность** - עברית, Русский, English
- 💳 **Платежи** - интеграция с Telegram Payments
- 💬 **Real-time чат** - WebSocket для мгновенных сообщений
- 📊 **Аналитика** - отслеживание просмотров и интереса
- 🗺️ **Карты** - интеграция с картографическими сервисами
- 🐳 **Docker** - легкий деплой через Docker Compose
- 📚 **Документация** - более 2000 строк документации

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

## 📊 Статистика проекта

```
📁 Файлов: 100+
📝 Строк кода: 10,000+
📚 Строк документации: 2,000+
🧪 Тестов: (в разработке)
⭐ GitHub Stars: 0 (будьте первым!)
```

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

### Вариант 1: Docker (рекомендуется)

```bash
# 1. Клонируйте репозиторий
git clone https://github.com/ilyaknirim/domdom.git
cd domdom

# 2. Настройте переменные окружения
cp backend/.env.template backend/.env
cp frontend/.env.template frontend/.env
# Отредактируйте .env файлы

# 3. Запустите всё одной командой
docker-compose up -d

# 4. Примените миграции базы данных
docker-compose exec backend npx prisma migrate deploy

# 5. Добавьте тестовые данные (опционально)
docker-compose exec backend npm run prisma:seed

# ✅ Готово! Приложение запущено:
# - Backend: http://localhost:3000
# - Frontend: http://localhost:5173
```

### Вариант 2: Локальная установка

```bash
# 1. Установите PostgreSQL и Redis
# macOS: brew install postgresql redis
# Ubuntu: apt install postgresql redis-server

# 2. Клонируйте и настройте
git clone https://github.com/ilyaknirim/domdom.git
cd domdom

# 3. Backend
cd backend
npm install
cp .env.template .env
# Отредактируйте .env
npx prisma migrate dev
npm run prisma:seed
npm run dev

# 4. Frontend (в новом терминале)
cd frontend
npm install
cp .env.template .env
# Отредактируйте .env
npm run dev
```

### 🤖 Настройка Telegram Bot

1. Создайте бота через [@BotFather](https://t.me/BotFather)
2. Получите токен и добавьте в `backend/.env`
3. Настройте Menu Button в BotFather
4. Для локального тестирования используйте [ngrok](https://ngrok.com)

📖 Подробная инструкция: [QUICKSTART.md](./QUICKSTART.md)

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

## 🧪 Тестирование

```bash
# Backend тесты
cd backend
npm test
npm run test:coverage

# Frontend тесты (в разработке)
cd frontend
npm test
```

## 📦 Production деплой

### Railway.app (Backend)
```bash
railway login
railway init
railway up
```

### Vercel (Frontend)
```bash
vercel login
vercel --prod
```

📖 Полная инструкция: [DEPLOY.md](./DEPLOY.md)

## 🤝 Contributing

Мы приветствуем вклад в проект! Пожалуйста, прочитайте [CONTRIBUTING.md](./CONTRIBUTING.md) перед созданием Pull Request.

### Шаги:
1. Fork проекта
2. Создайте ветку для фичи (`git checkout -b feature/AmazingFeature`)
3. Commit изменения (`git commit -m 'Add some AmazingFeature'`)
4. Push в ветку (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

## 🗺️ Roadmap

- [x] Базовый CRUD для объектов недвижимости
- [x] Система бронирований
- [x] Real-time чат
- [x] Мультиязычность
- [x] Docker конфигурация
- [ ] Unit и Integration тесты
- [ ] Admin панель
- [ ] Email уведомления
- [ ] Интеграция с внешними платформами (Yad2, Homeless)
- [ ] Mobile приложения (React Native)
- [ ] AI рекомендации

Полный список: [TODO.md](./TODO.md)

## 📊 Архитектура

```
┌─────────────┐
│  Telegram   │
│  Mini App   │
└──────┬──────┘
       │
       ▼
┌─────────────┐      ┌──────────────┐
│   Frontend  │◄────►│   Backend    │
│ React + TS  │      │ Express + TS │
└─────────────┘      └──────┬───────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
       ┌─────────────┐            ┌─────────────┐
       │ PostgreSQL  │            │    Redis    │
       │  Database   │            │    Cache    │
       └─────────────┘            └─────────────┘
```

## 🔐 Безопасность

Если вы обнаружили уязвимость в системе безопасности, пожалуйста, сообщите нам через [SECURITY.md](./SECURITY.md)

## 📝 Changelog

Все изменения документированы в [CHANGELOG.md](./CHANGELOG.md)

## 📄 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](./LICENSE) для деталей.

## 👥 Авторы

- **ilyaknirim** - *Создатель проекта* - [GitHub](https://github.com/ilyaknirim)

Смотрите также список [контрибьюторов](https://github.com/ilyaknirim/domdom/contributors), участвовавших в проекте.

## 🙏 Благодарности

- Telegram за отличную платформу Mini Apps
- Сообщество Open Source за замечательные инструменты
- Всем контрибьюторам этого проекта

## 💬 Поддержка

- 📫 Email: support@example.com
- 💬 Telegram: [@ilyaknirim](https://t.me/ilyaknirim)
- 🐛 Issues: [GitHub Issues](https://github.com/ilyaknirim/domdom/issues)
- 💡 Discussions: [GitHub Discussions](https://github.com/ilyaknirim/domdom/discussions)

## ⭐ Поддержите проект

Если вам понравился этот проект, поставьте ⭐ на GitHub!

---

<div align="center">
  
Сделано с ❤️ в Израиле 🇮🇱

[⬆ Вернуться наверх](#-israeli-real-estate-mini-app)

</div>
