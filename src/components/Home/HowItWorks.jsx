"use client";
import { useTranslation } from "@/TranslationContext";
import {
  Bath,
  Bed,
  Ruler,
  MapPin,
  Home,
  Handshake,
  FileText,
  Key,
} from "lucide-react";
export const HowItWorks = () => {
  let { t } = useTranslation();
  const steps = [
    {
      icon: <Home className="w-8 h-8 " />,
      title: t("findAperfectHomeListItemOneHeading"),
      description: t("findAperfectHomeListItemOneDescription"),
    },
    {
      icon: <Handshake className="w-8 h-8" />,
      title: t("findAperfectHomeListItemTwoHeading"),
      description: t("findAperfectHomeListItemTwoDescription"),
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: t("findAperfectHomeListItemThreeHeading"),
      description: t("findAperfectHomeListItemThreeDescription"),
    },
    {
      icon: <Key className="w-8 h-8" />,
      title: t("findAperfectHomeListItemFourHeading"),
      description: t("findAperfectHomeListItemFourDescription"),
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h2
            className="text-[45px] font-bold text-black mb-1"
            style={{
              fontWeight: 500,
              lineHeight: 1.1,
            }}
          >
            {t("howItWorkSection")}
          </h2>
          <p
            className="text-[45px] text-black"
            style={{
              fontWeight: 500,
              lineHeight: 1.1,
            }}
          >
            {t("findAperfectHome")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`
              bg-white p-8 duration-300 text-left
              relative
              ${index < steps.length - 1 ? "md:border-r border-gray-200" : ""}
              ${index < steps.length - 2 ? "lg:border-r border-gray-200" : ""}
            `}
            >
              <div className="mb-6">
                <div className="p-1">{step.icon}</div>
              </div>
              <h3
                className="text-[26px] font-semibold text-black mb-2"
                style={{
                  fontWeight: 500,
                }}
              >
                {step.title}
              </h3>
              <p className="text-[15px] text-[#555]">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
