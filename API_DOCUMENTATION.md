# 📡 API Documentation

## Base URL
```
Production: https://your-api.com/api
Development: http://localhost:3000/api
```

## Authentication
Все запросы требуют Telegram Web App authentication header:
```
x-telegram-init-data: <telegram_init_data>
```

---

## 🏠 Properties

### GET /properties
Получить список объектов недвижимости с фильтрами

**Query Parameters:**
```typescript
{
  city?: string;              // Город
  district?: string;          // Район
  type?: PropertyType;        // APARTMENT | HOUSE | ROOM | STUDIO | PENTHOUSE | VILLA
  dealType?: DealType;        // SALE | RENT | BOTH
  minPrice?: number;          // Минимальная цена
  maxPrice?: number;          // Максимальная цена
  minRooms?: number;          // Минимум комнат
  maxRooms?: number;          // Максимум комнат
  minArea?: number;           // Минимальная площадь
  maxArea?: number;           // Максимальная площадь
  amenities?: string[];       // Удобства (через запятую)
  latitude?: number;          // Широта (для поиска по радиусу)
  longitude?: number;         // Долгота
  radiusKm?: number;          // Радиус в км
  page?: number;              // Страница (default: 1)
  limit?: number;             // Количество (default: 20)
}
```

**Response:**
```typescript
{
  properties: Property[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }
}
```

**Example:**
```bash
curl -X GET "http://localhost:3000/api/properties?city=Tel%20Aviv&minPrice=5000&maxPrice=10000" \
  -H "x-telegram-init-data: <init_data>"
```

---

### GET /properties/:id
Получить детальную информацию об объекте

**Response:**
```typescript
{
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  dealType: DealType;
  status: PropertyStatus;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  price: number;
  images: string[];
  amenities: string[];
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    rating: number;
    isVerified: boolean;
  };
  reviews: Review[];
  blockedDates: BlockedDate[];
  isFavorite: boolean;
}
```

---

### POST /properties
Создать новое объявление

**Request Body:**
```typescript
{
  title: string;
  description: string;
  type: PropertyType;
  dealType: DealType;
  address: string;
  city: string;
  district?: string;
  latitude: number;
  longitude: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  floor?: number;
  totalFloors?: number;
  price: number;
  currency?: string;
  pricePerMonth?: number;
  deposit?: number;
  amenities?: string[];
  images: string[];
  availableFrom?: string; // ISO date
  availableTo?: string;
  minRentDays?: number;
}
```

**Response:**
```typescript
{
  id: string;
  // ... остальные поля
}
```

---

### PUT /properties/:id
Обновить объявление

**Request Body:** (частичное обновление)
```typescript
{
  title?: string;
  description?: string;
  price?: number;
  status?: PropertyStatus;
  // ... любые поля из создания
}
```

---

### DELETE /properties/:id
Удалить (архивировать) объявление

**Response:**
```typescript
{
  message: "Property archived successfully"
}
```

---

### GET /properties/my/list
Получить мои объявления

**Response:**
```typescript
Property[]
```

---

### POST /properties/:id/check-availability
Проверить доступность на даты

**Request Body:**
```typescript
{
  checkIn: string;  // ISO date
  checkOut: string; // ISO date
}
```

**Response:**
```typescript
{
  isAvailable: boolean;
  blockedDates: BlockedDate[];
  existingBookings: Booking[];
}
```

---

## 📅 Bookings

### GET /bookings
Получить мои бронирования

**Response:**
```typescript
Booking[]
```

---

### POST /bookings
Создать бронирование

**Request Body:**
```typescript
{
  propertyId: string;
  checkIn: string;    // ISO date
  checkOut: string;   // ISO date
  guestCount: number;
  notes?: string;
}
```

**Response:**
```typescript
{
  id: string;
  propertyId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  depositAmount: number;
  status: BookingStatus;
}
```

---

### PUT /bookings/:id/confirm
Подтвердить бронирование (для владельца)

**Response:**
```typescript
{
  id: string;
  status: "CONFIRMED";
  confirmedAt: string;
}
```

---

### PUT /bookings/:id/cancel
Отменить бронирование

**Request Body:**
```typescript
{
  reason?: string;
}
```

**Response:**
```typescript
{
  id: string;
  status: "CANCELLED";
  cancelledAt: string;
  cancelReason: string;
}
```

---

## ❤️ Favorites

### GET /favorites
Получить избранные объекты

