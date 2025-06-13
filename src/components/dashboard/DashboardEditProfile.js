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
import { userProfileSchema } from "@/validation/userProfile";
import { FormErrorAlert } from "./userForm/FormErrorAlert";
import { ProfileImageUpload } from "./userForm/ProfileImageUpload";

const UserProfileForm = ({ initialValues }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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

  const renderField = ({ field, form: { errors, touched }, ...props }) => {
    const hasError = errors[field.name] && touched[field.name];
    const fieldClasses = `${
      hasError
        ? "border-red-500 focus:border-red-500"
        : "border-gray-300 focus:border-orange-500"
    } ${props.className || ""}`;

    return (
      <>
        <Field as={Input} {...field} {...props} className={fieldClasses} />
        <ErrorMessage name={field.name}>
          {(msg) => <FormErrorAlert message={msg} />}
        </ErrorMessage>
      </>
    );
  };

  return (
    <div className="max-w-full mx-auto py-6 bg-white">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-5 h-5 text-yellow-500" />
          <h2 className="text-lg font-medium text-gray-900">General info</h2>
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={userProfileSchema}
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
                  {renderField({
                    id: "firstName",
                    name: "firstName",
                    type: "text",
                    field: { name: "firstName" },
                    form: { errors, touched },
                  })}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="lastName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Last Name:
                  </Label>
                  {renderField({
                    id: "lastName",
                    name: "lastName",
                    type: "text",
                    field: { name: "lastName" },
                    form: { errors, touched },
                  })}
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
                        : "border-gray-300 focus:border-yellow-500"
                    }`}
                  />
                  <ErrorMessage name="description">
                    {(msg) => <FormErrorAlert message={msg} />}
                  </ErrorMessage>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Profile image:
                  </Label>
                  <ProfileImageUpload
                    imagePreview={imagePreview}
                    onRemove={removeImage}
                    onUpload={handleImageUpload}
                  />
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
                  {renderField({
                    id: "password",
                    name: "password",
                    type: "password",
                    field: { name: "password" },
                    form: { errors, touched },
                  })}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="repeatPassword"
                    className="text-sm font-medium text-gray-700"
                  >
                    Repeat Password:
                  </Label>
                  {renderField({
                    id: "repeatPassword",
                    name: "repeatPassword",
                    type: "password",
                    field: { name: "repeatPassword" },
                    form: { errors, touched },
                  })}
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-2 cursor-pointer"
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
