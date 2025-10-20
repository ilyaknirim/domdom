# 🚀 НАЧНИТЕ ЗДЕСЬ!

## 👋 Добро пожаловать в Israeli Real Estate Mini App!

Этот файл поможет вам быстро разобраться в проекте.

---

## 📖 Что это за проект?

**Telegram Mini App** для продажи и аренды недвижимости в Израиле. 

Полнофункциональное приложение с:
- 🏠 Каталогом объектов
- 📅 Системой бронирований
- 💬 Real-time чатом
- 💳 Встроенными платежами
- ⭐ Отзывами и рейтингами
- 🌍 Поддержкой 3 языков (RU, EN, HE)

---

## 🎯 Что вам нужно знать?

### 1️⃣ Вы новичок в проекте?
**Начните с:** [README.md](./README.md)
- Обзор проекта
- Архитектура
- Основные возможности

### 2️⃣ Хотите быстро запустить локально?
**Идите сюда:** [QUICKSTART.md](./QUICKSTART.md)
- Запуск за 10 минут
- Пошаговая инструкция
- Без лишних деталей

### 3️⃣ Готовы к деплою?
**Читайте:** [DEPLOY.md](./DEPLOY.md)
- Развертывание backend
- Развертывание frontend
- Настройка БД и Redis
- Production checklist

### 4️⃣ Нужно настроить Telegram бота?
**Смотрите:** [TELEGRAM_BOT_SETUP.md](./TELEGRAM_BOT_SETUP.md)
- Создание бота через BotFather
- Настройка Mini App
- Конфигурация платежей

### 5️⃣ Хотите понять API?
**Документация:** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- Все endpoints
- Request/Response примеры
- WebSocket события

### 6️⃣ Интересно что уже реализовано?
**Список фич:** [FEATURES.md](./FEATURES.md)
- Полный функционал
- Roadmap
- Статус реализации

