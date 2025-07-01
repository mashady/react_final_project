"use client";

import UserProfileForm from "@/components/dashboard/DashboardEditProfile";
import React from "react";
import RequireAuth from "@/components/shared/RequireAuth"; // ✅ import it

const initialValues = {
  firstName: "first name init value",
  lastName: "last name init value",
  description: "description init value",
  password: "123456789",
  repeatPassword: "123456789",
};

const EditProfileContent = () => {
  return (
    <div>
      <UserProfileForm initialValues={initialValues} />
    </div>
  );
};

const EditProfilePage = () => (
  <RequireAuth allowedRoles={["student", "owner", "admin"]}>
    <EditProfileContent />
  </RequireAuth>
);

export default EditProfilePage;
