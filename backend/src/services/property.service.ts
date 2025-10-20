import { prisma } from '../config/database';
import { PropertyStatus, PropertyType, DealType, Prisma } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

export interface PropertyFilters {
  city?: string;
  district?: string;
  type?: PropertyType;
  dealType?: DealType;
  minPrice?: number;
  maxPrice?: number;
  minRooms?: number;
  maxRooms?: number;
  minArea?: number;
  maxArea?: number;
  amenities?: string[];
  availableFrom?: Date;
  availableTo?: Date;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
}

export interface CreatePropertyData {
  ownerId: string;
  title: string;
  description: string;
  type: PropertyType;
  dealType: DealType;
  address: string;
  city: string;
  district?: string;
  latitude: number;
  longitude: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  floor?: number;
  totalFloors?: number;
  price: number;
  currency?: string;
  pricePerMonth?: number;
  deposit?: number;
  amenities?: string[];
  images: string[];
  videoUrl?: string;
  virtualTourUrl?: string;
  availableFrom?: Date;
  availableTo?: Date;
  minRentDays?: number;
}

export class PropertyService {
  /**
   * Получить список объектов с фильтрами и пагинацией
   */
  async getProperties(
    filters: PropertyFilters,
    page: number = 1,
    limit: number = 20
  ) {
    const skip = (page - 1) * limit;
    
    const where: Prisma.PropertyWhereInput = {
      status: PropertyStatus.ACTIVE,
    };

    // Применение фильтров
    if (filters.city) {
      where.city = { contains: filters.city, mode: 'insensitive' };
    }

    if (filters.district) {
      where.district = { contains: filters.district, mode: 'insensitive' };
    }

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.dealType) {
      where.dealType = filters.dealType;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        where.price.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.price.lte = filters.maxPrice;
      }
    }

    if (filters.minRooms !== undefined || filters.maxRooms !== undefined) {
      where.rooms = {};
      if (filters.minRooms !== undefined) {
        where.rooms.gte = filters.minRooms;
      }
      if (filters.maxRooms !== undefined) {
        where.rooms.lte = filters.maxRooms;
      }
    }

    if (filters.minArea !== undefined || filters.maxArea !== undefined) {
      where.area = {};
      if (filters.minArea !== undefined) {
        where.area.gte = filters.minArea;
      }
      if (filters.maxArea !== undefined) {
        where.area.lte = filters.maxArea;
      }
    }

    if (filters.amenities && filters.amenities.length > 0) {
      where.amenities = {
        hasEvery: filters.amenities,
      };
    }

    // Поиск по радиусу (упрощенная версия через BETWEEN)
    if (filters.latitude && filters.longitude && filters.radiusKm) {
      const latDelta = filters.radiusKm / 111; // примерно 111 км на градус широты
      const lonDelta = filters.radiusKm / (111 * Math.cos(filters.latitude * Math.PI / 180));

      where.latitude = {
        gte: filters.latitude - latDelta,
        lte: filters.latitude + latDelta,
      };
      where.longitude = {
        gte: filters.longitude - lonDelta,
        lte: filters.longitude + lonDelta,
      };
    }

    // Запрос с подсчетом
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        skip,
        take: limit,
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
              rating: true,
              reviewCount: true,
              isVerified: true,
            },
          },
          _count: {
            select: {
              reviews: true,
              favorites: true,
            },
          },
        },
        orderBy: [
          { createdAt: 'desc' },
        ],
      }),
      prisma.property.count({ where }),
    ]);

    return {
      properties,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Получить детали объекта
   */
  async getPropertyById(id: string, userId?: string) {
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            phone: true,
            rating: true,
            reviewCount: true,
            isVerified: true,
          },
        },
        reviews: {
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
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        blockedDates: {
          where: {
            endDate: { gte: new Date() },
          },
        },
      },
    });

    if (!property) {
      throw new AppError('Property not found', 404);
    }

    // Увеличение счетчика просмотров
    await prisma.property.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    // Проверка, в избранном ли у пользователя
    let isFavorite = false;
    if (userId) {
      const favorite = await prisma.favorite.findUnique({
        where: {
          userId_propertyId: {
            userId,
            propertyId: id,
          },
        },
      });
      isFavorite = !!favorite;
    }

    return {
      ...property,
      isFavorite,
    };
  }

  /**
   * Создать объявление
   */
  async createProperty(data: CreatePropertyData) {
    const property = await prisma.property.create({
      data: {
        ...data,
        status: PropertyStatus.ACTIVE, // или PENDING для модерации
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
          },
        },
      },
    });

    return property;
  }

  /**
   * Обновить объявление
   */
  async updateProperty(id: string, ownerId: string, data: Partial<CreatePropertyData>) {
    // Проверка прав
    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      throw new AppError('Property not found', 404);
    }

    if (property.ownerId !== ownerId) {
      throw new AppError('Forbidden: You can only edit your own properties', 403);
    }

    const updated = await prisma.property.update({
      where: { id },
      data,
    });

    return updated;
  }

  /**
   * Удалить объявление (архивировать)
   */
  async deleteProperty(id: string, ownerId: string) {
    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      throw new AppError('Property not found', 404);
    }

    if (property.ownerId !== ownerId) {
      throw new AppError('Forbidden: You can only delete your own properties', 403);
    }

    // Не удаляем физически, а архивируем
    await prisma.property.update({
      where: { id },
      data: { status: PropertyStatus.ARCHIVED },
    });

    return { message: 'Property archived successfully' };
  }

  /**
   * Получить объекты пользователя
   */
  async getUserProperties(ownerId: string) {
    return prisma.property.findMany({
      where: { ownerId },
      include: {
        _count: {
          select: {
            bookings: true,
            favorites: true,
            reviews: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Проверить доступность на даты
   */
  async checkAvailability(propertyId: string, checkIn: Date, checkOut: Date) {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        blockedDates: {
          where: {
            OR: [
              {
                AND: [
                  { startDate: { lte: checkIn } },
                  { endDate: { gte: checkIn } },
                ],
              },
              {
                AND: [
                  { startDate: { lte: checkOut } },
                  { endDate: { gte: checkOut } },
                ],
              },
              {
                AND: [
                  { startDate: { gte: checkIn } },
                  { endDate: { lte: checkOut } },
                ],
              },
            ],
          },
        },
        bookings: {
          where: {
            status: {
              in: ['CONFIRMED', 'PAID', 'ACTIVE'],
            },
            OR: [
              {
                AND: [
                  { checkIn: { lte: checkIn } },
                  { checkOut: { gte: checkIn } },
                ],
              },
              {
                AND: [
                  { checkIn: { lte: checkOut } },
                  { checkOut: { gte: checkOut } },
                ],
              },
              {
                AND: [
                  { checkIn: { gte: checkIn } },
                  { checkOut: { lte: checkOut } },
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

    const isBlocked = property.blockedDates.length > 0;
    const isBooked = property.bookings.length > 0;

    return {
      isAvailable: !isBlocked && !isBooked,
      blockedDates: property.blockedDates,
      existingBookings: property.bookings,
    };
  }
}

export default new PropertyService();
