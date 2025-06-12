"use client";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { User, Upload, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const validationSchema = Yup.object({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .required("Last name is required"),
  description: Yup.string().max(
    500,
    "Description must be less than 500 characters"
  ),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .required("Password is required"),
  repeatPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
});

const UserProfileForm = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const initialValues = {
    firstName: "muhammed",
    lastName: "ahmed",
    description: "",
    password: "",
    repeatPassword: "",
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setImagePreview(null);
  };

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Form values:", values);
    console.log("Profile image:", profileImage);

    setTimeout(() => {
      console.log("done");
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="max-w-full mx-auto py-6 bg-white">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-medium text-gray-900">General info</h2>
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="firstName"
                    className="text-sm font-medium text-gray-700"
                  >
                    First Name:
                  </Label>
                  <Field
                    as={Input}
                    id="firstName"
                    name="firstName"
                    type="text"
                    className={`${
                      errors.firstName && touched.firstName
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-orange-500"
                    }`}
                  />
                  <ErrorMessage name="firstName">
                    {(msg) => (
                      <Alert className="mt-1 border-red-200 bg-red-50">
                        <AlertDescription className="text-red-600 text-sm">
                          {msg}
                        </AlertDescription>
                      </Alert>
                    )}
                  </ErrorMessage>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="lastName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Last Name:
                  </Label>
                  <Field
                    as={Input}
                    id="lastName"
                    name="lastName"
                    type="text"
                    className={`${
                      errors.lastName && touched.lastName
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-orange-500"
                    }`}
                  />
                  <ErrorMessage name="lastName">
                    {(msg) => (
                      <Alert className="mt-1 border-red-200 bg-red-50">
                        <AlertDescription className="text-red-600 text-sm">
                          {msg}
                        </AlertDescription>
                      </Alert>
                    )}
                  </ErrorMessage>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-sm font-medium text-gray-700"
                  >
                    Description:
                  </Label>
                  <Field
                    as={Textarea}
                    id="description"
                    name="description"
                    rows={4}
                    className={`resize-none ${
                      errors.description && touched.description
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-orange-500"
                    }`}
                  />
                  <ErrorMessage name="description">
                    {(msg) => (
                      <Alert className="mt-1 border-red-200 bg-red-50">
                        <AlertDescription className="text-red-600 text-sm">
                          {msg}
                        </AlertDescription>
                      </Alert>
                    )}
                  </ErrorMessage>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Profile image:
                  </Label>
                  <div className="space-y-3">
                    {imagePreview ? (
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                        <img
                          src={imagePreview}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-xs text-gray-500">No image</p>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById("imageUpload").click()
                        }
                        className="flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Upload
                      </Button>
                      {profileImage && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={removeImage}
                          className="flex items-center gap-2 text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                          Remove
                        </Button>
                      )}
                    </div>

                    <input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Password:
                  </Label>
                  <Field
                    as={Input}
                    id="password"
                    name="password"
                    type="password"
                    className={`${
                      errors.password && touched.password
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-orange-500"
                    }`}
                  />
                  <ErrorMessage name="password">
                    {(msg) => (
                      <Alert className="mt-1 border-red-200 bg-red-50">
                        <AlertDescription className="text-red-600 text-sm">
                          {msg}
                        </AlertDescription>
                      </Alert>
                    )}
                  </ErrorMessage>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="repeatPassword"
                    className="text-sm font-medium text-gray-700"
                  >
                    Repeat Password:
                  </Label>
                  <Field
                    as={Input}
                    id="repeatPassword"
                    name="repeatPassword"
                    type="password"
                    className={`${
                      errors.repeatPassword && touched.repeatPassword
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-orange-500"
                    }`}
                  />
                  <ErrorMessage name="repeatPassword">
                    {(msg) => (
                      <Alert className="mt-1 border-red-200 bg-red-50">
                        <AlertDescription className="text-red-600 text-sm">
                          {msg}
                        </AlertDescription>
                      </Alert>
                    )}
                  </ErrorMessage>
                </div>
              </div>
              <div className="flex justify-end pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2"
                >
                  {isSubmitting ? "Submitting..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UserProfileForm;
