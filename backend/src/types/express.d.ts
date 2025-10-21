// Расширение типов Express для Telegram пользователя

declare namespace Express {
  export interface Request {
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
