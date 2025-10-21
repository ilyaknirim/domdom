# 🚀 Руководство по деплою проекта

## 📦 Проект готов к деплою!

**GitHub:** https://github.com/ilyaknirim/domdom

---

## 🎯 Быстрый старт

### Railway (Backend + Database)
1. Backend: автоматически деплоится из GitHub
2. PostgreSQL: создайте сервис PostgreSQL в Railway
3. Redis: создайте сервис Redis в Railway

### Vercel (Frontend)
1. Подключите GitHub репозиторий
2. Настройте переменные окружения
3. Деплой произойдет автоматически

---

## 1️⃣ Backend на Railway

### Шаг 1: Создание проекта
```bash
# Если Railway CLI установлен:
railway login
railway link

# Или через веб-интерфейс:
# https://railway.app/new
```

### Шаг 2: Добавление сервисов

#### 2.1 PostgreSQL Database
1. В Railway проекте: `New` → `Database` → `Add PostgreSQL`
2. Railway автоматически создаст переменную `DATABASE_URL`

#### 2.2 Redis
1. `New` → `Database` → `Add Redis`
2. Railway автоматически создаст переменную `REDIS_URL`

#### 2.3 Backend Service
1. `New` → `GitHub Repo` → выберите `ilyaknirim/domdom`
2. Root Directory: `/backend`
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start`

### Шаг 3: Переменные окружения

В Railway настройте следующие переменные для Backend сервиса:

```env
# Database (автоматически из PostgreSQL сервиса)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Redis (автоматически из Redis сервиса)
REDIS_URL=${{Redis.REDIS_URL}}

# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather

# Security
JWT_SECRET=your_super_secret_jwt_key_min_32_chars

# Node Environment
NODE_ENV=production

# Port (Railway предоставляет автоматически)
PORT=${{PORT}}

# Frontend URL (для CORS)
FRONTEND_URL=https://your-app.vercel.app

# Optional: Cloudinary для загрузки изображений
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Шаг 4: Применение миграций

После первого деплоя:
```bash
# В Railway Terminal (или локально с production DATABASE_URL):
railway run npx prisma migrate deploy
railway run npx prisma generate

# Опционально: добавить тестовые данные
railway run npm run prisma:seed
```

### Шаг 5: Получение URL

Railway автоматически создаст публичный URL, например:
```
https://domdom-production.up.railway.app
```

Скопируйте этот URL - он понадобится для Vercel.

---

## 2️⃣ Frontend на Vercel

### Шаг 1: Импорт проекта