**Response:**
```typescript
Array<{
  id: string;
  property: Property;
  createdAt: string;
}>
```

---

### POST /favorites
Добавить в избранное

**Request Body:**
```typescript
{
  propertyId: string;
}
```

---

### DELETE /favorites/:propertyId
Удалить из избранного

**Response:**
```typescript
{
  message: "Removed from favorites"
}
```

---

## 👤 Users

### GET /users/me
Получить текущего пользователя

**Response:**
```typescript
{
  id: string;
  telegramId: number;
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  languageCode: string;
  isVerified: boolean;
  role: UserRole;
  rating: number;
  reviewCount: number;
}
```

---

### PUT /users/me
Обновить профиль

**Request Body:**
```typescript
{
  phone?: string;
  email?: string;
  languageCode?: string;
}
```

---

### GET /users/:id/reviews
Получить отзывы о пользователе

**Response:**
```typescript
Review[]
```

---

## ⭐ Reviews

### POST /reviews
Создать отзыв

**Request Body:**
```typescript
{
  targetId: string;       // ID пользователя
  propertyId?: string;    // ID объекта (опционально)
  rating: number;         // 1-5
  comment: string;
  cleanRating?: number;
  locationRating?: number;
  communicationRating?: number;
}
```

---

## 💳 Payments

### POST /payments/create
Создать платеж

**Request Body:**
```typescript
{
  bookingId: string;
  amount: number;
}
```

**Response:**
```typescript
{
  id: string;
  paymentUrl?: string;    // URL для оплаты
  invoiceUrl?: string;    // Telegram Invoice URL
}
```

---

### POST /payments/webhook
Webhook от платежной системы (только для провайдера)

---

## 🔔 Notifications

### GET /notifications
Получить уведомления

**Query Parameters:**
```typescript
{
  unreadOnly?: boolean;
  limit?: number;
}
```

**Response:**
```typescript
Notification[]
```

---

### PUT /notifications/:id/read
Отметить как прочитанное

---

### PUT /notifications/mark-all-read
Отметить все как прочитанные

---

## 💬 Chat

### GET /chat/:chatRoomId/messages
Получить сообщения чата

**Response:**
```typescript
Message[]
```

---

### POST /chat/:chatRoomId/messages
Отправить сообщение

**Request Body:**
```typescript
{
  content: string;
  attachments?: string[];
}
```

---

## 📤 Upload

### POST /upload/image
Загрузить изображение

**Request:**
```
Content-Type: multipart/form-data

image: <file>
```

**Response:**
```typescript
{
  url: string;
}
```

---

## 📊 Error Responses

### 400 Bad Request
```typescript
{
  error: "Validation error",
  details: [...] // Опционально
}
```

### 401 Unauthorized
```typescript
{
  error: "Unauthorized: Invalid signature"
}
```

### 403 Forbidden
```typescript
{
  error: "Forbidden: You can only edit your own properties"
}
```

### 404 Not Found
```typescript
{
  error: "Property not found"
}
```

### 500 Internal Server Error
```typescript
{
  error: "Internal server error"
}
```

---

## 🔄 WebSocket Events (Chat)

### Connection
```typescript
const socket = io('http://localhost:3000', {
  auth: {
    initData: telegramInitData
  }
});
```

### Events

#### join_room
```typescript
socket.emit('join_room', chatRoomId);
```

#### send_message
```typescript
socket.emit('send_message', {
  chatRoomId: string;
  content: string;
});
```

#### new_message
```typescript
socket.on('new_message', (message: Message) => {
  // Обработка нового сообщения
});
```

#### typing
```typescript
socket.emit('typing', {
  chatRoomId: string;
  userId: string;
});

socket.on('user_typing', (data) => {
  // Показать "печатает..."
});
```

---

## 📈 Rate Limiting

- **Global:** 100 запросов за 15 минут с одного IP
- **Uploads:** 10 изображений за 5 минут
- **Messages:** 30 сообщений в минуту

**Response при превышении:**
```typescript
{
  error: "Too many requests",
  retryAfter: 900 // секунды
}
```

---

## 🔐 Security Headers

Все ответы включают:
```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
```

---

## 📝 Notes

1. Все даты в формате ISO 8601
2. Цены в шекелях (₪)
3. Координаты в десятичных градусах (WGS84)
4. ID в формате UUID v4
5. Пагинация: максимум 100 элементов за запрос
