import { Navigation } from 'lucide-react'
import { gates, seat } from '../data/mockData'
import StatusPill from '../components/StatusPill'

const myGate = gates.find(g => g.id === 'D')

// Simple QR SVG placeholder
function QRPlaceholder() {
  const cells = []
  const size = 10
  const count = 11
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      const fill =
        (r < 3 && c < 3) || (r < 3 && c > 7) || (r > 7 && c < 3)
          ? '#C8F135'
          : Math.random() > 0.5
          ? '#F0F0F0'
          : 'transparent'
      cells.push({ r, c, fill })
    }
  }
  return (
    <svg width={count * size} height={count * size} viewBox={`0 0 ${count * size} ${count * size}`}>
      {cells
        .filter(cell => cell.fill !== 'transparent')
        .map((cell, i) => (
          <rect
            key={i}
            x={cell.c * size + 1}
            y={cell.r * size + 1}
            width={size - 2}
            height={size - 2}
            rx={1}
            fill={cell.fill}
          />
        ))}
    </svg>
  )
}

export default function EntryGuide() {
  return (
    <div className="page-enter" style={{ padding: '20px 20px 120px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h1
        style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: 22,
          fontWeight: 700,
          color: '#F0F0F0',
        }}
      >
        Entry Guide
      </h1>

      {/* Match status card */}
      <div
        style={{
          background: '#111118',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 16,
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 18,
            fontWeight: 700,
            color: '#C8F135',
            letterSpacing: '0.04em',
          }}
        >
          MATCH IN PROGRESS
        </span>
      </div>

      {/* Recommended Gate card */}
      <div
        style={{
          background: '#111118',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 20,
          padding: 24,
        }}
      >
        <p style={{ fontSize: 11, color: '#6B6B7A', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
          Recommended for Section {seat.section}
        </p>
        <p
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 48,
            fontWeight: 700,
            color: '#F0F0F0',
            lineHeight: 1,
            marginBottom: 14,
          }}
        >
          Gate D
        </p>

        {/* Chips row */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <span
            style={{
              background: 'rgba(200,241,53,0.12)',
              color: '#C8F135',
              border: '1px solid rgba(200,241,53,0.2)',
              fontSize: 11,
              fontWeight: 600,
              padding: '4px 12px',
              borderRadius: 9999,
            }}
          >
            {myGate?.wait} min wait
          </span>
          <span
            style={{
              background: 'rgba(0,214,143,0.1)',
              color: '#00D68F',
              border: '1px solid rgba(0,214,143,0.2)',
              fontSize: 11,
              fontWeight: 600,
              padding: '4px 12px',
              borderRadius: 9999,
            }}
          >
            Low crowd
          </span>
        </div>

        {/* Navigate button */}
        <button
          id="navigate-gate-d"
          style={{
            width: '100%',
            background: '#C8F135',
            color: '#0A0A0F',
            border: 'none',
            borderRadius: 12,
            padding: '14px 20px',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontFamily: 'Syne, sans-serif',
          }}
        >
          <Navigation size={16} />
          Navigate to Gate D →
        </button>
      </div>

      {/* All gates table */}
      <div
        style={{
          background: '#111118',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 16,
          padding: 20,
        }}
      >
        <p
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 15,
            fontWeight: 600,
            color: '#F0F0F0',
            marginBottom: 14,
          }}
        >
          All Gates
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {/* Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '60px 70px 1fr auto',
              gap: 8,
              paddingBottom: 10,
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              marginBottom: 4,
            }}
          >
            {['Gate', 'Wait', 'Crowd', ''].map(h => (
              <span key={h} style={{ fontSize: 10, color: '#6B6B7A', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {h}
              </span>
            ))}
          </div>

          {gates.map(g => (
            <div
              key={g.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '60px 70px 1fr auto',
                gap: 8,
                padding: '10px 0',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontSize: 16,
                  fontWeight: 700,
                  color: g.id === 'D' ? '#C8F135' : '#F0F0F0',
                }}
              >
                {g.id}
              </span>
              <span style={{ fontSize: 13, color: '#D0D0D0' }}>{g.wait} min</span>
              <span style={{ fontSize: 12, color: '#6B6B7A', textTransform: 'capitalize' }}>{g.crowd}</span>
              <StatusPill status={g.crowd} />
            </div>
          ))}
        </div>
      </div>

      {/* QR Code section */}
      <div
        style={{
          background: '#111118',
          border: '1px dashed rgba(255,255,255,0.15)',
          borderRadius: 16,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <p style={{ fontSize: 11, color: '#6B6B7A', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Your Entry Pass
        </p>
        <div
          style={{
            background: '#0A0A0F',
            padding: 16,
            borderRadius: 12,
          }}
        >
          <QRPlaceholder />
        </div>
        <p style={{ fontSize: 13, color: '#6B6B7A' }}>Scan at Gate D</p>
        <p style={{ fontSize: 11, color: '#3D3D4D' }}>Seat F · Row 12 · Seat 34</p>
      </div>
    </div>
  )
}
