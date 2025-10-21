import { prisma } from '../config/database';
import { BookingStatus } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import { io } from '../server';

export interface CreateBookingData {
  propertyId: string;
  userId: string;
  checkIn: Date;
  checkOut: Date;
  guestCount: number;
  notes?: string;
}

export class BookingService {
  /**
   * Создать бронирование
   */
  async createBooking(data: CreateBookingData) {
    // Проверка доступности
    const property = await prisma.property.findUnique({
      where: { id: data.propertyId },
      include: {
        blockedDates: {
          where: {
            OR: [
              {
                AND: [
                  { startDate: { lte: data.checkIn } },
                  { endDate: { gte: data.checkIn } },
                ],
              },
              {
                AND: [
                  { startDate: { lte: data.checkOut } },
                  { endDate: { gte: data.checkOut } },
                ],
              },
            ],
          },
        },
        bookings: {
          where: {
            status: { in: ['CONFIRMED', 'PAID', 'ACTIVE'] },
            OR: [
              {
                AND: [
                  { checkIn: { lte: data.checkIn } },
                  { checkOut: { gte: data.checkIn } },
                ],
              },
              {
                AND: [
                  { checkIn: { lte: data.checkOut } },
                  { checkOut: { gte: data.checkOut } },
                ],
              },
            ],
          },
        },
      },
    });

    if (!property) {
      throw new AppError('Property not found', 404);
    }

    if (property.blockedDates.length > 0 || property.bookings.length > 0) {
      throw new AppError('Property is not available for selected dates', 400);
    }

    // Расчет стоимости
    const days = Math.ceil(
      (data.checkOut.getTime() - data.checkIn.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (property.minRentDays && days < property.minRentDays) {
      throw new AppError(
        `Minimum rental period is ${property.minRentDays} days`,
        400
      );
    }

    const pricePerDay = property.pricePerMonth
      ? Number(property.pricePerMonth) / 30
      : Number(property.price);

    const totalPrice = pricePerDay * days;
    const depositAmount = property.deposit ? Number(property.deposit) : totalPrice * 0.2;

    // Создание бронирования
    const booking = await prisma.booking.create({
      data: {
        propertyId: data.propertyId,
        userId: data.userId,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        guestCount: data.guestCount,
        notes: data.notes,
        totalPrice,
        depositAmount,
        currency: property.currency,
        status: BookingStatus.PENDING,
      },
      include: {
        property: {
          include: {
            owner: true,
          },
        },
        user: true,
      },
    });

    // Создать уведомление для владельца
    await prisma.notification.create({
      data: {
        userId: property.ownerId,
        type: 'NEW_BOOKING',
        title: 'Новое бронирование',
        message: `${booking.user.firstName} хочет забронировать ${property.title}`,
        bookingId: booking.id,
        data: { bookingId: booking.id },
      },
    });

    // Отправить real-time уведомление
    io.to(`user_${property.ownerId}`).emit('new_notification', {
      type: 'NEW_BOOKING',
      bookingId: booking.id,
    });

    return booking;
  }

  /**
   * Получить бронирования пользователя
   */
  async getUserBookings(userId: string) {
    return prisma.booking.findMany({
      where: { userId },
      include: {
        property: {
          include: {
            owner: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Получить бронирования для владельца
   */
  async getOwnerBookings(ownerId: string) {
    return prisma.booking.findMany({
      where: {
        property: {
          ownerId,
        },
      },
      include: {
        property: true,
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Подтвердить бронирование
   */
  async confirmBooking(bookingId: string, ownerId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        property: true,
      },
    });

    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    if (booking.property.ownerId !== ownerId) {
      throw new AppError('You can only confirm your own property bookings', 403);
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw new AppError('Only pending bookings can be confirmed', 400);
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CONFIRMED,
        confirmedAt: new Date(),
      },
      include: {
        property: true,
        user: true,
      },
    });

    // Уведомление для арендатора
    await prisma.notification.create({
      data: {
        userId: booking.userId,
        type: 'BOOKING_CONFIRMED',
        title: 'Бронирование подтверждено',
        message: `Ваше бронирование ${booking.property.title} подтверждено`,
        bookingId: booking.id,
      },
    });

    io.to(`user_${booking.userId}`).emit('booking_confirmed', {
      bookingId: booking.id,
    });

    return updated;
  }

  /**
   * Отменить бронирование
   */
  async cancelBooking(bookingId: string, userId: string, reason?: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        property: true,
      },
    });

    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    // Проверка прав (владелец или арендатор)
    const isOwner = booking.property.ownerId === userId;
    const isRenter = booking.userId === userId;

    if (!isOwner && !isRenter) {
      throw new AppError('You can only cancel your own bookings', 403);
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CANCELLED,
        cancelledAt: new Date(),
        cancelReason: reason,
        cancelledBy: userId,
      },
    });

    // Уведомление для другой стороны
    const notifyUserId = isOwner ? booking.userId : booking.property.ownerId;
    await prisma.notification.create({
      data: {
        userId: notifyUserId,
        type: 'BOOKING_CANCELLED',
        title: 'Бронирование отменено',
        message: `Бронирование ${booking.property.title} отменено`,
        bookingId: booking.id,
        data: { reason },
      },
    });

    return updated;
  }

  /**
   * Получить детали бронирования
   */
  async getBookingById(bookingId: string, userId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        property: {
          include: {
            owner: true,
          },
        },
        user: true,
        payments: true,
      },
    });

    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    // Проверка доступа
    const hasAccess =
      booking.userId === userId || booking.property.ownerId === userId;

    if (!hasAccess) {
      throw new AppError('Access denied', 403);
    }

    return booking;
  }

  /**
   * Обновить статус бронирования (автоматически)
   */
  async updateBookingStatuses() {
    const now = new Date();

    // Активировать подтвержденные бронирования при заезде
    await prisma.booking.updateMany({
      where: {
        status: BookingStatus.CONFIRMED,
        checkIn: { lte: now },
      },
      data: {
        status: BookingStatus.ACTIVE,
      },
    });

    // Завершить активные бронирования при выезде
    await prisma.booking.updateMany({
      where: {
        status: BookingStatus.ACTIVE,
        checkOut: { lte: now },
      },
      data: {
        status: BookingStatus.COMPLETED,
      },
    });
  }
}

export default new BookingService();
