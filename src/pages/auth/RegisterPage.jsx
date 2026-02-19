import { yupResolver } from '@hookform/resolvers/yup'
import { ArrowRight, ChevronDown, Eye, EyeOff } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import FormField from '../../components/forms/FormField'
import Button from '../../components/ui/Button'
import { REGISTRATION_ROLES, ROLES } from '../../constants/roles'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { registerSchema } from '../../utils/validationSchemas'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const redirectTimerRef = useRef(null)
  const { register: registerUser, logout, loading } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: 'onChange',
    defaultValues: { fullName: '', email: '', mobile: '', role: ROLES.TENANT, password: '', confirmPassword: '' },
  })

  const onSubmit = async (values) => {
    try {
      const { confirmPassword, ...payload } = values
      await registerUser(payload)
      logout()
      setIsRegistered(true)
      showToast('Registered successfully', 'success')
      redirectTimerRef.current = setTimeout(() => {
        navigate('/login', { replace: true })
      }, 2000)
    } catch (error) {
      const rawMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        ''
      const normalized = String(rawMessage).toLowerCase()
      const isDuplicate =
        normalized.includes('already') ||
        normalized.includes('exists') ||
        normalized.includes('duplicate') ||
        (normalized.includes('email') && normalized.includes('used')) ||
        (normalized.includes('mobile') && normalized.includes('used')) ||
        (normalized.includes('number') && normalized.includes('used')) ||
        normalized.includes('unique')

      showToast(
        isDuplicate ? 'Email or number already used' : 'Registration failed. Please try again.',
        'error'
      )
    }
  }

  useEffect(() => () => {
    if (redirectTimerRef.current) {
      clearTimeout(redirectTimerRef.current)
    }
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-bold">Create your account</h2>
      <p className="mt-1 text-sm text-soft">Start managing properties, units, and rent workflows.</p>
      {isRegistered ? (
        <div className="register-redirect-loader mt-4" role="status" aria-live="polite" aria-label="Redirecting">
          <div className="register-redirect-spinner" aria-hidden="true" />
          <div className="register-redirect-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>
      ) : null}

      <form className="mt-6 space-y-4 register-form" onSubmit={handleSubmit(onSubmit)}>
        <FormField label="Full Name" error={errors.fullName?.message}>
          <input {...register('fullName')} className="input-base auth-input" placeholder="Eg. Alex Morgan" />
        </FormField>

        <FormField label="Email" error={errors.email?.message}>
          <input {...register('email')} className="input-base auth-input" placeholder="Eg. owner@renterz.com" />
        </FormField>

        <FormField label="Mobile Number" error={errors.mobile?.message}>
          <input {...register('mobile')} className="input-base auth-input" placeholder="Eg. 9876543210" />
        </FormField>

        <FormField label="Role" error={errors.role?.message}>
          <div className="relative">
            <select {...register('role')} className="input-base auth-input appearance-none pr-11 text-left">
              {REGISTRATION_ROLES.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
          </div>
        </FormField>

        <FormField label="Password" error={errors.password?.message}>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              className="input-base auth-input pr-10"
              placeholder="Eg. Minimum 8 characters"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-soft"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </FormField>

        <FormField label="Confirm Password" error={errors.confirmPassword?.message}>
          <div className="relative">
            <input
              {...register('confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              className="input-base auth-input pr-10"
              placeholder="Re-enter your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-soft"
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </FormField>

        <Button className="w-full" type="submit" disabled={!isValid || loading || isRegistered}>
          {loading
            ? 'Creating account...'
            : isRegistered
            ? 'Registered successfully'
            : <>Create Account <ArrowRight size={15} className="ml-1" /></>}
        </Button>
      </form>

      <p className="mt-4 text-sm text-soft">
        Already have an account? <Link className="font-semibold text-[var(--primary)]" to="/login">Sign in</Link>
      </p>
    </div>
  )
}
