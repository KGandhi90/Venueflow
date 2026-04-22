import { useState } from 'react'
import { LayoutDashboard, Map, ShoppingBag, Users, AlertTriangle, MessageSquareMore, X } from 'lucide-react'
import { useVenue } from '../context/VenueContext'
import { useFlash } from '../hooks/useFlash'
import StatCard from '../components/StatCard'
import AlertFeed from '../components/AlertFeed'
import StatusPill from '../components/StatusPill'
import { venueApi } from '../api/venueApi'

const navItems = [
  { id: 'overview', label: 'Overview',  icon: LayoutDashboard },
  { id: 'crowd',    label: 'Crowd Map', icon: Map             },
  { id: 'orders',   label: 'Orders',    icon: ShoppingBag     },
  { id: 'staff',    label: 'Staff',     icon: Users           },
  { id: 'alerts',   label: 'Alerts',    icon: AlertTriangle   },
]

// ── Sub-views ────────────────────────────────────────────────────────────────

function OverviewContent({ dashStats, match }) {
  const checkedInFlash    = useFlash(dashStats.checkedIn)
  const avgWaitFlash      = useFlash(dashStats.avgWait)
  const activeOrdersFlash = useFlash(dashStats.activeOrders)
  const crowdIndexFlash   = useFlash(dashStats.crowdIndex)

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div className={checkedInFlash}>
          <StatCard label="Checked In" value={dashStats.checkedIn.toLocaleString()} sub={`of ${dashStats.capacity.toLocaleString()} capacity`} />
        </div>
        <div className={avgWaitFlash}>
          <StatCard label="Avg Wait Time" value={`${dashStats.avgWait} min`} sub="↑ up from 4.1 min" accentColor="#FF4D6D" />
        </div>
        <div className={activeOrdersFlash}>
          <StatCard label="Active Orders" value={dashStats.activeOrders} sub="17 pending" accentColor="#7C6AFA" />
        </div>
        <div className={crowdIndexFlash}>
          <StatCard label="Open Tickets" value={dashStats.openTickets} sub="2 high priority" accentColor="#FFB547" />
        </div>
      </div>

      {/* Crowd index bar */}
      <div style={{ background: '#fff', border: '1px solid #E5E5E0', borderRadius: 16, padding: '20px 24px', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <p style={{ fontSize: 11, color: '#9E9E9E', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Crowd Index</p>
            <p className={crowdIndexFlash} style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 700, color: '#1C1C27' }}>
              {dashStats.crowdIndex}%
            </p>
          </div>
          <span style={{ background: 'rgba(255,181,71,0.12)', color: '#FFB547', fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 9999, border: '1px solid rgba(255,181,71,0.25)' }}>
            Moderate
          </span>
        </div>
        <div style={{ height: 8, background: '#F0F0ED', borderRadius: 9999, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${dashStats.crowdIndex}%`, background: 'linear-gradient(90deg, #00D68F, #FFB547)', borderRadius: 9999, transition: 'width 0.5s ease' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontSize: 10, color: '#9E9E9E' }}>0%</span>
          <span style={{ fontSize: 10, color: '#9E9E9E' }}>100% ({dashStats.capacity.toLocaleString()} max)</span>
        </div>
      </div>

      <AlertFeed />
    </>
  )
}

function OrdersContent({ orders, updateOrderStatus }) {
  const STATUS_CYCLE = { pending: 'preparing', preparing: 'ready', ready: 'delivered', delivered: 'delivered' }
  const latest = orders.slice(0, 5)

  return (
    <div style={{ background: '#fff', border: '1px solid #E5E5E0', borderRadius: 16, padding: 20, overflowX: 'auto' }}>
      <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: '#1C1C27', marginBottom: 16 }}>
        Recent Orders
      </h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['Order ID', 'Seat', 'Items', 'Time', 'Status', 'Action'].map(col => (
              <th key={col} style={{ textAlign: 'left', fontSize: 11, color: '#9E9E9E', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500, paddingBottom: 12, borderBottom: '1px solid #E5E5E0', whiteSpace: 'nowrap', paddingRight: 12 }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {latest.map((order, i) => {
            const next = STATUS_CYCLE[order.status]
            return (
              <tr key={order.id} style={{ borderBottom: i < latest.length - 1 ? '1px solid #F0F0ED' : 'none' }}>
                <td style={{ padding: '12px 12px 12px 0', fontSize: 13, color: '#1C1C27', fontWeight: 600 }}>{order.id}</td>
                <td style={{ padding: '12px 12px 12px 0', fontSize: 13, color: '#6B6B7A' }}>{order.seat}</td>
                <td style={{ padding: '12px 12px 12px 0', fontSize: 12, color: '#6B6B7A', maxWidth: 140 }}>{order.items.join(', ')}</td>
                <td style={{ padding: '12px 12px 12px 0', fontSize: 13, color: '#6B6B7A', whiteSpace: 'nowrap' }}>{order.time}</td>
                <td style={{ padding: '12px 12px 12px 0' }}><StatusPill status={order.status} /></td>
                <td style={{ padding: '12px 0 12px 0' }}>
                  {order.status !== 'delivered' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, next)}
                      style={{ fontSize: 11, color: '#7C6AFA', background: 'rgba(124,106,250,0.08)', border: '1px solid rgba(124,106,250,0.2)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                    >
                      Mark {next?.charAt(0).toUpperCase() + next?.slice(1)}
                    </button>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p style={{ fontSize: 13, color: '#9E9E9E', marginTop: 16, borderTop: '1px solid #F0F0ED', paddingTop: 12 }}>
        Showing {latest.length} of {orders.length} orders
      </p>
    </div>
  )
}

function StaffContent({ staff, updateStaffStatus }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #E5E5E0', borderRadius: 16, padding: 20, overflowX: 'auto' }}>
      <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: '#1C1C27', marginBottom: 16 }}>
        Staff Roster
      </h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['Name', 'Role', 'Zone', 'Status', 'Action'].map(col => (
              <th key={col} style={{ textAlign: 'left', fontSize: 11, color: '#9E9E9E', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500, paddingBottom: 12, borderBottom: '1px solid #E5E5E0', paddingRight: 16 }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {staff.map((member, i) => (
            <tr key={member.id} style={{ borderBottom: i < staff.length - 1 ? '1px solid #F0F0ED' : 'none' }}>
              <td style={{ padding: '12px 16px 12px 0', fontSize: 13, color: '#1C1C27', fontWeight: 600 }}>{member.name}</td>
              <td style={{ padding: '12px 16px 12px 0', fontSize: 13, color: '#6B6B7A' }}>{member.role}</td>
              <td style={{ padding: '12px 16px 12px 0', fontSize: 13, color: '#6B6B7A' }}>{member.zone}</td>
              <td style={{ padding: '12px 16px 12px 0' }}><StatusPill status={member.status} /></td>
              <td style={{ padding: '12px 0 12px 0' }}>
                <button
                  onClick={() => updateStaffStatus(member.id, member.status === 'on-duty' ? 'break' : 'on-duty')}
                  style={{ fontSize: 11, color: member.status === 'on-duty' ? '#FF4D6D' : '#00D68F', background: member.status === 'on-duty' ? 'rgba(255,77,109,0.08)' : 'rgba(0,214,143,0.08)', border: `1px solid ${member.status === 'on-duty' ? 'rgba(255,77,109,0.2)' : 'rgba(0,214,143,0.2)'}`, borderRadius: 6, padding: '4px 10px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  {member.status === 'on-duty' ? 'Mark Break' : 'Mark On Duty'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function AlertsContent({ alerts, toggleAlertResolved }) {
  const typeColors = { congestion: '#FF4D6D', stock: '#FFB547', broadcast: '#7C6AFA' }
  return (
    <div style={{ background: '#fff', border: '1px solid #E5E5E0', borderRadius: 16, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: '#1C1C27' }}>Live Alerts</h3>
        <span style={{ background: '#FF4D6D', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 9999 }}>
          {alerts.filter(a => !a.resolved).length} new
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {alerts.map(alert => (
          <div key={alert.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, opacity: alert.resolved ? 0.6 : 1 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: alert.resolved ? '#00D68F' : typeColors[alert.type] || '#6B6B7A', marginTop: 5, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#1C1C27', textDecoration: alert.resolved ? 'line-through' : 'none', marginBottom: 2 }}>{alert.zone}</p>
              <p style={{ fontSize: 12, color: '#6B6B7A', textDecoration: alert.resolved ? 'line-through' : 'none', lineHeight: 1.45 }}>{alert.msg}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
              <span style={{ fontSize: 11, color: '#9E9E9E', whiteSpace: 'nowrap' }}>{alert.time}'</span>
              {!alert.resolved && (
                <button
                  onClick={() => toggleAlertResolved(alert.id)}
                  style={{ fontSize: 10, color: '#00D68F', background: 'rgba(0,214,143,0.08)', border: '1px solid rgba(0,214,143,0.2)', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', whiteSpace: 'nowrap' }}
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

// ── Main Dashboard ────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { match, dashStats, alerts, orders, staff, toggleAlertResolved, updateOrderStatus, updateStaffStatus, addAlert } = useVenue()
  const [activeNav, setActiveNav] = useState('overview')

  // Broadcast modal
  const [showBroadcast, setShowBroadcast]   = useState(false)
  const [broadcastText, setBroadcastText]   = useState('')

  const handleBroadcast = async () => {
    if (!broadcastText.trim()) return
    try {
      await venueApi.broadcastAlert({ message: broadcastText.trim(), zone: 'Broadcast' })
    } catch (e) {
      console.warn('Backend unavailable, using fallback')
      addAlert({
        id:       Date.now(),
        time:     `${match.minute}:00`,
        zone:     'Broadcast',
        type:     'broadcast',
        msg:      broadcastText.trim(),
        resolved: false,
      })
    }
    setBroadcastText('')
    setShowBroadcast(false)
  }

  const handleUpdateOrderStatus = async (id, status) => {
    try { await venueApi.updateOrderStatus(id, status) } 
    catch (e) { console.warn('Backend unavailable'); updateOrderStatus(id, status) }
  }

  const handleUpdateStaffStatus = async (id, status) => {
    try { await venueApi.updateStaffStatus(id, status) } 
    catch (e) { console.warn('Backend unavailable'); updateStaffStatus(id, status) }
  }

  const handleToggleAlertResolved = async (id) => {
    try { await venueApi.resolveAlert(id) } 
    catch (e) { console.warn('Backend unavailable'); toggleAlertResolved(id) }
  }

  const renderContent = () => {
    switch (activeNav) {
      case 'overview': return <OverviewContent dashStats={dashStats} match={match} />
      case 'orders':   return <OrdersContent orders={orders} updateOrderStatus={handleUpdateOrderStatus} />
      case 'staff':    return <StaffContent staff={staff} updateStaffStatus={handleUpdateStaffStatus} />
      case 'alerts':   return <AlertsContent alerts={alerts} toggleAlertResolved={handleToggleAlertResolved} />
      case 'crowd':
        return (
          <div style={{ background: '#fff', border: '1px solid #E5E5E0', borderRadius: 16, padding: 40, textAlign: 'center' }}>
            <p style={{ color: '#6B6B7A', fontSize: 14 }}>Live Crowd Map — Phase 3</p>
          </div>
        )
      default: return null
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F4F3EF', position: 'relative' }}>

      {/* SIDEBAR */}
      <aside style={{ width: 240, background: '#1C1C27', display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
        <div style={{ padding: '24px 20px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 700, color: '#F0F0F0' }}>VenueFlow</span>
            <span style={{ background: '#C8F135', color: '#0A0A0F', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 4, letterSpacing: '0.06em' }}>OPS</span>
          </div>
          <p style={{ fontSize: 11, color: '#6B6B7A', lineHeight: 1.4 }}>
            {match.home} vs {match.away} · LIVE {match.minute}'
          </p>
        </div>
        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 20px' }} />
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {navItems.map(({ id, label, icon: Icon }) => {
            const isActive = activeNav === id
            return (
              <button
                key={id}
                id={`dash-nav-${id}`}
                onClick={() => setActiveNav(id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 10,
                  background: isActive ? 'rgba(200,241,53,0.08)' : 'transparent',
                  border: 'none',
                  borderLeft: isActive ? '2px solid #C8F135' : '2px solid transparent',
                  cursor: 'pointer',
                  color: isActive ? '#F0F0F0' : '#6B6B7A',
                  fontSize: 14, fontWeight: isActive ? 600 : 400, textAlign: 'left',
                  marginBottom: 2, transition: 'all 0.15s ease',
                }}
              >
                <Icon size={16} strokeWidth={isActive ? 2 : 1.5} />
                {label}
              </button>
            )
          })}
        </nav>
        <div style={{ padding: '16px 20px 24px' }}>
          <button
            id="broadcast-btn"
            onClick={() => setShowBroadcast(true)}
            style={{
              width: '100%', background: '#1A1A24',
              border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10,
              padding: '11px 16px', color: '#D0D0D0', fontSize: 13, fontWeight: 500,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            <MessageSquareMore size={15} /> Broadcast Message
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, padding: '32px 32px 40px', overflowY: 'auto' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 700, color: '#1C1C27', marginBottom: 4 }}>
            {navItems.find(n => n.id === activeNav)?.label}
          </h1>
          <p style={{ fontSize: 13, color: '#6B6B7A' }}>
            {match.venue} · {match.matchday} · Live dashboard
          </p>
        </div>
        {renderContent()}
      </main>

      {/* Broadcast modal */}
      {showBroadcast && (
        <div
          onClick={() => setShowBroadcast(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: 20, padding: 28, width: 'min(480px, 90vw)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700, color: '#1C1C27' }}>
                Broadcast Message
              </h2>
              <button onClick={() => setShowBroadcast(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="#9E9E9E" />
              </button>
            </div>
            <textarea
              id="broadcast-textarea"
              value={broadcastText}
              onChange={e => setBroadcastText(e.target.value)}
              placeholder="Type a message to broadcast to all staff..."
              style={{
                width: '100%', minHeight: 120, background: '#F4F3EF',
                border: '1px solid #E5E5E0', borderRadius: 12, padding: 16,
                fontSize: 14, color: '#1C1C27', resize: 'vertical',
                outline: 'none', fontFamily: 'Inter, sans-serif', lineHeight: 1.5,
              }}
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button
                onClick={() => setShowBroadcast(false)}
                style={{ flex: 1, background: '#F4F3EF', border: '1px solid #E5E5E0', borderRadius: 10, padding: '12px', fontSize: 14, color: '#6B6B7A', cursor: 'pointer', fontWeight: 500 }}
              >
                Cancel
              </button>
              <button
                id="broadcast-send-btn"
                onClick={handleBroadcast}
                style={{ flex: 2, background: '#1C1C27', border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, color: '#F0F0F0', cursor: 'pointer', fontWeight: 600, fontFamily: 'Syne, sans-serif' }}
              >
                Send to All Staff
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
