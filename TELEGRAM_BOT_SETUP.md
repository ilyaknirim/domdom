# 🤖 Настройка Telegram Bot

## Пошаговая инструкция по созданию и настройке бота

### Шаг 1: Создание бота

1. Откройте Telegram и найдите **@BotFather**
2. Отправьте команду: `/start`
3. Отправьте команду: `/newbot`
4. Введите имя бота (например: `Israeli Real Estate`)
5. Введите username бота (например: `israeli_realestate_bot`)
6. **Сохраните токен** - он понадобится для `.env` файла

```
Пример токена: 1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
```

---

### Шаг 2: Настройка описания бота

```
/setdescription
[Выберите бота]
```

Введите описание:
```
🏠 Лучший сервис для поиска и аренды недвижимости в Израиле!

✅ Тысячи объявлений
✅ Удобный поиск с фильтрами
✅ Бронирование онлайн
✅ Безопасные платежи
✅ Прямая связь с владельцами
```

---

### Шаг 3: Настройка короткого описания

```
/setabouttext
[Выберите бота]
```

Введите:
```
🏠 Найдите идеальное жилье в Израиле! Квартиры, комнаты, дома для аренды и продажи.
```

---

### Шаг 4: Настройка команд

```
/setcommands
[Выберите бота]
```

Введите список команд:
```
start - 🏠 Начать поиск жилья
search - 🔍 Поиск недвижимости
favorites - ❤️ Избранное
mybookings - 📅 Мои бронирования
myproperties - 🏢 Мои объявления
profile - 👤 Профиль
help - ℹ️ Помощь
language - 🌐 Сменить язык
```

---

### Шаг 5: Настройка Menu Button (Web App)

```
/setmenubutton
[Выберите бота]
```

1. Выберите "Edit menu button URL"
2. Введите URL вашего frontend (после деплоя):
   ```
   https://your-app.vercel.app
   ```
3. Введите текст кнопки:
   ```
   🏠 Найти жилье
   ```

---

### Шаг 6: Настройка картинки бота (опционально)

```
/setuserpic
[Выберите бота]
[Отправьте квадратное изображение 512x512]
```

---

### Шаг 7: Настройка Web App домена

```
/newapp
[Выберите бота]
[Введите название: Israeli Real Estate]
[Введите описание: Best real estate platform]
[Загрузите иконку 640x360]
[Введите URL: https://your-app.vercel.app]
```

---

### Шаг 8: Настройка платежей (для Telegram Stars или других провайдеров)

#### Вариант A: Telegram Stars (встроенная валюта)

```
/mybots
[Выберите бота]
[Bot Settings]
[Payments]
[Connect Telegram Stars]
```

#### Вариант B: Внешний провайдер (Stripe, YooKassa и т.д.)

1. Зарегистрируйтесь у платежного провайдера
2. Получите API ключи
3. В BotFather:
```
/mybots
[Выберите бота]
[Payments]
[Connect payment provider]
[Вставьте токен провайдера]
```

Популярные провайдеры для Израиля:
- **YooKassa** (для шекелей)
- **Stripe** (международные платежи)
- **PayPal**

---

### Шаг 9: Создание базового обработчика команд (опционально)

Создайте файл `backend/src/bot/commands.ts`:

```typescript
import TelegramBot from 'node-telegram-bot-api';

export const setupBotCommands = (bot: TelegramBot) => {
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const webAppUrl = process.env.FRONTEND_URL || 'https://your-app.vercel.app';
    
    bot.sendMessage(chatId, 
      '🏠 Добро пожаловать в Israeli Real Estate!\n\n' +
      'Найдите идеальное жилье в Израиле:', 
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🔍 Начать поиск',
                web_app: { url: webAppUrl }
              }
            ],
            [
              { text: '❤️ Избранное', callback_data: 'favorites' },
              { text: '📅 Бронирования', callback_data: 'bookings' }
            ]
          ]
        }
      }
    );
  });

  bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId,
      'ℹ️ *Помощь*\n\n' +
      '🔍 /search - Поиск недвижимости\n' +
      '❤️ /favorites - Избранные объекты\n' +
      '📅 /mybookings - Мои бронирования\n' +
      '🏢 /myproperties - Мои объявления\n' +
      '👤 /profile - Настройки профиля\n' +
      '🌐 /language - Сменить язык',
      { parse_mode: 'Markdown' }
    );
  });
};
```

---

### Шаг 10: Инициализация бота в backend

Добавьте в `backend/src/server.ts`:

