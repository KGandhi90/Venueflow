import { NavLink } from 'react-router-dom'
import { House, Map, ShoppingBag, MessageCircle, QrCode } from 'lucide-react'

const navItems = [
  { to: '/',          icon: House,          label: 'Home'   },
  { to: '/map',       icon: Map,            label: 'Map'    },
  { to: '/orders',    icon: ShoppingBag,    label: 'Orders' },
  { to: '/chat',      icon: MessageCircle,  label: 'Chat'   },
  { to: '/entry',     icon: QrCode,         label: 'Entry'  },
]

export default function BottomNav() {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 200,
      }}
    >
      <nav
        style={{
          background: 'rgba(17,17,24,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 9999,
          padding: '10px 24px',
          display: 'flex',
          gap: 32,
          alignItems: 'center',
        }}
      >
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={{ textDecoration: 'none' }}
          >
            {({ isActive }) => (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                }}
                aria-label={label}
              >
                <Icon
                  size={20}
                  strokeWidth={1.5}
                  color={isActive ? '#F0F0F0' : '#6B6B7A'}
                />
                {isActive && (
                  <span
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      background: '#C8F135',
                    }}
                  />
                )}
              </div>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
