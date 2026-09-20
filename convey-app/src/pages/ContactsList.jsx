import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContacts } from '../hooks/useContacts'
import { contactApi } from '../api/contactApi'
import { normalizePhoneNumber } from '../utils/phoneUtils'
import SearchBar from '../components/SearchBar'
import ContactItem from '../components/ContactItem'

export default function ContactsList() {
  const navigate = useNavigate()
  const { contacts, fetchContacts } = useContacts()
  const [registeredContacts, setRegisteredContacts] = useState([])
  const [otherContacts, setOtherContacts] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadContacts()
  }, [])

  const loadContacts = async () => {
    setLoading(true)
    try {
      // Get device contacts
      const deviceContacts = await fetchContacts()

      // Extract all phone numbers
      const allNumbers = deviceContacts.flatMap(c =>
        c.phoneNumbers.map(p => normalizePhoneNumber(p))
      )

      if (allNumbers.length === 0) {
        setLoading(false)
        return
      }

      // Check which are registered on Convey
      const response = await contactApi.checkContacts(allNumbers)
      const checkResults = response.data || []

      // Build lookup map
      const registeredMap = new Map()
      checkResults.forEach(r => {
        if (r.registered) {
          registeredMap.set(r.phoneNumber, r)
        }
      })

      // Split contacts into registered and other
      const registered = []
      const other = []

      deviceContacts.forEach(contact => {
        const normalizedNumbers = contact.phoneNumbers.map(p => normalizePhoneNumber(p))
        const matchedNumber = normalizedNumbers.find(n => registeredMap.has(n))

        if (matchedNumber) {
          const serverData = registeredMap.get(matchedNumber)
          registered.push({
            ...contact,
            userId: serverData.userId,
            serverName: serverData.name,
            profilePhotoUrl: serverData.profilePhotoUrl,
            about: serverData.about,
            registered: true,
            phoneNumber: matchedNumber
          })
        } else {
          other.push({
            ...contact,
            registered: false,
            phoneNumber: normalizedNumbers[0]
          })
        }
      })

      setRegisteredContacts(registered)
      setOtherContacts(other)
    } catch (error) {
      console.error('Failed to load contacts:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInvite = (contact) => {
    const message = `Hi ${contact.name} 👋\n\nI'm using Convey for messaging.\nJoin me on Convey!`
    // Open SMS composer
    window.open(`sms:${contact.phoneNumber}?body=${encodeURIComponent(message)}`)
  }

  const handleMessage = (contact) => {
    // Navigate to chat — the chat service will create/find the conversation
    navigate(`/chat/${contact.userId}`)
  }

  const filterContacts = (list) =>
    list.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="page page--no-nav">
      <div className="top-bar">
        <button className="top-bar__back" onClick={() => navigate(-1)}>←</button>
        <div className="top-bar__title">Contacts</div>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search contacts" />

      {/* Quick actions */}
      <div className="contact-item" onClick={() => navigate('/group/create')}>
        <div className="avatar avatar--sm" style={{ background: 'var(--primary)', color: 'var(--primary-text)' }}>👥</div>
        <div className="contact-item__info">
          <div className="contact-item__name">New group</div>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">
          <div className="splash__spinner" />
        </div>
      ) : (
        <>
          {/* Registered Contacts */}
          {filterContacts(registeredContacts).length > 0 && (
            <>
              <div className="section-header">Contacts on Convey</div>
              {filterContacts(registeredContacts).map((contact, i) => (
                <ContactItem
                  key={i}
                  contact={contact}
                  registered
                  onAction={() => handleMessage(contact)}
                />
              ))}
            </>
          )}

          {/* Other Contacts */}
          {filterContacts(otherContacts).length > 0 && (
            <>
              <div className="section-header">Other Contacts</div>
              {filterContacts(otherContacts).map((contact, i) => (
                <ContactItem
                  key={i}
                  contact={contact}
                  registered={false}
                  onAction={() => handleInvite(contact)}
                />
              ))}
            </>
          )}

          {filteredContacts(registeredContacts).length === 0 && filterContacts(otherContacts).length === 0 && (
            <div className="empty-state">
              <div className="empty-state__icon">👥</div>
              <div className="empty-state__title">No contacts found</div>
              <div className="empty-state__desc">
                Grant contacts permission to find people you know
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
