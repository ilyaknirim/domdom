import { Request, Response, NextFunction } from 'express';
import bookingService from '../services/booking.service';
import { AppError } from '../middleware/errorHandler';

export class BookingController {
  /**
   * GET /api/bookings
   */
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.telegramUser) {
        throw new AppError('Unauthorized', 401);
      }

      const userId = req.telegramUser.id.toString();
      const bookings = await bookingService.getUserBookings(userId);

      res.json(bookings);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/bookings/:id
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.telegramUser) {
        throw new AppError('Unauthorized', 401);
      }

      const { id } = req.params;
      const userId = req.telegramUser.id.toString();

      const booking = await bookingService.getBookingById(id, userId);

      res.json(booking);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/bookings
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.telegramUser) {
        throw new AppError('Unauthorized', 401);
      }

      const userId = req.telegramUser.id.toString();
      const { propertyId, checkIn, checkOut, guestCount, notes } = req.body;

      const booking = await bookingService.createBooking({
        propertyId,
        userId,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        guestCount: guestCount || 1,
        notes,
      });

      res.status(201).json(booking);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/bookings/:id/confirm
   */
  async confirm(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.telegramUser) {
        throw new AppError('Unauthorized', 401);
      }

      const { id } = req.params;
      const ownerId = req.telegramUser.id.toString();

      const booking = await bookingService.confirmBooking(id, ownerId);

      res.json(booking);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/bookings/:id/cancel
   */
  async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.telegramUser) {
        throw new AppError('Unauthorized', 401);
      }

      const { id } = req.params;
      const userId = req.telegramUser.id.toString();
      const { reason } = req.body;

      const booking = await bookingService.cancelBooking(id, userId, reason);

      res.json(booking);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/bookings/owner/list
   */
  async getOwnerBookings(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.telegramUser) {
        throw new AppError('Unauthorized', 401);
      }

      const ownerId = req.telegramUser.id.toString();
      const bookings = await bookingService.getOwnerBookings(ownerId);

      res.json(bookings);
    } catch (error) {
      next(error);
    }
  }
}

export default new BookingController();
