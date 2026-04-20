import { useVenue } from '../context/VenueContext'
import StatusPill from './StatusPill'

export default function OrderTable() {
  const { orders, updateOrderStatus } = useVenue()
  const latest = orders.slice(0, 5)
  const STATUS_NEXT = { pending: 'preparing', preparing: 'ready', ready: 'delivered', delivered: 'delivered' }

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #E5E5E0',
        borderRadius: 16,
        padding: 20,
        overflowX: 'auto',
      }}
    >
      <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: '#1C1C27', marginBottom: 16 }}>
        Recent Orders
      </h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['Order ID', 'Seat', 'Items', 'Time', 'Status'].map(col => (
              <th
                key={col}
                style={{
                  textAlign: 'left', fontSize: 11, color: '#9E9E9E',
                  textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500,
                  paddingBottom: 12, borderBottom: '1px solid #E5E5E0',
                  whiteSpace: 'nowrap', paddingRight: 16,
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {latest.map((order, i) => (
            <tr key={order.id} style={{ borderBottom: i < latest.length - 1 ? '1px solid #F0F0ED' : 'none' }}>
              <td style={{ padding: '12px 16px 12px 0', fontSize: 13, color: '#1C1C27', fontWeight: 600 }}>{order.id}</td>
              <td style={{ padding: '12px 16px 12px 0', fontSize: 13, color: '#6B6B7A' }}>{order.seat}</td>
              <td style={{ padding: '12px 16px 12px 0', fontSize: 12, color: '#6B6B7A', maxWidth: 160 }}>{order.items.join(', ')}</td>
              <td style={{ padding: '12px 16px 12px 0', fontSize: 13, color: '#6B6B7A', whiteSpace: 'nowrap' }}>{order.time}</td>
              <td style={{ padding: '12px 0 12px 0' }}>
                <button
                  disabled={order.status === 'delivered'}
                  onClick={() => updateOrderStatus(order.id, STATUS_NEXT[order.status])}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: order.status === 'delivered' ? 'default' : 'pointer' }}
                >
                  <StatusPill status={order.status} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ fontSize: 13, color: '#9E9E9E', marginTop: 16, borderTop: '1px solid #F0F0ED', paddingTop: 12, cursor: 'pointer' }}>
        View all {orders.length} orders →
      </p>
    </div>
  )
}
