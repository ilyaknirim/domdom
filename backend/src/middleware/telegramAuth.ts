import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { logger } from '../utils/logger';

// Расширяем тип Request для добавления telegramUser
declare global {
  namespace Express {
    interface Request {
      telegramUser?: {
        id: number;
        first_name?: string;
        last_name?: string;
        username?: string;
        language_code?: string;
        is_premium?: boolean;
      };
    }
  }
}

/**
 * Валидация данных Telegram Web App
 * https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
export const validateTelegramWebAppData = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const initData = req.headers['x-telegram-init-data'] as string;
    
    if (!initData) {
      logger.warn('Missing Telegram init data');
      return res.status(401).json({ error: 'Unauthorized: Missing Telegram data' });
    }

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    if (!BOT_TOKEN) {
      logger.error('TELEGRAM_BOT_TOKEN not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Разбор init data
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    urlParams.delete('hash');

    if (!hash) {
      logger.warn('Missing hash in init data');
      return res.status(401).json({ error: 'Unauthorized: Invalid data' });
    }

    // Сортировка параметров
    const dataCheckString = Array.from(urlParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    // Создание секретного ключа
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(BOT_TOKEN)
      .digest();

    // Вычисление хеша
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    // Сравнение хешей
    if (calculatedHash !== hash) {
      logger.warn('Invalid hash signature');
      return res.status(401).json({ error: 'Unauthorized: Invalid signature' });
    }

    // Проверка времени (данные не старше 24 часов)
    const authDate = urlParams.get('auth_date');
    if (authDate) {
      const authTimestamp = parseInt(authDate, 10);
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const maxAge = 86400; // 24 часа

      if (currentTimestamp - authTimestamp > maxAge) {
        logger.warn('Init data expired');
        return res.status(401).json({ error: 'Unauthorized: Data expired' });
      }
    }

    // Извлечение данных пользователя
    const userParam = urlParams.get('user');
    if (userParam) {
      try {
        req.telegramUser = JSON.parse(decodeURIComponent(userParam));
        logger.info(`Authenticated user: ${req.telegramUser?.id}`);
      } catch (e) {
        logger.error('Failed to parse user data', e);
        return res.status(401).json({ error: 'Unauthorized: Invalid user data' });
      }
    }

    return next();
  } catch (error) {
    logger.error('Telegram auth validation error:', error);
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

/**
 * Опциональная аутентификация (для публичных эндпоинтов)
 */
export const optionalTelegramAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const initData = req.headers['x-telegram-init-data'] as string;
  
  if (!initData) {
    return next();
  }

  return validateTelegramWebAppData(req, res, next);
};
