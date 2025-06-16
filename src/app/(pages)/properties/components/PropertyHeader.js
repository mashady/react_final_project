"use client";

export default function PropertyHeader({ totalProperties, error }) {
  return (
    <div className="my-8">
      <h1
        className="text-[45px] text-black mt-6"
        style={{
          fontWeight: 500,
        }}
      >
        Property List
      </h1>
      {/* <p className="text-gray-600 mt-2">
        Found {totalProperties} properties
        {error && (
          <span className="text-red-500 ml-2">
            (Using demo data - API connection failed)
          </span>
        )}
      </p> */}
    </div>
  );
}
