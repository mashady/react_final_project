import * as Yup from 'yup';

export const validationSchema = Yup.object({
  title: Yup.string()
    .required('Property title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(255, 'Title must be less than 255 characters'),

  type: Yup.string()
    .required('Property type is required')
    .oneOf(['apartment', 'room', 'bed'], 'Please select a valid property type'),
  
  space: Yup.number()
    .required('Space is required')
    .positive('Space must be a positive number')
    .integer('Space must be a whole number'),
  
  number_of_beds: Yup.number()
    .required('Number of bedrooms is required')
    .min(0, 'Number of bedrooms cannot be negative')
    .integer('Number of bedrooms must be a whole number'),
  
  number_of_bathrooms: Yup.number()
    .required('Number of bathrooms is required')
    .min(0, 'Number of bathrooms cannot be negative')
    .integer('Number of bathrooms must be a whole number'),
  
  description: Yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  
  price: Yup.number()
    .required('Price is required')
    .positive('Price must be greater than 0')
    .max(999999999, 'Price is too high'),
  
  area: Yup.string()
    .required('Area is required')
    .min(3, 'Area must be at least 3 characters')
    .max(100, 'Area must be less than 100 characters'),
  
  street: Yup.string()
    .required('Street is required')
    .min(5, 'Street must be at least 5 characters')
    .max(255, 'Street must be less than 255 characters'),
  
  block: Yup.string()
    .required('Block is required')
    .min(1, 'Block must be at least 1 character')
    .max(255, 'Block must be less than 255 characters'),
  
  media: Yup.array()
  .of(
    Yup.mixed()
      .test(
        'fileSize',
        'File too large',
        (value) => {
          if (value instanceof File) {
            return value.size <= 20 * 1024 * 1024;
          }
          return true; // Skip validation for existing media (not File)
        }
      )
      .test(
        'fileType',
        'Unsupported file format',
        (value) => {
          if (value instanceof File) {
            return ['image/', 'video/'].some(type => value.type?.startsWith(type));
          }
          return true; // Skip validation for existing media
        }
      )
  )
  .min(1, 'At least 1 media file is required')
  .max(8, 'Maximum 8 media files allowed')

});