import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getUserData } from '../utils/telegram';

import ru from './locales/ru.json';
import en from './locales/en.json';
import he from './locales/he.json';

// Определяем язык пользователя из Telegram
const userLang = getUserData()?.language_code || 'ru';
const supportedLanguages = ['ru', 'en', 'he'];
const defaultLanguage = supportedLanguages.includes(userLang) ? userLang : 'ru';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ru: { translation: ru },
      en: { translation: en },
      he: { translation: he },
    },
    lng: defaultLanguage,
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
