# 🤝 Contributing to Israeli Real Estate Mini App

Спасибо за интерес к улучшению проекта! Мы рады любому вкладу.

## 🎯 Как помочь проекту

### 🐛 Нашли баг?
1. Проверьте, не создан ли уже Issue
2. Создайте новый Issue с описанием:
   - Шаги воспроизведения
   - Ожидаемое поведение
   - Фактическое поведение
   - Скриншоты (если возможно)

### 💡 Есть идея для новой фичи?
1. Создайте Issue с тегом `enhancement`
2. Опишите:
   - Зачем нужна фича
   - Как она должна работать
   - Примеры использования

### 🔧 Хотите исправить баг или добавить фичу?

#### Шаг 1: Fork репозитория
```bash
# Клонируйте свой fork
git clone https://github.com/YOUR_USERNAME/israeli-realestate-miniapp.git
cd israeli-realestate-miniapp
```

#### Шаг 2: Создайте ветку
```bash
git checkout -b feature/amazing-feature
# или
git checkout -b fix/bug-description
```

#### Шаг 3: Внесите изменения
- Следуйте code style проекта
- Добавьте комментарии к сложному коду
- Обновите документацию если нужно

#### Шаг 4: Commit
```bash
git add .
git commit -m "feat: add amazing feature"
# или
git commit -m "fix: resolve issue with bookings"
```

**Формат commit message:**
- `feat:` - новая фича
- `fix:` - исправление бага
- `docs:` - изменения в документации
- `style:` - форматирование кода
- `refactor:` - рефакторинг
- `test:` - добавление тестов
- `chore:` - обновление зависимостей и т.д.

#### Шаг 5: Push и Pull Request
```bash
git push origin feature/amazing-feature
```

Создайте Pull Request на GitHub с описанием изменений.

---

## 📝 Code Style Guidelines

### TypeScript/JavaScript
- Используйте TypeScript для всего нового кода
- Следуйте ESLint правилам
- Используйте `const` и `let`, избегайте `var`
- Предпочитайте стрелочные функции
- Добавляйте типы ко всем параметрам

```typescript
// ✅ Хорошо
const getUserName = (user: User): string => {
  return `${user.firstName} ${user.lastName}`;
};

// ❌ Плохо
function getUserName(user) {
  return user.firstName + ' ' + user.lastName;
}
```

### React Components
- Используйте функциональные компоненты
- Хуки вместо классов
- Props типизированы через интерфейсы
- Деструктуризация props

```typescript
// ✅ Хорошо
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const Button = ({ label, onClick, disabled = false }: ButtonProps) => {
  return <button onClick={onClick} disabled={disabled}>{label}</button>;
};

// ❌ Плохо
const Button = (props) => {
  return <button onClick={props.onClick}>{props.label}</button>;
};
```

### Backend Services
- Один сервис = одна ответственность
- Методы должны быть короткими
- Обработка ошибок через try-catch
- Логирование важных операций

```typescript
// ✅ Хорошо
async createBooking(data: CreateBookingData) {
  try {
    // Проверка доступности
    const isAvailable = await this.checkAvailability(data);
    if (!isAvailable) {
      throw new AppError('Not available', 400);
    }
    
    // Создание
    const booking = await prisma.booking.create({ data });
    logger.info(`Booking created: ${booking.id}`);
    
    return booking;
  } catch (error) {
    logger.error('Failed to create booking', error);
    throw error;
  }
}
```

---

## 🧪 Тестирование

Перед созданием PR:

### Backend
```bash
cd backend
npm run lint
npm run test
npm run build
```

### Frontend
```bash
cd frontend
npm run lint
npm run build
```

---

## 📁 Структура Pull Request

### Название
`feat: Add calendar component for booking dates`

### Описание
```markdown
## Изменения
- Добавлен компонент Calendar
- Интеграция date-fns
- Поддержка блокированных дат

## Тестирование
- [x] Протестировано локально
- [x] Проверена мобильная версия
- [x] Проверены все языки

## Screenshots
![Calendar](link-to-screenshot)

## Связанные Issues
Closes #42
```

---

## 🔍 Review Process

1. Maintainer проверит ваш PR
2. Может попросить внести изменения
3. После одобрения - merge в main
4. Ваш вклад появится в проекте! 🎉

---

## 💬 Общение

- **Issues** - для багов и предложений
- **Pull Requests** - для кода
- **Discussions** - для вопросов

---

## 📜 License

Внося вклад, вы соглашаетесь что ваш код будет под лицензией MIT.

---

## 🙏 Благодарности

Спасибо всем контрибьюторам за помощь в развитии проекта!

---

**Приятного кодинга! 🚀**
