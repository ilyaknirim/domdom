import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { BookingStatus, PaymentStatus } from '@prisma/client';

const router = Router();

// Создать платеж
router.post('/create', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.telegramUser) {
      throw new AppError('Unauthorized', 401);
    }

    const userId = req.telegramUser.id.toString();
    const { bookingId, amount, currency = 'ILS', paymentMethod } = req.body;

    if (!bookingId || !amount) {
      throw new AppError('bookingId and amount are required', 400);
    }

    // Проверка бронирования
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { property: true },
    });

    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    if (booking.userId !== userId) {
      throw new AppError('Access denied', 403);
    }

    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new AppError('Booking must be confirmed before payment', 400);
    }

    // Создание платежа
    const payment = await prisma.payment.create({
      data: {
        userId,
        bookingId,
        amount,
        currency,
        paymentMethod,
        status: PaymentStatus.PENDING,
        description: `Payment for ${booking.property.title}`,
      },
    });

    // Здесь должна быть интеграция с Telegram Payment API
    // или другим платежным провайдером

    res.status(201).json({
      payment,
      // Для Telegram Mini App:
      // paymentLink: `https://t.me/$YOUR_BOT?start=pay_${payment.id}`,
    });
  } catch (error) {
    next(error);
  }
});

// Получить платежи пользователя
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.telegramUser) {
      throw new AppError('Unauthorized', 401);
    }

    const userId = req.telegramUser.id.toString();
    const { page = '1', limit = '20' } = req.query;
    
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where: { userId },
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' },
        include: {
          booking: {
            include: {
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
      prisma.payment.count({ where: { userId } }),
    ]);

    res.json({
      payments,
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

// Получить детали платежа
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.telegramUser) {
      throw new AppError('Unauthorized', 401);
    }

    const userId = req.telegramUser.id.toString();
    const { id } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        booking: {
          include: {
            property: true,
          },
        },
      },
    });

    if (!payment) {
      throw new AppError('Payment not found', 404);
    }

    if (payment.userId !== userId) {
      throw new AppError('Access denied', 403);
    }

    res.json(payment);
  } catch (error) {
    next(error);
  }
});

// Webhook для обработки платежей (без Telegram аутентификации)
router.post('/webhook', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Здесь должна быть проверка подписи webhook'а
    const { paymentId, status, providerPaymentId } = req.body;

    if (!paymentId || !status) {
      throw new AppError('Invalid webhook data', 400);
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { booking: true },
    });

    if (!payment) {
      throw new AppError('Payment not found', 404);
    }

    // Обновление статуса
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status,
        providerPaymentId,
        paidAt: status === PaymentStatus.SUCCEEDED ? new Date() : undefined,
      },
    });

    // Если платеж успешен
    if (status === PaymentStatus.SUCCEEDED && payment.bookingId) {
      await prisma.booking.update({
        where: { id: payment.bookingId },
        data: { status: BookingStatus.PAID },
      });

      // Уведомления
      await prisma.notification.create({
        data: {
          userId: payment.userId,
          type: 'PAYMENT_RECEIVED',
          title: 'Платеж прошел успешно',
          message: `Ваш платеж на сумму ${payment.amount} ${payment.currency} подтвержден`,
          relatedId: payment.id,
        },
      });

      // Получить бронирование с объектом
      const bookingWithProperty = await prisma.booking.findUnique({
        where: { id: payment.bookingId },
        include: { property: true },
      });

      if (bookingWithProperty) {
        await prisma.notification.create({
          data: {
            userId: bookingWithProperty.property.ownerId,
            type: 'PAYMENT_RECEIVED',
            title: 'Получен платеж',
            message: `Платеж за бронирование получен`,
            bookingId: payment.bookingId,
          },
        });
      }
    }

    // Если платеж не прошел
    if (status === PaymentStatus.FAILED) {
      await prisma.notification.create({
        data: {
          userId: payment.userId,
          type: 'PAYMENT_FAILED',
          title: 'Платеж не прошел',
          message: 'Попробуйте еще раз или свяжитесь с поддержкой',
          relatedId: payment.id,
        },
      });
    }

    res.json({ success: true, payment: updatedPayment });
  } catch (error) {
    next(error);
  }
});

// Возврат платежа
router.post('/:id/refund', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.telegramUser) {
      throw new AppError('Unauthorized', 401);
    }

    const { id } = req.params;
    const { reason } = req.body;

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: { booking: { include: { property: true } } },
    });

    if (!payment) {
      throw new AppError('Payment not found', 404);
    }

    // Проверка прав (только владелец объекта или админ)
    const userId = req.telegramUser.id.toString();
    const isOwner = payment.booking?.property.ownerId === userId;
    
    if (!isOwner) {
      throw new AppError('Only property owner can refund payments', 403);
    }

    if (payment.status !== PaymentStatus.SUCCEEDED) {
      throw new AppError('Only successful payments can be refunded', 400);
    }

    // Здесь должна быть логика возврата через платежную систему

    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: {
        status: PaymentStatus.REFUNDED,
        metadata: {
          refundReason: reason,
          refundedAt: new Date().toISOString(),
        },
      },
    });

    // Уведомление
    await prisma.notification.create({
      data: {
        userId: payment.userId,
        type: 'PAYMENT_RECEIVED',
        title: 'Платеж возвращен',
        message: `Вам возвращено ${payment.amount} ${payment.currency}`,
        relatedId: payment.id,
      },
    });

    res.json(updatedPayment);
  } catch (error) {
    next(error);
  }
});

export default router;
