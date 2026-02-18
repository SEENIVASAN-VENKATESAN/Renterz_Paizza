import { Navigate, Route, Routes } from 'react-router-dom'
import { ALL_ROLES, ROLES } from '../constants/roles'
import AppLayout from '../layouts/AppLayout'
import AuthLayout from '../layouts/AuthLayout'
import LandingLayout from '../layouts/LandingLayout'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import CommunicationPage from '../pages/communication/CommunicationPage'
import ComplaintPage from '../pages/complaint/ComplaintPage'
import AdminDashboard from '../pages/dashboard/AdminDashboard'
import OwnerDashboard from '../pages/dashboard/OwnerDashboard'
import TenantDashboard from '../pages/dashboard/TenantDashboard'
import DamageReportPage from '../pages/damage/DamageReportPage'
import LandingPage from '../pages/landing/LandingPage'
import MaintenancePage from '../pages/maintenance/MaintenancePage'
import PaymentPage from '../pages/payment/PaymentPage'
import PropertyDetailPage from '../pages/property/PropertyDetailPage'
import PropertyListPage from '../pages/property/PropertyListPage'
import RentPage from '../pages/rent/RentPage'
import UnitPage from '../pages/unit/UnitPage'
import { useAuth } from '../hooks/useAuth'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'

function RoleDashboard() {
  const { user } = useAuth()

  if (user?.role === ROLES.ADMIN) return <AdminDashboard />
  if (user?.role === ROLES.OWNER) return <OwnerDashboard />
  return <TenantDashboard />
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<LandingLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={ALL_ROLES} />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<RoleDashboard />} />
          <Route path="/rent" element={<RentPage />} />
          <Route path="/payments" element={<PaymentPage />} />
          <Route path="/complaints" element={<ComplaintPage />} />
          <Route path="/damage-reports" element={<DamageReportPage />} />
          <Route path="/communication" element={<CommunicationPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.OWNER]} />}>
        <Route element={<AppLayout />}>
          <Route path="/properties" element={<PropertyListPage />} />
          <Route path="/properties/:id" element={<PropertyDetailPage />} />
          <Route path="/units" element={<UnitPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
