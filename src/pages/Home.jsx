import { Navigation, UtensilsCrossed, MapPin, MessageCircle, ArrowRight, ChevronRight } from 'lucide-react'
import { match, seat, dashStats } from '../data/mockData'
import { useNavigate } from 'react-router-dom'

const quickActions = [
  {
    id: 'navigate-seat',
    icon: Navigation,
    title: 'Navigate to Seat',
    desc: 'Turn-by-turn guide',
    to: '/map',
  },
  {
    id: 'order-food',
    icon: UtensilsCrossed,
    title: 'Order Food',
    desc: `Deliver to ${seat.section}${seat.row}-${seat.seat}`,
    to: '/orders',
  },
  {
    id: 'find-restroom',
    icon: MapPin,
    title: 'Find Restroom',
    desc: 'Nearest: Block R1, 2 min',
    to: '/waittimes',
  },
  {
    id: 'get-help',
    icon: MessageCircle,
    title: 'Get Help',
    desc: 'AI concierge',
    to: '/chat',
  },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="page-enter" style={{ padding: '20px 20px 120px', display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* SECTION 1 — My Seat Card */}
      <div
        style={{
          background: '#111118',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 20,
          padding: 20,
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontSize: 10, color: '#6B6B7A', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
              Your Seat
            </p>
            <p
              style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: 28,
                fontWeight: 700,
                color: '#F0F0F0',
                lineHeight: 1.1,
              }}
            >
              {seat.section} · Row {seat.row} · Seat {seat.seat}
            </p>
          </div>
          {/* Lime chip */}
          <span
            style={{
              background: 'rgba(200,241,53,0.12)',
              color: '#C8F135',
              fontSize: 11,
              fontWeight: 600,
              padding: '4px 12px',
              borderRadius: 9999,
              whiteSpace: 'nowrap',
              border: '1px solid rgba(200,241,53,0.2)',
            }}
          >
            2 min wait
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginTop: 14,
            paddingTop: 14,
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <span style={{ fontSize: 13, color: '#6B6B7A' }}>
            Recommended gate:
          </span>
          <span style={{ fontSize: 13, color: '#F0F0F0', fontWeight: 500 }}>
            {seat.gate}
          </span>
          <ArrowRight size={14} color="#6B6B7A" style={{ marginLeft: 2 }} />
        </div>
      </div>

      {/* SECTION 2 — Crowd Status Strip */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }} className="no-scrollbar">
        {[
          `${dashStats.checkedIn.toLocaleString()} inside`,
          `Avg wait ${dashStats.avgWait} min`,
          `${dashStats.crowdIndex}% capacity`,
        ].map(label => (
          <span
            key={label}
            style={{
              background: '#1A1A24',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 9999,
              padding: '8px 16px',
              fontSize: 12,
              color: '#D0D0D0',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {label}
          </span>
        ))}
      </div>

      {/* SECTION 3 — Quick Actions Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
        }}
      >
        {quickActions.map(({ id, icon: Icon, title, desc, to }) => (
          <div
            key={id}
            id={id}
            className="pressable"
            onClick={() => navigate(to)}
            style={{
              background: '#111118',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 20,
              padding: 20,
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <Icon size={24} color="#C8F135" strokeWidth={1.5} />
            <p style={{ fontSize: 14, color: '#F0F0F0', fontWeight: 500, marginTop: 4 }}>
              {title}
            </p>
            <p style={{ fontSize: 11, color: '#6B6B7A' }}>{desc}</p>
            <ChevronRight
              size={14}
              color="#6B6B7A"
              style={{ position: 'absolute', bottom: 16, right: 16 }}
            />
          </div>
        ))}
      </div>

      {/* SECTION 4 — AI Best Time Suggestion */}
      <div
        style={{
          background: '#1A1A24',
          borderRadius: 16,
          padding: 16,
          borderLeft: '2px solid #C8F135',
        }}
      >
        <p
          style={{
            fontSize: 10,
            color: '#C8F135',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontWeight: 600,
            marginBottom: 6,
          }}
        >
          AI Suggestion
        </p>
        <p style={{ fontSize: 14, color: '#F0F0F0', fontWeight: 500, marginBottom: 4 }}>
          Best restroom break in ~8 min during stoppage time
        </p>
        <p style={{ fontSize: 12, color: '#6B6B7A' }}>
          Gate B congestion expected to ease after 72'
        </p>
      </div>
    </div>
  )
}
