"use client";

import { HeroSection } from "@/components/Home/HeroSection";
import { PropertiesGrid } from "@/components/Home/PropertyCard";
import {SmallDescription} from "@/components/Home/SmallDescription";
import {HowItWorks} from "@/components/Home/HowItWorks";
import RenovationServices from "@/components/Home/RenovationSection";

import { Button } from "@/components/ui/button";
import Link from "next/link";



export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-6xl font-bold mb-8 max-w-3xl">
            Our choice of popular real estate
          </h2>
          <PropertiesGrid />

          <div className="flex justify-center mt-20">
            <Link href="/properties">
              <Button className="bg-orange-500 hover:bg-yellow-800 text-white whitespace-nowrap h-16 px-8 text-lg">
               Browse More Properties
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
