import * as Yup from 'yup';

export const validationSchema = Yup.object({
  title: Yup.string()
    .required('Property title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),

  type: Yup.string()
    .required('Property type is required')
    .oneOf(['apartment', 'room', 'bed'], 'Please select a valid property type'),
  
  space: Yup.number()
    .required('Space is required')
    .positive('Space must be a positive number')
    .integer('Space must be a whole number'),
  
  bedrooms: Yup.number()
    .required('Bedrooms is required')
    .min(0, 'Bedrooms cannot be negative')
    .integer('Bedrooms must be a whole number'),
  
  bathrooms: Yup.number()
    .required('Bathrooms is required')
    .min(0, 'Bathrooms cannot be negative')
    .integer('Bathrooms must be a whole number'),
  
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
    .max(100, 'Area must be less than 100 characters'),
  
  street: Yup.string()
    .required('Street is required')
    .min(10, 'Street must be at least 10 characters')
    .max(255, 'Street must be less than 255 characters'),
  
  block: Yup.string()
    .required('Block is required')
    .max(255, 'Block must be less than 255 characters'),
  
  media: Yup.array()
    .of(
      Yup.mixed()
        .test(
          'fileSize',
          'File too large',
          (value) => !value || (value.size <= 20 * 1024 * 1024) // 20MB
        )
        .test(
          'fileType',
          'Unsupported file format',
          (value) => !value || ['image/', 'video/'].some(type => value.type?.startsWith(type))
        )
    )
    .min(1, 'At least 1 media file is required')
    .max(8, 'Maximum 8 media files allowed')
});