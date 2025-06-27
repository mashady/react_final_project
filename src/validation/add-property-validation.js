import * as Yup from "yup";

export const validationSchema = Yup.object({
  title: Yup.string()
    .required("Property title is required")
    .min(3, "Title must be at least 3 characters")
    .max(255, "Title must be less than 255 characters"),

  type: Yup.string()
    .required("Property type is required")
    .oneOf(["apartment", "room", "bed"], "Please select a valid property type"),

  space: Yup.number()
    .required("Space is required")
    .positive("Space must be positive")
    .max(999999.99, "Space value too large")
    .test(
      "decimal",
      "Maximum 2 decimal places",
      (value) => !value || /^\d+(\.\d{1,2})?$/.test(value)
    ),

  number_of_beds: Yup.number()
    .required("Number of bedrooms is required")
    .min(0, "Number of bedrooms cannot be negative")
    .integer("Number of bedrooms must be a whole number")
    .max(32767, "Value too large"),

  number_of_bathrooms: Yup.number()
    .required("Number of bathrooms is required")
    .min(0, "Number of bathrooms cannot be negative")
    .integer("Number of bathrooms must be a whole number")
    .max(32767, "Value too large"),

  description: Yup.string()
    .required("Description is required")
    .min(20, "Description must be at least 20 characters"),

  price: Yup.number()
    .required("Price is required")
    .positive("Price must be greater than 0")
    .max(99999999.99, "Price cannot exceed 99,999,999.99")
    .test(
      "decimal",
      "Maximum 2 decimal places",
      (value) => !value || /^\d+(\.\d{1,2})?$/.test(value)
    ),

  area: Yup.string()
    .required("Area is required")
    .min(3, "Area must be at least 3 characters")
    .max(100, "Area must be less than 100 characters"),

  street: Yup.string()
    .required("Street is required")
    .min(5, "Street must be at least 5 characters")
    .max(100, "Street must be less than 100 characters"),

  block: Yup.string()
    .required("Block is required")
    .min(1, "Block must be at least 1 character")
    .max(50, "Block must be less than 50 characters"),

  media: Yup.array()
    .of(
      Yup.mixed()
        .test(
          "fileSize",
          "Maximum file size is 20MB",
          (value) => !value || value.size <= 20 * 1024 * 1024
        )
        .test(
          "fileType",
          "Only images and videos are allowed",
          (value) =>
            !value ||
            [
              "image/jpeg",
              "image/png",
              "video/mp4",
              "video/quicktime",
            ].includes(value.type)
        )
    )
    .min(1, "At least 1 media file is required")
    .max(8, "Maximum 8 media files allowed"),
});
