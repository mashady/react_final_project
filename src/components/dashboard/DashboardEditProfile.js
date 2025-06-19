"use client";
import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, updateUser } from "@/features/user/userSlice";
import { userProfileSchema } from "@/validation/userProfile";
// import LoadingSpinner from "@/components/LoadingSpinner";

const ProfileImageUpload = ({
  imagePreview,
  onRemove,
  onUpload,
  hasExistingImage,
}) => {
  const fileInputRef = React.useRef(null);
  const [localPreview, setLocalPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (onUpload(file)) {
        const reader = new FileReader();
        reader.onload = () => setLocalPreview(reader.result);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleRemove = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setLocalPreview(null);
    onRemove();
  };

  const displayPreview = localPreview || imagePreview;

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-24 h-24 rounded overflow-hidden bg-gray-200">
        {displayPreview ? (
          <img
            src={displayPreview}
            alt="Profile preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            No image
          </div>
        )}
      </div>

      <div className="space-y-2">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="profile-upload"
        />
        <label
          htmlFor="profile-upload"
          className="block px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200"
        >
          {displayPreview ? "Change" : "Upload"}
        </label>

        {(displayPreview || hasExistingImage) && (
          <button
            type="button"
            onClick={handleRemove}
            className="block px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

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

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUser(user.id));
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (user) {
      const profilePicture =
        user.owner_profile?.picture || user.student_profile?.picture;
      if (profilePicture) {
        setImagePreview(profilePicture);
      }
    }
  }, [user]);

  const handleImageUpload = (file) => {
    if (!file.type.match("image.*")) {
      alert("Please select an image file");
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return false;
    }

    setProfileImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
    return true;
  };

  const removeImage = () => {
    setProfileImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (value && key !== "password") {
          formData.append(key, value);
        }
      });

      if (values.password) {
        formData.append("password", values.password);
      }

      if (profileImage) {
        formData.append("picture", profileImage);
      } else if (
        imagePreview === null &&
        (user?.owner_profile?.picture || user?.student_profile?.picture)
      ) {
        formData.append("remove_picture", "true");
      }

      await dispatch(
        updateUser({
          userId: user.id,
          userData: formData,
        })
      ).unwrap();

      await dispatch(fetchUser(user.id));

      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      resetForm({ values: { ...values, password: "" } });
      setProfileImage(null);
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !user) {
    return <LoadingSpinner />;
  }

  const initialValues = {
    name: user?.name || "",
    bio: user?.owner_profile?.bio || user?.student_profile?.bio || "",
    phone_number:
      user?.owner_profile?.phone_number ||
      user?.student_profile?.phone_number ||
      "",
    whatsapp_number:
      user?.owner_profile?.whatsapp_number ||
      user?.student_profile?.whatsapp_number ||
      "",
    address:
      user?.owner_profile?.address || user?.student_profile?.address || "",
    university: user?.student_profile?.university || "",
    password: "",
  };

  const hasExistingImage = !!(
    user?.owner_profile?.picture || user?.student_profile?.picture
  );

  return (
    <div className="max-w-full mx-auto py-6 bg-white rounded-lg shadow p-6">
      {successMessage && (
        <Alert variant="success" className="mb-6">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {updateError && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {typeof updateError === "string"
              ? updateError
              : updateError.picture?.join(" ") || "Update failed"}
          </AlertDescription>
        </Alert>
      )}

      <div className="mb-8 flex items-center gap-2">
        <User className="w-5 h-5 text-yellow-500" />
        <h2 className="text-lg font-medium text-gray-900">General info</h2>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={userProfileSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Name"
                name="name"
                type="text"
                errors={errors}
                touched={touched}
              />

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-medium">
                  Bio:
                </Label>
                <Field
                  as={Textarea}
                  id="bio"
                  name="bio"
                  rows={4}
                  className={`resize-none ${
                    errors.bio && touched.bio
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:border-yellow-500`}
                />
                <ErrorMessage
                  name="bio"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Phone Number"
                name="phone_number"
                type="tel"
                errors={errors}
                touched={touched}
              />

              <FormField
                label="WhatsApp Number"
                name="whatsapp_number"
                type="tel"
                errors={errors}
                touched={touched}
              />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <FormField
                label="Address"
                name="address"
                type="text"
                errors={errors}
                touched={touched}
              />
            </div>

            {user?.role === "student" && (
              <div className="grid grid-cols-1 gap-6">
                <FormField
                  label="University"
                  name="university"
                  type="text"
                  errors={errors}
                  touched={touched}
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Profile image:</Label>
                <ProfileImageUpload
                  imagePreview={imagePreview}
                  onRemove={removeImage}
                  onUpload={handleImageUpload}
                  hasExistingImage={hasExistingImage}
                />
              </div>

              <FormField
                label="New Password"
                name="password"
                type="password"
                errors={errors}
                touched={touched}
                placeholder="Leave blank to keep current password"
              />
            </div>

            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                disabled={isSubmitting || updateLoading}
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-2"
              >
                {isSubmitting || updateLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

const FormField = ({ label, name, type, errors, touched, ...props }) => (
  <div className="space-y-2">
    <Label htmlFor={name} className="text-sm font-medium">
      {label}:
    </Label>
    <Field
      as={Input}
      id={name}
      name={name}
      type={type}
      className={`${
        errors[name] && touched[name] ? "border-red-500" : "border-gray-300"
      } focus:border-yellow-500`}
      {...props}
    />
    <ErrorMessage
      name={name}
      component="div"
      className="text-red-500 text-sm"
    />
  </div>
);

export default UserProfileForm;
