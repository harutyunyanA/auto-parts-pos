import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en";
import hy from "./locales/hy";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en, hy },
    fallbackLng: "en",
    supportedLngs: ["en", "hy"],
    detection: {
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
