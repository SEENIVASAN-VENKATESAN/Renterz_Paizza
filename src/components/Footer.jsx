import { Mail, MapPin, Phone } from 'lucide-react'
import { useMemo } from 'react'

export default function Footer() {
  const year = useMemo(() => new Date().getFullYear(), [])

  return (
    <footer className="mt-10 border-t border-base bg-surface/70">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6">
        <div className="grid gap-6 text-sm text-soft md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h4 className="text-base font-semibold text-main">Renterz</h4>
            <p className="mt-2">
              Smart rent tracking and property operations for admins, owners, and tenants.
            </p>
          </div>

          <div>
            <h4 className="text-base font-semibold text-main">Product</h4>
            <ul className="mt-2 space-y-1.5">
              <li>Property and Unit Management</li>
              <li>Rent and Payment Monitoring</li>
              <li>Maintenance and Damage Tracking</li>
              <li>Complaint and Communication Tools</li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-semibold text-main">Quick Links</h4>
            <ul className="mt-2 space-y-1.5">
              <li><a href="#landing-hero" className="hover:text-main">Overview</a></li>
              <li><a href="#landing-features" className="hover:text-main">Features</a></li>
              <li><a href="#landing-feedback" className="hover:text-main">Feedback</a></li>
              <li><a href="#landing-integration" className="hover:text-main">Integration</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-semibold text-main">Contact</h4>
            <ul className="mt-2 space-y-2">
              <li className="inline-flex items-center gap-2"><Mail size={14} /> support@renterz.com</li>
              <li className="inline-flex items-center gap-2"><Phone size={14} /> +1 (800) 555-2014</li>
              <li className="inline-flex items-center gap-2"><MapPin size={14} /> New York, United States</li>
            </ul>
          </div>
        </div>

        <div className="mt-7 border-t border-base pt-4 text-xs text-soft sm:text-sm">
          <p>© {year} Renterz. All rights reserved.</p>
          <p className="mt-1">Built for modern rent tracking and property operations.</p>
        </div>
      </div>
    </footer>
  )
}
