import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo-clean.png'
import Button from '../ui/Button'

export default function LandingHeader() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 md:px-6">
      <div className="flex items-center gap-3">
        <img src={logo} alt="Renterz logo" className="h-10 w-10 rounded-xl border border-base object-cover" />
        <div>
          <h1 className="text-xl font-bold">Renterz SaaS</h1>
          <p className="text-xs text-soft">Rent Tracking and Property Management</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link to="/login">
          <Button variant="secondary">Sign In</Button>
        </Link>
        <Link to="/register">
          <Button>
            Get Started <ArrowRight size={14} className="ml-1" />
          </Button>
        </Link>
      </div>
    </header>
  )
}
