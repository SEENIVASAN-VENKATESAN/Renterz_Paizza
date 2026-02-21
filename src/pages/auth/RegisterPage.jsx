import { yupResolver } from '@hookform/resolvers/yup'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import FormField from '../../components/forms/FormField'
import Button from '../../components/ui/Button'
import { COUNTRY_CODES } from '../../constants/countryCodes'
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
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: 'onChange',
    defaultValues: { fullName: '', buildingName: '', email: '', countryIso: 'IN', mobile: '', password: '', confirmPassword: '' },
  })
  const selectedCountryIso = watch('countryIso')
  const selectedCountry = useMemo(
    () => COUNTRY_CODES.find((item) => item.code === selectedCountryIso) || COUNTRY_CODES[0],
    [selectedCountryIso]
  )

  const onSubmit = async (values) => {
    try {
      const { confirmPassword: _confirmPassword, countryIso, ...rest } = values
      const payload = {
        ...rest,
        countryIso,
        mobile: `${selectedCountry.dialCode}${String(values.mobile || '').trim()}`,
      }
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
        isDuplicate ? 'Email or number already used' : (rawMessage || 'Registration failed. Please try again.'),
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
      <h2 className="text-2xl font-bold">Register Admin</h2>
      <p className="mt-1 text-sm text-soft">Create your building and admin account in one step.</p>
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

        <FormField label="Building Name" error={errors.buildingName?.message}>
          <input {...register('buildingName')} className="input-base auth-input" placeholder="Eg. Palm Crest Residency" />
        </FormField>

        <FormField label="Email" error={errors.email?.message}>
          <input {...register('email')} className="input-base auth-input" placeholder="Eg. admin@building.com" />
        </FormField>

        <FormField label="Mobile Number" error={errors.mobile?.message}>
          <div className="grid grid-cols-[112px_1fr] gap-2">
            <select
              {...register('countryIso')}
              aria-label="Country dialing code"
              className="input-base auth-input h-10 pl-2 pr-1 text-xs font-semibold"
            >
              {COUNTRY_CODES.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.code} {item.dialCode}
                </option>
              ))}
            </select>
            <input
              {...register('mobile')}
              aria-label="Mobile number"
              className="input-base auth-input"
              inputMode="numeric"
              placeholder={`Eg. ${selectedCountry.dialCode} 9876543210`}
              onInput={(event) => {
                event.target.value = event.target.value.replace(/\D/g, '').slice(0, 15)
              }}
            />
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
