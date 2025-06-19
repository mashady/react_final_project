import * as Yup from "yup";

export const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .matches(
      /^[A-Za-zÀ-ÿ' -]{3,70}$/,
      "Invalid name! Name must be 3–70 characters and only include letters, spaces, hyphens, or apostrophes."
    )
    .required("Name is required"),

  email: Yup.string()
    .matches(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Invalid email format! It must be like m@example.com"
    )
    .required("Email is required"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  password_confirmation: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required("Password confirmation is required"),

  role: Yup.string()
    .required("Role is required"),

  verification_document: Yup.mixed()
    .required("Verification document is required")
    .test("fileSize", "File size is too large", value => {
      return value && value.size <= 5242880; // 5MB limit
    })
    .test("fileType", "Unsupported file format", value => {
      return value && ["image/jpeg", "image/png", "application/pdf"].includes(value.type);
    }),
});
