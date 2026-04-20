import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import ChatBubble from '../components/ChatBubble'

const QUICK_REPLIES = [
  'Nearest restroom',
  'Halftime time?',
  'I lost my bag',
  'Wheelchair access',
  'First aid',
]

const MOCK_AI_RESPONSE =
  "I'm checking that for you! Meanwhile, the nearest option based on your current location is just a short walk away. Is there anything else I can help you with? 🙂"

const initialMessages = [
  {
    id: 1,
    role: 'user',
    message: 'Where\'s the nearest restroom?',
    time: '67:01',
  },
  {
    id: 2,
    role: 'ai',
    message:
      'The closest restroom to your seat (F12-34) is Block R1 near Gate A — currently just a 2 min wait. Block R11 on the upper tier is also free if you prefer less walking from Gate D.',
    time: '67:02',
  },
]

export default function Chat() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = (text = input) => {
    const msg = text.trim()
    if (!msg) return
    setInput('')

    const userMsg = {
      id: Date.now(),
      role: 'user',
      message: msg,
      time: '67:' + String(Math.floor(Math.random() * 59)).padStart(2, '0'),
    }
    setMessages(prev => [...prev, userMsg])
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'ai',
          message: MOCK_AI_RESPONSE,
          time: '67:' + String(Math.floor(Math.random() * 59)).padStart(2, '0'),
        },
      ])
    }, 1800)
  }

  return (
    <div
      className="page-enter"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 52px)',
        overflow: 'hidden',
      }}
    >
      {/* Chat header */}
      <div
        style={{
          padding: '14px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #7C6AFA, #C8F135)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 700,
            color: '#fff',
          }}
        >
          VF
        </div>
        <div>
          <p style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 600, color: '#F0F0F0' }}>
            VenueFlow AI
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00D68F' }} />
            <span style={{ fontSize: 11, color: '#00D68F' }}>Online</span>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
        className="no-scrollbar"
      >
        {messages.map(m => (
          <ChatBubble key={m.id} role={m.role} message={m.message} time={m.time} />
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: '#7C6AFA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                fontWeight: 700,
                color: '#fff',
                flexShrink: 0,
              }}
            >
              VF
            </div>
            <div
              style={{
                background: '#1A1A24',
                borderRadius: '16px 16px 16px 4px',
                padding: '12px 16px',
                display: 'flex',
                gap: 5,
                alignItems: 'center',
              }}
            >
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#6B6B7A',
                    animation: `pulse-lime 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick reply chips */}
      <div
        className="no-scrollbar"
        style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          padding: '8px 20px',
          flexShrink: 0,
        }}
      >
        {QUICK_REPLIES.map(r => (
          <button
            key={r}
            onClick={() => sendMessage(r)}
            style={{
              background: '#1A1A24',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 9999,
              padding: '7px 14px',
              fontSize: 12,
              color: '#D0D0D0',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'background 0.15s ease',
            }}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div
        style={{
          padding: '10px 20px 100px',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 10,
            background: '#1A1A24',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            padding: '6px 6px 6px 16px',
            alignItems: 'center',
          }}
        >
          <input
            id="chat-input"
            type="text"
            placeholder="Ask anything about the venue..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#F0F0F0',
              fontSize: 14,
            }}
          />
          <button
            id="chat-send-btn"
            onClick={() => sendMessage()}
            style={{
              background: '#C8F135',
              border: 'none',
              borderRadius: 9999,
              width: 38,
              height: 38,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'transform 0.12s ease',
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.9)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Send size={16} color="#0A0A0F" />
          </button>
        </div>
      </div>
    </div>
  )
}
