import { Outlet } from 'react-router-dom'
import logo from '../assets/logo-clean.png'

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] p-4">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-base bg-white shadow-2xl lg:grid-cols-2">
        <section className="hidden bg-gradient-to-br from-teal-700 via-teal-600 to-cyan-600 p-8 text-white lg:block">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Renterz logo" className="h-12 w-12 rounded-xl border border-white/30 object-cover" />
            <h1 className="text-3xl font-bold">Renterz Platform</h1>
          </div>
          <p className="mt-4 max-w-sm text-sm text-white/90">
            Centralized rent tracking, property management, payment workflows, and communication in a single SaaS control plane.
          </p>
        </section>
        <section className="bg-white p-6 text-slate-900 [--border:#dbe4ee] [--surface:#ffffff] [--text:#0f172a] [--text-soft:#64748b] md:p-8">
          <Outlet />
        </section>
      </div>
    </div>
  )
}
