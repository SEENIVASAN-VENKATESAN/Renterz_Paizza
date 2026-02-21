import { object, ref, string } from 'yup'

export const loginSchema = object({
  email: string().required('Email is required').email('Enter a valid email'),
  password: string().required('Password is required').min(8, 'Minimum 8 characters'),
})

export const registerSchema = object({
  fullName: string().required('Full name is required'),
  buildingName: string().required('Building name is required'),
  email: string().required('Email is required').email('Enter a valid email'),
  countryIso: string().required('Country code is required'),
  mobile: string()
    .required('Mobile number is required')
    .matches(/^\d{6,15}$/, 'Enter a valid mobile number'),
  password: string().required('Password is required').min(8, 'Minimum 8 characters'),
  confirmPassword: string()
    .required('Confirm password is required')
    .oneOf([ref('password')], 'Passwords must match'),
})

export const forgotPasswordSchema = object({
  email: string().required('Email is required').email('Enter a valid email'),
})
