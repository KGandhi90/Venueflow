const statusStyles = {
  low:       { bg: 'rgba(0,214,143,0.12)',  color: '#00D68F' },
  delivered: { bg: 'rgba(0,214,143,0.12)',  color: '#00D68F' },
  'on-duty': { bg: 'rgba(0,214,143,0.12)',  color: '#00D68F' },
  medium:    { bg: 'rgba(255,181,71,0.12)', color: '#FFB547' },
  preparing: { bg: 'rgba(255,181,71,0.12)', color: '#FFB547' },
  high:      { bg: 'rgba(255,77,109,0.12)', color: '#FF4D6D' },
  pending:   { bg: 'rgba(255,77,109,0.12)', color: '#FF4D6D' },
  break:     { bg: 'rgba(255,77,109,0.12)', color: '#FF4D6D' },
  ready:     { bg: 'rgba(200,241,53,0.12)', color: '#C8F135' },
}

export default function StatusPill({ status }) {
  const style = statusStyles[status] || { bg: 'rgba(107,107,122,0.15)', color: '#6B6B7A' }
  return (
    <span
      style={{
        display: 'inline-block',
        background: style.bg,
        color: style.color,
        fontSize: 10,
        fontWeight: 500,
        padding: '2px 10px',
        borderRadius: 9999,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        whiteSpace: 'nowrap',
      }}
    >
      {status}
    </span>
  )
}
