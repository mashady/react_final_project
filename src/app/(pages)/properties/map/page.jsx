"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

// Dynamically import map components with SSR disabled
const Map = dynamic(() => import("react-map-gl").then((mod) => mod.Map), {
  ssr: false,
});
const Marker = dynamic(() => import("react-map-gl").then((mod) => mod.Marker), {
  ssr: false,
});
const Popup = dynamic(() => import("react-map-gl").then((mod) => mod.Popup), {
  ssr: false,
});

export default function PropertySuggestion() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [viewState, setViewState] = useState({
    latitude: 27.178312,
    longitude: 31.185926,
    zoom: 12,
  });
  const router = useRouter();
  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.length < 3) {
      setError("Please enter at least 3 characters");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:8000/api/properties/near-university?university=${encodeURIComponent(
          searchTerm
        )}`
      );
      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Failed to fetch properties");

      setResults(data);
      setViewState({
        latitude: data.university.latitude,
        longitude: data.university.longitude,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (results?.university) {
      setViewState((prev) => ({
        ...prev,
        latitude: results.university.latitude,
        longitude: results.university.longitude,
        zoom: 12,
      }));

      // Focus on first property if exists
      if (results.properties?.length > 0) {
        const first = results.properties[0];
        setViewState((prev) => ({
          ...prev,
          latitude: first.latitude,
          longitude: first.longitude,
          zoom: 14,
        }));
        setSelectedProperty(first);
      }
    }
  }, [results]);

  return (
    <div className="bg-gray-50">
      <main className="containerpy-8 px-4">
        <div className="mx-auto">
          <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">
            Student Property Finder
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Find housing near your university
          </p>

          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter your Location"
                  disabled={loading}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={loading || searchTerm.length < 3}
                >
                  {loading ? "Searching..." : "Find Properties"}
                </Button>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </form>
          </div>

          <div className="bg-white rounded-xl overflow-hidden shadow-lg mb-8">
            <div className="h-[500px] w-full">
              <Map
                {...viewState}
                onMove={(evt) => setViewState(evt.viewState)}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
              >
                {results?.university && (
                  <Marker
                    longitude={results.university.longitude}
                    latitude={results.university.latitude}
                  >
                    <div className="relative">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white cursor-pointer shadow-lg">
                        🏫
                      </div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded text-sm whitespace-nowrap shadow-sm mb-2 font-medium">
                        {results.university.name}
                      </div>
                    </div>
                  </Marker>
                )}

                {results?.properties?.map((property) => (
                  <Marker
                    key={property.id}
                    longitude={property.longitude}
                    latitude={property.latitude}
                    onClick={(e) => {
                      router.push(`/property/${property.id}`);
                    }}
                  >
                    <div className="relative">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white cursor-pointer shadow-md hover:scale-110 transition-transform">
                        🏠
                      </div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs whitespace-nowrap shadow-sm mb-1 font-medium">
                        ${property.price}
                      </div>
                    </div>
                  </Marker>
                ))}

                {selectedProperty && (
                  <Popup
                    longitude={selectedProperty.longitude}
                    latitude={selectedProperty.latitude}
                    onClose={() => setSelectedProperty(null)}
                    closeButton={false}
                    offset={25}
                    anchor="bottom"
                  >
                    <div className="max-w-xs p-2">
                      <h3 className="font-bold text-lg mb-1">
                        {selectedProperty.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {[
                          selectedProperty.block,
                          selectedProperty.street,
                          selectedProperty.area,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-blue-600">
                          ${selectedProperty.price}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">
                          {selectedProperty.type}
                        </span>
                      </div>
                    </div>
                  </Popup>
                )}
              </Map>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
