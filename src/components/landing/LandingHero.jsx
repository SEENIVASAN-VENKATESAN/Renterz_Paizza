import { ArrowRight, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../ui/Button'

export default function LandingHero() {
  return (
    <section className="overflow-hidden rounded-3xl border border-base bg-surface p-8 shadow-xl md:p-12">
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          <ShieldCheck size={14} /> Production-Ready SaaS Frontend
        </span>
        <h2 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
          Manage Properties, Rent, Payments, and Tenant Operations on One Platform
        </h2>
        <p className="mt-4 max-w-2xl text-base text-soft md:text-lg">
          Built for admins, owners, and tenants with role-based access, JWT auth, operational modules, and a scalable frontend architecture.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link to="/register">
            <Button className="px-5 py-2.5">
              Start Free Setup <ArrowRight size={15} className="ml-1" />
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary" className="px-5 py-2.5">Open Demo Workspace</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
