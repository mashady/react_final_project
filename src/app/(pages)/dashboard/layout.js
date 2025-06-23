"use client";
import DashboardNav from "@/components/dashboard/DashboardNav";
import Header from "@/components/shared/Header";
import { useTranslation } from "@/TranslationContext";
import React from "react";
const layout = ({ children }) => {
  let { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <Header title={t("dashboardHeader")} />
      <DashboardNav />
      <main className="py-6 mx-22 mb-15">{children}</main>
    </div>
  );
};

export default layout;
