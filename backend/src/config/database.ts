import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

// Singleton pattern для Prisma Client
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: [
      { level: 'warn', emit: 'event' },
      { level: 'error', emit: 'event' },
    ],
  });

// Логирование событий базы данных

prisma.$on('warn' as never, (e: any) => {
  logger.warn('Prisma warning:', e);
});


prisma.$on('error' as never, (e: any) => {
  logger.error('Prisma error:', e);
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Проверка подключения
export const connectDatabase = async () => {
  try {
    await prisma.$connect();
    logger.info('✅ Database connected successfully');
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

// Graceful shutdown
export const disconnectDatabase = async () => {
  await prisma.$disconnect();
  logger.info('Database disconnected');
};

process.on('beforeExit', disconnectDatabase);
