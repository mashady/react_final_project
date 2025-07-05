"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  getRegisterSchema,
  RegisterSchema,
} from "@/validation/register-validation";
import Toast from "../../property/[id]/components/Toast";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/features/user/userSlice";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/TranslationContext";
import GoogleSignInButton from "@/components/shared/GoogleSignInButton";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
const RegisterPage = () => {
  let { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { loading, error } = useSelector((state) => state.user);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [selectedPersonalImageName, setSelectedPersonalImageName] =
    useState("");

  const [toast, setToast] = useState({
    message: "",
    type: "",
    visible: false,
  });

  const showToast = (message, type) => {
    setToast({ message, type, visible: true });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, visible: false });
  };

  const handleRegister = async (values) => {
    try {
      if (!values.verification_document || !values.picture) {
        showToast(t("bothFilesRequired"), "error");
        return;
      }
      const compareFormData = new FormData();
      compareFormData.append("image1", values.verification_document);
      compareFormData.append("image2", values.picture);
      compareFormData.append("tolerance", 0.6);
      const compareRes = await fetch("http://localhost:5001/compare-files", {
        method: "POST",
        body: compareFormData,
      });
      const compareData = await compareRes.json();
      let verificationStatus = "pending";
      if (compareData.same_person) {
        verificationStatus = "verified";
      }
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("password_confirmation", values.password_confirmation);
      formData.append("role", values.role);
      formData.append("verification_status", verificationStatus);
      formData.append("verification_document", values.verification_document);
      formData.append("picture", values.picture);
      const resultAction = await dispatch(registerUser(formData));
      if (registerUser.fulfilled.match(resultAction)) {
        showToast(t("registerSuccessMsg"), "success");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        throw resultAction.payload;
      }
    } catch (error) {
      showToast(error || t("registerError"), "error");
    }
  };
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-[500px] border rounded-lg shadow-lg py-6">
          <CardHeader>
            <CardTitle className="text-center text-3xl">
              {t("registerHeader")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Formik
              initialValues={{
                name: "",
                email: "",
                password: "",
                password_confirmation: "",
                role: "",
                verification_document: null,
                picture: null,
              }}
              validationSchema={getRegisterSchema(t)}
              onSubmit={async (values, actions) => {
                await handleRegister(values);
                actions.setSubmitting(false);
              }}
            >
              {({ isSubmitting, setFieldValue, values }) => (
                <Form className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Field
                      name="name"
                      type="text"
                      as={Input}
                      placeholder={t("registerNamePlaceholder")}
                      className="border rounded-none p-6 text-muted-foreground"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Field
                      name="email"
                      type="text"
                      as={Input}
                      placeholder={t("registerEmailPlaceholder")}
                      className="border rounded-none p-6 text-muted-foreground"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="grid gap-2 relative">
                    <Field
                      name="password"
                      as={Input}
                      placeholder={t("registerPasswordPlaceholder")}
                      className="border rounded-none p-6 text-muted-foreground"
                      type={showPassword ? "text" : "password"}
                    />
                    {showPassword ? (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                      >
                        <IoMdEye size={20} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                      >
                        <IoMdEyeOff size={20} />
                      </button>
                    )}

                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="grid gap-2 relative">
                    <Field
                      name="password_confirmation"
                      type={showConfirmPassword ? "text" : "password"}
                      as={Input}
                      placeholder={t("registerConfirmPasswordPlaceholder")}
                      className="border rounded-none p-6 text-muted-foreground"
                    />
                    {showConfirmPassword ? (
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                      >
                        <IoMdEye size={20} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                      >
                        <IoMdEyeOff size={20} />
                      </button>
                    )}
                    <ErrorMessage
                      name="password_confirmation"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Field
                      name="role"
                      as="select"
                      className="border rounded-none p-4 text-1xl text-muted-foreground"
                    >
                      <option value="">{t("registerRolePlaceholder")}</option>
                      <option value="student">
                        {t("registerStudentRolePlaceholder")}
                      </option>
                      <option value="owner">
                        {t("registerOwnerRolePlaceholder")}
                      </option>
                    </Field>
                    <ErrorMessage
                      name="role"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="grid gap-2">
                    <input
                      id="fileUpload"
                      name="verification_document"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(event) => {
                        const file = event.currentTarget.files[0];
                        setFieldValue("verification_document", file);
                        setSelectedFileName(file?.name || "");
                      }}
                      className="hidden"
                    />

                    <label
                      htmlFor="fileUpload"
                      className="cursor-pointer text-muted-foreground border border-gray-300 px-4 py-4 rounded w-full hover:bg-gray-100"
                    >
                      {selectedFileName ? selectedFileName : t("chooseFile")}
                    </label>

                    <ErrorMessage
                      name="verification_document"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="grid gap-2">
                    <input
                      id="personalImageUpload"
                      name="picture"
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={(event) => {
                        const file = event.currentTarget.files[0];
                        setFieldValue("picture", file);
                        setSelectedPersonalImageName(file?.name || "");
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="personalImageUpload"
                      className="cursor-pointer text-muted-foreground border border-gray-300 px-4 py-4 rounded w-full hover:bg-gray-100"
                    >
                      {selectedPersonalImageName
                        ? selectedPersonalImageName
                        : t("choosePersonalImage")}
                    </label>
                    <ErrorMessage
                      name="picture"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-[#ffcc41] text-black text-1xl p-6 rounded-none hover:bg-amber-400"
                  >
                    {loading ? t("registerLoading") : t("registerButton")}
                  </Button>
                </Form>
              )}
            </Formik>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <div className="text-center">
              <span className="text-muted-foreground">
                {t("haveAnAccount")}
              </span>
              <Link
                href="/login"
                passHref
                className="text-black m-2 hover:underline"
              >
                {t("loginHeader")}
              </Link>
            </div>
            <div>
              <p> {t("or")} </p>
            </div>
            <div className="flex justify-center items-center">
              <GoogleSignInButton page="register" />
            </div>
          </CardFooter>
        </Card>
      </div>
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleCloseToast}
        />
      )}
    </>
  );
};

export default RegisterPage;
