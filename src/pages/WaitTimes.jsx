import { useState, useEffect } from 'react'
import { RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'
import { useVenue } from '../context/VenueContext'
import WaitCard from '../components/WaitCard'
import { SkeletonWaitCard } from '../components/Skeleton'

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
  const { waitTimes, lastUpdated, manualRefresh, isInitialized } = useVenue()
  const [open, setOpen] = useState({ restrooms: true, foodCourts: true, parking: true })
  const [secondsAgo, setSecondsAgo] = useState(0)
  const [spinning, setSpinning] = useState(false)

  // "Last updated Xs ago" ticker
  useEffect(() => {
    const id = setInterval(() => {
      setSecondsAgo(Math.floor((Date.now() - lastUpdated) / 1000))
    }, 1000)
    return () => clearInterval(id)
  }, [lastUpdated])

  // Reset secondsAgo when lastUpdated changes
  useEffect(() => {
    setSecondsAgo(0)
  }, [lastUpdated])

  const toggle = key => setOpen(prev => ({ ...prev, [key]: !prev[key] }))

  const handleRefresh = () => {
    manualRefresh()
    setSpinning(true)
    setTimeout(() => setSpinning(false), 600)
  }

  // Find item with lowest wait across all categories
  const allItems = [
    ...waitTimes.restrooms.map(i => ({ ...i, cat: 'Restrooms' })),
    ...waitTimes.foodCourts.map(i => ({ ...i, cat: 'Food Courts' })),
    ...waitTimes.parking.map(i => ({ ...i, cat: 'Parking' })),
  ]
  const bestItem = allItems.reduce((best, i) => i.wait < best.wait ? i : best, allItems[0])

  return (
    <div className="page-enter" style={{ padding: '20px 20px 120px', display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 700, color: '#F0F0F0' }}>
          Wait Times
        </h1>
        <button
          id="refresh-wait-times"
          onClick={handleRefresh}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <span style={{ fontSize: 11, color: '#6B6B7A' }}>
            Updated {secondsAgo}s ago
          </span>
          <RefreshCw
            size={12}
            color="#6B6B7A"
            style={{
              transition: 'transform 0.6s ease',
              transform: spinning ? 'rotate(360deg)' : 'rotate(0deg)',
            }}
          />
        </button>
      </div>

      {/* Sections */}
      {sections.map(({ key, label }) => (
        <div key={key}>
          {/* Section toggle */}
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
            <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 600, color: '#F0F0F0' }}>
              {label}
            </span>
            <ChevronDown
              size={16}
              color="#6B6B7A"
              style={{
                transform: open[key] ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.25s ease'
              }}
            />
          </button>

          {/* Animated body */}
          <div className={`section-body ${open[key] ? 'open' : 'closed'}`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 8 }}>
              {!isInitialized ? (
                <>
                  <SkeletonWaitCard />
                  <SkeletonWaitCard />
                  <SkeletonWaitCard />
                  <SkeletonWaitCard />
                </>
              ) : (
                waitTimes[key].map(item => (
                  <WaitCard
                    key={item.id}
                    name={item.name}
                    wait={item.wait}
                    trend={item.trend}
                    status={waitToStatus(item.wait)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Best time card — dynamic */}
      <div
        style={{
          background: '#1A1A24',
          borderRadius: 16,
          padding: 16,
          borderLeft: '2px solid #C8F135',
        }}
      >
        <p style={{ fontSize: 10, color: '#C8F135', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 6 }}>
          Best Time to Visit
        </p>
        <p style={{ fontSize: 14, color: '#F0F0F0', fontWeight: 500, marginBottom: 4 }}>
          {bestItem.name} — just {bestItem.wait} min wait
        </p>
        <p style={{ fontSize: 12, color: '#6B6B7A' }}>
          Quietest spot right now · {bestItem.cat}
        </p>
      </div>
    </div>
  )
}
