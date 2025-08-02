// 国际化配置文件 - 支持多语言切换
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 导入语言资源
import en from './locales/en.json';
import ko from './locales/ko.json';
import ja from './locales/ja.json';
import ru from './locales/ru.json';

// 配置i18n
i18n
  .use(initReactI18next) // 绑定react-i18next
  .init({
    // 默认语言
    lng: 'en',
    // 备用语言
    fallbackLng: 'en',
    // 调试模式（开发环境开启）
    debug: import.meta.env.DEV,
    
    // 语言资源
    resources: {
      en: { translation: en },
      ko: { translation: ko },
      ja: { translation: ja },
      ru: { translation: ru },
    },
    
    // 插值配置
    interpolation: {
      escapeValue: false, // React已经处理了XSS
    },
    
    // 检测用户语言
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;