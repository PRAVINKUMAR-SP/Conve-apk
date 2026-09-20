export default function ChatBubble({ message, isOwn }) {
  const formatTime = (isoString) => {
    if (!isoString) return ''
    const date = new Date(isoString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const renderStatus = () => {
    if (!isOwn) return null
    switch (message.status) {
      case 'SENT': return '✓'
      case 'DELIVERED': return '✓✓'
      case 'READ': return <span className="bubble__status--read">✓✓</span>
      default: return '·'
    }
  }

  return (
    <div className={`bubble-wrapper ${isOwn ? 'bubble-wrapper--outgoing' : 'bubble-wrapper--incoming'}`}>
      <div className={`bubble ${isOwn ? 'bubble--outgoing' : 'bubble--incoming'}`}>
        {message.type === 'IMAGE' && message.mediaUrl && (
          <img
            src={message.mediaUrl}
            alt="Image message"
            style={{ borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-xs)', maxWidth: '100%' }}
          />
        )}
        <div className="bubble__text">{message.text}</div>
        <div className="bubble__meta">
          <span className="bubble__time">{formatTime(message.createdAt)}</span>
          <span className="bubble__status">{renderStatus()}</span>
        </div>
      </div>
    </div>
  )
}
