import React from "react";
import FormField from "./FormField";

const FormSection = ({ section }) => {
    const renderIcon = () => {
        if (typeof section.icon === 'string') {
          return section.icon;
        }
      
        if (React.isValidElement(section.icon)) {
          return section.icon;
        }
      
        if (typeof section.icon === 'function') {
          const IconComponent = section.icon;
          return <IconComponent className="w-4 h-4" />;
        }
      
        return null; 
      };
      

  return (
    <div className="bg-white overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-sm font-medium text-black flex items-center">
          {section.title}
        </h2>
      </div>
      
      <div className="p-6">
        <div className={`grid grid-cols-1 ${
          section.fields.some(f => f.colSpan?.includes('col-span-2')) 
            ? 'md:grid-cols-2' 
            : 'md:grid-cols-3'
        } gap-4`}>
          {section.fields.map((field) => (
            <FormField
              key={field.name}
              field={field}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormSection;