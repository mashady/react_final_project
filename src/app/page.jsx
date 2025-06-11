"use client";

import { HeroSection } from "@/components/Home/HeroSection";
import { PropertiesGrid } from "@/components/Home/PropertyCard";
import { useEffect, useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bath, Bed, Ruler , MapPin ,Home, Handshake, FileText, Key} from "lucide-react"; 
import Link from "next/link";


// export const PropertyCard = ({ property }) => {
//   return (
//     <Card className="overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
//       <div className="relative">
//         <img
//           src={property.primary_image || "https://via.placeholder.com/400x300"}
//           alt={property.title}
//           className="w-full h-56 object-cover"
//         />
//         <span className="absolute top-2 left-2 bg-white text-sm font-semibold text-gray-800 px-2 py-1 rounded">
//           {property.status || "For Rent"}
//         </span>
//       </div>

//       <div className="p-4">
//         <div className="flex items-center text-sm text-gray-500 mb-1">
//             <MapPin className="w-4 h-4 mr-1" />
//             {property.category?.name?.toUpperCase()} – {property.location}
//         </div>
//         <h3 className="text-lg font-semibold">{property.title}</h3>
//         <p className="text-gray-500 text-lg mb-4 line-clamp-2">
//           {property.description || "Lorem ipsum dolor sit amet, wisi nemore fastidii..."}
//         </p>

//         <div className="flex justify-between items-center border-t pt-3 text-lg text-gray-700">
//           <div className="font-bold">{property.price} $</div>
//           <div className="flex items-center gap-4">
//             <span className="flex items-center gap-1">
//               <Ruler className="w-4 h-4" /> {property.space} m²
//             </span>
//             <span className="flex items-center gap-1">
//               <Bed className="w-4 h-4" /> {property.bedrooms || 2}
//             </span>
//             <span className="flex items-center gap-1">
//               <Bath className="w-4 h-4" /> {property.bathrooms || 1}
//             </span>
//           </div>
//         </div>
//       </div>
//     </Card>
//   );
// };




export const SmallDescription = () => {
  return (
    <section className="flex flex-col sm:flex-row items-center bg-white mt-30">

      <div className="w-full sm:w-1/2 h-96 sm:h-auto">
        <img
          src="https://newhome.qodeinteractive.com/wp-content/uploads/2023/03/main-home-img-1.jpg"
          alt="Modern Property"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-full sm:w-1/2 p-6 flex flex-col justify-center">
        <h2 className="text-3xl sm:text-4xl font-semibold mb-4 text-gray-800">
          Modern spaces and premium design
        </h2>
        <p className="text-muted-foreground mb-6 text-base sm:text-lg leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Nulla facilisi. Nulla facilisi.
        </p>

        <ul className="list-disc pl-5 space-y-2 text-muted-foreground text-sm sm:text-base">
          <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
          <li>Nulla facilisi. Nulla facilisi. Nulla facilisi.</li>
          <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
          <li>Nulla facilisi. Nulla facilisi. Nulla facilisi.</li>
        </ul>

        <div className="mt-8 text-center">
          <Link href="/properties">
            <Button className="bg-yellow-500 hover:bg-yellow-800 text-white whitespace-nowrap h-16 px-8 text-lg w-80">
              Search
            </Button>
          </Link>
        </div>
      </div>
      
    </section>
  );
};

export const HowItWorks = () => {
  const steps = [
    {
      icon: <Home className="w-10 h-10 " />,
      title: "Find real estate",
      description: "Sumo petentium ut per, at his wisim utinam adipiscing. Est el graeco quod suavitate vix."
    },
    {
      icon: <Handshake className="w-10 h-10" />,
      title: "Meet relator",
      description: "Sumo petentium ut per, at his wisim utinam adipiscing. Est el graeco quod suavitate vix."
    },
    {
      icon: <FileText className="w-10 h-10" />,
      title: "Documents",
      description: "Sumo petentium ut per, at his wisim utinam adipiscing. Est el graeco quod suavitate vix."
    },
    {
      icon: <Key className="w-10 h-10" />,
      title: "Take the keys",
      description: "Sumo petentium ut per, at his wisim utinam adipiscing. Est el graeco quod suavitate vix."
    }
  ];

  return (
<section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
  <div className="max-w-7xl mx-auto">
    <div className="mb-12">
      <h2 className="text-5xl md:text-4xl font-bold text-gray-900 mb-4">How It Works?</h2>
      <p className="text-6xl">Find a perfect home</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, index) => (
        <div 
          key={index}
          className={`
            bg-white p-8 duration-300 text-left
            relative
            ${index < steps.length - 1 ? 'md:border-r border-gray-200' : ''}
            ${index < steps.length - 2 ? 'lg:border-r border-gray-200' : ''}
          `}
        >
          <div className="mb-6">
            <div className="p-1">
              {step.icon}
            </div>
          </div>
          <h3 className="text-3xl font-semibold text-gray-900 mb-3">{step.title}</h3>
          <p className="text-xl text-gray-600">{step.description}</p>
        </div>
      ))}
    </div>
  </div>
</section>
  );
};

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

          <div className="flex justify-center mt-8">
            <Link href="/properties">
              <Button className="bg-yellow-700 hover:bg-yellow-800 text-white whitespace-nowrap h-16 px-8 text-lg">
                View All Properties
              </Button>
            </Link>
          </div>
          <SmallDescription />
          <HowItWorks />
        </div>
      </div>
    </div>
  );
}
