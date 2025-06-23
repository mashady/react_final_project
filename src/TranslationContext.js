"use client";
import { createContext, useContext, useState, useEffect } from "react";
import en from "./translation/en";
import ar from "./translation/ar";

const translations = { en, ar };
const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    const stored = localStorage.getItem("locale");
    if (stored) setLocale(stored);
  }, []);

  const changeLanguage = (lng) => {
    setLocale(lng);
    localStorage.setItem("locale", lng);
  };

  const t = (key) => translations[locale][key] || key;

  return (
    <TranslationContext.Provider value={{ t, locale, changeLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => useContext(TranslationContext);
