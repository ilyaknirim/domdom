# 🎨 Frontend - Israeli Real Estate Mini App

React + TypeScript + Telegram Mini App SDK интерфейс.

## 🚀 Быстрый старт

```bash
# Установка зависимостей
npm install

# Настройка .env
cp .env.example .env
# Отредактируйте VITE_API_URL

# Запуск dev сервера
npm run dev

# Откройте http://localhost:5173
```

## 📁 Структура

```
frontend/
├── src/
│   ├── main.tsx              # Точка входа
│   ├── App.tsx               # Главный компонент + роутинг
│   ├── pages/                # Страницы
│   │   ├── HomePage.tsx
│   │   ├── SearchPage.tsx
│   │   ├── PropertyDetailPage.tsx
│   │   ├── BookingDetailPage.tsx
│   │   └── ...
│   ├── components/           # Компоненты
│   │   ├── Layout.tsx
│   │   ├── PropertyCard.tsx
│   │   ├── Calendar.tsx
│   │   └── ...
│   ├── services/             # API клиент
│   │   ├── api.ts
│   │   └── types.ts
│   ├── utils/                # Утилиты
│   │   └── telegram.ts
│   └── i18n/                 # Переводы
│       ├── locales/
│       │   ├── ru.json
│       │   ├── en.json
│       │   └── he.json
│       └── index.ts
└── package.json
```

## 🎨 Компоненты

### Layout
Общий макет с нижней навигацией:
```tsx
<Layout>
  <Routes>...</Routes>
</Layout>
```

### PropertyCard
Карточка недвижимости с фото:
```tsx
<PropertyCard 
  property={property} 
  onClick={() => navigate(`/property/${id}`)}
  isFavorite={true}
/>
```

### Calendar
Интерактивный календарь:
```tsx
<Calendar
  selectedDates={{ checkIn, checkOut }}
  onDateSelect={handleDateSelect}
  blockedDates={blockedDates}
/>
```

## 🌍 Мультиязычность

i18next для 3 языков:
```tsx
const { t, i18n } = useTranslation();

<h1>{t('home.title')}</h1>

i18n.changeLanguage('he'); // Переключение
```

## 📱 Telegram Integration

### SDK инициализация
```typescript
import { getTelegramWebApp, hapticFeedback } from './utils/telegram';

const tg = getTelegramWebApp();
tg.ready();
tg.expand();

hapticFeedback.impact('medium');
```

### Кнопки
```typescript
showMainButton('Забронировать', () => {
  // действие
});

showBackButton(() => {
  navigate(-1);
});
```

## 🎯 API интеграция

React Query для запросов:
```tsx
const { data, isLoading } = useQuery({
  queryKey: ['properties'],
  queryFn: () => api.getProperties(),
});
```

## 🎨 Стилизация

Tailwind CSS:
```tsx
<div className="bg-white rounded-2xl p-4 shadow-sm">
  <h2 className="text-xl font-bold">Title</h2>
</div>
```

Кастомные классы в `index.css`:
- `.property-card`
- `.btn-primary`
- `.btn-secondary`
- `.input-field`

## 📦 Сборка

```bash
npm run build       # Vite сборка в /dist
npm run preview     # Превью production сборки
```

## 🐳 Docker

```bash
docker build -t israeli-realestate-frontend .
docker run -p 80:80 israeli-realestate-frontend
```

## 📝 Environment Variables

```env
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_MAPS_API_KEY=...
```

## 🔧 Development

### Vite Hot Module Replacement
Автоматическая перезагрузка при изменениях.

### TypeScript
Строгая типизация:
```typescript
interface Property {
  id: string;
  title: string;
  // ...
}
```

### React Router
```tsx
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/property/:id" element={<PropertyDetailPage />} />
</Routes>
```

## 🎨 Design System

### Цвета
- Primary: `blue-600`
- Secondary: `gray-600`
- Success: `green-600`
- Danger: `red-600`

### Типографика
- Заголовки: `font-bold`
- Текст: `text-sm`, `text-base`, `text-lg`

### Отступы
- Маленькие: `p-2`, `m-2`
- Средние: `p-4`, `m-4`
- Большие: `p-6`, `m-6`

## 📚 Дополнительно

- [Главная документация](../README.md)
- [Telegram SDK](https://core.telegram.org/bots/webapps)
- [React Query](https://tanstack.com/query)
- [Tailwind CSS](https://tailwindcss.com)
