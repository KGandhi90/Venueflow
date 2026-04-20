import StatusPill from './StatusPill'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const TrendIcon = ({ trend }) => {
  if (trend === 'up')     return <TrendingUp size={14}  color="#FF4D6D" />
  if (trend === 'down')   return <TrendingDown size={14} color="#00D68F" />
  return <Minus size={14} color="#6B6B7A" />
}

export default function WaitCard({ name, wait, trend, status }) {
  return (
    <div
      style={{
        background: '#111118',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12,
        padding: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
      }}
    >
      {/* Left — name */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, color: '#F0F0F0', fontWeight: 500, marginBottom: 2 }}>
          {name}
        </p>
      </div>

      {/* Right — wait + trend + pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span
            style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 20,
              fontWeight: 600,
              color: '#F0F0F0',
            }}
          >
            {wait}
          </span>
          <span style={{ fontSize: 12, color: '#6B6B7A' }}>min</span>
          <TrendIcon trend={trend} />
        </div>
        <StatusPill status={status} />
      </div>
    </div>
  )
}
