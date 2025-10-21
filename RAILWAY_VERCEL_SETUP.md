# ⚡ Быстрая настройка: Railway + Vercel

## 🎯 За 10 минут до production!

---

## 1️⃣ Railway Backend (5 минут)

### Автоматический способ:

1. **Перейдите:** https://railway.app/new
2. **Deploy from GitHub repo** → выберите `ilyaknirim/domdom`
3. **Add services:**
   - ➕ PostgreSQL
   - ➕ Redis  
   - ➕ Backend (root: `/backend`)

4. **Переменные окружения для Backend:**
   ```env
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   REDIS_URL=${{Redis.REDIS_URL}}
   TELEGRAM_BOT_TOKEN=<ваш_токен_от_BotFather>
   JWT_SECRET=<случайная_строка_32_символа>
   NODE_ENV=production
   FRONTEND_URL=https://your-app.vercel.app
   ```

5. **Применить миграции:**
   ```bash
   railway run npx prisma migrate deploy
   ```

6. **Скопировать URL:** `https://domdom-production.up.railway.app`

---

## 2️⃣ Vercel Frontend (3 минуты)

1. **Перейдите:** https://vercel.com/new
2. **Import Git Repository** → `ilyaknirim/domdom`
3. **Root Directory:** `frontend`
4. **Framework:** Vite
5. **Environment Variable:**
   ```env
   VITE_API_URL=https://domdom-production.up.railway.app/api
   ```
6. **Deploy!**

---

## 3️⃣ Telegram Bot (2 минуты)

### В @BotFather:

```
/setmenubutton
→ Выберите бота
→ URL: https://domdom.vercel.app
→ Text: 🏠 Недвижимость
```

---

## ✅ Проверка

### Backend:
```bash
curl https://domdom-production.up.railway.app/health
# Ответ: {"status":"ok"}
```

### Frontend:
Откройте: https://domdom.vercel.app

### Telegram:
Откройте бота → Menu Button → должно открыться Mini App

---

## 🔄 Автоматические обновления

После настройки просто делайте:
```bash
git push origin main
```

Railway и Vercel автоматически задеплоят изменения! 🚀

---

## 📊 Полезные команды

```bash
# Логи Railway
railway logs

# Логи Vercel  
vercel logs

# Миграции на production
railway run npx prisma migrate deploy

# Открыть БД
railway run npx prisma studio
```

---

## 🆘 Проблемы?

Смотрите полный гайд: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
