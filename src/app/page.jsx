"use client";

import { HeroSection } from "@/components/Home/HeroSection";
import { PropertiesGrid } from "@/components/Home/PropertyCard";
import { SmallDescription } from "@/components/Home/SmallDescription";
import { HowItWorks } from "@/components/Home/HowItWorks";
import RenovationServices from "@/components/Home/RenovationSection";
import { useTranslation } from "@/TranslationContext";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen ">
      <HeroSection />
      <div className="bg-white py-16 ">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-[45px] font-bold mb-8 max-w-3xl"
            style={{
              fontWeight: 500,
              width: "500px",
              lineHeight: 1.1,
            }}
          >
            {t("propertySection")}
          </h2>
          <PropertiesGrid />

          <div className="flex justify-center mt-20">
            <Link href="/properties">
              <Button className="bg-yellow-500 hover:bg-yellow-600 rounded-none text-black whitespace-nowrap h-16 px-8 text-[15px] cursor-pointer">
                {t("browseMore")}
              </Button>
            </Link>
          </div>
          <SmallDescription />
          <HowItWorks />
          <RenovationServices />
        </div>
      </div>
    </div>
  );
}