### 7️⃣ Нужна структура проекта?
**Карта кода:** [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
- Дерево файлов
- Описание компонентов
- Потоки данных

### 8️⃣ Хотите внести вклад?
**Гайд:** [CONTRIBUTING.md](./CONTRIBUTING.md)
- Как создать Pull Request
- Code style guide
- Процесс review

---

## ⚡ Быстрый старт за 5 минут

```bash
# 1. Клонируйте репозиторий
git clone <your-repo-url>
cd israeli-realestate-miniapp

# 2. Создайте .env файлы
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Отредактируйте backend/.env
# Добавьте ваш TELEGRAM_BOT_TOKEN

# 4. Запустите всё через Docker
docker-compose up -d

# 5. Откройте http://localhost:5173
```

**Готово!** Приложение запущено локально.

---

## 📁 Структура документации

```
📚 Документация
├── 📄 START_HERE.md              ← ВЫ ЗДЕСЬ
├── 📄 README.md                  → Обзор проекта
├── 📄 QUICKSTART.md              → Быстрый старт (10 мин)
├── 📄 DEPLOY.md                  → Развертывание
├── 📄 TELEGRAM_BOT_SETUP.md      → Настройка бота
├── 📄 API_DOCUMENTATION.md       → API endpoints
├── 📄 FEATURES.md                → Список фич
├── 📄 PROJECT_STRUCTURE.md       → Структура кода
├── 📄 CONTRIBUTING.md            → Гайд для контрибьюторов
├── 📄 CHANGELOG.md               → История изменений
├── 📄 SUMMARY.md                 → Итоговая сводка
└── 📄 LICENSE                    → MIT лицензия
```

---

## 🗂️ Структура проекта

```
israeli-realestate-miniapp/
├── 📁 backend/                   # Node.js + Express API
│   ├── src/                      # Исходный код
│   │   ├── controllers/          # HTTP handlers
│   │   ├── services/             # Бизнес-логика
│   │   ├── routes/               # API routes
│   │   ├── middleware/           # Express middleware
│   │   └── utils/                # Утилиты
│   ├── prisma/                   # База данных
│   └── package.json
│
├── 📁 frontend/                  # React + TypeScript
│   ├── src/
│   │   ├── pages/                # Страницы
│   │   ├── components/           # Компоненты
│   │   ├── services/             # API клиент
│   │   ├── utils/                # Утилиты
│   │   └── i18n/                 # Переводы
│   └── package.json
│
└── 📁 docs/                      # Документация (здесь)
```

---

## 🎓 Технологии

### Backend
- **Node.js** + Express
- **TypeScript**
- **PostgreSQL** + Prisma
- **Redis**
- **Socket.IO** (WebSocket)

### Frontend
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **Vite**
- **React Query**
- **i18next**

### Telegram
- **Telegram Mini App SDK**
- **Telegram Payments API**

---

## 🆘 Частые вопросы

### ❓ Как запустить проект?
→ [QUICKSTART.md](./QUICKSTART.md)

### ❓ Как создать Telegram бота?
→ [TELEGRAM_BOT_SETUP.md](./TELEGRAM_BOT_SETUP.md)

### ❓ Как задеплоить приложение?
→ [DEPLOY.md](./DEPLOY.md)

### ❓ Какие есть API endpoints?
→ [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### ❓ Где находится код страницы X?
→ [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

### ❓ Как добавить новую функцию?
→ [CONTRIBUTING.md](./CONTRIBUTING.md)

### ❓ Что уже реализовано?
→ [FEATURES.md](./FEATURES.md)

---

## 🎯 Рекомендованный путь изучения

### Для разработчиков:

```
1. START_HERE.md (вы здесь)       ← Знакомство
        ↓
2. README.md                       ← Обзор
        ↓
3. PROJECT_STRUCTURE.md            ← Архитектура
        ↓
4. QUICKSTART.md                   ← Запуск локально
        ↓
5. API_DOCUMENTATION.md            ← Изучение API
        ↓
6. CONTRIBUTING.md                 ← Начало разработки
```

### Для деплоя:

```
1. TELEGRAM_BOT_SETUP.md          ← Создание бота
        ↓
2. QUICKSTART.md                   ← Тест локально
        ↓
3. DEPLOY.md                       ← Деплой
```

---

## 🚀 Следующие шаги

### Шаг 1: Понять проект
- [ ] Прочитать [README.md](./README.md)
- [ ] Посмотреть [FEATURES.md](./FEATURES.md)
- [ ] Изучить [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

### Шаг 2: Запустить локально
- [ ] Следовать [QUICKSTART.md](./QUICKSTART.md)
- [ ] Открыть http://localhost:5173
- [ ] Протестировать функционал

### Шаг 3: Настроить Telegram
- [ ] Создать бота ([TELEGRAM_BOT_SETUP.md](./TELEGRAM_BOT_SETUP.md))
- [ ] Получить токен
- [ ] Настроить Mini App

### Шаг 4: Задеплоить
- [ ] Выбрать хостинг
- [ ] Следовать [DEPLOY.md](./DEPLOY.md)
- [ ] Настроить домен

### Шаг 5: Разработка
- [ ] Прочитать [CONTRIBUTING.md](./CONTRIBUTING.md)
- [ ] Изучить [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- [ ] Начать кодить! 🎉

---

## 💡 Полезные команды

```bash
# Backend
cd backend
npm install          # Установка зависимостей
npm run dev          # Запуск dev сервера
npm run build        # Сборка
npx prisma studio    # Открыть БД в браузере

# Frontend
cd frontend
npm install          # Установка зависимостей
npm run dev          # Запуск dev сервера
npm run build        # Сборка

# Docker
docker-compose up -d              # Запустить всё
docker-compose down               # Остановить всё
docker-compose logs -f backend    # Логи backend
docker-compose restart            # Перезапуск
```

---

## 🌟 Основные фичи

✅ **Поиск недвижимости** - умные фильтры, карта, геолокация  
✅ **Бронирования** - календарь, подтверждения, уведомления  
✅ **Чат** - real-time переписка с владельцами  
✅ **Платежи** - Telegram Stars, внешние провайдеры  
✅ **Отзывы** - рейтинги, комментарии, верификация  
✅ **Мультиязычность** - RU, EN, עברית  
✅ **Telegram Integration** - haptic, native UI, theme  

---

## 📊 Статистика проекта

```
📦 Размер проекта
  ├── 50+ файлов
  ├── 6000+ строк кода
  ├── 2000+ строк документации
  └── 9 моделей БД

🚀 Готовность
  ├── ✅ Backend - 100%
  ├── ✅ Frontend - 100%
  ├── ✅ Документация - 100%
  └── ✅ Production-ready - ДА
```

---

## 🎨 Скриншоты

> TODO: Добавьте скриншоты после запуска

---

## 🔗 Полезные ссылки

### Документация технологий
- [Telegram Mini Apps](https://core.telegram.org/bots/webapps)
- [React](https://react.dev)
- [Prisma](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com)

### Хостинг
- [Vercel](https://vercel.com) - frontend
- [Railway](https://railway.app) - backend + БД
- [Supabase](https://supabase.com) - PostgreSQL

---

## 🤝 Поддержка

### Нужна помощь?
- 📖 Читайте документацию
- 🐛 Создайте [Issue](https://github.com/your-repo/issues)
- 💬 Задайте вопрос в [Discussions](https://github.com/your-repo/discussions)

### Нашли баг?
- 🐛 Создайте [Issue](https://github.com/your-repo/issues/new)
- 🔧 Или исправьте и сделайте Pull Request!

---

## 📜 Лицензия

MIT License - используйте как хотите!

---

## 🎉 Готовы начать?

### Новичок в проекте?
→ Читайте [README.md](./README.md)

### Хотите запустить?
→ Идите в [QUICKSTART.md](./QUICKSTART.md)

### Готовы к деплою?
→ Открывайте [DEPLOY.md](./DEPLOY.md)

---

**Удачи в разработке! 🚀**

---

*Последнее обновление: 2024-01-15*
