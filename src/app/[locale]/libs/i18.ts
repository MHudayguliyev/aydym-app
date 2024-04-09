import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationRU from "../../../public/locales/ru/translation.json";
import translationTM from "../../../public/locales/tm/translation.json";


// the translations
const resources = {
  ru: {
    translation: translationRU,
  },
  tm: {
    translation: translationTM,
  },
}
const language = typeof window !== 'undefined' ? localStorage.getItem('language') as string : 'en';
i18n.use(initReactI18next).init({
  resources,
  lng: language, 
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
