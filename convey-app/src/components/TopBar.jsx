export default function TopBar({ title, subtitle, onBackClick, onMenuClick, showMenu }) {
  return (
    <div className="top-bar">
      {onBackClick && (
        <button className="top-bar__back" onClick={onBackClick}>←</button>
      )}
      <div className="top-bar__title">
        <div>{title}</div>
        {subtitle && <div className="top-bar__subtitle">{subtitle}</div>}
      </div>
      <div className="top-bar__actions">
        <button className="top-bar__action">📷</button>
        <button className="top-bar__action">🔍</button>
        {showMenu && (
          <button className="top-bar__action" onClick={onMenuClick}>⋮</button>
        )}
      </div>
    </div>
  )
}
