import { useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { House, MessageSquare, TriangleAlert, Wrench } from 'lucide-react'
import logo from '../assets/logo-clean.png'
import { EXTRA_NAV_ITEMS, NAV_ITEMS } from '../constants/navigation'
import { ROLES } from '../constants/roles'
import { classNames } from '../utils/classNames'

export default function Sidebar({ role, open, onClose }) {
  const isAdmin = role === ROLES.ADMIN
  const [isMobileDock, setIsMobileDock] = useState(() => window.innerWidth < 1024)
  const [activeDockIndex, setActiveDockIndex] = useState(0)
  const dockRef = useRef(null)
  const dockItemRefs = useRef([])
  const mobileDockInitializedRef = useRef(false)
  const autoScrollingRef = useRef(false)
  const settleTimerRef = useRef(null)
  const lastNavigatedIndexRef = useRef(-1)
  const navigate = useNavigate()
  const location = useLocation()
  const visibleMain = useMemo(() => NAV_ITEMS.filter((item) => item.roles.includes(role)), [role])
  const extraIconByPath = {
    '/maintenance': Wrench,
    '/damage-reports': TriangleAlert,
    '/communication': MessageSquare,
  }
  const visibleExtra = useMemo(
    () =>
      EXTRA_NAV_ITEMS
        .filter((item) => item.roles.includes(role))
        .map((item) => ({ ...item, icon: extraIconByPath[item.to] || MessageSquare })),
    [role]
  )
  const adminItems = useMemo(() => [...visibleMain, ...visibleExtra], [visibleMain, visibleExtra])
  const mobileDockItems = useMemo(() => {
    const homeItem = adminItems.find((item) => item.to === '/dashboard')
    const nonHomeItems = adminItems.filter((item) => item.to !== '/dashboard')
    const mid = Math.floor(nonHomeItems.length / 2)
    return homeItem
      ? [...nonHomeItems.slice(0, mid), { ...homeItem, icon: House }, ...nonHomeItems.slice(mid)]
      : adminItems
  }, [adminItems])
  const dockItems = isMobileDock ? mobileDockItems : adminItems

  useEffect(() => {
    const handleResize = () => setIsMobileDock(window.innerWidth < 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!isAdmin) return undefined

    const isDesktop = () => !isMobileDock

    const getClosestIndex = () => {
      const container = dockRef.current
      if (!container) return 0

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

      return closestIndex
    }

    const centerItem = (index, behavior = 'smooth') => {
      const container = dockRef.current
      const node = dockItemRefs.current[index]
      if (!container || !node) return
      const containerRect = container.getBoundingClientRect()
      const nodeRect = node.getBoundingClientRect()
      const delta = nodeRect.left + nodeRect.width / 2 - (containerRect.left + containerRect.width / 2)
      autoScrollingRef.current = behavior === 'smooth'
      container.scrollTo({ left: container.scrollLeft + delta, behavior })
      if (behavior !== 'smooth') {
        autoScrollingRef.current = false
      } else {
        setTimeout(() => {
          autoScrollingRef.current = false
        }, 260)
      }
    }

    const updateActiveIndex = () => {
      const closestIndex = getClosestIndex()
      setActiveDockIndex(closestIndex)
      return closestIndex
    }

    const container = dockRef.current
    const homeIndex = dockItems.findIndex((item) => item.to === '/dashboard')
    if (!isDesktop() && homeIndex >= 0 && !mobileDockInitializedRef.current) {
      mobileDockInitializedRef.current = true
      setActiveDockIndex(homeIndex)
      centerItem(homeIndex, 'auto')
    } else {
      updateActiveIndex()
    }

    if (!container) return undefined

    const onScroll = () => {
      if (isDesktop()) return
      if (autoScrollingRef.current) return
      const closestIndex = updateActiveIndex()
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current)
      settleTimerRef.current = setTimeout(() => {
        const target = dockItems[closestIndex]
        if (!target) return
        if (lastNavigatedIndexRef.current === closestIndex && location.pathname === target.to) return
        if (location.pathname !== target.to) {
          navigate(target.to)
        }
        lastNavigatedIndexRef.current = closestIndex
      }, 140)
    }

    container.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', updateActiveIndex)
    return () => {
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current)
      container.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', updateActiveIndex)
    }
  }, [isAdmin, isMobileDock, dockItems, navigate, location.pathname])

  if (isAdmin) {
    return (
      <>
        <aside className="fixed bottom-3 left-0 right-0 z-40 mx-auto w-[calc(100vw-2.2rem)] max-w-[540px] rounded-full border border-white/12 bg-[linear-gradient(180deg,rgba(10,12,19,0.96),rgba(6,8,14,0.92))] px-2.5 py-2.5 backdrop-blur-md motion-safe:animate-[dockSlideUp_320ms_ease-out_both] lg:inset-y-0 lg:left-0 lg:right-auto lg:mx-0 lg:w-24 lg:max-w-none lg:rounded-none lg:border-r lg:border-t-0 lg:border-l-0 lg:border-b-0 lg:p-3 lg:motion-safe:animate-none">
          <div className="mt-2 hidden justify-center lg:flex">
            <img src={logo} alt="Renterz logo" className="h-11 w-11 rounded-xl border border-base object-cover" />
          </div>
          <nav className="flex justify-center lg:mt-10">
            <div
              ref={dockRef}
              className={classNames(
                'w-full rounded-[999px] border border-white/12 bg-[linear-gradient(180deg,rgba(30,34,49,0.82),rgba(14,16,26,0.86))] p-2.5 shadow-[0_22px_40px_rgba(2,6,23,0.5)] backdrop-blur-xl lg:w-[62px] lg:overflow-visible',
                isMobileDock ? 'admin-dock-track snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden' : 'overflow-visible'
              )}
            >
              <div className="flex min-w-max flex-row items-center justify-start gap-2.5 lg:min-w-0 lg:flex-col lg:justify-center">
                <span className="w-[calc(50vw-2.25rem)] shrink-0 lg:hidden" aria-hidden="true" />
                {dockItems.map((item, index) => (
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
                        'admin-dock-item snap-center inline-flex h-12 w-12 items-center justify-center rounded-full border text-[#9ca4c8]',
                        isActive
                          ? 'border-[#8f7be8]/45 bg-[radial-gradient(circle_at_30%_20%,rgba(173,158,255,0.38),rgba(92,78,158,0.62))] text-white shadow-[0_10px_24px_rgba(70,56,136,0.55)]'
                          : 'border-transparent hover:border-white/15 hover:bg-white/10 hover:text-[#d4d9f1]',
                        isMobileDock && index === activeDockIndex
                          ? 'z-20 scale-100 opacity-100 blur-0 border-white/30 bg-white/12 text-white'
                          : isMobileDock && Math.abs(index - activeDockIndex) === 1
                          ? 'scale-90 opacity-70 blur-[1px] translate-y-0.5'
                          : isMobileDock
                          ? 'scale-[0.82] opacity-45 blur-[2px] translate-y-1'
                          : '',
                        'lg:scale-100 lg:opacity-100 lg:translate-y-0 lg:blur-0'
                      )
                    }
                  >
                    <item.icon size={19} />
                  </NavLink>
                ))}
                <span className="w-[calc(50vw-2.25rem)] shrink-0 lg:hidden" aria-hidden="true" />
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
