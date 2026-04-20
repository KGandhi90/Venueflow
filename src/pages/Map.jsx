import { useState } from 'react'
import { useVenue } from '../context/VenueContext'
import StatusPill from '../components/StatusPill'

const FILTERS = ['All', 'Restrooms', 'Food', 'Exits']

const CX = 200, CY = 200, RX = 155, RY = 130

const gateAngles = { A: -90, B: -30, C: 30, D: 90, E: 150, F: 210 }

function toXY(angleDeg, rx, ry, cx, cy) {
  const rad = (angleDeg * Math.PI) / 180
  return { x: cx + rx * Math.cos(rad), y: cy + ry * Math.sin(rad) }
}

// Map gate ID → approximate blob center and which radial gradient to use
const gateBlobs = {
  B: { cx: 280, cy: 110, rx: 70, ry: 55, gradId: 'blobB' },
  E: { cx: 110, cy: 295, rx: 65, ry: 50, gradId: 'blobE' },
  D: { cx: 345, cy: 210, rx: 50, ry: 45, gradId: 'blobD' },
}

function blobOpacity(wait) {
  if (wait > 8)  return 0.30
  if (wait > 4)  return 0.18
  return 0.08
}

const RESTROOM_MARKERS = [
  { x: 130, y: 150 }, { x: 260, y: 170 },
  { x: 190, y: 270 }, { x: 100, y: 240 },
]
const FOOD_MARKERS = [
  { x: 155, y: 130 }, { x: 245, y: 145 },
  { x: 220, y: 260 }, { x: 125, y: 265 },
]

// Approximate SVG path from Gate D position to Seat marker at (305, 200)
const GATE_D_POS = toXY(gateAngles['D'], RX + 18, RY + 18, CX, CY)
const SEAT_POS   = { x: 305, y: 200 }
const PATH_D     = `M ${GATE_D_POS.x} ${GATE_D_POS.y} C ${GATE_D_POS.x + 20} ${CY} ${SEAT_POS.x - 20} ${CY} ${SEAT_POS.x} ${SEAT_POS.y}`
// Rough length for dasharray
const PATH_LEN   = 120

