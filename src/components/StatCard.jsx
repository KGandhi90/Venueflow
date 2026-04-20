export default function StatCard({ label, value, sub, accentColor }) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #E5E5E0',
        borderRadius: 16,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <p
        style={{
          fontSize: 11,
          color: '#9E9E9E',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontWeight: 500,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: 32,
          fontWeight: 700,
          color: accentColor || '#1C1C27',
          lineHeight: 1,
        }}
      >
        {value}
      </p>
      {sub && (
        <p style={{ fontSize: 12, color: '#6B6B7A', marginTop: 2 }}>
          {sub}
        </p>
      )}
    </div>
  )
}
