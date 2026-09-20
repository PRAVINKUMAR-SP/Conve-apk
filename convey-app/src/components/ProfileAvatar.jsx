export default function ProfileAvatar({ src, name, size = 'md', online = false, style }) {
  const getInitial = () => {
    if (!name) return '👤'
    return name.charAt(0).toUpperCase()
  }

  return (
    <div className={`avatar avatar--${size}`} style={style}>
      {src ? (
        <img src={src} alt={name || 'Profile'} />
      ) : (
        <span>{getInitial()}</span>
      )}
      {online && <div className="avatar__online-dot" />}
    </div>
  )
}
