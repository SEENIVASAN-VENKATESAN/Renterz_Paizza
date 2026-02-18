import { useMemo } from 'react'

export default function Footer() {
  const year = useMemo(() => new Date().getFullYear(), [])

  return (
    <footer className="mt-8 border-t border-base bg-surface/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-5 text-sm text-soft md:flex-row md:items-center md:justify-between md:px-6">
        <p>© {year} Renterz SaaS. All rights reserved.</p>
        <p>Built for modern rent tracking and property operations.</p>
      </div>
    </footer>
  )
}