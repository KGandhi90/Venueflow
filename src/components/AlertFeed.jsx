import { alerts } from '../data/mockData'

const typeColors = {
  congestion: '#FF4D6D',
  stock:      '#FFB547',
}

export default function AlertFeed() {
  const unread = alerts.filter(a => !a.resolved).length

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #E5E5E0',
        borderRadius: 16,
        padding: 20,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <h3
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 16,
            fontWeight: 700,
            color: '#1C1C27',
          }}
        >
          Live Alerts
        </h3>
        {unread > 0 && (
          <span
            style={{
              background: '#FF4D6D',
              color: '#fff',
              fontSize: 11,
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 9999,
            }}
          >
            {unread} new
          </span>
        )}
      </div>

      {/* Alert list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {alerts.map(alert => (
          <div
            key={alert.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              opacity: alert.resolved ? 0.6 : 1,
            }}
          >
            {/* Colored dot */}
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: alert.resolved
                  ? '#00D68F'
                  : typeColors[alert.type] || '#6B6B7A',
                marginTop: 5,
                flexShrink: 0,
              }}
            />

            {/* Content */}
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#1C1C27',
                  textDecoration: alert.resolved ? 'line-through' : 'none',
                  marginBottom: 2,
                }}
              >
                {alert.zone}
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: '#6B6B7A',
                  textDecoration: alert.resolved ? 'line-through' : 'none',
                  lineHeight: 1.45,
                }}
              >
                {alert.msg}
              </p>
            </div>

            {/* Timestamp */}
            <span style={{ fontSize: 11, color: '#9E9E9E', whiteSpace: 'nowrap', marginTop: 2 }}>
              {alert.time}'
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
