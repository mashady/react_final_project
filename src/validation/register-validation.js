import * as Yup from "yup";

export const getRegisterSchema = (t) =>
  Yup.object().shape({
    name: Yup.string()
       .matches(
          /^[A-Za-zÀ-ÿ\u0621-\u064A' -]{3,70}$/,
          t("nameComplexity")
        )

      .required(t("nameRequired")),

    email: Yup.string()
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, t("emailInvalidRegister"))
      .required(t("emailRequired")),

    password: Yup.string()
      .min(12, t("passwordMinLength"))
      .max(50, t("passwordMaxLength"))
      .required(t("passwordRequired"))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,50}$/,
        t("passwordComplexity")
      ),

    password_confirmation: Yup.string()
      .oneOf([Yup.ref("password"), null], t("passwordMismatch"))
      .required(t("passwordConfirmationRequired")),

    role: Yup.string().required(t("roleRequired")),

    verification_document: Yup.mixed()
      .required(t("verificationDocumentRequired"))
      .test(
        "fileSize",
        t("File size is too large (max 5MB)"),
        (value) => value && value.size <= 5242880
      )
      .test(
        "fileType",
        t("Unsupported file format (only JPG, PNG, PDF, JPEG)"),
        (value) =>
          value &&
          ["image/jpeg", "image/png", "application/pdf"].includes(value.type)
      ),
    picture: Yup.mixed().required("personal Image Required"),
  });
