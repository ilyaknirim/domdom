import { Request, Response, NextFunction } from 'express';
import userService from '../services/user.service';
import { AppError } from '../middleware/errorHandler';

export class UserController {
  /**
   * GET /api/users/me
   */
  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.telegramUser) {
        throw new AppError('Unauthorized', 401);
      }

      // Получить или создать пользователя
      const user = await userService.getOrCreateUser(req.telegramUser);

      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/users/me
   */
  async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.telegramUser) {
        throw new AppError('Unauthorized', 401);
      }

      const user = await userService.getOrCreateUser(req.telegramUser);
      const { phone, email, languageCode } = req.body;

      const updated = await userService.updateProfile(user.id, {
        phone,
        email,
        languageCode,
      });

      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users/me/stats
   */
  async getMyStats(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.telegramUser) {
        throw new AppError('Unauthorized', 401);
      }

      const user = await userService.getOrCreateUser(req.telegramUser);
      const stats = await userService.getUserStats(user.id);

      res.json(stats);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users/:id
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await userService.getCurrentUser(id);

      // Скрыть конфиденциальную информацию
      const publicUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        rating: user.rating,
        reviewCount: user.reviewCount,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      };

      res.json(publicUser);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
