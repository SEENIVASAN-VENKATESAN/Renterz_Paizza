import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import HomeButton from '../components/ui/HomeButton'
import { CURRENCY_OPTIONS } from '../constants/currency'
import { ROLES } from '../constants/roles'
import { useAuth } from '../hooks/useAuth'
import Sidebar from './Sidebar'
import TopNavbar from './TopNavbar'

export default function AppLayout() {
  const { user } = useAuth()
  const isAdmin = user?.role === ROLES.ADMIN
  const [open, setOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [currency, setCurrency] = useState(() => localStorage.getItem('rp_currency') || 'USD')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem('rp_currency', currency)
  }, [currency])

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Sidebar role={user?.role} open={open} onClose={() => setOpen(false)} />
      <div className={isAdmin ? 'lg:pl-24' : 'lg:pl-72'}>
        <TopNavbar
          onToggleSidebar={() => setOpen((prev) => !prev)}
          darkMode={darkMode}
          onToggleTheme={() => setDarkMode((prev) => !prev)}
          currency={currency}
          onChangeCurrency={setCurrency}
          currencyOptions={CURRENCY_OPTIONS}
        />
        <main className="app-main workbench-theme p-4 md:p-6">
          <Outlet />
        </main>
      </div>
      {!isAdmin ? <HomeButton /> : null}
    </div>
  )
}
