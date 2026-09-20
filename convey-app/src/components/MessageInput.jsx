import { useState } from 'react'

export default function MessageInput({ onSend }) {
  const [text, setText] = useState('')

  const handleSend = () => {
    if (text.trim()) {
      onSend(text)
      setText('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="message-input">
      <div className="message-input__field-wrapper">
        <button className="message-input__emoji">😊</button>
        <textarea
          className="message-input__field"
          placeholder="Message"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <button className="message-input__attach">📎</button>
      </div>
      <button className="message-input__send" onClick={handleSend}>
        {text.trim() ? '➤' : '🎤'}
      </button>
    </div>
  )
}
