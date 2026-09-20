import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  requestContactsPermission,
  requestCameraPermission,
  requestMicrophonePermission,
  requestLocationPermission,
  requestNotificationPermission
} from '../utils/permissions'

const PERMISSIONS = [
  { id: 'contacts', icon: '👥', title: 'Contacts', desc: 'Find people you know', request: requestContactsPermission },
  { id: 'camera', icon: '📷', title: 'Camera', desc: 'Take photos and videos', request: requestCameraPermission },
  { id: 'microphone', icon: '🎤', title: 'Microphone', desc: 'Voice messages & calls', request: requestMicrophonePermission },
  { id: 'location', icon: '📍', title: 'Location', desc: 'Share your location', request: requestLocationPermission },
  { id: 'notifications', icon: '🔔', title: 'Notifications', desc: 'Receive new message alerts', request: requestNotificationPermission }
]

export default function PermissionSetup() {
  const [statuses, setStatuses] = useState({})
  const [requesting, setRequesting] = useState(false)
  const navigate = useNavigate()

  const handleContinue = async () => {
    setRequesting(true)

    for (const perm of PERMISSIONS) {
      try {
        const granted = await perm.request()
        setStatuses(prev => ({ ...prev, [perm.id]: granted }))
      } catch {
        setStatuses(prev => ({ ...prev, [perm.id]: false }))
      }
    }

    setRequesting(false)
    // Navigate to home regardless of permission results
    navigate('/home', { replace: true })
  }

  return (
    <div className="page page--no-nav" style={{ padding: 'var(--space-xl)' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)', marginTop: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--space-sm)' }}>
          Welcome to Convey
        </h1>
        <p className="text-secondary" style={{ fontSize: 'var(--font-size-sm)' }}>
          Convey needs some permissions for messaging features.
        </p>
      </div>

      <div style={{ marginBottom: 'var(--space-xl)' }}>
        {PERMISSIONS.map(perm => (
          <div className="permission-item" key={perm.id}>
            <div className="permission-item__icon">{perm.icon}</div>
            <div className="permission-item__info">
              <div className="permission-item__title">{perm.title}</div>
              <div className="permission-item__desc">{perm.desc}</div>
            </div>
            {statuses[perm.id] !== undefined && (
              <span style={{
                fontSize: 'var(--font-size-sm)',
                color: statuses[perm.id] ? 'var(--online)' : 'var(--text-tertiary)'
              }}>
                {statuses[perm.id] ? '✓' : '✕'}
              </span>
            )}
          </div>
        ))}
      </div>

      <button
        id="permissions-continue"
        className={`btn btn--primary btn--full ${requesting ? 'btn--disabled' : ''}`}
        onClick={handleContinue}
        disabled={requesting}
      >
        {requesting ? 'Setting up...' : 'Continue'}
      </button>
    </div>
  )
}
