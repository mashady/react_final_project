"use client";

import React from "react";
import { useSelector } from "react-redux";
import LoadingSpinner from "../properties/components/LoadingSpinner";
import RequireAuth from "@/components/shared/RequireAuth";
import { useTranslation } from "@/TranslationContext";
const UserProfileCardContent = () => {
  const { data: user, loading, error } = useSelector((state) => state.user);
  const { t } = useTranslation();
  if (loading || !user) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Error loading profile: {error}
      </div>
    );
  }

  const profile =
    user.role === "student" ? user.student_profile : user.owner_profile;

  return (
    <div className="flex flex-col lg:flex-row bg-white mt-15 p-6 rounded-lg">
      <div className="flex-shrink-0 mb-6 lg:mb-0 lg:mx-8">
        <div className="w-64 h-64 lg:w-80 lg:h-80 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
          <img
            src={
              profile?.picture ||
              "https://secure.gravatar.com/avatar/placeholder?s=341&d=mm&r=g"
            }
            alt="User Avatar"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                "https://secure.gravatar.com/avatar/placeholder?s=341&d=mm&r=g";
            }}
          />
        </div>
      </div>

      <div className="flex-1 space-y-6">
        <h2 className="text-2xl lg:text-3xl font-medium text-gray-900 break-words">
          {user.name}
        </h2>

        <div className="space-y-4">
          <ProfileField label={t("dashboardProfileEmail")} value={user.email} />
          {user.role === "student" && (
            <ProfileField
              label={t("dashboardProfileUniversity")}
              value={profile?.university}
            />
          )}
          <ProfileField
            label={t("dashboardProfilePhone")}
            value={profile?.phone_number}
          />
          <ProfileField
            label={t("dashboardProfileWhatsapp")}
            value={profile?.whatsapp_number}
          />
          <ProfileField
            label={t("dashboardProfileAddress")}
            value={profile?.address}
          />
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row">
    <span className="text-gray-500 text-sm sm:text-base font-normal sm:w-1/4">
      {label}:
    </span>
    <span className="text-gray-900 sm:w-3/4">{value || "-"}</span>
  </div>
);

const UserProfileCard = () => (
  <RequireAuth allowedRoles={["student", "owner", "admin"]}>
    <UserProfileCardContent />
  </RequireAuth>
);

export default UserProfileCard;
