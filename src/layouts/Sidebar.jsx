import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { MessageSquare, TriangleAlert, Wrench } from 'lucide-react'
import logo from '../assets/logo-clean.png'
import { EXTRA_NAV_ITEMS, NAV_ITEMS } from '../constants/navigation'
import { ROLES } from '../constants/roles'
import { classNames } from '../utils/classNames'

export default function Sidebar({ role, open, onClose }) {
  const isAdmin = role === ROLES.ADMIN
  const [activeDockIndex, setActiveDockIndex] = useState(0)
  const dockRef = useRef(null)
  const dockItemRefs = useRef([])
  const visibleMain = NAV_ITEMS.filter((item) => item.roles.includes(role))
  const extraIconByPath = {
    '/maintenance': Wrench,
    '/damage-reports': TriangleAlert,
    '/communication': MessageSquare,
  }
  const visibleExtra = EXTRA_NAV_ITEMS
    .filter((item) => item.roles.includes(role))
    .map((item) => ({ ...item, icon: extraIconByPath[item.to] || MessageSquare }))
  const adminItems = [...visibleMain, ...visibleExtra]

  useEffect(() => {
    if (!isAdmin) return undefined

    const updateActiveIndex = () => {
      const container = dockRef.current
      if (!container) return

      const containerRect = container.getBoundingClientRect()
      const centerX = containerRect.left + containerRect.width / 2

      let closestIndex = 0
      let closestDistance = Number.POSITIVE_INFINITY

      dockItemRefs.current.forEach((node, index) => {
        if (!node) return
        const rect = node.getBoundingClientRect()
        const itemCenter = rect.left + rect.width / 2
        const distance = Math.abs(centerX - itemCenter)
        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = index
        }
      })

      setActiveDockIndex(closestIndex)
    }

    const container = dockRef.current
    updateActiveIndex()
    if (!container) return undefined

    container.addEventListener('scroll', updateActiveIndex, { passive: true })
    window.addEventListener('resize', updateActiveIndex)
    return () => {
      container.removeEventListener('scroll', updateActiveIndex)
      window.removeEventListener('resize', updateActiveIndex)
    }
  }, [isAdmin, adminItems.length])

  if (isAdmin) {
    return (
      <>
        <aside className="fixed bottom-3 left-1/2 z-40 w-[calc(100vw-1.2rem)] max-w-[520px] -translate-x-1/2 rounded-full border border-white/12 bg-[linear-gradient(180deg,rgba(10,12,19,0.96),rgba(6,8,14,0.92))] px-2 py-2 backdrop-blur-md lg:inset-y-0 lg:left-0 lg:w-24 lg:max-w-none lg:translate-x-0 lg:rounded-none lg:border-r lg:border-t-0 lg:border-l-0 lg:border-b-0 lg:p-3">
          <div className="mt-2 hidden justify-center lg:flex">
            <img src={logo} alt="Renterz logo" className="h-11 w-11 rounded-xl border border-base object-cover" />
          </div>
          <nav className="flex justify-center lg:mt-10">
            <div
              ref={dockRef}
              className="w-full overflow-x-auto rounded-[999px] border border-white/12 bg-[linear-gradient(180deg,rgba(30,34,49,0.82),rgba(14,16,26,0.86))] p-2 shadow-[0_22px_40px_rgba(2,6,23,0.5)] backdrop-blur-xl lg:w-[62px] lg:overflow-visible"
            >
              <div className="flex min-w-max flex-row items-center justify-start gap-2 lg:min-w-0 lg:flex-col lg:justify-center">
                {adminItems.map((item, index) => (
                  <NavLink
                    key={item.to}
                    ref={(node) => {
                      dockItemRefs.current[index] = node
                    }}
                    to={item.to}
                    onClick={onClose}
                    title={item.label}
                    className={({ isActive }) =>
                      classNames(
                        'inline-flex h-11 w-11 items-center justify-center rounded-full border text-[#9ca4c8] transition',
                        isActive
                          ? 'border-[#8f7be8]/45 bg-[radial-gradient(circle_at_30%_20%,rgba(173,158,255,0.38),rgba(92,78,158,0.62))] text-white shadow-[0_10px_24px_rgba(70,56,136,0.55)]'
                          : 'border-transparent hover:border-white/15 hover:bg-white/10 hover:text-[#d4d9f1]',
                        index === activeDockIndex
                          ? 'z-20 scale-100 opacity-100'
                          : Math.abs(index - activeDockIndex) === 1
                          ? 'scale-90 opacity-80 translate-y-0.5'
                          : 'scale-[0.82] opacity-60 translate-y-1',
                        'lg:scale-100 lg:opacity-100 lg:translate-y-0'
                      )
                    }
                  >
                    <item.icon size={18} />
                  </NavLink>
                ))}
              </div>
            </div>
          </nav>
        </aside>
      </>
    )
  }

  return (
    <>
      <aside className={classNames('fixed inset-y-0 left-0 z-40 w-72 border-r border-base bg-surface p-4 transition lg:translate-x-0', open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0')}>
        <div className="mb-6 border-b border-base pb-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Renterz logo" className="h-11 w-11 rounded-xl border border-base object-cover" />
            <div>
              <h2 className="text-xl font-bold text-main">Renterz SaaS</h2>
              <p className="mt-1 text-xs text-soft">Property Management</p>
            </div>
          </div>
        </div>
        <nav className="space-y-1">
          {visibleMain.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) => classNames('flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition', isActive ? 'bg-teal-50 text-teal-700' : 'text-main hover-surface-soft')}
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-6 border-t border-base pt-4">
          <p className="mb-2 text-xs font-semibold text-soft">Operations</p>
          <div className="space-y-1">
            {visibleExtra.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) => classNames('block rounded-xl px-3 py-2 text-sm font-semibold transition', isActive ? 'bg-teal-50 text-teal-700' : 'text-main hover-surface-soft')}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </aside>
      {open ? <button type="button" className="fixed inset-0 z-30 bg-overlay lg:hidden" onClick={onClose} /> : null}
    </>
  )
}
