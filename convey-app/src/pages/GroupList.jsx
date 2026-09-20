import { useState, useEffect } from 'react'
import { groupApi } from '../api/groupApi'
import { useNavigate } from 'react-router-dom'
import ProfileAvatar from '../components/ProfileAvatar'

export default function GroupList() {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadGroups()
  }, [])

  const loadGroups = async () => {
    try {
      const response = await groupApi.getMyGroups()
      setGroups(response.data || [])
    } catch (error) {
      console.log('Failed to load groups:', error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="empty-state">
        <div className="splash__spinner" />
      </div>
    )
  }

  if (groups.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon">👥</div>
        <div className="empty-state__title">No groups yet</div>
        <div className="empty-state__desc">
          Create a group to chat with multiple people at once
        </div>
        <button
          className="btn btn--primary mt-lg"
          onClick={() => navigate('/group/create')}
        >
          Create Group
        </button>
      </div>
    )
  }

  return (
    <div>
      {groups.map(group => (
        <div key={group.id} className="chat-item" onClick={() => navigate(`/chat/${group.id}`)}>
          <ProfileAvatar src={group.groupPhotoUrl} name={group.name} />
          <div className="chat-item__content">
            <div className="chat-item__header">
              <span className="chat-item__name">{group.name}</span>
            </div>
            <div className="chat-item__message">
              {group.description || 'Group chat'}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
