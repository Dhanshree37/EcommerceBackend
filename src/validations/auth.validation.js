import Joi from "joi";

// Address validation schema
const addressSchema = Joi.object({
  addressLine1: Joi.string().required().messages({
    "string.empty": "Address Line 1 is required"
  }),
  addressLine2: Joi.string().optional(),
  city: Joi.string().required().messages({
    "string.empty": "City is required"
  }),
  state: Joi.string().required().messages({
    "string.empty": "State is required"
  }),
  postalCode: Joi.string().required().messages({
    "string.empty": "Postal Code is required"
  }),
  country: Joi.string().required().messages({
    "string.empty": "Country is required"
  }),
  isDefault: Joi.boolean().optional()
});

export const signupSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name can be maximum 50 characters"
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be valid"
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters"
  }),
  dob: Joi.date().required().messages({
    "date.base": "Date of Birth must be a valid date",
    "any.required": "Date of Birth is required"
  }),
  phone: Joi.string().pattern(/^\d{10}$/).required().messages({
    "string.empty": "Phone number is required",
    "string.pattern.base": "Phone number must be exactly 10 digits"
  }),
  gender: Joi.string().valid("male", "female", "other").optional(),
  addresses: Joi.array()
    .items(addressSchema)
    .min(1)
    .required()
    .messages({
      "array.min": "At least one address is required",
      "any.required": "Addresses are required",
    }),
  profileImage: Joi.string().uri().optional()
});


export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be valid"
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters"
  })
});
