import ProfileAvatar from './ProfileAvatar'

export default function ChatListItem({ chat, onClick }) {
  const { conversation, participants } = chat
  const otherUser = participants?.[0]?.user
  const isGroup = conversation?.type === 'GROUP'
  const name = isGroup ? conversation.name : otherUser?.name || 'Unknown'
  const photoUrl = isGroup ? conversation.groupPhotoUrl : otherUser?.profilePhotoUrl

  const formatTime = (isoString) => {
    if (!isoString) return ''
    const date = new Date(isoString)
    const today = new Date()
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    return date.toLocaleDateString()
  }

  return (
    <div className="chat-item" onClick={onClick}>
      <ProfileAvatar src={photoUrl} name={name} />
      <div className="chat-item__content">
        <div className="chat-item__header">
          <span className="chat-item__name">{name}</span>
          <span className="chat-item__time">{formatTime(conversation?.lastMessageAt)}</span>
        </div>
        <div className="chat-item__message">
          {/* Mock ticks for latest message */}
          <span className="chat-item__ticks">✓✓</span>
          <span style={{ marginLeft: 4 }}>{conversation?.lastMessage || '...'}</span>
        </div>
      </div>
    </div>
  )
}
