import ProfileAvatar from './ProfileAvatar'

export default function StatusItem({ status, viewed = false }) {
  const formatTime = (isoString) => {
    if (!isoString) return ''
    const date = new Date(isoString)
    const today = new Date()
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    }
    return date.toLocaleDateString()
  }

  return (
    <div className="status-item">
      <div className={`status-item__ring ${viewed ? 'status-item__ring--viewed' : ''}`}>
        <div className="status-item__ring-inner">
          <ProfileAvatar src={status.user?.profilePhotoUrl} name={status.user?.name} />
        </div>
      </div>
      <div className="status-item__info">
        <div className="status-item__name">{status.user?.name || 'Contact'}</div>
        <div className="status-item__time">{formatTime(status.createdAt)}</div>
      </div>
    </div>
  )
}