export default function Map() {
  const { gates } = useVenue()
  const [activeFilter, setActiveFilter] = useState('All')
  const [showRoute, setShowRoute]       = useState(false)

  // Build a lookup map for live gate data
  const gateMap = {}
  gates.forEach(g => { gateMap[g.id] = g })

  return (
    <div className="page-enter" style={{ paddingBottom: 120 }}>
      <div style={{ padding: '16px 20px 0' }}>
        <h1
          style={{
            fontFamily: 'Syne, sans-serif', fontSize: 22,
            fontWeight: 700, color: '#F0F0F0', marginBottom: 4,
          }}
        >
          Venue Map
        </h1>
        <p style={{ fontSize: 12, color: '#6B6B7A', marginBottom: 12 }}>
          Horizon Arena · Live crowd density
        </p>
      </div>

      {/* Filter pills */}
      <div className="no-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0 20px 16px' }}>
        {FILTERS.map(f => (
          <button
            key={f}
            id={`map-filter-${f.toLowerCase()}`}
            onClick={() => setActiveFilter(f)}
            style={{
              background: activeFilter === f ? '#C8F135' : '#1A1A24',
              color: activeFilter === f ? '#0A0A0F' : '#6B6B7A',
              border: '1px solid',
              borderColor: activeFilter === f ? '#C8F135' : 'rgba(255,255,255,0.07)',
              borderRadius: 9999,
              padding: '7px 18px',
              fontSize: 13,
              fontWeight: activeFilter === f ? 600 : 400,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Route toggle button */}
      <div style={{ padding: '0 20px 12px' }}>
        <button
          id="toggle-route-btn"
          onClick={() => setShowRoute(v => !v)}
          style={{
            background: showRoute ? 'rgba(200,241,53,0.12)' : '#1A1A24',
            border: `1px solid ${showRoute ? 'rgba(200,241,53,0.3)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: 9999,
            padding: '7px 18px',
            fontSize: 13,
            color: showRoute ? '#C8F135' : '#6B6B7A',
            cursor: 'pointer',
            fontWeight: showRoute ? 600 : 400,
            transition: 'all 0.2s ease',
          }}
        >
          {showRoute ? 'Hide Route' : 'Show Route to My Seat'}
        </button>
      </div>

      {/* SVG Map */}
      <div style={{ padding: '0 20px' }}>
        <svg
          viewBox="0 0 400 400"
          style={{
            width: '100%',
            borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.07)',
            background: '#111118',
          }}
        >
          <defs>
            <radialGradient id="blobB" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,77,109,1)" />
              <stop offset="100%" stopColor="rgba(255,77,109,0)" />
            </radialGradient>
            <radialGradient id="blobE" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,77,109,1)" />
              <stop offset="100%" stopColor="rgba(255,77,109,0)" />
            </radialGradient>
            <radialGradient id="blobD" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(200,241,53,1)" />
              <stop offset="100%" stopColor="rgba(200,241,53,0)" />
            </radialGradient>
          </defs>

          {/* Live density blobs — opacity tied to gate wait */}
          {Object.entries(gateBlobs).map(([gateId, blob]) => {
            const gateData = gateMap[gateId]
            const op = gateData ? blobOpacity(gateData.wait) : 0.15
            return (
              <ellipse
                key={gateId}
                cx={blob.cx} cy={blob.cy}
                rx={blob.rx} ry={blob.ry}
                fill={`url(#${blob.gradId})`}
                style={{ opacity: op, transition: 'opacity 0.8s ease' }}
              />
            )
          })}

          {/* Stadium oval */}
          <ellipse cx={CX} cy={CY} rx={RX} ry={RY}
            fill="#0D0D14" stroke="rgba(255,255,255,0.10)" strokeWidth="1.5" />

          {/* Inner pitch */}
          <ellipse cx={CX} cy={CY} rx={90} ry={72}
            fill="#0F1A0F" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <line x1="110" y1="200" x2="290" y2="200"
            stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <circle cx={CX} cy={CY} r={22}
            fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

          {/* Section labels */}
          {[
            { label: 'A', x: 165, y: 145 }, { label: 'B', x: 235, y: 145 },
            { label: 'C', x: 240, y: 258 }, { label: 'D', x: 162, y: 258 },
          ].map(s => (
            <text key={s.label} x={s.x} y={s.y} textAnchor="middle"
              fontSize="13" fill="rgba(255,255,255,0.18)"
              fontFamily="Syne, sans-serif" fontWeight="600">
              {s.label}
            </text>
          ))}

          {/* Gate markers — live crowd color */}
          {Object.entries(gateAngles).map(([id, angle]) => {
            const pos = toXY(angle, RX + 18, RY + 18, CX, CY)
            const isHighlighted = activeFilter === 'Exits'
            const gateData = gateMap[id]
            const crowdColor = gateData?.crowd === 'high'
              ? '#FF4D6D' : gateData?.crowd === 'medium'
              ? '#FFB547' : '#00D68F'

            return (
              <g key={id}>
                <circle cx={pos.x} cy={pos.y} r={13}
                  fill={isHighlighted ? 'rgba(200,241,53,0.2)' : '#1A1A24'}
                  stroke={isHighlighted ? '#C8F135' : crowdColor}
                  strokeWidth="1.5"
                  style={{ transition: 'stroke 0.5s ease' }}
                />
                <text x={pos.x} y={pos.y + 5} textAnchor="middle"
                  fontSize="11"
                  fill={isHighlighted ? '#C8F135' : '#F0F0F0'}
                  fontFamily="Syne, sans-serif" fontWeight="700">
                  {id}
                </text>
              </g>
            )
          })}

          {/* Route path — animated draw */}
          {showRoute && (
            <path
              key={showRoute ? 'on' : 'off'}
              d={PATH_D}
              fill="none"
              stroke="#C8F135"
              strokeWidth="2"
              strokeDasharray={PATH_LEN}
              strokeDashoffset={PATH_LEN}
              strokeLinecap="round"
              className="draw-path"
              style={{ filter: 'drop-shadow(0 0 4px #C8F135)' }}
            />
          )}

          {/* YOUR SEAT marker */}
          <circle cx={SEAT_POS.x} cy={SEAT_POS.y} r={10}
            fill="rgba(200,241,53,0.25)" className="pulse" />
          <circle cx={SEAT_POS.x} cy={SEAT_POS.y} r={5} fill="#C8F135" />
          <text x={SEAT_POS.x} y={SEAT_POS.y - 15} textAnchor="middle"
            fontSize="9" fill="#C8F135"
            fontFamily="Inter, sans-serif" fontWeight="600">
            YOUR SEAT
          </text>

          {/* Restroom markers */}
          {activeFilter === 'Restrooms' && RESTROOM_MARKERS.map((m, i) => (
            <rect key={i} x={m.x - 6} y={m.y - 6} width={12} height={12}
              rx={2} fill="rgba(100,160,255,0.85)" />
          ))}

          {/* Food markers */}
          {activeFilter === 'Food' && FOOD_MARKERS.map((m, i) => (
            <circle key={i} cx={m.x} cy={m.y} r={7} fill="rgba(255,181,71,0.9)" />
          ))}
        </svg>
      </div>

      {/* Gate wait strip — live from context */}
      <div className="no-scrollbar" style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '16px 20px 0' }}>
        {gates.map(g => (
          <div
            key={g.id}
            style={{
              background: '#111118',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12,
              padding: '10px 16px',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 4,
              minWidth: 72, flexShrink: 0,
            }}
          >
            <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700, color: '#F0F0F0' }}>
              {g.id}
            </span>
            <span style={{ fontSize: 11, color: '#6B6B7A' }}>{g.wait} min</span>
            <StatusPill status={g.crowd} />
          </div>
        ))}
      </div>
    </div>
  )
}
