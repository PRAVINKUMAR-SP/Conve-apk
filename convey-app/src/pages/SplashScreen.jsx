import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function SplashScreen() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (loading) return

    const timer = setTimeout(() => {
      if (user) {
        navigate('/home', { replace: true })
      } else {
        navigate('/create-profile', { replace: true })
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [user, loading, navigate])

  return (
    <div className="splash">
      <div className="splash__logo">CONVEY</div>
      <p className="text-secondary" style={{ fontSize: 'var(--font-size-sm)' }}>
        Real-time messaging
      </p>
      <div className="splash__spinner" />
    </div>
  )
}
