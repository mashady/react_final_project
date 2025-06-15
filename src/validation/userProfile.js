import * as Yup from "yup";

const userProfileSchema = Yup.object({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
  description: Yup.string().max(
    500,
    "Description must be less than 500 characters"
  ),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  repeatPassword: Yup.string().when("password", {
    is: (val) => !!val,
    then: (schema) =>
      schema
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Please confirm your password"),
    otherwise: (schema) => schema.notRequired(),
  }),
});
export { userProfileSchema };
