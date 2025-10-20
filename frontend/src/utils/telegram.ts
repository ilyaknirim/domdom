// Утилиты для работы с Telegram Mini App SDK

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: {
      id: number;
      first_name?: string;
      last_name?: string;
      username?: string;
      language_code?: string;
      is_premium?: boolean;
    };
    query_id?: string;
    auth_date?: number;
    hash?: string;
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;
  BackButton: {
    isVisible: boolean;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText: (text: string) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive?: boolean) => void;
    hideProgress: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  ready: () => void;
  expand: () => void;
  close: () => void;
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
  onEvent: (eventType: string, callback: () => void) => void;
  offEvent: (eventType: string, callback: () => void) => void;
  sendData: (data: string) => void;
  openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
  openTelegramLink: (url: string) => void;
  openInvoice: (url: string, callback?: (status: string) => void) => void;
  showPopup: (params: {
    title?: string;
    message: string;
    buttons?: Array<{ id?: string; type?: string; text?: string }>;
  }, callback?: (buttonId: string) => void) => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
  showScanQrPopup: (params: { text?: string }, callback?: (text: string) => boolean) => void;
  closeScanQrPopup: () => void;
  readTextFromClipboard: (callback?: (text: string) => void) => void;
}

export const getTelegramWebApp = (): TelegramWebApp | null => {
  return window.Telegram?.WebApp || null;
};

export const initTelegramSDK = () => {
  const tg = getTelegramWebApp();
  
  if (tg) {
    // Готовность приложения
    tg.ready();
    
    // Развернуть на весь экран
    tg.expand();
    
    // Применить цветовую схему
    if (tg.themeParams.bg_color) {
      document.documentElement.style.setProperty(
        '--tg-theme-bg-color',
        tg.themeParams.bg_color
      );
    }
    if (tg.themeParams.text_color) {
      document.documentElement.style.setProperty(
        '--tg-theme-text-color',
        tg.themeParams.text_color
      );
    }
    if (tg.themeParams.button_color) {
      document.documentElement.style.setProperty(
        '--tg-theme-button-color',
        tg.themeParams.button_color
      );
    }
    
    console.log('✅ Telegram SDK initialized', {
      version: tg.version,
      platform: tg.platform,
      user: tg.initDataUnsafe.user,
    });
  } else {
    console.warn('⚠️ Telegram WebApp not available. Running in browser mode.');
  }
};

export const getInitData = (): string => {
  const tg = getTelegramWebApp();
  return tg?.initData || '';
};

export const getUserData = () => {
  const tg = getTelegramWebApp();
  return tg?.initDataUnsafe.user || null;
};

export const hapticFeedback = {
  impact: (style: 'light' | 'medium' | 'heavy' = 'medium') => {
    getTelegramWebApp()?.HapticFeedback.impactOccurred(style);
  },
  notification: (type: 'error' | 'success' | 'warning') => {
    getTelegramWebApp()?.HapticFeedback.notificationOccurred(type);
  },
  selection: () => {
    getTelegramWebApp()?.HapticFeedback.selectionChanged();
  },
};

export const showBackButton = (onClick: () => void) => {
  const tg = getTelegramWebApp();
  if (tg) {
    tg.BackButton.onClick(onClick);
    tg.BackButton.show();
  }
};

export const hideBackButton = () => {
  getTelegramWebApp()?.BackButton.hide();
};

export const showMainButton = (text: string, onClick: () => void) => {
  const tg = getTelegramWebApp();
  if (tg) {
    tg.MainButton.setText(text);
    tg.MainButton.onClick(onClick);
    tg.MainButton.show();
  }
};

export const hideMainButton = () => {
  getTelegramWebApp()?.MainButton.hide();
};

export const showAlert = (message: string) => {
  getTelegramWebApp()?.showAlert(message);
};

export const showConfirm = (message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    getTelegramWebApp()?.showConfirm(message, (confirmed) => {
      resolve(confirmed);
    });
  });
};

export const closeMiniApp = () => {
  getTelegramWebApp()?.close();
};

export const openLink = (url: string) => {
  getTelegramWebApp()?.openLink(url);
};

export const openTelegramLink = (url: string) => {
  getTelegramWebApp()?.openTelegramLink(url);
};
