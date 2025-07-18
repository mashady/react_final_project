"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslation } from "@/TranslationContext";
export const SmallDescription = () => {
  const { t } = useTranslation();
  return (
    <section className="flex flex-col sm:flex-row items-center bg-[#EDF9F9] mt-30 p-30">
      <div className="w-full sm:w-1/2 h-96 sm:h-auto">
        <img
          src="https://newhome.qodeinteractive.com/wp-content/uploads/2023/03/main-home-img-1.jpg"
          alt="Modern Property"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-full sm:w-1/2 p-6 flex flex-col justify-center">
        <h2
          className="text-[45px] font-semibold mb-4 text-black"
          style={{
            fontWeight: 500,
            lineHeight: 1.1,
          }}
        >
          {t("modernSection")}
        </h2>
        <p className="mb-6 text-[15px] leading-relaxed mt-2 text-[#555]">
          {t("modernSectionDescription")}
        </p>

        <ul className="pl-5 space-y-2 text-[15px] text-[#555]">
          <li>
            <span className="mr-2 text-[#555]">-</span>
            {t("modernSectionListItemOne")}
          </li>
          <li>
            <span className="mr-2 text-[#555]">-</span>
            {t("modernSectionListItemTwo")}
          </li>
          <li>
            <span className="mr-2 text-[#555]">-</span>
            {t("modernSectionListItemThree")}
          </li>
          <li>
            <span className="mr-2 text-[#555]">-</span>
            {t("modernSectionListItemFour")}
          </li>
        </ul>

        <div className="mt-8">
          <Link href="/properties">
            <Button className="bg-yellow-500 hover:bg-yellow-600 rounded-none text-black whitespace-nowrap h-16 px-8 text-[15px] cursor-pointer">
              {t("modernSectionButton")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
