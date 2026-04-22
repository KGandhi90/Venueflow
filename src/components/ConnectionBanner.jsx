import { useEffect, useState } from 'react'
import { WifiOff } from 'lucide-react'
import { useVenue } from '../context/VenueContext'

export default function ConnectionBanner() {
  const { isBackendConnected } = useVenue()

  if (isBackendConnected) return null

  return (
    <div
      className="animate-slideDown"
      style={{
        position: 'sticky',
        top: 0,
        width: '100%',
        height: 36,
        background: 'rgba(255,77,109,0.12)',
        borderBottom: '1px solid rgba(255,77,109,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        zIndex: 900,
      }}
    >
      <WifiOff size={14} color="#FF4D6D" />
      <span style={{ color: '#FF4D6D', fontSize: 12, fontWeight: 500 }}>
        Live updates paused — reconnecting...
      </span>
    </div>
  )
}
