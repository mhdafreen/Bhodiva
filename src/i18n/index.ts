import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import ml from './locales/ml.json';
import hi from './locales/hi.json';
import ta from './locales/ta.json';
import kn from './locales/kn.json';
import te from './locales/te.json';

const resources = {
  en: { translation: en },
  ml: { translation: ml },
  hi: { translation: hi },
  ta: { translation: ta },
  kn: { translation: kn },
  te: { translation: te }
};

// Retrieve saved language or default to English
const savedLanguage = localStorage.getItem('bodhiva_preferred_language') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export const changeLanguage = (lng: string) => {
  i18n.changeLanguage(lng);
  localStorage.setItem('bodhiva_preferred_language', lng);
  document.documentElement.lang = lng;
};

export default i18n;
