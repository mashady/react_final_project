"use client";
import * as Yup from "yup";
import { useTranslation } from "@/TranslationContext";

export const useValidationSchema = () => {
  const { t } = useTranslation();

  const validationSchema = Yup.object({
    title: Yup.string()
      .required(t("validationPropertyTitleRequired"))
      .min(3, t("validationPropertyTitleMin"))
      .max(255, t("validationPropertyTitleMax")),

    type: Yup.string()
      .required(t("validationPropertyTypeRequired"))
      .oneOf(["apartment", "room", "bed"], t("validationPropertyTypeValid")),

    space: Yup.number()
      .required(t("validationSpaceRequired"))
      .positive(t("validationSpacePositive"))
      .max(999999.99, t("validationSpaceMax"))
      .test(
        "decimal",
        t("validationSpaceDecimal"),
        (value) => !value || /^\d+(\.\d{1,2})?$/.test(value)
      ),

    number_of_beds: Yup.number()
      .required(t("validationBedroomsRequired"))
      .min(0, t("validationBedroomsMin"))
      .integer(t("validationBedroomsInteger"))
      .max(32767, t("validationBedroomsMax")),

    number_of_bathrooms: Yup.number()
      .required(t("validationBathroomsRequired"))
      .min(0, t("validationBathroomsMin"))
      .integer(t("validationBathroomsInteger"))
      .max(32767, t("validationBathroomsMax")),

    description: Yup.string()
      .required(t("validationDescriptionRequired"))
      .min(20, t("validationDescriptionMin")),

    price: Yup.number()
      .required(t("validationPriceRequired"))
      .positive(t("validationPricePositive"))
      .max(99999999.99, t("validationPriceMax"))
      .test(
        "decimal",
        t("validationPriceDecimal"),
        (value) => !value || /^\d+(\.\d{1,2})?$/.test(value)
      ),

    area: Yup.string()
      .required(t("validationAreaRequired"))
      .min(3, t("validationAreaMin"))
      .max(100, t("validationAreaMax")),

    street: Yup.string()
      .required(t("validationStreetRequired"))
      .min(5, t("validationStreetMin"))
      .max(100, t("validationStreetMax")),

    block: Yup.string()
      .required(t("validationBlockRequired"))
      .min(1, t("validationBlockMin"))
      .max(50, t("validationBlockMax")),

    media: Yup.array()
      .of(
        Yup.mixed()
          .test("fileSize", t("validationMediaFileSize"), (value) => {
            if (value instanceof File) {
              return value.size <= 20 * 1024 * 1024;
            }
            return true;
          })
          .test("fileType", t("validationMediaFileType"), (value) => {
            if (value instanceof File) {
              return ["image/", "video/"].some((type) =>
                value.type?.startsWith(type)
              );
            }
            return true;
          })
      )
      .min(1, t("validationMediaMin"))
      .max(8, t("validationMediaMax")),
  });

  return validationSchema;
};
