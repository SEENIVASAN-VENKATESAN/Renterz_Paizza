import Footer from '../../components/Footer'
import LandingDevelopers from '../../components/landing/LandingDevelopers'
import LandingFeatures from '../../components/landing/LandingFeatures'
import LandingHeader from '../../components/landing/LandingHeader'
import LandingHero from '../../components/landing/LandingHero'
import LandingIntegration from '../../components/landing/LandingIntegration'
import { useAuth } from '../../hooks/useAuth'
import { Navigate } from 'react-router-dom'

export default function LandingPage() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <>
      <LandingHeader />
      <main className="mx-auto w-full max-w-6xl px-4 pb-12 md:px-6">
        <LandingHero />
        <LandingFeatures />
        <LandingDevelopers />
        <LandingIntegration />
      </main>
      <Footer />
    </>
  )
}
