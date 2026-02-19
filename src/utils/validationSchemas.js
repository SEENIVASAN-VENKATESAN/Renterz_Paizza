import { object, ref, string } from 'yup'
import { REGISTRATION_ROLES } from '../constants/roles'

export const loginSchema = object({
  email: string().required('Email is required').email('Enter a valid email'),
  password: string().required('Password is required').min(8, 'Minimum 8 characters'),
})

export const registerSchema = object({
  fullName: string().required('Full name is required'),
  email: string().required('Email is required').email('Enter a valid email'),
  mobile: string()
    .required('Mobile number is required')
    .matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  role: string().required('Role is required').oneOf(REGISTRATION_ROLES, 'Invalid role selected'),
  password: string().required('Password is required').min(8, 'Minimum 8 characters'),
  confirmPassword: string()
    .required('Confirm password is required')
    .oneOf([ref('password')], 'Passwords must match'),
})

export const forgotPasswordSchema = object({
  email: string().required('Email is required').email('Enter a valid email'),
})