1. Зайдите на [Vercel](https://vercel.com)
2. `Add New` → `Project`
3. Импортируйте `ilyaknirim/domdom` из GitHub
4. Root Directory: `frontend`
5. Framework Preset: `Vite`

### Шаг 2: Настройка сборки

Vercel должен автоматически определить:
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Шаг 3: Переменные окружения

В Vercel настройте:

```env
VITE_API_URL=https://domdom-production.up.railway.app/api
```

### Шаг 4: Деплой

Нажмите `Deploy` - Vercel автоматически соберет и задеплоит приложение.

Ваш URL будет примерно таким:
```
https://domdom.vercel.app
```

### Шаг 5: Обновить CORS в Railway

Вернитесь в Railway и обновите переменную:
```env
FRONTEND_URL=https://domdom.vercel.app
```

---

## 3️⃣ Настройка Telegram Bot

### Шаг 1: Получение токена

Если бота еще нет:
```
1. Откройте @BotFather в Telegram
2. Отправьте /newbot
3. Следуйте инструкциям
4. Скопируйте токен
```

### Шаг 2: Настройка Menu Button

```
1. В @BotFather отправьте: /setmenubutton
2. Выберите своего бота
3. Вставьте URL: https://domdom.vercel.app
4. Название кнопки: "Открыть недвижимость" (или на английском)
```

### Шаг 3: Настройка описания

```bash
# Описание бота
/setdescription
"Поиск и аренда недвижимости в Израиле 🏠"

# Краткое описание
/setabouttext
"Telegram Mini App для поиска квартир, домов и комнат в Израиле"

# Команды
/setcommands
start - Запустить приложение
help - Помощь
```

### Шаг 4: Установка webhook (опционально)

Если нужны уведомления через бота:
```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://domdom-production.up.railway.app/api/telegram/webhook"}'
```

---

## 4️⃣ Проверка работы

### Тест Backend
```bash
# Health check
curl https://domdom-production.up.railway.app/health

# Ожидаемый ответ:
# {"status":"ok","timestamp":"2025-01-21T..."}
```

### Тест Frontend
1. Откройте https://domdom.vercel.app в браузере
2. Должен загрузиться React App

### Тест через Telegram
1. Найдите своего бота в Telegram
2. Нажмите кнопку Menu
3. Должно открыться Mini App

---

## 5️⃣ Мониторинг и логи

### Railway Logs
```bash
# CLI
railway logs

# Или в веб-интерфейсе:
# Project → Service → Logs
```

### Vercel Logs
```bash
# CLI
vercel logs

# Или в веб-интерфейсе:
# Project → Deployments → [выбрать деплой] → Logs
```

---

## 6️⃣ Автоматический деплой

### Настройка CI/CD

После настройки оба сервиса будут автоматически деплоить при пуше в `main`:

```bash
git add .
git commit -m "feat: добавлена новая функция"
git push origin main

# Railway и Vercel автоматически начнут деплой
```

### Отслеживание статуса
- Railway: https://railway.app/project/your-project
- Vercel: https://vercel.com/your-username/domdom

---

## 7️⃣ Обновление приложения

### Обновление Backend
```bash
# Локально внести изменения
git add backend/
git commit -m "fix: исправление бага"
git push origin main

# Railway автоматически задеплоит
```

### Обновление Frontend
```bash
git add frontend/
git commit -m "feat: новый компонент"
git push origin main

# Vercel автоматически задеплоит
```

### Миграции базы данных
```bash
# Локально создать миграцию
cd backend
npx prisma migrate dev --name add_new_field

# Закоммитить
git add prisma/migrations/
git commit -m "db: добавлено новое поле"
git push origin main

# Применить на production
railway run npx prisma migrate deploy
```

---

## 8️⃣ Rollback (откат)

### Railway
1. Project → Deployments
2. Найдите предыдущий успешный деплой
3. Нажмите `Redeploy`

### Vercel
1. Project → Deployments
2. Найдите предыдущий деплой
3. `⋮` → `Promote to Production`

---

## 🔒 Безопасность

### Важные переменные (НИКОГДА не коммитить!)
- ❌ `TELEGRAM_BOT_TOKEN`
- ❌ `JWT_SECRET`
- ❌ `DATABASE_URL`
- ❌ `CLOUDINARY_API_SECRET`

### Рекомендации:
- ✅ Используйте сложные секреты (min 32 символа)
- ✅ Регулярно меняйте JWT_SECRET
- ✅ Включите 2FA на Railway и Vercel
- ✅ Ограничьте CORS только вашим доменом

---

## 📊 Мониторинг производительности

### Рекомендуемые сервисы:
1. **Sentry** - отслеживание ошибок
2. **LogRocket** - session replay
3. **Uptime Robot** - проверка доступности
4. **Railway Metrics** - встроенная аналитика

---

## 🆘 Troubleshooting

### Backend не запускается
```bash
# Проверьте логи
railway logs

# Проверьте переменные окружения
railway variables

# Проверьте подключение к БД
railway run npx prisma db push
```

### Frontend не собирается
```bash
# Проверьте логи в Vercel
vercel logs

# Пересоберите локально
cd frontend
npm run build
```

### База данных не подключается
```bash
# Проверьте DATABASE_URL
echo $DATABASE_URL

# Проверьте миграции
railway run npx prisma migrate status
```

---

## 📞 Поддержка

- **GitHub Issues:** https://github.com/ilyaknirim/domdom/issues
- **Railway Support:** https://help.railway.app
- **Vercel Support:** https://vercel.com/support
- **Telegram:** [@ilyaknirim](https://t.me/ilyaknirim)

---

## ✅ Checklist перед запуском

### Railway Backend
- [ ] PostgreSQL сервис создан
- [ ] Redis сервис создан
- [ ] Backend сервис подключен к GitHub
- [ ] Все переменные окружения настроены
- [ ] Миграции применены
- [ ] `/health` endpoint отвечает
- [ ] Токен Telegram бота добавлен

### Vercel Frontend
- [ ] Репозиторий импортирован
- [ ] Root directory указан: `frontend`
- [ ] `VITE_API_URL` настроен
- [ ] Деплой успешен
- [ ] Приложение открывается в браузере

### Telegram Bot
- [ ] Бот создан через @BotFather
- [ ] Menu button настроена
- [ ] Описания добавлены
- [ ] Mini App открывается из Telegram

### Production Ready
- [ ] CORS настроен для production домена
- [ ] JWT_SECRET безопасный
- [ ] SSL сертификаты активны (автоматически)
- [ ] Логирование настроено
- [ ] Backup базы данных настроен (Railway auto-backup)

---

<div align="center">

**🎉 Готово к запуску! 🎉**

[![Deploy Backend](https://img.shields.io/badge/Deploy-Railway-blueviolet?logo=railway)](https://railway.app)
[![Deploy Frontend](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)

*Следуйте этому гайду шаг за шагом для успешного деплоя*

</div>
