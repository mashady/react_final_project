"use client";

import { useTranslation } from "@/TranslationContext";

export default function HowItWorks() {
  let { t } = useTranslation();
  return (
    <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
      <div>
        <h1
          className="text-[45px] text-black mb-6"
          style={{
            fontWeight: 500,
          }}
        >
          {t("howItWorksHeader")}
          <br />

          {t("howItWorksHeader2")}
        </h1>
      </div>
      <div className="text-[#555] text-[17px] leading-relaxed">
        <p>{t("howItWorksText1")}</p>
      </div>
    </div>
  );
}
