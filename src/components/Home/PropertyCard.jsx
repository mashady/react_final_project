"use client";

import PropertyCard from "@/components/shared/PropertyCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { fetchWishlist } from "@/features/wishlist/wishlistThunks";
import LoadingSpinner from "@/app/(pages)/properties/components/LoadingSpinner";

export const PropertiesGrid = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.items);

  useEffect(() => {
    const fetchFirstPage = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/ads", {
          params: { page: 1, per_page: 6 },
        });

        setAds(response.data.data);
        dispatch(fetchWishlist());
      } catch (error) {
        console.error("Failed to fetch ads:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFirstPage();
  }, [dispatch]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 container mx-auto">
      {ads.map((ad) => (
        <PropertyCard
          key={ad.id}
          property={ad}
          isInWishlist={wishlist.some((item) => item.id === ad.id)}
        />
      ))}
    </div>
  );
};
