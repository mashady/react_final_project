"use client";

export default function PricingHeader() {
  return (
    <div className="relative bg-gray-100 text-white h-[350px] overflow-hidden rounded-lg m-4">
      <div className="absolute inset-0 h-[350px]">
        <img
          src="https://newhome.qodeinteractive.com/wp-content/uploads/2023/03/packages-title-img.jpg"
          alt="Woman working on laptop in modern living room"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0  bg-opacity-20"></div>
      </div>

      <div className="relative px-6 py-24 h-full flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="max-w-2xl">
            <h1
              className="text-[65px] text-white leading-tight"
              style={{ fontWeight: 500 }}
            >
              Pricing Package
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
