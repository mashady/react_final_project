"use client";
const PricingCard = ({ title, price, fullPrice, features, isPopular }) => {
  return (
    <div
      className={`bg-white p-8 shadow-lg ${
        isPopular ? "border-2" : "border border-gray-200"
      } hover:shadow-xl transition-shadow relative h-[
       400px] flex flex-col `}
    >
      <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
        {title}
      </h3>
      <div className="text-center mb-8">
        <div className="text-4xl font-[500] text-gray-900 mb-2">
          {price === "Free" ? (
            price
          ) : (
            <>
              ${price}
              <span className="text-lg font-normal text-gray-600">/month*</span>
            </>
          )}
        </div>
        {fullPrice && (
          <div className="text-sm text-gray-600">
            full payment: ${fullPrice}
          </div>
        )}
      </div>
      <div className="space-y-4 flex-grow">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center text-gray-700">
            {feature ? (
              <span className=" font-medium">{feature}</span>
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </div>
        ))}
      </div>
      <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-6  transition-colors mt-8">
        Get Started
      </button>
    </div>
  );
};

export default PricingCard;
