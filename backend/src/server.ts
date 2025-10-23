import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import rateLimit from 'express-rate-limit';

// Импорты конфигурации и маршрутов
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { validateTelegramWebAppData, optionalTelegramAuth } from './middleware/telegramAuth';

// Роуты
import propertyRoutes from './routes/property.routes';
import bookingRoutes from './routes/booking.routes';
import userRoutes from './routes/user.routes';
import paymentRoutes from './routes/payment.routes';
import reviewRoutes from './routes/review.routes';
import favoriteRoutes from './routes/favorite.routes';
import notificationRoutes from './routes/notification.routes';
import chatRoutes from './routes/chat.routes';
import { setIO } from './utils/socket';

dotenv.config();

const app: Application = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // максимум 100 запросов с одного IP
  message: 'Слишком много запросов с этого IP, попробуйте позже',
});

app.use('/api/', limiter);

// Логирование запросов
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes (все требуют Telegram аутентификации)
app.use('/api/properties', optionalTelegramAuth, propertyRoutes);
app.use('/api/bookings', validateTelegramWebAppData, bookingRoutes);
app.use('/api/users', validateTelegramWebAppData, userRoutes);
app.use('/api/payments', validateTelegramWebAppData, paymentRoutes);
app.use('/api/reviews', validateTelegramWebAppData, reviewRoutes);
app.use('/api/favorites', validateTelegramWebAppData, favoriteRoutes);
app.use('/api/notifications', validateTelegramWebAppData, notificationRoutes);
app.use('/api/chat', validateTelegramWebAppData, chatRoutes);

// WebSocket для чата
setIO(io);

io.on('connection', (socket) => {
  logger.info(`Socket connected: ${socket.id}`);

  socket.on('join_room', (chatRoomId: string) => {
    socket.join(chatRoomId);
    logger.info(`Socket ${socket.id} joined room ${chatRoomId}`);
  });

  socket.on('send_message', (data) => {
    io.to(data.chatRoomId).emit('new_message', data);
  });

  socket.on('typing', (data) => {
    socket.to(data.chatRoomId).emit('user_typing', data);
  });

  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

// Экспорт io для использования в других модулях
export { io };

// Error handling
app.use(errorHandler);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  logger.info(`🚀 Server is running on port ${PORT}`);
  logger.info(`📱 Telegram Mini App Backend ready`);
  logger.info(`🏠 Real Estate API initialized`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  httpServer.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

export default app;
