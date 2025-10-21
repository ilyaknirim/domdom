import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Получить все уведомления
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.telegramUser) {
      throw new AppError('Unauthorized', 401);
    }

    const userId = req.telegramUser.id.toString();
    const { page = '1', limit = '20', unreadOnly = 'false' } = req.query;
    
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: { userId: string; isRead?: boolean } = { userId };
    if (unreadOnly === 'true') {
      where.isRead = false;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' },
        include: {
          booking: {
            select: {
              id: true,
              property: {
                select: {
                  id: true,
                  title: true,
                  images: true,
                },
              },
            },
          },
        },
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

    res.json({
      notifications,
      unreadCount,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        totalPages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Получить количество непрочитанных
router.get('/unread-count', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.telegramUser) {
      throw new AppError('Unauthorized', 401);
    }

    const userId = req.telegramUser.id.toString();
    
    const count = await prisma.notification.count({
      where: { userId, isRead: false },
    });

    res.json({ unreadCount: count });
  } catch (error) {
    next(error);
  }
});

// Отметить как прочитанное
router.put('/:id/read', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.telegramUser) {
      throw new AppError('Unauthorized', 401);
    }

    const userId = req.telegramUser.id.toString();
    const { id } = req.params;

    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new AppError('Notification not found', 404);
    }

    if (notification.userId !== userId) {
      throw new AppError('Access denied', 403);
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// Отметить все как прочитанные
router.put('/read-all', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.telegramUser) {
      throw new AppError('Unauthorized', 401);
    }

    const userId = req.telegramUser.id.toString();

    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
});

// Удалить уведомление
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.telegramUser) {
      throw new AppError('Unauthorized', 401);
    }

    const userId = req.telegramUser.id.toString();
    const { id } = req.params;

    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new AppError('Notification not found', 404);
    }

    if (notification.userId !== userId) {
      throw new AppError('Access denied', 403);
    }

    await prisma.notification.delete({
      where: { id },
    });

    res.json({ message: 'Notification deleted' });
  } catch (error) {
    next(error);
  }
});

// Удалить все прочитанные
router.delete('/clear-read', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.telegramUser) {
      throw new AppError('Unauthorized', 401);
    }

    const userId = req.telegramUser.id.toString();

    await prisma.notification.deleteMany({
      where: {
        userId,
        isRead: true,
      },
    });

    res.json({ message: 'Read notifications cleared' });
  } catch (error) {
    next(error);
  }
});

export default router;
