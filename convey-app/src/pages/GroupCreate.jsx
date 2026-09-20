import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContacts } from '../hooks/useContacts'
import { contactApi } from '../api/contactApi'
import { groupApi } from '../api/groupApi'
import { normalizePhoneNumber } from '../utils/phoneUtils'
import ProfileAvatar from '../components/ProfileAvatar'

export default function GroupCreate() {
  const navigate = useNavigate()
  const { fetchContacts } = useContacts()

  const [step, setStep] = useState('select') // 'select' or 'details'
  const [contacts, setContacts] = useState([])
  const [selected, setSelected] = useState(new Set())
  const [groupName, setGroupName] = useState('')
  const [groupDesc, setGroupDesc] = useState('')
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    loadRegisteredContacts()
  }, [])

  const loadRegisteredContacts = async () => {
    try {
      const deviceContacts = await fetchContacts()
      const allNumbers = deviceContacts.flatMap(c =>
        c.phoneNumbers.map(p => normalizePhoneNumber(p))
      )

      const response = await contactApi.checkContacts(allNumbers)
      const registered = (response.data || []).filter(c => c.registered)
      setContacts(registered)
    } catch (error) {
      console.error('Failed to load contacts:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleContact = (userId) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(userId)) next.delete(userId)
      else next.add(userId)
      return next
    })
  }

  const handleCreate = async () => {
    if (!groupName.trim() || selected.size === 0) return

    setCreating(true)
    try {
      await groupApi.createGroup({
        name: groupName.trim(),
        description: groupDesc.trim(),
        memberIds: Array.from(selected)
      })
      navigate('/home', { replace: true })
    } catch (error) {
      console.error('Failed to create group:', error.message)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="page page--no-nav">
      <div className="top-bar">
        <button className="top-bar__back" onClick={() =>
          step === 'details' ? setStep('select') : navigate(-1)
        }>←</button>
        <div className="top-bar__title">
          {step === 'select' ? 'Select Members' : 'New Group'}
        </div>
      </div>

      {step === 'select' ? (
        <>
          {loading ? (
            <div className="empty-state"><div className="splash__spinner" /></div>
          ) : (
            <div>
              <p className="section-header">
                Select contacts ({selected.size} selected)
              </p>
              {contacts.map(contact => (
                <div
                  key={contact.userId}
                  className="contact-item"
                  onClick={() => toggleContact(contact.userId)}
                >
                  <ProfileAvatar src={contact.profilePhotoUrl} name={contact.name} />
                  <div className="contact-item__info">
                    <div className="contact-item__name">{contact.name}</div>
                    <div className="contact-item__status">{contact.about || contact.phoneNumber}</div>
                  </div>
                  <span style={{
                    width: 24, height: 24,
                    borderRadius: 'var(--radius-full)',
                    border: `2px solid ${selected.has(contact.userId) ? 'var(--primary)' : 'var(--text-tertiary)'}`,
                    background: selected.has(contact.userId) ? 'var(--primary)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', color: 'var(--primary-text)'
                  }}>
                    {selected.has(contact.userId) && '✓'}
                  </span>
                </div>
              ))}

              {selected.size > 0 && (
                <div style={{ padding: 'var(--space-md)' }}>
                  <button className="btn btn--primary btn--full" onClick={() => setStep('details')}>
                    Next ({selected.size})
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div style={{ padding: 'var(--space-xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-xl)' }}>
            <div className="avatar avatar--xl" style={{ background: 'var(--primary)', color: 'var(--primary-text)' }}>👥</div>
          </div>

          <div className="form-group">
            <label className="form-label">Group name</label>
            <input
              className="form-input"
              placeholder="Enter group name"
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              maxLength={50}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description (optional)</label>
            <input
              className="form-input"
              placeholder="What is this group about?"
              value={groupDesc}
              onChange={e => setGroupDesc(e.target.value)}
              maxLength={100}
            />
          </div>

          <button
            className={`btn btn--primary btn--full ${creating ? 'btn--disabled' : ''}`}
            onClick={handleCreate}
            disabled={creating || !groupName.trim()}
          >
            {creating ? 'Creating...' : 'Create Group'}
          </button>
        </div>
      )}
    </div>
  )
}
