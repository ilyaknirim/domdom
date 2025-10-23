import { Request, Response, NextFunction } from 'express';
import propertyService from '../services/property.service';
import { AppError } from '../middleware/errorHandler';
import { PropertyType, DealType } from '@prisma/client';

export class PropertyController {
  /**
   * GET /api/properties
   * Получить список объектов с фильтрами
   */
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        city,
        district,
        type,
        dealType,
        minPrice,
        maxPrice,
        minRooms,
        maxRooms,
        minArea,
        maxArea,
        amenities,
        availableFrom,
        availableTo,
        latitude,
        longitude,
        radiusKm,
        page = '1',
        limit = '20',
      } = req.query;

      const filters = {
        city: city as string,
        district: district as string,
        type: type as PropertyType,
        dealType: dealType as DealType,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        minRooms: minRooms ? parseInt(minRooms as string) : undefined,
        maxRooms: maxRooms ? parseInt(maxRooms as string) : undefined,
        minArea: minArea ? parseFloat(minArea as string) : undefined,
        maxArea: maxArea ? parseFloat(maxArea as string) : undefined,
        amenities: amenities ? (amenities as string).split(',') : undefined,
        availableFrom: availableFrom ? new Date(availableFrom as string) : undefined,
        availableTo: availableTo ? new Date(availableTo as string) : undefined,
        latitude: latitude ? parseFloat(latitude as string) : 0,
        longitude: longitude ? parseFloat(longitude as string) : 0,
        radiusKm: radiusKm ? parseFloat(radiusKm as string) : undefined,
      };

      const result = await propertyService.getProperties(
        filters,
        parseInt(page as string),
        parseInt(limit as string)
      );

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/properties/:id
   * Получить детали объекта
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.telegramUser?.id.toString();

      const property = await propertyService.getPropertyById(id, userId);

      res.json(property);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/properties
   * Создать объявление
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      // Для разработки временно убираем требование аутентификации
      const ownerId = req.telegramUser ? req.telegramUser.id.toString() : 'test-user-id';

      const requiredFields = ['title', 'description', 'type', 'dealType', 'city', 'address', 'rooms', 'bedrooms', 'bathrooms', 'area', 'price', 'latitude', 'longitude'];
      const missing = requiredFields.filter((f) => req.body[f] === undefined || req.body[f] === null || req.body[f] === '');
      if (missing.length > 0) {
        throw new AppError(`Validation error: missing fields: ${missing.join(', ')}`, 400);
      }

      // Базовая валидация типов
      const numericFields = ['rooms', 'bedrooms', 'bathrooms', 'area', 'price'];
      for (const f of numericFields) {
        const v = Number(req.body[f]);
        if (Number.isNaN(v) || v < 0) {
          throw new AppError(`Validation error: field '${f}' must be a non-negative number`, 400);
        }
      }

      // Приведение типов к ожидаемым
      const data = {
        ...req.body,
        rooms: Number(req.body.rooms),
        bedrooms: Number(req.body.bedrooms),
        bathrooms: Number(req.body.bathrooms),
        area: Number(req.body.area),
        price: Number(req.body.price),
        latitude: req.body.latitude ? Number(req.body.latitude) : undefined,
        longitude: req.body.longitude ? Number(req.body.longitude) : undefined,
        ownerId,
      };

      const property = await propertyService.createProperty(data);

      res.status(201).json(property);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/properties/:id
   * Обновить объявление
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.telegramUser) {
        throw new AppError('Unauthorized', 401);
      }

      const { id } = req.params;
      const ownerId = req.telegramUser.id.toString();

      const property = await propertyService.updateProperty(id, ownerId, req.body);

      res.json(property);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/properties/:id
   * Удалить (архивировать) объявление
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.telegramUser) {
        throw new AppError('Unauthorized', 401);
      }

      const { id } = req.params;
      const ownerId = req.telegramUser.id.toString();

      const result = await propertyService.deleteProperty(id, ownerId);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/properties/my/list
   * Получить мои объявления
   */
  async getMyProperties(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.telegramUser) {
        throw new AppError('Unauthorized', 401);
      }

      const ownerId = req.telegramUser.id.toString();
      const properties = await propertyService.getUserProperties(ownerId);

      res.json(properties);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/properties/:id/check-availability
   * Проверить доступность на даты
   */
  async checkAvailability(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { checkIn, checkOut } = req.body;

      if (!checkIn || !checkOut) {
        throw new AppError('checkIn and checkOut dates are required', 400);
      }

      const result = await propertyService.checkAvailability(
        id,
        new Date(checkIn),
        new Date(checkOut)
      );

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new PropertyController();
