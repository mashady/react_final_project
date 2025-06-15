"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../../features/user/userSlice";

const UserProfileCard = () => {
  const params = useParams();
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const dispatch = useDispatch();
  const { data: user, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (userId) {
      console.log(JSON.stringify(userId));
      const parsedUser = JSON.parse(userId);
      console.log(parsedUser.id);
      dispatch(fetchUser(parsedUser.id));
      // dispatch(fetchUser(userId.id));
    }
  }, [userId, dispatch]);

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">Loading profile...</div>
    );

  if (error)
    return (
      <div className="p-8 text-center text-red-500">
        Error loading profile: {error}
      </div>
    );

  if (!user)
    return (
      <div className="p-8 text-center text-gray-500">No user data found</div>
    );

  // Get profile data based on user role
  const profile =
    user.role === "student" ? user.student_profile : user.owner_profile;

  return (
    <div className="flex flex-col lg:flex-row bg-white mt-15">
      {/* Profile Picture Section */}
      <div className="flex-shrink-0 mb-6 lg:mb-0 lg:mr-8">
        <div className="w-64 h-64 lg:w-80 lg:h-80 bg-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
          <img
            src={
              profile?.picture ||
              "https://secure.gravatar.com/avatar/2e4f394b7744b481c1a87797f8a5cf2021d287bd1fe66bcfe0115a21fd1f709b?s=341&d=mm&r=g"
            }
            alt="User Avatar"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                "https://secure.gravatar.com/avatar/2e4f394b7744b481c1a87797f8a5cf2021d287bd1fe66bcfe0115a21fd1f709b?s=341&d=mm&r=g";
            }}
          />
        </div>
      </div>

      {/* Profile Details Section */}
      <div className="flex-1 space-y-6">
        <h2
          className="text-[26px] lg:text-3xl text-black break-words"
          style={{ fontWeight: 500 }}
        >
          {user.name}
        </h2>

        <div className="space-y-4">
          {/* Email (always shown) */}
          <div className="flex flex-col sm:flex-row">
            <span
              className="text-[#555] text-[15px] mb-1 sm:mb-0"
              style={{ fontWeight: 400, width: "22%" }}
            >
              Email:
            </span>
            <span className="text-black">{user.email}</span>
          </div>

          {/* Role-specific fields */}
          {user.role === "student" && (
            <>
              <div className="flex flex-col sm:flex-row">
                <span
                  className="text-[#555] text-[15px] mb-1 sm:mb-0"
                  style={{ fontWeight: 400, width: "22%" }}
                >
                  University:
                </span>
                <span className="text-black">{profile?.university || "-"}</span>
              </div>
              <div className="flex flex-col sm:flex-row">
                <span
                  className="text-[#555] text-[15px] mb-1 sm:mb-0"
                  style={{ fontWeight: 400, width: "22%" }}
                >
                  Major:
                </span>
                <span className="text-black">{profile?.major || "-"}</span>
              </div>
            </>
          )}
          {/* 
          {user.role === "owner" && (
            <div className="flex flex-col sm:flex-row">
              <span
                className="text-[#555] text-[15px] mb-1 sm:mb-0"
                style={{ fontWeight: 400, width: "22%" }}
              >
                Institution:
              </span>
              <span className="text-black">{profile?.institution || "-"}</span>
            </div>
          )} */}

          {/* Common fields */}
          <div className="flex flex-col sm:flex-row">
            <span
              className="text-[#555] text-[15px] mb-1 sm:mb-0"
              style={{ fontWeight: 400, width: "22%" }}
            >
              Phone:
            </span>
            <span className="text-black">{profile?.phone_number || "-"}</span>
          </div>

          <div className="flex flex-col sm:flex-row">
            <span
              className="text-[#555] text-[15px] mb-1 sm:mb-0"
              style={{ fontWeight: 400, width: "22%" }}
            >
              WhatsApp:
            </span>
            <span className="text-black">
              {profile?.whatsapp_number || "-"}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row">
            <span
              className="text-[#555] text-[15px] mb-1 sm:mb-0"
              style={{ fontWeight: 400, width: "22%" }}
            >
              Address:
            </span>
            <span className="text-black">{profile?.address || "-"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
