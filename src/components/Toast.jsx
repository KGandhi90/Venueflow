import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react'

const TYPE_CONFIG = {
  success: { color: '#00D68F', bg: 'rgba(0,214,143,0.3)',  Icon: CheckCircle },
  error:   { color: '#FF4D6D', bg: 'rgba(255,77,109,0.3)', Icon: XCircle },
  info:    { color: '#7C6AFA', bg: 'rgba(124,106,250,0.3)', Icon: Info },
  warning: { color: '#FFB547', bg: 'rgba(255,181,71,0.3)',  Icon: AlertTriangle },
}

export default function Toast({ toasts, removeToast }) {
  if (toasts.length === 0) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 90,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      {toasts.map(toast => {
        const config = TYPE_CONFIG[toast.type] || TYPE_CONFIG.info
        const Icon = toast.icon || config.Icon
        return (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className="animate-slideUp"
            style={{
              background: '#1A1A24',
              border: `1px solid ${config.bg}`,
              borderRadius: 16,
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              backdropFilter: 'blur(12px)',
              pointerEvents: 'auto',
              cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}
          >
            <Icon size={18} color={config.color} />
            <span style={{ fontSize: 13, color: '#fff', fontWeight: 500, whiteSpace: 'nowrap' }}>
              {toast.message}
            </span>
          </div>
        )
      })}
    </div>
  )
}
