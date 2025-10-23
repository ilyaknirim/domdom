import { Router } from 'express';
import propertyController from '../controllers/property.controller';

const router = Router();

// Публичные роуты (со списком объектов)
router.get('/', propertyController.getAll);

// Мои объявления (ставим до динамических маршрутов)
router.get('/my/list', propertyController.getMyProperties);

// Проверка доступности (ставим до :id)
router.post('/:id/check-availability', propertyController.checkAvailability);

// Динамические маршруты
router.get('/:id', propertyController.getById);

// Приватные роуты (требуют авторизации)
router.post('/', propertyController.create);
router.put('/:id', propertyController.update);
router.delete('/:id', propertyController.delete);

export default router;
