import { yupResolver } from '@hookform/resolvers/yup'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import FormField from '../../components/forms/FormField'
import Button from '../../components/ui/Button'
import { REGISTRATION_ROLES, ROLES } from '../../constants/roles'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { registerSchema } from '../../utils/validationSchemas'

export default function RegisterPage() {
  const { register: registerUser, loading } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: 'onChange',
    defaultValues: { fullName: '', email: '', mobile: '', role: ROLES.TENANT, password: '' },
  })

  const onSubmit = async (values) => {
    try {
      await registerUser(values)
      showToast('Account created successfully', 'success')
      navigate('/dashboard', { replace: true })
    } catch {
      showToast('Registration failed. Please try again.', 'error')
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">Create your account</h2>
      <p className="mt-1 text-sm text-soft">Start managing properties, units, and rent workflows.</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
          <input {...register('password')} type="password" className="input-base auth-input" placeholder="Eg. Minimum 8 characters" />
        </FormField>

        <Button className="w-full" type="submit" disabled={!isValid || loading}>
          {loading ? 'Creating account...' : <>Create Account <ArrowRight size={15} className="ml-1" /></>}
        </Button>
      </form>

      <p className="mt-4 text-sm text-soft">
        Already have an account? <Link className="font-semibold text-teal-700" to="/login">Sign in</Link>
      </p>
    </div>
  )
}
