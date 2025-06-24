"use client";
import { useTranslation } from "@/TranslationContext";
import React from "react";

const Header = ({ title = "User Dashboard.", className = "", style = {} }) => {
  const defaultStyle = {
    backgroundColor: "#ffcc41",
    color: "black",
    ...style,
  };

  // If you want to use the translation function, you can uncomment the line below
  // and use it to translate the title or any other text.
  // title = t('dashboardHeader');
  return (
    <header
      className={`font-medium p-4 h-60 m-6 mb-0 rounded-lg flex items-center ${className}`}
      style={{
        ...defaultStyle,
        backgroundImage:
          "url(https://newhome.qodeinteractive.com/wp-content/uploads/2023/03/title-bg-img.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 className="text-6xl ml-20">{title}</h1>
    </header>
  );
};

export default Header;
