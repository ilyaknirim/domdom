# 🚀 Быстрый старт за 10 минут

## Что получите:
- ✅ Работающий Telegram Mini App
- ✅ Backend API с базой данных
- ✅ Полнофункциональный фронтенд
- ✅ Готово к деплою

---

## Шаг 1: Создайте Telegram Bot (2 мин)

1. Откройте [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте `/newbot`
3. Следуйте инструкциям
4. **Сохраните токен** (выглядит как `1234567890:ABCdef...`)

---

## Шаг 2: Клонируйте проект (1 мин)

```bash
# Клонируйте репозиторий
git clone <your-repo-url>
cd israeli-realestate-miniapp

# Или создайте пустой проект
mkdir israeli-realestate-miniapp
cd israeli-realestate-miniapp
```

---

## Шаг 3: Настройте Backend (3 мин)

```bash
# Перейдите в папку backend
cd backend

# Установите зависимости
npm install

# Создайте .env файл
cat > .env << EOF
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/israeli_realestate?schema=public"
REDIS_URL="redis://localhost:6379"
TELEGRAM_BOT_TOKEN=ВАШТОКЕН
JWT_SECRET=your-secret-key-change-in-production
FRONTEND_URL=http://localhost:5173
EOF

# Запустите PostgreSQL и Redis через Docker
docker run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=israeli_realestate \
  -p 5432:5432 \
  postgres:15-alpine

docker run -d \
  --name redis \
  -p 6379:6379 \
  redis:7-alpine

# Примените миграции базы данных
npx prisma generate
npx prisma migrate dev --name init

# Запустите сервер
npm run dev
```

**Backend запущен!** 🎉  
Проверьте: http://localhost:3000/health

---

## Шаг 4: Настройте Frontend (2 мин)

```bash
# В новом терминале, перейдите в папку frontend
cd frontend

# Установите зависимости
npm install

# Создайте .env файл
cat > .env << EOF
VITE_API_URL=http://localhost:3000/api
EOF

# Запустите dev сервер
npm run dev
```

**Frontend запущен!** 🎉  
Откройте: http://localhost:5173

---

## Шаг 5: Протестируйте локально (2 мин)

### Вариант A: Через ngrok (рекомендуется)

```bash
# Установите ngrok
brew install ngrok  # macOS
# или скачайте с https://ngrok.com

# Создайте туннель для frontend
ngrok http 5173

# Скопируйте HTTPS URL (например: https://abc123.ngrok.io)
```

### Вариант B: Через Telegram Web

Просто откройте http://localhost:5173 в браузере для тестирования UI

---

## Шаг 6: Подключите к Telegram (1 мин)

1. Вернитесь в [@BotFather](https://t.me/BotFather)
2. Отправьте `/setmenubutton`
3. Выберите вашего бота
4. Введите URL: `https://ваш-ngrok-url.ngrok.io`
5. Введите текст кнопки: `🏠 Найти жилье`

---

## Шаг 7: Тестируйте! 🎉

1. Найдите вашего бота в Telegram
2. Нажмите START
3. Нажмите на кнопку "🏠 Найти жилье"
4. Mini App откроется!

---

## 🔥 Альтернатива: Docker Compose (5 мин)

Если хотите всё запустить одной командой:

```bash
# В корне проекта
docker-compose up -d

# Посмотрите логи
docker-compose logs -f
```

Всё запущено:
- Backend: http://localhost:3000
- Frontend: http://localhost:5173
- PostgreSQL: localhost:5432
- Redis: localhost:6379

---

## 📝 Добавьте тестовые данные

```bash
# Откройте Prisma Studio
cd backend
npx prisma studio

# Или используйте seed скрипт (если создан)
npm run seed
```

Создайте несколько тестовых объявлений:

```typescript
// backend/prisma/seed.ts (создайте файл)
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.property.create({
    data: {
      title: 'Уютная квартира в центре Тель-Авива',
      description: 'Светлая 2-комнатная квартира с балконом',
      type: 'APARTMENT',
      dealType: 'RENT',
      status: 'ACTIVE',
      address: 'Rothschild Blvd 50',
      city: 'Tel Aviv',
      latitude: 32.0644,
      longitude: 34.7749,
      rooms: 2,
      bedrooms: 1,
      bathrooms: 1,
      area: 60,
      price: 7500,
      currency: 'ILS',
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'
      ],
      amenities: ['parking', 'balcony', 'wifi'],
      owner: {
        create: {
          telegramId: 123456789,
          firstName: 'Тест',
          lastName: 'Пользователь',
        }
      }
    }
  });
}

main();
```

Запустите: `npx ts-node prisma/seed.ts`

---

## 🎯 Что дальше?

### Для локальной разработки:
- ✅ Всё работает локально
- ✅ Можете разрабатывать и тестировать

### Для продакшена:
1. **Деплой Backend** → Railway, Heroku, или VPS
2. **Деплой Frontend** → Vercel или Netlify
3. **Настройте домен** → В BotFather укажите production URL

📖 Подробнее: [DEPLOY.md](./DEPLOY.md)

---

## 🐛 Проблемы?

### Backend не запускается
```bash
# Проверьте PostgreSQL
docker ps | grep postgres

# Проверьте логи
docker logs postgres
```

### Frontend не подключается к API
```bash
# Проверьте .env
cat frontend/.env

# Убедитесь что backend работает
curl http://localhost:3000/health
```

### Telegram не открывает Mini App
- Убедитесь что используете HTTPS (ngrok даёт HTTPS)
- Проверьте что URL правильный в BotFather
- Попробуйте переоткрыть бота

---

## 📚 Полезные команды

```bash
# Backend
npm run dev          # Запуск в dev режиме
npm run build        # Сборка для production
npm start            # Запуск production версии
npx prisma studio    # Открыть БД в браузере
npx prisma migrate   # Создать миграцию

# Frontend
npm run dev          # Запуск dev сервера
npm run build        # Сборка для production
npm run preview      # Превью production сборки

# Docker
docker-compose up -d              # Запустить всё
docker-compose down               # Остановить всё
docker-compose logs -f backend    # Логи backend
docker-compose restart            # Перезапуск
```

---

## ⚡ Быстрые ссылки

- 📖 [Полная документация](./README.md)
- 🚀 [Инструкция по деплою](./DEPLOY.md)
- 🤖 [Настройка Telegram Bot](./TELEGRAM_BOT_SETUP.md)
- 📡 [API документация](./API_DOCUMENTATION.md)
- ✨ [Список фич](./FEATURES.md)

---

## 🎉 Готово!

Теперь у вас есть:
- ✅ Работающий Telegram Mini App
- ✅ База данных с моделями
- ✅ REST API
- ✅ Красивый UI
- ✅ Real-time чат
- ✅ Система бронирований
- ✅ И ещё куча крутых фич!

**Удачной разработки!** 🚀

---

## 💡 Совет профи

Для удобной разработки используйте:
```bash
# Терминал 1: Backend
cd backend && npm run dev

# Терминал 2: Frontend  
cd frontend && npm run dev

# Терминал 3: Prisma Studio
cd backend && npx prisma studio

# Терминал 4: Ngrok (для тестирования в Telegram)
ngrok http 5173
```

Или используйте [Tmux](https://github.com/tmux/tmux) / [Screen](https://www.gnu.org/software/screen/) для управления несколькими терминалами.
