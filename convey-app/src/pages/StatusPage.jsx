import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { statusApi } from '../api/statusApi'
import StatusItem from '../components/StatusItem'

export default function StatusPage() {
  const { user } = useAuth()
  const [myStatuses, setMyStatuses] = useState([])
  const [contactStatuses, setContactStatuses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStatuses()
  }, [])

  const loadStatuses = async () => {
    try {
      const [mine] = await Promise.all([
        statusApi.getMyStatuses()
      ])
      setMyStatuses(mine.data || [])
    } catch (error) {
      console.log('Failed to load statuses:', error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* My Status */}
      <div className="status-item" onClick={() => {}}>
        <div className="avatar avatar--lg" style={{ position: 'relative' }}>
          {user?.profilePhotoUrl ? (
            <img src={user.profilePhotoUrl} alt="My status" />
          ) : (
            <span>👤</span>
          )}
          <div style={{
            position: 'absolute', bottom: 0, right: 0,
            width: 22, height: 22,
            background: 'var(--primary)',
            borderRadius: 'var(--radius-full)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.75rem', color: 'var(--primary-text)',
            border: '2px solid var(--bg-primary)'
          }}>+</div>
        </div>
        <div className="status-item__info">
          <div className="status-item__name">My Status</div>
          <div className="status-item__time">
            {myStatuses.length > 0 ? 'Tap to view' : 'Tap to add status update'}
          </div>
        </div>
      </div>

      {/* Recent Updates */}
      {contactStatuses.length > 0 && (
        <>
          <div className="section-header">Recent updates</div>
          {contactStatuses.map(status => (
            <StatusItem key={status.id} status={status} />
          ))}
        </>
      )}

      {contactStatuses.length === 0 && (
        <div className="empty-state" style={{ paddingTop: 'var(--space-2xl)' }}>
          <div className="empty-state__icon">🟢</div>
          <div className="empty-state__title">No status updates</div>
          <div className="empty-state__desc">
            Status updates from your contacts will appear here
          </div>
        </div>
      )}
    </div>
  )
}
