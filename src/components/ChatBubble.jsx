export default function ChatBubble({ role, message, time }) {
  const isUser = role === 'user'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        gap: 8,
      }}
    >
      {/* AI avatar */}
      {!isUser && (
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
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: isUser ? '75%' : '80%' }}>
        <div
          style={{
            background: isUser ? '#C8F135' : '#1A1A24',
            color: isUser ? '#0A0A0F' : '#F0F0F0',
            borderRadius: isUser
              ? '16px 16px 4px 16px'
              : '16px 16px 16px 4px',
            padding: '10px 16px',
            fontSize: 13,
            lineHeight: 1.55,
            fontWeight: isUser ? 500 : 400,
          }}
        >
          {message}
        </div>
        <span
          style={{
            fontSize: 10,
            color: '#6B6B7A',
            textAlign: isUser ? 'right' : 'left',
          }}
        >
          {time}
        </span>
      </div>
    </div>
  )
}
