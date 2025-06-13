import UserProfileForm from "@/components/dashboard/DashboardEditProfile";
import React from "react";

const initialValues = {
  firstName: "first name init value",
  lastName: "last name init value",
  description: "description init value",
  password: "123456789",
  repeatPassword: "123456789",
};

const page = () => {
  return (
    <div>
      <UserProfileForm initialValues={initialValues} />
    </div>
  );
};

export default page;
