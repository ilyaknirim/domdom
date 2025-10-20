# 🚀 Руководство по установке и запуску

## Предварительные требования

- **Node.js** 18+ и npm
- **PostgreSQL** 15+ (или Docker для запуска БД в контейнере)
- **Redis** (опционально, для продакшена)

## 📦 Установка

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd israeli-realestate-miniapp
```

### 2. Установка зависимостей

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 3. Настройка базы данных

#### Вариант A: Использование Docker (рекомендуется)

```bash
# Запустить PostgreSQL и Redis в Docker
docker compose -f docker-compose-dev.yml up -d

# Проверить статус
docker ps
```

#### Вариант B: Локальная PostgreSQL

1. Установите PostgreSQL 15+
2. Создайте базу данных:

```sql
CREATE DATABASE israeli_realestate;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE israeli_realestate TO postgres;
```

### 4. Настройка переменных окружения

#### Backend

```bash
cd backend
cp .env.example .env
```

Отредактируйте `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/israeli_realestate?schema=public"
PORT=3000
NODE_ENV=development
TELEGRAM_BOT_TOKEN=your_bot_token_here
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_here
LOG_LEVEL=info
```

#### Frontend

```bash
cd frontend
cp .env.example .env
```

Отредактируйте `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000
```

### 5. Инициализация базы данных

```bash
cd backend

# Генерация Prisma клиента
npm run prisma:generate

# Применение миграций
npm run prisma:migrate

# (Опционально) Открыть Prisma Studio для просмотра БД
npm run prisma:studio
```

### 6. Запуск приложения

#### В режиме разработки

Откройте 2 терминала:

**Терминал 1 - Backend:**
```bash
cd backend
npm run dev
```

**Терминал 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Backend будет доступен на: http://localhost:3000
Frontend будет доступен на: http://localhost:5173

## 🔧 Настройка Telegram Bot

### 1. Создание бота

1. Откройте Telegram и найдите [@BotFather](https://t.me/botfather)
2. Отправьте команду `/newbot`
3. Следуйте инструкциям и выберите имя для бота
4. Скопируйте токен бота

### 2. Настройка Mini App

1. Отправьте `/newapp` в BotFather
2. Выберите вашего бота
3. Укажите URL вашего frontend приложения
4. Загрузите иконку (необязательно)

### 3. Обновление .env

Вставьте токен бота в `backend/.env`:
```env
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
```

## 📝 Полезные команды

### Backend

```bash
# Разработка
npm run dev

# Сборка
npm run build

# Запуск продакшн версии
npm start

# Тесты
npm test

# Линтинг
npm run lint

# Форматирование
npm run format

# Prisma команды
npm run prisma:generate  # Генерация клиента
npm run prisma:migrate   # Применение миграций
npm run prisma:studio    # Открыть Prisma Studio
```

### Frontend

```bash
# Разработка
npm run dev

# Сборка
npm run build

# Превью сборки
npm run preview

# Линтинг
npm run lint
```

## 🐛 Решение проблем

### Проблема: Ошибка подключения к БД

**Решение:**
1. Проверьте, запущена ли PostgreSQL:
   ```bash
   # Windows
   Get-Service postgresql*
   
   # Linux/Mac
   sudo systemctl status postgresql
   ```

2. Проверьте правильность DATABASE_URL в .env

3. Попробуйте подключиться вручную:
   ```bash
   psql -U postgres -d israeli_realestate
   ```

### Проблема: Prisma ошибки

**Решение:**
```bash
# Пересоздать клиент Prisma
npx prisma generate

# Сбросить базу данных (ВНИМАНИЕ: удалит все данные!)
npx prisma migrate reset

# Применить миграции заново
npx prisma migrate dev
```

### Проблема: Порт уже занят

**Решение:**
```bash
# Windows - найти процесс на порту 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

### Проблема: npm install ошибки

**Решение:**
```bash
# Очистить кэш npm
npm cache clean --force

# Удалить node_modules и package-lock.json
rm -rf node_modules package-lock.json

# Переустановить
npm install
```

## 🔒 Безопасность

⚠️ **ВАЖНО для продакшена:**

1. Измените все пароли и секретные ключи в .env
2. Используйте HTTPS для frontend
3. Настройте CORS правильно
4. Включите rate limiting
5. Используйте надежные пароли для БД
6. Не коммитьте .env файлы в git

## 📊 Мониторинг

### Логи

Логи сохраняются в `backend/logs/`:
- `combined.log` - все логи
- `error.log` - только ошибки

### Health Check

```bash
curl http://localhost:3000/health
```

## 🚢 Деплой

См. подробную инструкцию в [DEPLOY.md](./DEPLOY.md)

### Быстрый деплой на Railway

1. Зарегистрируйтесь на [Railway.app](https://railway.app)
2. Подключите GitHub репозиторий
3. Добавьте PostgreSQL сервис
4. Настройте переменные окружения
5. Деплой произойдет автоматически

## 💡 Дополнительные ресурсы

- [Prisma Documentation](https://www.prisma.io/docs)
- [Telegram Mini Apps](https://core.telegram.org/bots/webapps)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [React Documentation](https://react.dev)

## 🤝 Поддержка

Если возникли проблемы:
1. Проверьте [Issues](../../issues)
2. Создайте новый Issue с описанием проблемы
3. Включите логи и версии используемого ПО

---

**Готово!** 🎉 Теперь ваше приложение должно работать.

Откройте http://localhost:5173 в браузере или в Telegram Mini App.
