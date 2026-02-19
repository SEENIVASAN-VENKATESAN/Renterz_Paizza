import { Building2, Gauge, IndianRupee, LayoutGrid, MessageSquareWarning, Wallet } from 'lucide-react'
import { ROLES } from './roles'

export const NAV_ITEMS = [
  { label: 'Dashboard', to: '/dashboard', icon: Gauge, roles: Object.values(ROLES) },
  { label: 'Properties', to: '/properties', icon: Building2, roles: [ROLES.ADMIN, ROLES.OWNER] },
  { label: 'Units', to: '/units', icon: LayoutGrid, roles: [ROLES.ADMIN, ROLES.OWNER] },
  { label: 'Rent', to: '/rent', icon: Wallet, roles: [ROLES.ADMIN, ROLES.OWNER, ROLES.TENANT] },
  { label: 'Payments', to: '/payments', icon: IndianRupee, roles: Object.values(ROLES) },
  { label: 'Complaints', to: '/complaints', icon: MessageSquareWarning, roles: Object.values(ROLES) },
]

export const EXTRA_NAV_ITEMS = [
  { label: 'Maintenance', to: '/maintenance', roles: [ROLES.ADMIN, ROLES.OWNER] },
  { label: 'Damage Reports', to: '/damage-reports', roles: [ROLES.ADMIN, ROLES.OWNER, ROLES.TENANT] },
  { label: 'Communication', to: '/communication', roles: [ROLES.ADMIN, ROLES.OWNER, ROLES.TENANT] },
]
