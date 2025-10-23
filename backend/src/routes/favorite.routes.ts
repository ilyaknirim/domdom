import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Получить избранные объекты
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.telegramUser) {
      throw new AppError('Unauthorized', 401);
    }

    const userId = req.telegramUser.id.toString();
    
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        property: {
          include: {
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                rating: true,
                reviewCount: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(favorites);
  } catch (error) {
    next(error);
  }
});

// Добавить в избранное
router.post('/:propertyId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.telegramUser) {
      throw new AppError('Unauthorized', 401);
    }

    const userId = req.telegramUser.id.toString();
    const { propertyId } = req.params;

    // Проверка существования объекта
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new AppError('Property not found', 404);
    }

    // Создание или получение избранного
    // Проверить, существует ли уже избранное
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_propertyId: {
          userId,
          propertyId,
        },
      },
    });

    let favorite;
    if (existing) {
      // Возвращаем существующую запись без изменения счетчиков
      favorite = await prisma.favorite.findUnique({
        where: {
          userId_propertyId: {
            userId,
            propertyId,
          },
        },
        include: { property: true },
      });
    } else {
      // Создаем новую и инкрементируем счетчик
      favorite = await prisma.favorite.create({
        data: { userId, propertyId },
        include: { property: true },
      });
      await prisma.property.update({
        where: { id: propertyId },
        data: { favoriteCount: { increment: 1 } },
      });
    }

    res.status(201).json(favorite);
  } catch (error) {
    next(error);
  }
});

// Удалить из избранного
router.delete('/:propertyId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.telegramUser) {
      throw new AppError('Unauthorized', 401);
    }

    const userId = req.telegramUser.id.toString();
    const { propertyId } = req.params;

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_propertyId: {
          userId,
          propertyId,
        },
      },
    });

    if (!favorite) {
      throw new AppError('Favorite not found', 404);
    }

    await prisma.favorite.delete({
      where: {
        userId_propertyId: {
          userId,
          propertyId,
        },
      },
    });

    // Обновить счетчик
    // Декремент со страховкой от отрицательных значений
    await prisma.property.update({
      where: { id: propertyId },
      data: {
        favoriteCount: {
          decrement: 1,
        },
      },
    });

    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    next(error);
  }
});

export default router;
