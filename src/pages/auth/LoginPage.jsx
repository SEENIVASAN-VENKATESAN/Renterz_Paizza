import { yupResolver } from '@hookform/resolvers/yup'
import { ArrowRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import FormField from '../../components/forms/FormField'
import Button from '../../components/ui/Button'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { loginSchema } from '../../utils/validationSchemas'

export default function LoginPage() {
  const { login, loading } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (values) => {
    try {
      await login(values)
      showToast('Login successful', 'success')
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true })
    } catch {
      showToast('Unable to login. Please verify credentials.', 'error')
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">Welcome back</h2>
      <p className="mt-1 text-sm text-soft">Sign in to access your property workspace.</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField label="Email" error={errors.email?.message}>
          <input {...register('email')} className="input-base auth-input" placeholder="Eg. admin@renterz.com" />
        </FormField>

        <FormField label="Password" error={errors.password?.message}>
          <input {...register('password')} type="password" className="input-base auth-input" placeholder="Eg. ********" />
        </FormField>

        <Button className="w-full" type="submit" disabled={!isValid || loading}>
          {loading ? 'Signing in...' : <>Sign In <ArrowRight size={15} className="ml-1" /></>}
        </Button>
      </form>

      <p className="mt-4 text-sm text-soft">
        New account? <Link className="font-semibold text-teal-700" to="/register">Create one</Link>
      </p>
    </div>
  )
}
