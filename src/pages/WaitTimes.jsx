import { useState } from 'react'
import { RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'
import { waitTimes } from '../data/mockData'
import WaitCard from '../components/WaitCard'

const waitToStatus = wait => {
  if (wait <= 3) return 'low'
  if (wait <= 7) return 'medium'
  return 'high'
}

const sections = [
  { key: 'restrooms',  label: 'Restrooms'   },
  { key: 'foodCourts', label: 'Food Courts' },
  { key: 'parking',    label: 'Parking'     },
]

export default function WaitTimes() {
  const [open, setOpen] = useState({ restrooms: true, foodCourts: true, parking: true })

  const toggle = key => setOpen(prev => ({ ...prev, [key]: !prev[key] }))

  return (
    <div className="page-enter" style={{ padding: '20px 20px 120px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 22,
            fontWeight: 700,
            color: '#F0F0F0',
          }}
        >
          Wait Times
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: '#6B6B7A' }}>Updated 12s ago</span>
          <RefreshCw size={12} color="#6B6B7A" />
        </div>
      </div>

      {/* Sections */}
      {sections.map(({ key, label }) => (
        <div key={key}>
          {/* Section header — toggle */}
          <button
            id={`toggle-${key}`}
            onClick={() => toggle(key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0 0 12px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: 15,
                fontWeight: 600,
                color: '#F0F0F0',
              }}
            >
              {label}
            </span>
            {open[key]
              ? <ChevronUp size={16} color="#6B6B7A" />
              : <ChevronDown size={16} color="#6B6B7A" />
            }
          </button>

          {/* Items */}
          {open[key] && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {waitTimes[key].map(item => (
                <WaitCard
                  key={item.id}
                  name={item.name}
                  wait={item.wait}
                  trend={item.trend}
                  status={waitToStatus(item.wait)}
                />
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Best time card */}
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
          Best Time to Visit
        </p>
        <p style={{ fontSize: 14, color: '#F0F0F0', fontWeight: 500, marginBottom: 4 }}>
          Restrooms in Block R11 — Upper Tier are free now
        </p>
        <p style={{ fontSize: 12, color: '#6B6B7A' }}>
          Just 1 min wait · Quietest spot right now
        </p>
      </div>
    </div>
  )
}
