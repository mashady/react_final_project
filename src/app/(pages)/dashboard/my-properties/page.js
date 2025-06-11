"use client";
import DashboardEmptyMsg from "@/components/dashboard/DashboardEmptyMsg";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import LoadMoreBtn from "@/components/shared/LoadMoreBtn";
import PropertyCard from "@/components/shared/PropertyCard";
import React from "react";

const page = () => {
  let assume_this_is_my_wishlist = [
    // {
    //   id: 1,
    //   image:
    //     "https://newhome.qodeinteractive.com/wp-content/uploads/2023/03/list-half-map-image-1-450x300.jpg",
    //   status: "Sell",
    //   location: "CONDOS - Manhattan",
    //   title: "Park House",
    //   description:
    //     "Lorem ipsum dolor sit amet, wisi nemore fastidii at vis, eos equidem admodum",
    //   price: 2200,
    //   currency: "$",
    //   area: "150",
    //   bedrooms: "2",
    //   bathrooms: "2",
    // },
    // {
    //   id: 2,
    //   image:
    //     "https://newhome.qodeinteractive.com/wp-content/uploads/2023/03/list-half-map-image-3-460x300.jpg",
    //   status: "Rent",
    //   location: "APARTMENTS - Brooklyn",
    //   title: "Modern Loft",
    //   description:
    //     "Beautiful modern loft with stunning city views and premium amenities",
    //   price: 3500,
    //   currency: "$",
    //   area: "200",
    //   bedrooms: "3",
    //   bathrooms: "2",
    // },
    // {
    //   id: 3,
    //   image:
    //     "https://newhome.qodeinteractive.com/wp-content/uploads/2023/03/list-sidebar-img-1-460x300.jpg",
    //   status: "Buy",
    //   location: "HOUSES - Queens",
    //   title: "Family Home",
    //   description:
    //     "Spacious family home with garden and garage, perfect for growing families",
    //   price: 450000,
    //   currency: "$",
    //   area: "300",
    //   bedrooms: "4",
    //   bathrooms: "3",
    // },
  ];
  const handleCardClick = (property) => {
    console.log("Property clicked:", property);
  };
  return (
    <div>
      {assume_this_is_my_wishlist.length !== 0 && (
        <>
          <DashboardPageHeader
            title="My Properties"
            description="This page displays all the properties you have listed. Manage your properties, view details, and update your listings here."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {assume_this_is_my_wishlist.map((property) => (
              <PropertyCard
                key={property.id}
                image={property.image}
                status={property.status}
                location={property.location}
                title={property.title}
                description={property.description}
                price={property.price}
                currency={property.currency}
                area={property.area}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                onClick={() => handleCardClick(property)}
                className="hover:transform"
              />
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <LoadMoreBtn />
          </div>
        </>
      )}
      {assume_this_is_my_wishlist.length === 0 && <DashboardEmptyMsg />}
    </div>
  );
};

export default page;
