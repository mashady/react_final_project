"use client";
import Link from "next/link";

import {
  Card,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import PropertyCard from "@/components/shared/PropertyCard";

export default function PropertyGrid({
  properties,
  getPropertyImage,
  formatPrice,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {properties.map((property, index) => (
        <PropertyCard key={index} property={property} />
      ))}
    </div>
  );
}
