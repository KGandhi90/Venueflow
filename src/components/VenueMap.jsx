import { useState } from 'react'
import { gates } from '../data/mockData'
import StatusPill from './StatusPill'

const FILTERS = ['All', 'Restrooms', 'Food', 'Exits']

// Gate positions around the oval (angle in degrees, starting top)
const gateAngles = {
  A: -90,
  B: -30,
  C: 30,
  D: 90,
  E: 150,
  F: 210,
}

const toXY = (angleDeg, rx, ry, cx, cy) => {
  const rad = (angleDeg * Math.PI) / 180
  return { x: cx + rx * Math.cos(rad), y: cy + ry * Math.sin(rad) }
}

const CX = 200, CY = 200, RX = 155, RY = 130

const RESTROOM_MARKERS = [
  { x: 130, y: 150 },
  { x: 260, y: 170 },
  { x: 190, y: 270 },
  { x: 100, y: 240 },
]
const FOOD_MARKERS = [
  { x: 155, y: 130 },
  { x: 245, y: 145 },
  { x: 220, y: 260 },
  { x: 125, y: 265 },
]

export default function VenueMap() {
  const [activeFilter, setActiveFilter] = useState('All')

  return (
    <div>
      {/* Filter pills */}
      <div
        className="no-scrollbar"
        style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          padding: '0 20px 16px',
        }}
      >
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
          {/* Density blobs */}
          <defs>
            <radialGradient id="blobB" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,77,109,0.35)" />
              <stop offset="100%" stopColor="rgba(255,77,109,0)" />
            </radialGradient>
            <radialGradient id="blobE" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,77,109,0.28)" />
              <stop offset="100%" stopColor="rgba(255,77,109,0)" />
            </radialGradient>
            <radialGradient id="blobD" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(200,241,53,0.18)" />
              <stop offset="100%" stopColor="rgba(200,241,53,0)" />
            </radialGradient>
          </defs>

          {/* Gate B blob — upper right */}
          <ellipse cx="280" cy="110" rx="70" ry="55" fill="url(#blobB)" />
          {/* Gate E blob — lower left */}
          <ellipse cx="110" cy="295" rx="65" ry="50" fill="url(#blobE)" />
          {/* Gate D blob — right */}
          <ellipse cx="345" cy="210" rx="50" ry="45" fill="url(#blobD)" />

          {/* Stadium oval */}
          <ellipse
            cx={CX} cy={CY} rx={RX} ry={RY}
            fill="#0D0D14"
            stroke="rgba(255,255,255,0.10)"
            strokeWidth="1.5"
          />

          {/* Inner pitch */}
          <ellipse
            cx={CX} cy={CY} rx={90} ry={72}
            fill="#0F1A0F"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
          {/* Pitch centre line */}
          <line x1="110" y1="200" x2="290" y2="200"
            stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          {/* Centre circle */}
          <circle cx={CX} cy={CY} r={22}
            fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

          {/* Section labels */}
          {[
            { label: 'A', x: 165, y: 145 },
            { label: 'B', x: 235, y: 145 },
            { label: 'C', x: 240, y: 258 },
            { label: 'D', x: 162, y: 258 },
          ].map(s => (
            <text
              key={s.label}
              x={s.x} y={s.y}
              textAnchor="middle"
              fontSize="13"
              fill="rgba(255,255,255,0.18)"
              fontFamily="Syne, sans-serif"
              fontWeight="600"
            >
              {s.label}
            </text>
          ))}

          {/* Gate markers */}
          {Object.entries(gateAngles).map(([id, angle]) => {
            const pos = toXY(angle, RX + 18, RY + 18, CX, CY)
            const isHighlighted = activeFilter === 'Exits'
            return (
              <g key={id}>
                <circle
                  cx={pos.x} cy={pos.y} r={13}
                  fill={isHighlighted ? 'rgba(200,241,53,0.2)' : '#1A1A24'}
                  stroke={isHighlighted ? '#C8F135' : 'rgba(255,255,255,0.12)'}
                  strokeWidth="1.5"
                />
                <text
                  x={pos.x} y={pos.y + 5}
                  textAnchor="middle"
                  fontSize="11"
                  fill={isHighlighted ? '#C8F135' : '#F0F0F0'}
                  fontFamily="Syne, sans-serif"
                  fontWeight="700"
                >
                  {id}
                </text>
              </g>
            )
          })}

          {/* YOUR SEAT marker */}
          <circle cx="305" cy="200" r="10" fill="rgba(200,241,53,0.25)" className="pulse" />
          <circle cx="305" cy="200" r="5" fill="#C8F135" />
          <text x="305" y="185" textAnchor="middle" fontSize="9" fill="#C8F135"
            fontFamily="Inter, sans-serif" fontWeight="600">
            YOUR SEAT
          </text>

          {/* Restroom markers */}
          {(activeFilter === 'Restrooms' || activeFilter === 'All') && activeFilter === 'Restrooms' &&
            RESTROOM_MARKERS.map((m, i) => (
              <rect
                key={i}
                x={m.x - 6} y={m.y - 6}
                width={12} height={12}
                rx={2}
                fill="rgba(100,160,255,0.85)"
              />
            ))
          }

          {/* Food markers */}
          {activeFilter === 'Food' &&
            FOOD_MARKERS.map((m, i) => (
              <circle key={i} cx={m.x} cy={m.y} r={7} fill="rgba(255,181,71,0.9)" />
            ))
          }
        </svg>
      </div>

      {/* Gate wait time strip */}
      <div
        className="no-scrollbar"
        style={{
          display: 'flex',
          gap: 10,
          overflowX: 'auto',
          padding: '16px 20px 0',
        }}
      >
        {gates.map(g => (
          <div
            key={g.id}
            style={{
              background: '#111118',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12,
              padding: '10px 16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              minWidth: 72,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: 18,
                fontWeight: 700,
                color: '#F0F0F0',
              }}
            >
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
