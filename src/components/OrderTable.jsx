import StatusPill from './StatusPill'
import { orders } from '../data/mockData'

export default function OrderTable() {
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
      <h3
        style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: 16,
          fontWeight: 700,
          color: '#1C1C27',
          marginBottom: 16,
        }}
      >
        Recent Orders
      </h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['Order ID', 'Seat', 'Items', 'Time', 'Status'].map(col => (
              <th
                key={col}
                style={{
                  textAlign: 'left',
                  fontSize: 11,
                  color: '#9E9E9E',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  fontWeight: 500,
                  paddingBottom: 12,
                  borderBottom: '1px solid #E5E5E0',
                  whiteSpace: 'nowrap',
                  paddingRight: 16,
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((order, i) => (
            <tr key={order.id} style={{ borderBottom: i < orders.length - 1 ? '1px solid #F0F0ED' : 'none' }}>
              <td style={{ padding: '12px 16px 12px 0', fontSize: 13, color: '#1C1C27', fontWeight: 600 }}>
                {order.id}
              </td>
              <td style={{ padding: '12px 16px 12px 0', fontSize: 13, color: '#6B6B7A' }}>
                {order.seat}
              </td>
              <td style={{ padding: '12px 16px 12px 0', fontSize: 12, color: '#6B6B7A', maxWidth: 180 }}>
                {order.items.join(', ')}
              </td>
              <td style={{ padding: '12px 16px 12px 0', fontSize: 13, color: '#6B6B7A', whiteSpace: 'nowrap' }}>
                {order.time}
              </td>
              <td style={{ padding: '12px 0 12px 0' }}>
                <StatusPill status={order.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p
        style={{
          fontSize: 13,
          color: '#9E9E9E',
          marginTop: 16,
          borderTop: '1px solid #F0F0ED',
          paddingTop: 12,
          cursor: 'pointer',
        }}
      >
        View all 143 orders →
      </p>
    </div>
  )
}
