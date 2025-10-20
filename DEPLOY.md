# 🚀 Инструкция по развертыванию

## Содержание
1. [Создание Telegram Bot](#1-создание-telegram-bot)
2. [Локальная разработка](#2-локальная-разработка)
3. [Развертывание Backend](#3-развертывание-backend)
4. [Развертывание Frontend](#4-развертывание-frontend)
5. [Настройка базы данных](#5-настройка-базы-данных)
6. [Настройка Telegram Mini App](#6-настройка-telegram-mini-app)

---

## 1. Создание Telegram Bot

### 1.1. Создайте бота через BotFather

```
1. Откройте Telegram и найдите @BotFather
2. Отправьте команду /newbot
3. Выберите имя и username для бота
4. Сохраните токен бота (TELEGRAM_BOT_TOKEN)
```

### 1.2. Настройте Mini App

```
1. Отправьте /mybots в BotFather
2. Выберите вашего бота
3. Выберите "Bot Settings" -> "Menu Button"
4. Настройте Web App URL на ваш frontend URL
```

---

## 2. Локальная разработка

### 2.1. Установка зависимостей

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Отредактируйте .env файл

# Frontend
cd ../frontend
npm install
cp .env.example .env
# Отредактируйте .env файл
```

### 2.2. Запуск с Docker

```bash
# В корне проекта
docker-compose up -d

# Проверка логов
docker-compose logs -f backend
```

### 2.3. Запуск локально (без Docker)

```bash
# Установите PostgreSQL и Redis локально

# Backend
cd backend
npx prisma generate
npx prisma migrate dev
npm run dev

# Frontend (в новом терминале)
cd frontend
npm run dev
```

### 2.4. Доступ к приложению

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Prisma Studio: `npx prisma studio` (порт 5555)

---

## 3. Развертывание Backend

### Вариант A: VPS (DigitalOcean, Hetzner, AWS EC2)

```bash
# 1. Подключитесь к серверу
ssh root@your-server-ip

# 2. Установите Docker и Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 3. Клонируйте репозиторий
git clone <your-repo-url>
cd israeli-realestate-miniapp

# 4. Настройте переменные окружения
cp backend/.env.example backend/.env
nano backend/.env

# 5. Запустите приложение
docker-compose up -d

# 6. Настройте Nginx как reverse proxy (опционально)
```

### Вариант B: Railway.app

```bash
# 1. Установите Railway CLI
npm install -g @railway/cli

# 2. Войдите
railway login

# 3. Инициализируйте проект
railway init

# 4. Добавьте PostgreSQL
railway add postgresql

# 5. Добавьте Redis
railway add redis

# 6. Разверните backend
cd backend
railway up

# 7. Настройте переменные окружения через dashboard
```

### Вариант C: Heroku

```bash
# 1. Создайте приложение
heroku create israeli-realestate-api

# 2. Добавьте PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# 3. Добавьте Redis
heroku addons:create heroku-redis:hobby-dev

# 4. Настройте переменные окружения
heroku config:set TELEGRAM_BOT_TOKEN=your_token

# 5. Разверните
git push heroku main
```

---

## 4. Развертывание Frontend

### Вариант A: Vercel (Рекомендуется)

```bash
# 1. Установите Vercel CLI
npm install -g vercel

# 2. Войдите
vercel login

# 3. Разверните
cd frontend
vercel

# 4. Настройте environment variables
# В Vercel Dashboard добавьте:
# VITE_API_URL=https://your-backend-url.com/api
```

### Вариант B: Netlify

```bash
# 1. Установите Netlify CLI
npm install -g netlify-cli

# 2. Войдите
netlify login

# 3. Разверните
cd frontend
npm run build
netlify deploy --prod --dir=dist

# 4. Настройте environment variables через dashboard
```

### Вариант C: GitHub Pages

```bash
# 1. Добавьте в package.json:
{
  "homepage": "https://yourusername.github.io/israeli-realestate"
}

# 2. Установите gh-pages
npm install --save-dev gh-pages

# 3. Добавьте в scripts:
{
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}

# 4. Разверните
npm run deploy
```

---

## 5. Настройка базы данных

### Миграции Prisma

```bash
# Создать новую миграцию
npx prisma migrate dev --name init

# Применить миграции в production
npx prisma migrate deploy

# Сгенерировать Prisma Client
npx prisma generate

# Открыть Prisma Studio
npx prisma studio
```

### Резервное копирование

```bash
# Создать backup
pg_dump $DATABASE_URL > backup.sql

# Восстановить из backup
psql $DATABASE_URL < backup.sql
```

---

## 6. Настройка Telegram Mini App

### 6.1. Настройка Bot Menu Button

В BotFather:
```
/setmenubutton
[Выберите бота]
[Введите текст кнопки: 🏠 Найти жилье]
[Введите URL: https://your-frontend-url.com]
```

### 6.2. Настройка Web App Domain

```
/setdomain
[Выберите бота]
[Введите домен: your-frontend-url.com]
```

### 6.3. Настройка платежей (опционально)

```
/setinvoice
[Выберите бота]
[Выберите платежного провайдера]
[Получите payment provider token]
```

### 6.4. Тестирование Mini App

1. Откройте вашего бота в Telegram
2. Нажмите на кнопку меню
3. Mini App должен открыться во встроенном браузере

---

## 7. Мониторинг и логирование

### 7.1. Логи Docker

```bash
# Просмотр логов
docker-compose logs -f

# Логи конкретного сервиса
docker-compose logs -f backend
```

### 7.2. PM2 (если не используете Docker)

```bash
# Установка
npm install -g pm2

# Запуск
cd backend
pm2 start dist/server.js --name israeli-realestate-api

# Мониторинг
pm2 monit

# Логи
pm2 logs
```

### 7.3. Мониторинг с Sentry (опционально)

```bash
# Установка
npm install @sentry/node

# Добавьте в backend/src/server.ts
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
});
```

---

## 8. SSL сертификаты (HTTPS)

### Certbot (Let's Encrypt)

```bash
# Установка
sudo apt install certbot python3-certbot-nginx

# Получение сертификата
sudo certbot --nginx -d your-domain.com

# Автоматическое обновление
sudo certbot renew --dry-run
```

---

## 9. Безопасность

### 9.1. Firewall

```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 9.2. Fail2Ban

```bash
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

## 10. Производительность

### 10.1. Redis для кэширования

```typescript
// Кэширование популярных запросов
const cachedData = await redis.get('popular-properties');
if (cachedData) {
  return JSON.parse(cachedData);
}

const data = await prisma.property.findMany();
await redis.setex('popular-properties', 3600, JSON.stringify(data));
```

### 10.2. CDN для изображений

- Используйте Cloudinary или AWS S3 + CloudFront
- Оптимизируйте изображения (WebP, AVIF)
- Используйте lazy loading

---

## 11. CI/CD Pipeline (GitHub Actions)

Создайте `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

---

## 📞 Поддержка

Если возникли вопросы:
- Создайте Issue в GitHub
- Проверьте логи: `docker-compose logs -f`
- Проверьте документацию Telegram Bot API

---

## ✅ Checklist перед запуском

- [ ] Telegram Bot создан и настроен
- [ ] База данных PostgreSQL запущена
- [ ] Redis запущен
- [ ] Переменные окружения настроены
- [ ] Миграции базы данных применены
- [ ] Backend развернут и доступен
- [ ] Frontend развернут и доступен
- [ ] SSL сертификат установлен
- [ ] Telegram Mini App протестирован
- [ ] Платежная система настроена (если нужна)
- [ ] Мониторинг и логирование настроены

Удачи! 🚀
