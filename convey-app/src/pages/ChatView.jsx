import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { chatApi } from '../api/chatApi'
import { deriveSharedKey, encryptMessage, decryptMessage } from '../utils/crypto'
import { userApi } from '../api/userApi'
import { useMessageSubscription } from '../hooks/useWebSocket'
import ChatBubble from '../components/ChatBubble'
import MessageInput from '../components/MessageInput'
import ProfileAvatar from '../components/ProfileAvatar'

export default function ChatView() {
  const { id: conversationId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [messages, setMessages] = useState([])
  const [participant, setParticipant] = useState(null)
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    loadMessages()
  }, [conversationId])

  useMessageSubscription(user?.id, async (msg) => {
    if (msg.conversationId === conversationId) {
      // Try to decrypt if encrypted
      if (msg.type === 'TEXT' && msg.text.startsWith('{') && msg.text.includes('"c"')) {
        const myPrivateKey = localStorage.getItem('convey_private_key')
        if (myPrivateKey && participant && participant.publicKey) {
          try {
            const sharedKey = await deriveSharedKey(myPrivateKey, participant.publicKey)
            const encryptedData = JSON.parse(msg.text)
            const plaintext = await decryptMessage(sharedKey, encryptedData.c, encryptedData.iv)
            msg.text = plaintext
          } catch (e) {
            console.error('Failed to decrypt incoming message', e)
          }
        }
      }
      setMessages(prev => {
        // Prevent duplicates
        if (prev.some(m => m.id === msg.id)) return prev
        return [...prev, msg]
      })
    }
  })

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadMessages = async () => {
    try {
      const [msgsRes] = await Promise.all([
        chatApi.getMessages(conversationId)
      ])

      // Messages come newest first from API, reverse for display
      const msgs = (msgsRes.data?.content || []).reverse()
      setMessages(msgs)

      // Try to load participant info and decrypt messages
      try {
        const chatsRes = await chatApi.getMyChats()
        const thisChat = (chatsRes.data || []).find(c => c.conversation?.id === conversationId)
        let loadedParticipant = null
        if (thisChat?.participants?.[0]?.user) {
          loadedParticipant = thisChat.participants[0].user
          setParticipant(loadedParticipant)
        }

        // Decrypt messages if participant has a public key
        const myPrivateKey = localStorage.getItem('convey_private_key')
        if (myPrivateKey && loadedParticipant && loadedParticipant.publicKey) {
          try {
            const sharedKey = await deriveSharedKey(myPrivateKey, loadedParticipant.publicKey)
            const decryptedMsgs = await Promise.all(msgs.map(async (msg) => {
              if (msg.type === 'TEXT' && msg.text.startsWith('{') && msg.text.includes('"c"')) {
                try {
                  const encryptedData = JSON.parse(msg.text)
                  const plaintext = await decryptMessage(sharedKey, encryptedData.c, encryptedData.iv)
                  return { ...msg, text: plaintext }
                } catch (e) {
                  return msg
                }
              }
              return msg
            }))
            setMessages(decryptedMsgs)
            return // Skip setting unencrypted msgs if we successfully decrypted
          } catch (e) {
            console.error('Failed to decrypt messages', e)
          }
        }
      } catch {}

      setMessages(msgs)
    } catch (error) {
      console.error('Failed to load messages:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async (text) => {
    if (!text.trim()) return

    // Optimistic update
    const tempMsg = {
      id: 'temp_' + Date.now(),
      conversationId,
      senderId: user.id,
      type: 'TEXT',
      text,
      status: 'SENT',
      createdAt: new Date().toISOString()
    }
    setMessages(prev => [...prev, tempMsg])

    let textToSend = text
    const myPrivateKey = localStorage.getItem('convey_private_key')
    if (myPrivateKey && participant && participant.publicKey) {
      try {
        const sharedKey = await deriveSharedKey(myPrivateKey, participant.publicKey)
        const { ciphertext, iv } = await encryptMessage(sharedKey, text)
        textToSend = JSON.stringify({ c: ciphertext, iv })
      } catch (e) {
        console.error('Encryption failed', e)
        // Fallback to plain text if encryption fails
      }
    }

    try {
      const response = await chatApi.sendMessage({
        conversationId,
        receiverId: participant?.id || '',
        type: 'TEXT',
        text: textToSend
      })

      // We need to replace the temp message. The response.data has the encrypted text, 
      // but we should display the plain text locally.
      const savedMsg = response.data
      savedMsg.text = text
      
      setMessages(prev => prev.map(m =>
        m.id === tempMsg.id ? savedMsg : m
      ))
    } catch (error) {
      console.error('Failed to send:', error.message)
    }
  }

  return (
    <div className="page page--no-nav" style={{ display: 'flex', flexDirection: 'column', paddingBottom: 0 }}>
      {/* Chat Header */}
      <div className="top-bar">
        <button className="top-bar__back" onClick={() => navigate(-1)}>←</button>
        <ProfileAvatar
          src={participant?.profilePhotoUrl}
          name={participant?.name}
          size="sm"
          style={{ marginRight: 'var(--space-sm)' }}
        />
        <div className="top-bar__title">
          <div>{participant?.name || 'Chat'}</div>
          <div className="top-bar__subtitle">
            {participant?.online ? 'online' : participant?.lastSeen || ''}
          </div>
        </div>
        <div className="top-bar__actions">
          <button className="top-bar__action">📹</button>
          <button className="top-bar__action">📞</button>
          <button className="top-bar__action">⋮</button>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: 'var(--space-sm) 0',
        background: 'var(--bg-deep)'
      }}>
        {loading ? (
          <div className="empty-state">
            <div className="splash__spinner" />
          </div>
        ) : messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">👋</div>
            <div className="empty-state__title">Say hello!</div>
            <div className="empty-state__desc">Start a conversation</div>
          </div>
        ) : (
          messages.map(msg => (
            <ChatBubble
              key={msg.id}
              message={msg}
              isOwn={msg.senderId === user.id}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput onSend={handleSend} />
    </div>
  )
}
