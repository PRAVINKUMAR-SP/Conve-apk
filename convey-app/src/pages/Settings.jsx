import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import ProfileAvatar from '../components/ProfileAvatar'

const SETTINGS_ITEMS = [
  { icon: '🔑', title: 'Privacy', desc: 'Last seen, profile photo, about' },
  { icon: '🔒', title: 'Security', desc: 'End-to-end encryption' },
  { icon: '🔔', title: 'Notifications', desc: 'Message, group & call tones' },
  { icon: '💬', title: 'Chats', desc: 'Theme, wallpaper, chat history' },
  { icon: '📊', title: 'Data & Storage', desc: 'Network usage, auto-download' },
  { icon: '💻', title: 'Linked Devices', desc: 'Manage your devices' },
  { icon: '❓', title: 'Help', desc: 'FAQ, contact us, privacy policy' },
  { icon: 'ℹ️', title: 'About Convey', desc: 'Version 1.0.0' }
]

export default function Settings() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout()
      navigate('/create-profile', { replace: true })
    }
  }

  return (
    <div className="page page--no-nav">
      <div className="top-bar">
        <button className="top-bar__back" onClick={() => navigate(-1)}>←</button>
        <div className="top-bar__title">Settings</div>
      </div>

      {/* Profile Section */}
      <div className="chat-item" style={{ padding: 'var(--space-lg)' }}>
        <ProfileAvatar
          src={user?.profilePhotoUrl}
          name={user?.name}
          size="lg"
        />
        <div className="chat-item__content" style={{ borderBottom: 'none' }}>
          <div className="chat-item__name" style={{ fontSize: 'var(--font-size-lg)' }}>
            {user?.name || 'User'}
          </div>
          <div className="chat-item__message">
            {user?.phoneNumber || ''}
          </div>
        </div>
      </div>

      <div style={{ height: 1, background: 'var(--border)', margin: '0 var(--space-md)' }} />

      {/* Settings Items */}
      {SETTINGS_ITEMS.map((item, i) => (
        <div key={i} className="settings-item">
          <div className="settings-item__icon">{item.icon}</div>
          <div className="settings-item__info">
            <div className="settings-item__title">{item.title}</div>
            <div className="settings-item__desc">{item.desc}</div>
          </div>
        </div>
      ))}

      <div style={{ height: 1, background: 'var(--border)', margin: '0 var(--space-md)' }} />

      {/* Logout */}
      <div className="settings-item settings-item--danger" onClick={handleLogout}>
        <div className="settings-item__icon" style={{ background: 'rgba(234, 67, 53, 0.1)' }}>🚪</div>
        <div className="settings-item__info">
          <div className="settings-item__title">Logout</div>
          <div className="settings-item__desc">Sign out of Convey</div>
        </div>
      </div>

      <div style={{ height: 'var(--space-2xl)' }} />
    </div>
  )
}
