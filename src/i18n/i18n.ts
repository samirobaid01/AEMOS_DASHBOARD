import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslation from './locales/en.json';
import esTranslation from './locales/es.json';

// Define supported languages
export const SUPPORTED_LANGUAGES = ['en', 'es'];
export const DEFAULT_LANGUAGE = 'en';

const resources = {
  en: {
    translation: enTranslation
  },
  es: {
    translation: esTranslation
  }
};

i18n
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next
  .use(initReactI18next)
  // init i18next
  .init({
    resources,
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES,
    
    interpolation: {
      escapeValue: false, // not needed for React as it escapes by default
    },
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    
    react: {
      useSuspense: true,
    },
  });

export default i18n; 