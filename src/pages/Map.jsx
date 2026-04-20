import VenueMap from '../components/VenueMap'

export default function Map() {
  return (
    <div className="page-enter" style={{ paddingBottom: 120 }}>
      <div style={{ padding: '16px 20px 0' }}>
        <h1
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 22,
            fontWeight: 700,
            color: '#F0F0F0',
            marginBottom: 4,
          }}
        >
          Venue Map
        </h1>
        <p style={{ fontSize: 12, color: '#6B6B7A', marginBottom: 16 }}>
          Horizon Arena · Live crowd density
        </p>
      </div>
      <VenueMap />
    </div>
  )
}
