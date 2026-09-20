import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { chatApi } from '../api/chatApi'
import BottomNav from '../components/BottomNav'
import TopBar from '../components/TopBar'
import SearchBar from '../components/SearchBar'
import ChatListItem from '../components/ChatListItem'
import FloatingActionButton from '../components/FloatingActionButton'
import StatusPage from './StatusPage'
import CallsPage from './CallsPage'
import GroupList from './GroupList'

const TABS = ['Chats', 'Groups', 'Status', 'Calls']

export default function Home() {
  const [activeTab, setActiveTab] = useState('Chats')
  const [chats, setChats] = useState([])
  const [search, setSearch] = useState('')
  const [showMenu, setShowMenu] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    loadChats()
  }, [])

  const loadChats = async () => {
    try {
      const response = await chatApi.getMyChats()
      setChats(response.data || [])
    } catch (error) {
      console.log('Failed to load chats:', error.message)
      // Show empty state — chats will populate as conversations are created
    }
  }

  const filteredChats = chats.filter(chat => {
    if (!search) return true
    const participant = chat.participants?.[0]?.user
    return participant?.name?.toLowerCase().includes(search.toLowerCase())
  })

  const menuItems = [
    { icon: '👥', label: 'New group', action: () => navigate('/group/create') },
    { icon: '👤', label: 'New contact', action: () => navigate('/contacts') },
    { icon: '⭐', label: 'Starred', action: () => {} },
    { icon: '💻', label: 'Linked devices', action: () => {} },
    { icon: '⚙️', label: 'Settings', action: () => navigate('/settings') }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'Chats':
        return (
          <>
            <SearchBar value={search} onChange={setSearch} placeholder="Search" />
            <div className="tab-bar">
              {['All', 'Unread', 'Favourites', 'Groups'].map(tab => (
                <button key={tab} className={`tab-bar__item ${tab === 'All' ? 'tab-bar__item--active' : ''}`}>
                  {tab}
                </button>
              ))}
            </div>
            {filteredChats.length > 0 ? (
              <div>
                {filteredChats.map((chat, i) => (
                  <ChatListItem
                    key={chat.conversation?.id || i}
                    chat={chat}
                    onClick={() => navigate(`/chat/${chat.conversation?.id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state__icon">💬</div>
                <div className="empty-state__title">No conversations yet</div>
                <div className="empty-state__desc">
                  Tap the + button to start a new conversation
                </div>
              </div>
            )}
            <FloatingActionButton onClick={() => navigate('/contacts')} />
          </>
        )
      case 'Groups':
        return <GroupList />
      case 'Status':
        return <StatusPage />
      case 'Calls':
        return <CallsPage />
      default:
        return null
    }
  }

  return (
    <div className="page">
      <TopBar
        title="Convey"
        onMenuClick={() => setShowMenu(!showMenu)}
        showMenu
      />

      {renderContent()}

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Three-dot menu */}
      {showMenu && (
        <>
          <div className="menu-overlay" onClick={() => setShowMenu(false)} />
          <div className="menu">
            {menuItems.map((item, i) => (
              <div key={i} className="menu__item" onClick={() => { item.action(); setShowMenu(false) }}>
                <span className="menu__item__icon">{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
