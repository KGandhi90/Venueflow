export default function EmptyState({ icon: Icon, title, subtitle, action, onAction }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 40, textAlign: 'center' }}>
      <Icon size={40} color="#6B6B7A" style={{ opacity: 0.4 }} />
      <h3 style={{ fontSize: 15, color: '#F0F0F0', fontWeight: 500, marginTop: 16 }}>{title}</h3>
      <p style={{ fontSize: 13, color: '#6B6B7A', marginTop: 4, maxWidth: 240 }}>{subtitle}</p>
      {action && (
        <button
          onClick={onAction}
          style={{
            marginTop: 20,
            background: '#C8F135',
            color: '#0A0A0F',
            border: 'none',
            borderRadius: 9999,
            padding: '10px 20px',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          {action}
        </button>
      )}
    </div>
  )
}
