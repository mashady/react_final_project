"use client";

import PropertyCard from "@/components/shared/PropertyCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

// export const PropertyCard = ({ property }) => {
//   return (
//     <Card className="overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
//       <div className="relative">
//         <img
//           src={property.primary_image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBwaEzx_-nYeIfjU_HA1cb8r0fPTk5QZ3jQA&s"}
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
export const PropertiesGrid = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/ads")
      .then((response) => {
        console.log(response.data.data);
        setAds(response.data.data.slice(0, 6));
      })
      .catch((error) => {
        console.error("Failed to fetch ads:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-black">Loading ads...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 container mx-auto">
      {ads.map((ad, index) => (
        <PropertyCard key={index} property={ad} />
      ))}
    </div>
  );
};
