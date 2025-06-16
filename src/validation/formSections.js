import { MapPin, Video, Camera } from "lucide-react";

export const formSections = [
  {
    title: "Property Info",
    icon: "i",
    fields: [
      { 
        name: "title", 
        label: "Property Title", 
        type: "text", 
        required: true, 
        colSpan: "md:col-span-1" 
      },
      { 
        name: "type", 
        label: "Property Type", 
        type: "select", 
        required: true, 
        options: [
          { value: "", label: "Select Property Type" },
          { value: "apartment", label: "Apartment" },
          { value: "room", label: "Room" },
          { value: "bed", label: "Bed" }
        ], 
        colSpan: "md:col-span-1" 
      },
      { 
        name: "space", 
        label: "Property Space (sq ft)", 
        type: "number", 
        min: 0, 
        colSpan: "md:col-span-1" 
      },
      { 
        name: "number_of_beds", 
        label: "Number of bedrooms", 
        type: "number", 
        required: true, 
        min: 0, 
        colSpan: "md:col-span-1" 
      },
      { 
        name: "number_of_bathrooms", 
        label: "Number of bathrooms", 
        type: "number", 
        min: 0, 
        required: true, 
        step: 0.5, 
        colSpan: "md:col-span-1" 
      },
      { 
        name: "description", 
        label: "Property Description", 
        type: "textarea",
        required: true,  
        rows: 4, 
        colSpan: "md:col-span-2" 
      }
    ]
  },
  {
    title: "Price settings",
    icon: "$",
    fields: [
      { 
        name: "price", 
        label: "Price", 
        type: "number", 
        required: true, 
        min: 0, 
        step: 0.01, 
        colSpan: "max-w-xs" 
      }
    ]
  },
  {
    title: "Location Settings",
    icon: MapPin,
    fields: [
      { 
        name: "area", 
        label: "Area", 
        type: "text", 
        required: true, 
        colSpan: "md:col-span-1" 
      },
      { 
        name: "street", 
        label: "Street", 
        type: "text", 
        required: true, 
        maxLength: 255, 
        colSpan: "md:col-span-1" 
      },
      { 
        name: "block", 
        label: "Block", 
        type: "text", 
        required: true, 
        maxLength: 255, 
        colSpan: "md:col-span-1" 
      }
    ]
  },
];

export const initialValues = {
  title: "",
  type: "",
  space: "",
  number_of_beds: "",
  number_of_bathrooms: "",
  description: "",
  price: "",
  area: "",
  street: "",
  block: "",
  media: []
};