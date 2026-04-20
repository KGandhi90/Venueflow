import { useState } from 'react'
import { LayoutDashboard, Map, ShoppingBag, Users, AlertTriangle, MessageSquareMore } from 'lucide-react'
import { dashStats, match } from '../data/mockData'
import StatCard from '../components/StatCard'
import AlertFeed from '../components/AlertFeed'
import OrderTable from '../components/OrderTable'

const navItems = [
  { id: 'overview', label: 'Overview',   icon: LayoutDashboard },
  { id: 'crowd',    label: 'Crowd Map',  icon: Map             },
  { id: 'orders',   label: 'Orders',     icon: ShoppingBag     },
  { id: 'staff',    label: 'Staff',      icon: Users           },
  { id: 'alerts',   label: 'Alerts',     icon: AlertTriangle   },
]

const capacityPct = Math.round((dashStats.checkedIn / dashStats.capacity) * 100)

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState('overview')

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#F4F3EF',
      }}
    >
      {/* SIDEBAR */}
      <aside
        style={{
          width: 240,
          background: '#1C1C27',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        {/* Logo */}
        <div style={{ padding: '24px 20px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span
              style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: 20,
                fontWeight: 700,
                color: '#F0F0F0',
              }}
            >
              VenueFlow
            </span>
            <span
              style={{
                background: '#C8F135',
                color: '#0A0A0F',
                fontSize: 9,
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: 4,
                letterSpacing: '0.06em',
              }}
            >
              OPS
            </span>
          </div>
          <p style={{ fontSize: 11, color: '#6B6B7A', lineHeight: 1.4 }}>
            {match.home} vs {match.away} · LIVE {match.minute}'
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 20px' }} />

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {navItems.map(({ id, label, icon: Icon }) => {
            const isActive = activeNav === id
            return (
              <button
                key={id}
                id={`dash-nav-${id}`}
                onClick={() => setActiveNav(id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 10,
                  background: isActive ? 'rgba(200,241,53,0.08)' : 'transparent',
                  border: 'none',
                  borderLeft: isActive ? '2px solid #C8F135' : '2px solid transparent',
                  cursor: 'pointer',
                  color: isActive ? '#F0F0F0' : '#6B6B7A',
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                  textAlign: 'left',
                  marginBottom: 2,
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={16} strokeWidth={isActive ? 2 : 1.5} />
                {label}
              </button>
            )
          })}
        </nav>

        {/* Broadcast button */}
        <div style={{ padding: '16px 20px 24px' }}>
          <button
            id="broadcast-btn"
            style={{
              width: '100%',
              background: '#1A1A24',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10,
              padding: '11px 16px',
              color: '#D0D0D0',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <MessageSquareMore size={15} />
            Broadcast Message
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, padding: '32px 32px 40px', overflowY: 'auto' }}>
        {/* Page title */}
        <div style={{ marginBottom: 24 }}>
          <h1
            style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 26,
              fontWeight: 700,
              color: '#1C1C27',
              marginBottom: 4,
            }}
          >
            Overview
          </h1>
          <p style={{ fontSize: 13, color: '#6B6B7A' }}>
            {match.venue} · {match.matchday} · Live dashboard
          </p>
        </div>

        {/* Stat cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
            marginBottom: 24,
          }}
        >
          <StatCard
            label="Checked In"
            value={dashStats.checkedIn.toLocaleString()}
            sub={`of ${dashStats.capacity.toLocaleString()} capacity`}
          />
          <StatCard
            label="Avg Wait Time"
            value={`${dashStats.avgWait} min`}
            sub="↑ up from 4.1 min"
            accentColor="#FF4D6D"
          />
          <StatCard
            label="Active Orders"
            value={dashStats.activeOrders}
            sub="17 pending"
            accentColor="#7C6AFA"
          />
          <StatCard
            label="Open Tickets"
            value={dashStats.openTickets}
            sub="2 high priority"
            accentColor="#FFB547"
          />
        </div>

        {/* Crowd index bar */}
        <div
          style={{
            background: '#fff',
            border: '1px solid #E5E5E0',
            borderRadius: 16,
            padding: '20px 24px',
            marginBottom: 24,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <p style={{ fontSize: 11, color: '#9E9E9E', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
                Crowd Index
              </p>
              <p style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 700, color: '#1C1C27' }}>
                {dashStats.crowdIndex}%
              </p>
            </div>
            <span
              style={{
                background: 'rgba(255,181,71,0.12)',
                color: '#FFB547',
                fontSize: 11,
                fontWeight: 600,
                padding: '4px 12px',
                borderRadius: 9999,
                border: '1px solid rgba(255,181,71,0.25)',
              }}
            >
              Moderate
            </span>
          </div>
          {/* Progress bar */}
          <div
            style={{
              height: 8,
              background: '#F0F0ED',
              borderRadius: 9999,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${dashStats.crowdIndex}%`,
                background: 'linear-gradient(90deg, #00D68F, #FFB547)',
                borderRadius: 9999,
                transition: 'width 0.5s ease',
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontSize: 10, color: '#9E9E9E' }}>0%</span>
            <span style={{ fontSize: 10, color: '#9E9E9E' }}>100% ({dashStats.capacity.toLocaleString()} max)</span>
          </div>
        </div>

        {/* Alerts + Orders two-col */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 20,
          }}
        >
          <AlertFeed />
          <OrderTable />
        </div>
      </main>
    </div>
  )
}
