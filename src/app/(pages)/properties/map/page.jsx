"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Toast from "../../property/[id]/components/Toast";
import { Map , Marker} from 'react-map-gl';
import { WebMercatorViewport } from "viewport-mercator-project";

export default function PropertySuggestion() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [viewState, setViewState] = useState({
    latitude: 27.178312,
    longitude: 31.185926,
    zoom: 5,
  });

  const [toast, setToast] = useState({
    message: "",
    type: "",
    visible: false,
  });
  const router = useRouter();

  const showToast = (message, type) => {
    setToast({ message, type, visible: true });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, visible: false });
  };

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

      if (!data.properties || data.properties.length === 0) {
        setResults(null); 
        return showToast("No properties found near this location." , "error");
      }

      setResults(data);
      showToast(`Found ${data.properties.length} properties near "${data.university?.name || searchTerm}"`, "success");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced useEffect to focus map on searched properties
  useEffect(() => {
    if (results?.properties?.length > 0) {
      
      let centerLat, centerLng;
      
      if (results.university) {
        centerLat = Number(results.university.latitude);
        centerLng = Number(results.university.longitude);
        console.log('Centering on university:', centerLat, centerLng);
      } else {
        centerLat = Number(results.properties[0].latitude);
        centerLng = Number(results.properties[0].longitude);
        console.log('Centering on first property:', centerLat, centerLng);
      }

      // Calculate the spread of all locations for zoom level
      const allLocations = [...results.properties];
      if (results.university) {
        allLocations.push({
          latitude: results.university.latitude,
          longitude: results.university.longitude
        });
      }

      const latitudes = allLocations.map(loc => Number(loc.latitude));
      const longitudes = allLocations.map(loc => Number(loc.longitude));
      
      const latSpread = Math.max(...latitudes) - Math.min(...latitudes);
      const lngSpread = Math.max(...longitudes) - Math.min(...longitudes);
      const maxSpread = Math.max(latSpread, lngSpread);

      let zoomLevel = 13; // Good default for city-level view
      if (maxSpread > 0.5) zoomLevel = 10;
      else if (maxSpread > 0.1) zoomLevel = 12;
      else if (maxSpread > 0.05) zoomLevel = 13;
      else if (maxSpread > 0.01) zoomLevel = 14;
      else zoomLevel = 15; // Very close properties


      setViewState({
        latitude: centerLat,
        longitude: centerLng,
        zoom: zoomLevel,
        transitionDuration: 2000, // Longer transition to make it more visible
        transitionInterpolator: 'flyTo',
      });

      // Set the first property as selected
      setSelectedProperty(results.properties[0]);
    }
  }, [results]);

  return (
    <div className="bg-gray-50">
      <main className="container mx-auto py-8 px-4">
        {toast.visible && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={handleCloseToast}
          />
        )}
        <div className="mx-auto">
          <h1
            className="text-[45px] text-black mt-6"
            style={{ fontWeight: 500 }}
          >
            Find your property on map
          </h1>
          <p className="text-[#555] mb-8">Find housing near your location</p>

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
                {results && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setResults(null);
                      setSelectedProperty(null);
                      setSearchTerm("");
                      setViewState({
                        latitude: 27.178312,
                        longitude: 31.185926,
                        zoom: 5,
                        transitionDuration: 1000,
                      });
                    }}
                  >
                    Reset
                  </Button>
                )}
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
                    </div>
                  </Marker>
                ))}
              </Map>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}