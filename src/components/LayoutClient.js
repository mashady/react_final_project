"use client";
import { useTranslation } from "@/TranslationContext";

export default function LayoutClient({ children }) {
  const { locale } = useTranslation();

  return <div dir={locale === "ar" ? "rtl" : "ltr"}>{children}</div>;
}
