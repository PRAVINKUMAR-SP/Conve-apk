import { useState, useEffect } from 'react'
import { callApi } from '../api/callApi'
import ProfileAvatar from '../components/ProfileAvatar'

export default function CallsPage() {
  const [calls, setCalls] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCalls()
  }, [])

  const loadCalls = async () => {
    try {
      const response = await callApi.getCallHistory()
      setCalls(response.data || [])
    } catch (error) {
      console.log('Failed to load calls:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const formatCallTime = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const today = new Date()
    if (date.toDateString() === today.toDateString()) {
      return `Today ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    }
    return date.toLocaleDateString()
  }

  if (loading) {
    return <div className="empty-state"><div className="splash__spinner" /></div>
  }

  if (calls.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon">📞</div>
        <div className="empty-state__title">No calls yet</div>
        <div className="empty-state__desc">
          Your call history will appear here
        </div>
      </div>
    )
  }

  return (
    <div>
      {calls.map(call => (
        <div key={call.id} className="chat-item">
          <ProfileAvatar name={call.receiverId} />
          <div className="chat-item__content">
            <div className="chat-item__header">
              <span className="chat-item__name">
                {call.type === 'VIDEO' ? '📹' : '📞'} {call.receiverId}
              </span>
              <span className="chat-item__time">{formatCallTime(call.createdAt)}</span>
            </div>
            <div className="chat-item__message">
              <span style={{
                color: call.status === 'MISSED' ? 'var(--accent-red)' : 'var(--text-secondary)'
              }}>
                {call.status === 'MISSED' ? '↙ Missed' :
                 call.status === 'ENDED' ? `↗ Outgoing · ${call.durationSeconds || 0}s` :
                 call.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
