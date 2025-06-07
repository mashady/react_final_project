import React from "react";

const DashboardPageHeader = ({ title, description }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-center">
      <h1 className="text-[26px] text-black mb-4" style={{ fontWeight: 500 }}>
        {title}
      </h1>
      <p className="text-[#555] text-[15px] mb-6" style={{ fontWeight: 400 }}>
        {description}
      </p>
    </div>
  );
};

export default DashboardPageHeader;
