import { Router } from 'express';
import bookingController from '../controllers/booking.controller';

const router = Router();

// Получить бронирования пользователя
router.get('/', bookingController.getAll);

// Получить бронирования владельца
router.get('/owner/list', bookingController.getOwnerBookings);

// Получить детали бронирования
router.get('/:id', bookingController.getById);

// Создать бронирование
router.post('/', bookingController.create);

// Подтвердить бронирование
router.put('/:id/confirm', bookingController.confirm);

// Отменить бронирование
router.put('/:id/cancel', bookingController.cancel);

export default router;
