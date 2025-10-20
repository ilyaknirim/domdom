import { Router } from 'express';
import userController from '../controllers/user.controller';

const router = Router();

// Получить текущего пользователя
router.get('/me', userController.getMe);

// Обновить профиль
router.put('/me', userController.updateMe);

// Получить статистику
router.get('/me/stats', userController.getMyStats);

// Получить публичный профиль пользователя
router.get('/:id', userController.getById);

export default router;
