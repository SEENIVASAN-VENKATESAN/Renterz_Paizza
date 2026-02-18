import { useEffect, useMemo, useRef, useState } from 'react'
import { Bell, LogOut, Menu, Moon, Sun } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo-clean.png'
import { ROLES } from '../constants/roles'
import { useAuth } from '../hooks/useAuth'

export default function TopNavbar({ onToggleSidebar, darkMode, onToggleTheme, currency, onChangeCurrency, currencyOptions = [] }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [openProfileMenu, setOpenProfileMenu] = useState(false)
  const profileMenuRef = useRef(null)
  const showHeaderLogo = user?.role !== ROLES.ADMIN
  const showSidebarToggle = user?.role !== ROLES.ADMIN
  const panelTitle = user?.role === ROLES.ADMIN ? 'Admin Panel' : 'Rent Tracking Platform'

  const initials = useMemo(() => {
    if (!user?.fullName) return 'U'
    return user.fullName
      .split(' ')
      .map((part) => part[0]?.toUpperCase())
      .slice(0, 2)
      .join('')
  }, [user])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setOpenProfileMenu(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setOpenProfileMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const handleLogout = () => {
    logout()
    setOpenProfileMenu(false)
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-base bg-surface px-4 md:px-6">
      <div className="flex items-center gap-3">
        {showSidebarToggle ? (
          <button type="button" className="rounded-lg p-2 hover-surface-soft lg:hidden" onClick={onToggleSidebar}>
            <Menu size={18} />
          </button>
        ) : null}
        {showHeaderLogo ? <img src={logo} alt="Renterz logo" className="h-8 w-8 rounded-lg border border-base object-cover" /> : null}
        <h1 className="text-lg font-bold text-main">{panelTitle}</h1>
      </div>
      <div className="flex items-center gap-3">
        <select
          value={currency}
          onChange={(event) => onChangeCurrency(event.target.value)}
          className="hidden rounded-lg border border-base bg-surface px-2 py-1 text-xs font-semibold text-main md:block"
          aria-label="Currency type"
        >
          {currencyOptions.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        <button type="button" className="rounded-lg border border-base p-2" onClick={onToggleTheme}>
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button type="button" className="rounded-lg border border-base p-2">
          <Bell size={16} />
        </button>
        <div className="relative" ref={profileMenuRef}>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-base px-3 py-1.5"
            onClick={() => setOpenProfileMenu((prev) => !prev)}
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700">{initials}</span>
            <span className="hidden text-left md:block">
              <strong className="block text-sm text-main">{user?.fullName || 'User'}</strong>
              <small className="text-xs text-soft">{user?.role}</small>
            </span>
          </button>
          <div className={`absolute right-0 mt-2 w-52 rounded-xl border border-base bg-surface p-2 shadow-lg transition ${openProfileMenu ? 'visible opacity-100' : 'invisible opacity-0'}`}>
            <div className="mb-2 block rounded-lg border border-base px-3 py-2 md:hidden">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-soft">Currency</p>
              <select
                value={currency}
                onChange={(event) => onChangeCurrency(event.target.value)}
                className="mt-1 w-full rounded-md border border-base bg-surface px-2 py-1 text-xs font-semibold text-main"
                aria-label="Currency type"
              >
                {currencyOptions.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
            <button type="button" onClick={handleLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-600 hover:bg-rose-50">
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
