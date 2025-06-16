import React from "react";
import { ChevronDown } from "lucide-react";
import { Field, ErrorMessage } from "formik";

const FormField = ({ field }) => {
  const baseClasses = `w-full px-3 py-2 text-sm border rounded focus:outline-none focus:border-blue-500`;
  
  const renderField = (fieldProps, meta) => {
    const { field: formikField, form } = fieldProps;
    const hasError = meta.touched && meta.error;
    
    const inputClasses = `${baseClasses} ${
      hasError ? "border-red-500" : "border-gray-300"
    }`;

    switch (field.type) {
      case "select":
        return (
          <div className="relative">
            <select
              {...formikField}
              className={`${inputClasses} appearance-none bg-white text-gray-600`}
              aria-label={field.label}
            >
              {field.options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        );
      
      case "textarea":
        return (
          <textarea
            {...formikField}
            rows={field.rows || 3}
            className={`${inputClasses} resize-none`}
            aria-label={field.label}
            placeholder={field.placeholder}
          />
        );
      
      default:
        return (
          <input
            {...formikField}
            type={field.type || "text"}
            min={field.min}
            max={field.max}
            step={field.step}
            maxLength={field.maxLength}
            placeholder={field.placeholder}
            className={inputClasses}
            aria-label={field.label}
          />
        );
    }
  };

  return (
    <div className={field.colSpan || ""}>
      <label className="block text-xs font-medium text-black mb-1">
        {field.label}:
        {field.required && <span className="text-red-500"> *</span>}
      </label>
      
      <Field name={field.name}>
        {(fieldProps) => {
          const { meta } = fieldProps;
          return renderField(fieldProps, meta);
        }}
      </Field>
      
      <ErrorMessage name={field.name}>
        {msg => <p className="text-xs text-red-500 mt-1">{msg}</p>}
      </ErrorMessage>
    </div>
  );
};

export default FormField;