```typescript
import TelegramBot from 'node-telegram-bot-api';
import { setupBotCommands } from './bot/commands';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (BOT_TOKEN) {
  const bot = new TelegramBot(BOT_TOKEN, { polling: true });
  setupBotCommands(bot);
  logger.info('✅ Telegram Bot initialized');
} else {
  logger.warn('⚠️ Telegram Bot Token not provided');
}
```

---

### Шаг 11: Тестирование

1. Найдите вашего бота в Telegram по username
2. Нажмите START
3. Нажмите на кнопку "🏠 Найти жилье"
4. Mini App должен открыться во встроенном браузере

---

### Шаг 12: Публикация бота (опционально)

Чтобы бот появился в поиске Telegram:

```
/setjoingroups
[Выберите бота]
[Enable/Disable]

/setprivacy
[Выберите бота]
[Disable] - бот увидит все сообщения в группе
```

---

## 📱 Примеры команд для пользователей

### Базовая структура сообщений:

**При старте:**
```
🏠 Добро пожаловать в Israeli Real Estate!

Мы поможем вам найти идеальное жилье в Израиле.

✨ Что мы предлагаем:
✅ Квартиры и дома для аренды
✅ Недвижимость на продажу
✅ Бронирование онлайн
✅ Безопасные платежи

Нажмите кнопку ниже, чтобы начать поиск! 👇
```

**При новом объявлении:**
```
🆕 Новое объявление!

📍 Тель-Авив, район Флорентин
🏠 3-комнатная квартира
💰 8,500 ₪/месяц
📐 75 м²

✨ Удобства: парковка, балкон, кондиционер

[Посмотреть детали]
```

**При бронировании:**
```
✅ Бронирование подтверждено!

📅 Заезд: 15.01.2024
📅 Выезд: 15.02.2024
🏠 3-комнатная квартира, Тель-Авив
💰 Итого: 8,500 ₪

Владелец свяжется с вами в ближайшее время.
```

---

## 🔐 Безопасность

### Важные настройки:

1. **Храните токен бота в безопасности** - никогда не публикуйте в GitHub
2. **Используйте webhook вместо polling** в production:

```typescript
// Вместо polling: true
bot.setWebHook(`${YOUR_DOMAIN}/bot${BOT_TOKEN}`);

app.post(`/bot${BOT_TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});
```

3. **Валидация данных** - всегда проверяйте signature от Telegram

---

## 🌐 Мультиязычность

Настройте ответы бота на разных языках:

```typescript
const messages = {
  ru: {
    welcome: '🏠 Добро пожаловать!',
    search: '🔍 Начать поиск',
  },
  en: {
    welcome: '🏠 Welcome!',
    search: '🔍 Start search',
  },
  he: {
    welcome: '🏠 ברוך הבא!',
    search: '🔍 התחל חיפוש',
  }
};

const lang = msg.from.language_code || 'ru';
bot.sendMessage(chatId, messages[lang].welcome);
```

---

## 📊 Аналитика

Отслеживайте активность бота:

```typescript
bot.on('message', (msg) => {
  // Логирование
  logger.info(`User ${msg.from.id} sent: ${msg.text}`);
  
  // Аналитика
  await prisma.botAnalytics.create({
    data: {
      userId: msg.from.id,
      action: 'message',
      payload: msg.text,
    }
  });
});
```

---

## ✅ Checklist

- [ ] Бот создан через BotFather
- [ ] Токен сохранен в `.env`
- [ ] Описание настроено
- [ ] Команды добавлены
- [ ] Menu Button настроен
- [ ] Web App URL указан
- [ ] Картинка загружена
- [ ] Платежи настроены (если нужно)
- [ ] Webhook настроен (для production)
- [ ] Бот протестирован

---

## 🆘 Решение проблем

### Бот не отвечает
- Проверьте, правильно ли указан токен
- Убедитесь, что бот запущен (`polling: true` или webhook)
- Проверьте логи

### Web App не открывается
- Проверьте HTTPS (обязательно для Mini Apps)
- Убедитесь, что URL правильный
- Проверьте CORS настройки

### Платежи не работают
- Убедитесь, что провайдер активирован
- Проверьте токен платежного провайдера
- Тестируйте в тестовом режиме

---

## 📚 Полезные ссылки

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Telegram Mini Apps](https://core.telegram.org/bots/webapps)
- [Telegram Payments](https://core.telegram.org/bots/payments)
- [BotFather Commands](https://core.telegram.org/bots#6-botfather)

---

Готово! Ваш бот настроен и готов к работе! 🎉
