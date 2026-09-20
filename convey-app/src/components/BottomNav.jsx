import { useState } from 'react'

export default function BottomNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'Chats', icon: '💬', badge: 3 },
    { id: 'Groups', icon: '👥' },
    { id: 'Status', icon: '🟢', badge: 1 },
    { id: 'Calls', icon: '📞' }
  ]

  return (
    <div className="bottom-nav">
      {tabs.map(tab => (
        <div
          key={tab.id}
          className={`bottom-nav__item ${activeTab === tab.id ? 'bottom-nav__item--active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <div className="bottom-nav__icon">{tab.icon}</div>
          <div className="bottom-nav__label">{tab.id}</div>
          {tab.badge && <div className="bottom-nav__badge">{tab.badge}</div>}
        </div>
      ))}
    </div>
  )
}
