"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";
export default function ImageCarousel({ images, currentImageIndex, setCurrentImageIndex }) {
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [images, setCurrentImageIndex]);
  if (!images.length) return null;
  return (
    <div className="relative w-full h-64 md:h-96 bg-gray-100 rounded-lg overflow-hidden mb-6">
      <img src={images[currentImageIndex]} alt="Property" className="w-full h-full object-cover" />
      {images.length > 1 && (
        <>
          <button onClick={() => setCurrentImageIndex(currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1 shadow hover:bg-white">
            <ChevronLeft />
          </button>
          <button onClick={() => setCurrentImageIndex(currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1 shadow hover:bg-white">
            <ChevronRight />
          </button>
        </>
      )}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {images.map((_, idx) => (
          <span key={idx} className={`block w-2 h-2 rounded-full ${idx === currentImageIndex ? "bg-yellow-500" : "bg-gray-300"}`}></span>
        ))}
      </div>
    </div>
  );
}
