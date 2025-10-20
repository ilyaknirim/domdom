import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Получить список чатов
router.get('/rooms', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.telegramUser) {
      throw new AppError('Unauthorized', 401);
    }

    const userId = req.telegramUser.id.toString();

    // Получить все сообщения, где пользователь участвует
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      orderBy: { createdAt: 'desc' },
      distinct: ['chatRoomId'],
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
          },
        },
      },
    });

    // Сгруппировать по chatRoomId
    const chatRooms = [];
    const seenRooms = new Set();

    for (const message of messages) {
      if (seenRooms.has(message.chatRoomId)) continue;
      seenRooms.add(message.chatRoomId);

      // Получить информацию о собеседнике
      const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
      const otherUser = await prisma.user.findUnique({
        where: { id: otherUserId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          lastActive: true,
        },
      });

      // Подсчитать непрочитанные
      const unreadCount = await prisma.message.count({
        where: {
          chatRoomId: message.chatRoomId,
          receiverId: userId,
          isRead: false,
        },
      });

      // Получить последнее сообщение
      const lastMessage = await prisma.message.findFirst({
        where: { chatRoomId: message.chatRoomId },
        orderBy: { createdAt: 'desc' },
      });

      chatRooms.push({
        chatRoomId: message.chatRoomId,
        otherUser,
        lastMessage,
        unreadCount,
      });
    }

    res.json(chatRooms);
  } catch (error) {
    next(error);
  }
});

// Получить сообщения в чате
router.get('/rooms/:chatRoomId/messages', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.telegramUser) {
      throw new AppError('Unauthorized', 401);
    }

    const userId = req.telegramUser.id.toString();
    const { chatRoomId } = req.params;
    const { page = '1', limit = '50' } = req.query;
    
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    // Проверка доступа
    const hasAccess = await prisma.message.findFirst({
      where: {
        chatRoomId,
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
    });

    if (!hasAccess) {
      throw new AppError('Access denied to this chat room', 403);
    }

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where: { chatRoomId },
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'asc' },
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
            },
          },
        },
      }),
      prisma.message.count({ where: { chatRoomId } }),
    ]);

    // Отметить как прочитанные
    await prisma.message.updateMany({
      where: {
        chatRoomId,
        receiverId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    res.json({
      messages,
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

// Отправить сообщение
router.post('/messages', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.telegramUser) {
      throw new AppError('Unauthorized', 401);
    }

    const senderId = req.telegramUser.id.toString();
    const { receiverId, content, attachments } = req.body;

    if (!receiverId || !content) {
      throw new AppError('receiverId and content are required', 400);
    }

    // Создать chatRoomId (сортированные ID)
    const chatRoomId = [senderId, receiverId].sort().join('_');

    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        chatRoomId,
        content,
        attachments: attachments || [],
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
          },
        },
      },
    });

    // Уведомление
    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: 'MESSAGE_RECEIVED',
        title: 'Новое сообщение',
        message: `${req.telegramUser.first_name}: ${content.substring(0, 50)}...`,
        relatedId: message.id,
      },
    });

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
});

// Отметить сообщение как прочитанное
router.put('/messages/:id/read', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.telegramUser) {
      throw new AppError('Unauthorized', 401);
    }

    const userId = req.telegramUser.id.toString();
    const { id } = req.params;

    const message = await prisma.message.findUnique({
      where: { id },
    });

    if (!message) {
      throw new AppError('Message not found', 404);
    }

    if (message.receiverId !== userId) {
      throw new AppError('Access denied', 403);
    }

    const updated = await prisma.message.update({
      where: { id },
      data: { isRead: true },
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// Удалить сообщение
router.delete('/messages/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.telegramUser) {
      throw new AppError('Unauthorized', 401);
    }

    const userId = req.telegramUser.id.toString();
    const { id } = req.params;

    const message = await prisma.message.findUnique({
      where: { id },
    });

    if (!message) {
      throw new AppError('Message not found', 404);
    }

    if (message.senderId !== userId) {
      throw new AppError('You can only delete your own messages', 403);
    }

    await prisma.message.delete({
      where: { id },
    });

    res.json({ message: 'Message deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
