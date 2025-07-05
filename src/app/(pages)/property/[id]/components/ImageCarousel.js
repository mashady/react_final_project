"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import Image from "next/image";
export default function ImageCarousel({
  images,
  currentImageIndex,
  setCurrentImageIndex,
}) {
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [images, setCurrentImageIndex]);
  if (!images.length) return null;
  return (
    <div className="relative w-full h-80 md:h-[420px] bg-[#f7f7f7] rounded-2xl overflow-hidden mb-10 shadow-lg border border-[#ececec]">
      <Image
        src={images[currentImageIndex]}
        alt="Property"
        className="w-full h-full object-cover rounded-2xl"
        width={1200}
        unoptimized={true}
        height={420}
      />
      {images.length > 1 && (
        <>
          <button
            onClick={() =>
              setCurrentImageIndex(
                currentImageIndex === 0
                  ? images.length - 1
                  : currentImageIndex - 1
              )
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white border border-[#ececec]"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="#eab308"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={() =>
              setCurrentImageIndex(
                currentImageIndex === images.length - 1
                  ? 0
                  : currentImageIndex + 1
              )
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white border border-[#ececec]"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="#eab308"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </>
      )}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, idx) => (
          <span
            key={idx}
            className={`block w-3 h-3 rounded-full ${
              idx === currentImageIndex ? "bg-[#eab308]" : "bg-[#ececec]"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
}
