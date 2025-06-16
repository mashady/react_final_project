"use client";
import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { User } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FormErrorAlert } from "./userForm/FormErrorAlert";
import { ProfileImageUpload } from "./userForm/ProfileImageUpload";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, updateUser } from "@/features/user/userSlice";
import { userProfileSchema } from "@/validation/userProfile";
const UserProfileForm = () => {
  const dispatch = useDispatch();
  const {
    data: user,
    loading,
    updateLoading,
    updateError,
  } = useSelector((state) => state.user);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const getLocalUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  };

  useEffect(() => {
    const localUser = getLocalUser();
    if (localUser?.id) {
      dispatch(fetchUser(localUser.id));
    }
  }, [dispatch]);

  useEffect(() => {
    if (user?.owner_profile?.picture) {
      setImagePreview(user.owner_profile.picture);
    }
  }, [user]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
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
    if (!user?.owner_profile?.picture) {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("bio", values.bio);
      formData.append("phone_number", values.phone_number);
      formData.append("whatsapp_number", values.whatsapp_number);
      formData.append("address", values.address);
      if (user?.role === "student") {
        formData.append("university", values.university);
      }
      if (values.password) {
        formData.append("password", values.password);
      }

      if (profileImage) {
        formData.append("picture", profileImage);
      } else if (imagePreview === null && user?.owner_profile?.picture) {
        formData.append("remove_picture", "true");
      }

      await dispatch(
        updateUser({
          userId: getLocalUser()?.id,
          userData: formData,
        })
      ).unwrap();

      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => {
        setSuccessMessage(null);
        resetForm({
          values: {
            ...values,
            password: "",
          },
        });
      }, 3000);
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setSubmitting(false);
    }
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

  if (loading && !user) {
    return <div className="p-8 text-center">Loading user data...</div>;
  }

  const initialValues = {
    name: user?.name || "",
    bio: user?.owner_profile?.bio || "",
    phone_number: user?.owner_profile?.phone_number || "",
    whatsapp_number: user?.owner_profile?.whatsapp_number || "",
    address: user?.owner_profile?.address || "",
    password: "",
  };

  return (
    <div className="max-w-full mx-auto py-6 bg-white">
      {successMessage && (
        <Alert variant="success" className="mb-6">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {updateError && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{updateError}</AlertDescription>
        </Alert>
      )}

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-5 h-5 text-yellow-500" />
          <h2 className="text-lg font-medium text-gray-900">General info</h2>
        </div>
      </div>

      <Formik
        initialValues={{
          ...initialValues,
          university:
            user?.role === "student"
              ? user?.owner_profile?.university || ""
              : undefined,
        }}
        validationSchema={userProfileSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Name:
                  </Label>
                  {renderField({
                    id: "name",
                    name: "name",
                    type: "text",
                    field: { name: "name" },
                    form: { errors, touched },
                  })}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="bio"
                    className="text-sm font-medium text-gray-700"
                  >
                    Bio:
                  </Label>
                  <Field
                    as={Textarea}
                    id="bio"
                    name="bio"
                    rows={4}
                    className={`resize-none ${
                      errors.bio && touched.bio
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-yellow-500"
                    }`}
                  />
                  <ErrorMessage name="bio">
                    {(msg) => <FormErrorAlert message={msg} />}
                  </ErrorMessage>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="phone_number"
                    className="text-sm font-medium text-gray-700"
                  >
                    Phone Number:
                  </Label>
                  {renderField({
                    id: "phone_number",
                    name: "phone_number",
                    type: "tel",
                    field: { name: "phone_number" },
                    form: { errors, touched },
                  })}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="whatsapp_number"
                    className="text-sm font-medium text-gray-700"
                  >
                    WhatsApp Number:
                  </Label>
                  {renderField({
                    id: "whatsapp_number",
                    name: "whatsapp_number",
                    type: "tel",
                    field: { name: "whatsapp_number" },
                    form: { errors, touched },
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="address"
                    className="text-sm font-medium text-gray-700"
                  >
                    Address:
                  </Label>
                  {renderField({
                    id: "address",
                    name: "address",
                    type: "text",
                    field: { name: "address" },
                    form: { errors, touched },
                  })}
                </div>
              </div>

              {/* University field for students */}
              {user?.role === "student" && (
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="university"
                      className="text-sm font-medium text-gray-700"
                    >
                      University:
                    </Label>
                    {renderField({
                      id: "university",
                      name: "university",
                      type: "text",
                      field: { name: "university" },
                      form: { errors, touched },
                    })}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    New Password:
                  </Label>
                  {renderField({
                    id: "password",
                    name: "password",
                    type: "password",
                    field: { name: "password" },
                    form: { errors, touched },
                    placeholder: "Leave blank to keep current password",
                  })}
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting || updateLoading}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-2 cursor-pointer"
                >
                  {isSubmitting || updateLoading ? "Saving..." : "Save Changes"}
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
