import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';

export class UserService {
  /**
   * Получить или создать пользователя из Telegram данных
   */
  async getOrCreateUser(telegramUser: {
    id: number;
    first_name?: string;
    last_name?: string;
    username?: string;
    language_code?: string;
  }) {
    let user = await prisma.user.findUnique({
      where: { telegramId: BigInt(telegramUser.id) },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          telegramId: BigInt(telegramUser.id),
          firstName: telegramUser.first_name,
          lastName: telegramUser.last_name,
          username: telegramUser.username,
          languageCode: telegramUser.language_code || 'ru',
        },
      });
    } else {
      // Обновить lastActive
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          lastActive: new Date(),
          // Обновить данные если изменились
          firstName: telegramUser.first_name,
          lastName: telegramUser.last_name,
          username: telegramUser.username,
        },
      });
    }

    return user;
  }

  /**
   * Получить текущего пользователя
   */
  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            properties: true,
            bookings: true,
            favorites: true,
            receivedReviews: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  /**
   * Обновить профиль пользователя
   */
  async updateProfile(userId: string, data: {
    phone?: string;
    email?: string;
    languageCode?: string;
  }) {
    return prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  /**
   * Получить статистику пользователя
   */
  async getUserStats(userId: string) {
    const [
      propertiesCount,
      activeBookingsCount,
      completedBookingsCount,
      reviews,
    ] = await Promise.all([
      prisma.property.count({ where: { ownerId: userId } }),
      prisma.booking.count({
        where: {
          userId,
          status: { in: ['CONFIRMED', 'PAID', 'ACTIVE'] },
        },
      }),
      prisma.booking.count({
        where: { userId, status: 'COMPLETED' },
      }),
      prisma.review.findMany({
        where: { targetId: userId },
        select: { rating: true },
      }),
    ]);

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return {
      propertiesCount,
      activeBookingsCount,
      completedBookingsCount,
      reviewsCount: reviews.length,
      averageRating: Number(averageRating.toFixed(1)),
    };
  }

  /**
   * Обновить рейтинг пользователя
   */
  async updateUserRating(userId: string) {
    const reviews = await prisma.review.findMany({
      where: { targetId: userId },
      select: { rating: true },
    });

    if (reviews.length === 0) return;

    const averageRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await prisma.user.update({
      where: { id: userId },
      data: {
        rating: averageRating,
        reviewCount: reviews.length,
      },
    });
  }
}

export default new UserService();
