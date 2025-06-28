import React, { useState } from "react";
import { X, Save } from "lucide-react";
import MediaUpload from "@/components/add-property/MediaUpload";
import FormError from "@/app/(pages)/property/[id]/components/FormError";
import { validationSchema } from "@/validation/add-property-validation";
import { useTranslation } from "../../../../../TranslationContext";

const PropertyModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  editingProperty,
}) => {
  const { t, locale } = useTranslation();
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validate = () => {
    try {
      validationSchema.validateSync(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      const fieldErrors = {};
      if (err.inner) {
        err.inner.forEach((e) => {
          fieldErrors[e.path] = e.message;
        });
      }
      setErrors(fieldErrors);
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(e);
  };

  return (
    <div
      className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-4 shadow-2xl transform transition-all duration-300 border border-amber-200">
        <div
          className={`flex justify-between items-center p-4 border-b ${
            locale === "ar" ? "flex-row-reverse" : ""
          }`}
        >
          <h2 className="text-2xl font-bold text-gray-900">
            {editingProperty ? t("editPropertyTitle") : t("addPropertyTitle")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label={t("closeButton")}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <form className="p-4 space-y-6" onSubmit={handleSubmit} noValidate>
          {errors.general && <FormError message={errors.general} />}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("titleLabel")}
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("typeLabel")}
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.type ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="apartment">{t("apartmentOption")}</option>
                <option value="house">{t("houseOption")}</option>
                <option value="room">{t("roomOption")}</option>
                <option value="studio">{t("studioOption")}</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("priceLabel")} ({t("currency")})
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.price ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("spaceLabel")} (m²)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.space}
                onChange={(e) =>
                  setFormData({ ...formData, space: e.target.value })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.space ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.space && (
                <p className="mt-1 text-sm text-red-600">{errors.space}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("bedroomsLabel")}
              </label>
              <input
                type="number"
                min="0"
                value={formData.number_of_beds}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    number_of_beds: parseInt(e.target.value),
                  })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.number_of_beds ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.number_of_beds && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.number_of_beds}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("bathroomsLabel")}
              </label>
              <input
                type="number"
                min="0"
                value={formData.number_of_bathrooms}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    number_of_bathrooms: parseInt(e.target.value),
                  })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.number_of_bathrooms
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {errors.number_of_bathrooms && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.number_of_bathrooms}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("streetLabel")}
              </label>
              <input
                type="text"
                value={formData.street}
                onChange={(e) =>
                  setFormData({ ...formData, street: e.target.value })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.street ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.street && (
                <p className="mt-1 text-sm text-red-600">{errors.street}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("areaLabel")}
              </label>
              <input
                type="text"
                value={formData.area}
                onChange={(e) =>
                  setFormData({ ...formData, area: e.target.value })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.area ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.area && (
                <p className="mt-1 text-sm text-red-600">{errors.area}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("blockLabel")}
              </label>
              <input
                type="text"
                value={formData.block}
                onChange={(e) =>
                  setFormData({ ...formData, block: e.target.value })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.block ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.block && (
                <p className="mt-1 text-sm text-red-600">{errors.block}</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("descriptionLabel")}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div
            className={`flex gap-4 ${
              locale === "ar" ? "flex-row-reverse" : ""
            }`}
          >
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {t("cancelButton")}
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Save className="w-5 h-5" />
              {editingProperty
                ? t("updatePropertyButton")
                : t("createPropertyButton")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyModal;
