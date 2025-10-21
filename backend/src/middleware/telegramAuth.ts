import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { logger } from '../utils/logger';

/**
 * Валидация данных Telegram Web App
 * https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
export const validateTelegramWebAppData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const initData = req.headers['x-telegram-init-data'] as string;
    
    if (!initData) {
      logger.warn('Missing Telegram init data');
      res.status(401).json({ error: 'Unauthorized: Missing Telegram data' });
      return;
    }

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    if (!BOT_TOKEN) {
      logger.error('TELEGRAM_BOT_TOKEN not configured');
      res.status(500).json({ error: 'Server configuration error' });
      return;
    }

    // Разбор init data
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    urlParams.delete('hash');

    if (!hash) {
      logger.warn('Missing hash in init data');
      res.status(401).json({ error: 'Unauthorized: Invalid data' });
      return;
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
      res.status(401).json({ error: 'Unauthorized: Invalid signature' });
      return;
    }

    // Проверка времени (данные не старше 24 часов)
    const authDate = urlParams.get('auth_date');
    if (authDate) {
      const authTimestamp = parseInt(authDate, 10);
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const maxAge = 86400; // 24 часа

      if (currentTimestamp - authTimestamp > maxAge) {
        logger.warn('Init data expired');
        res.status(401).json({ error: 'Unauthorized: Data expired' });
        return;
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
        res.status(401).json({ error: 'Unauthorized: Invalid user data' });
        return;
      }
    }

    next();
  } catch (error) {
    logger.error('Telegram auth validation error:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

/**
 * Опциональная аутентификация (для публичных эндпоинтов)
 */
export const optionalTelegramAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const initData = req.headers['x-telegram-init-data'] as string;
  
  if (!initData) {
    next();
    return;
  }

  validateTelegramWebAppData(req, res, next);
};
