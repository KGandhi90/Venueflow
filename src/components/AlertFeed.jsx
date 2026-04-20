import { useVenue } from '../context/VenueContext'

const typeColors = {
  congestion: '#FF4D6D',
  stock:      '#FFB547',
  broadcast:  '#7C6AFA',
}

export default function AlertFeed() {
  const { alerts, toggleAlertResolved } = useVenue()
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: '#1C1C27' }}>
          Live Alerts
        </h3>
        {unread > 0 && (
          <span style={{ background: '#FF4D6D', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 9999 }}>
            {unread} new
          </span>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {alerts.map(alert => (
          <div
            key={alert.id}
            style={{ display: 'flex', alignItems: 'flex-start', gap: 12, opacity: alert.resolved ? 0.6 : 1 }}
          >
            <span
              style={{
                width: 8, height: 8, borderRadius: '50%',
                background: alert.resolved ? '#00D68F' : typeColors[alert.type] || '#6B6B7A',
                marginTop: 5, flexShrink: 0,
              }}
            />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#1C1C27', textDecoration: alert.resolved ? 'line-through' : 'none', marginBottom: 2 }}>
                {alert.zone}
              </p>
              <p style={{ fontSize: 12, color: '#6B6B7A', textDecoration: alert.resolved ? 'line-through' : 'none', lineHeight: 1.45 }}>
                {alert.msg}
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
              <span style={{ fontSize: 11, color: '#9E9E9E', whiteSpace: 'nowrap', marginTop: 2 }}>
                {alert.time}'
              </span>
              {!alert.resolved && (
                <button
                  onClick={() => toggleAlertResolved(alert.id)}
                  style={{
                    fontSize: 10, color: '#00D68F',
                    background: 'rgba(0,214,143,0.08)',
                    border: '1px solid rgba(0,214,143,0.2)',
                    borderRadius: 6, padding: '3px 8px', cursor: 'pointer',
                  }}
                >
                  Resolve
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
