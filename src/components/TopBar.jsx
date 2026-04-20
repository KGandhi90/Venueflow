import { match } from '../data/mockData'

export default function TopBar() {
  return (
    <header
      style={{
        height: 52,
        background: '#111118',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        flexShrink: 0,
      }}
    >
      {/* Left — Live indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span
          className="pulse"
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: '#C8F135',
            display: 'inline-block',
          }}
        />
        <span
          style={{
            fontFamily: 'Syne, sans-serif',
            color: '#C8F135',
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.04em',
          }}
        >
          LIVE {match.minute}'
        </span>
      </div>

      {/* Center — Score */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 18,
            fontWeight: 700,
            color: '#F0F0F0',
            whiteSpace: 'nowrap',
          }}
        >
          {match.home}
        </span>
        <span
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 18,
            fontWeight: 700,
            color: '#C8F135',
          }}
        >
          {match.homeScore} – {match.awayScore}
        </span>
        <span
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 18,
            fontWeight: 700,
            color: '#F0F0F0',
            whiteSpace: 'nowrap',
          }}
        >
          {match.away}
        </span>
      </div>

      {/* Right — Venue name */}
      <span style={{ fontSize: 11, color: '#6B6B7A', textAlign: 'right' }}>
        {match.venue}
      </span>
    </header>
  )
}
