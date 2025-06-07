import React from "react";

const UserProfileCard = () => {
  return (
    <div className="flex flex-col lg:flex-row bg-white mt-15">
      <div className="flex-shrink-0 mb-6 lg:mb-0 lg:mr-8">
        <div className="w-64 h-64 lg:w-80 lg:h-80 bg-gray-300 rounded-lg flex items-center justify-center">
          <img
            src={
              "https://secure.gravatar.com/avatar/2e4f394b7744b481c1a87797f8a5cf2021d287bd1fe66bcfe0115a21fd1f709b?s=341&d=mm&r=g"
            }
            alt="User Avatar"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>

      <div className="flex-1 space-y-6">
        <h2
          className="text-[26px] lg:text-3xl text-black break-words"
          style={{ fontWeight: 500 }}
        >
          mashady
        </h2>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row">
            <span
              className="text-[#555] text-[15px] mb-1 sm:mb-0"
              style={{ fontWeight: 400, width: "22%" }}
            >
              Office phone:
            </span>
            <span className="text-black">-</span>
          </div>

          <div className="flex flex-col sm:flex-row">
            <span
              className="text-[#555] text-[15px] mb-1 sm:mb-0"
              style={{ fontWeight: 400, width: "22%" }}
            >
              Mobile phone:
            </span>
            <span className="text-black">-</span>
          </div>

          <div className="flex flex-col sm:flex-row">
            <span
              className="text-[#555] text-[15px] mb-1 sm:mb-0"
              style={{ fontWeight: 400, width: "22%" }}
            >
              Address:
            </span>
            <span className="text-black">-</span>
          </div>

          <div className="flex flex-col text-[15px] sm:flex-row">
            <span
              className="text-[#555] mb-1 sm:mb-0"
              style={{ fontWeight: 400, width: "22%" }}
            >
              Email:
            </span>
            <span className="text-black">mashady@mashady.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
