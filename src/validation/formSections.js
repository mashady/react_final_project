"use client";
import { MapPin } from "lucide-react";
import { useTranslation } from "@/TranslationContext";

export const getFormSections = (t) => {
  return [
    {
      title: t("formPropertyInfo"),
      icon: "i",
      fields: [
        {
          name: "title",
          label: t("formPropertyTitle"),
          type: "text",
          required: true,
          colSpan: "md:col-span-1",
        },
        {
          name: "type",
          label: t("formPropertyType"),
          type: "select",
          required: true,
          options: [
            { value: "", label: t("formSelectPropertyType") },
            { value: "apartment", label: t("formPropertyTypeApartment") },
            { value: "room", label: t("formPropertyTypeRoom") },
            { value: "bed", label: t("formPropertyTypeBed") },
          ],
          colSpan: "md:col-span-1",
        },
        {
          name: "space",
          label: t("formPropertySpace"),
          type: "number",
          min: 0,
          colSpan: "md:col-span-1",
        },
        {
          name: "number_of_beds",
          label: t("formNumberOfBedrooms"),
          type: "number",
          required: true,
          min: 0,
          colSpan: "md:col-span-1",
        },
        {
          name: "number_of_bathrooms",
          label: t("formNumberOfBathrooms"),
          type: "number",
          min: 0,
          required: true,
          step: 0.5,
          colSpan: "md:col-span-1",
        },
        {
          name: "description",
          label: t("formPropertyDescription"),
          type: "textarea",
          required: true,
          rows: 4,
          colSpan: "md:col-span-2",
        },
      ],
    },
    {
      title: t("formPriceSettings"),
      icon: "$",
      fields: [
        {
          name: "price",
          label: t("formPrice"),
          type: "number",
          required: true,
          min: 0,
          step: 0.01,
          colSpan: "max-w-xs",
        },
      ],
    },
    {
      title: t("formLocationSettings"),
      icon: MapPin,
      fields: [
        {
          name: "area",
          label: t("formArea"),
          type: "text",
          required: true,
          colSpan: "md:col-span-1",
        },
        {
          name: "street",
          label: t("formStreet"),
          type: "text",
          required: true,
          maxLength: 255,
          colSpan: "md:col-span-1",
        },
        {
          name: "block",
          label: t("formBlock"),
          type: "text",
          required: true,
          maxLength: 255,
          colSpan: "md:col-span-1",
        },
      ],
    },
  ];
};

export const initialValues = {
  title: "",
  type: "",
  space: "",
  number_of_beds: "",
  number_of_bathrooms: "",
  description: "",
  price: "",
  area: "",
  street: "",
  block: "",
  media: [],
};
