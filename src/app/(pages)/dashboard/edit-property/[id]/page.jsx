
"use client";
import React from "react";
import { useParams } from "next/navigation";
import EditPropertyForm from "@/components/edit-property/EditPropertyForm";

const EditPropertyPage = () => {
  const { id } = useParams();
  return <EditPropertyForm propertyId={id} />;
};

export default EditPropertyPage;
