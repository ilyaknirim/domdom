import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import userService from '../services/user.service';

const router = Router();

// Получить отзывы о пользователе
router.get('/user/:userId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const { page = '1', limit = '10' } = req.query;
    
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { targetId: userId },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
            },
          },
          property: {
            select: {
              id: true,
              title: true,
              images: true,
            },
          },
        },
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.review.count({ where: { targetId: userId } }),
    ]);

    res.json({
      reviews,
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

// Получить отзывы об объекте
router.get('/property/:propertyId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { propertyId } = req.params;
    const { page = '1', limit = '10' } = req.query;
    
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { propertyId },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
              rating: true,
            },
          },
        },
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.review.count({ where: { propertyId } }),
    ]);

    res.json({
      reviews,
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

// Создать отзыв
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.telegramUser) {
      throw new AppError('Unauthorized', 401);
    }

    const authorId = req.telegramUser.id.toString();
    const {
      targetId,
      propertyId,
      rating,
      comment,
      cleanRating,
      locationRating,
      communicationRating,
    } = req.body;

    // Валидация
    if (!targetId || !rating || !comment) {
      throw new AppError('targetId, rating and comment are required', 400);
    }

    if (rating < 1 || rating > 5) {
      throw new AppError('Rating must be between 1 and 5', 400);
    }

    if (authorId === targetId) {
      throw new AppError('You cannot review yourself', 400);
    }

    // Проверить, что было завершенное бронирование
    let isVerified = false;
    if (propertyId) {
      const completedBooking = await prisma.booking.findFirst({
        where: {
          userId: authorId,
          propertyId,
          status: 'COMPLETED',
        },
      });
      isVerified = !!completedBooking;
    }

    const review = await prisma.review.create({
      data: {
        authorId,
        targetId,
        propertyId,
        rating,
        comment,
        cleanRating,
        locationRating,
        communicationRating,
        isVerified,
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
          },
        },
      },
    });

    // Обновить рейтинг пользователя
    await userService.updateUserRating(targetId);

    // Уведомление
    await prisma.notification.create({
      data: {
        userId: targetId,
        type: 'REVIEW_RECEIVED',
        title: 'Новый отзыв',
        message: `${req.telegramUser.first_name} оставил отзыв (${rating}/5)`,
        relatedId: review.id,
      },
    });

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
});

// Обновить отзыв
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.telegramUser) {
      throw new AppError('Unauthorized', 401);
    }

    const authorId = req.telegramUser.id.toString();
    const { id } = req.params;
    const { rating, comment, cleanRating, locationRating, communicationRating } = req.body;

    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new AppError('Review not found', 404);
    }

    if (review.authorId !== authorId) {
      throw new AppError('You can only edit your own reviews', 403);
    }

    const updated = await prisma.review.update({
      where: { id },
      data: {
        rating,
        comment,
        cleanRating,
        locationRating,
        communicationRating,
      },
    });

    // Обновить рейтинг
    await userService.updateUserRating(review.targetId);

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// Удалить отзыв
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.telegramUser) {
      throw new AppError('Unauthorized', 401);
    }

    const authorId = req.telegramUser.id.toString();
    const { id } = req.params;

    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new AppError('Review not found', 404);
    }

    if (review.authorId !== authorId) {
      throw new AppError('You can only delete your own reviews', 403);
    }

    await prisma.review.delete({
      where: { id },
    });

    // Обновить рейтинг
    await userService.updateUserRating(review.targetId);

    res.json({ message: 'Review deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
