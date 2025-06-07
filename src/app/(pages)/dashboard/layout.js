import DashboardNav from "@/components/dashboard/DashboardNav";
import Header from "@/components/shared/Header";
import React from "react";
const layout = ({ children }) => {
  return (
    <div className="min-h-screen">
      <Header />
      <DashboardNav />
      <main className="py-6 mx-22 mb-15">{children}</main>
    </div>
  );
};

export default layout;
