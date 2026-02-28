"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "../public/locales/en/translation.json";
import hi from "../public/locales/hi/translation.json";
import mr from "../public/locales/mr/translation.json";

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: en,
            hi: hi,
            mr: mr,
        },
        supportedLngs: ["en", "hi", "mr"],
        fallbackLng: "en",
        debug: process.env.NODE_ENV === "development",
        ns: ["translation"],
        defaultNS: "translation",
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ["cookie", "localStorage", "htmlTag", "path", "subdomain"],
            caches: ["cookie"],
        },
    });

export default i18n;
