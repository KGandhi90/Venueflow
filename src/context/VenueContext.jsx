import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import {
  match as initialMatch,
  seat,
  gates as initialGates,
  waitTimes as initialWaitTimes,
  dashStats as initialDashStats,
  alerts as initialAlerts,
  orders as initialOrders,
  staff as initialStaff,
} from '../data/mockData'

import { socket } from '../api/socket'
import { venueApi } from '../api/venueApi'
import { useToast } from '../hooks/useToast'

export const VenueContext = createContext(null)

export function useVenue() {
  const ctx = useContext(VenueContext)
  if (!ctx) throw new Error('useVenue must be used inside VenueProvider')
  return ctx
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val))
}

function nudge(val, min, max) {
  const delta = Math.random() < 0.5 ? -1 : 1
  return clamp(val + delta, min, max)
}

function waitToCrowd(wait) {
  if (wait <= 3) return 'low'
  if (wait <= 7) return 'medium'
  return 'high'
}

function computeTrend(prev, next) {
  if (next > prev) return 'up'
  if (next < prev) return 'down'
  return 'stable'
}

// Deep-clone the initial wait times so we own the objects
function cloneWaitTimes(wt) {
  return {
    restrooms:  wt.restrooms.map(i => ({ ...i })),
    foodCourts: wt.foodCourts.map(i => ({ ...i })),
    parking:    wt.parking.map(i => ({ ...i })),
  }
}

// ─── Provider ──────────────────────────────────────────────────────────────

export function VenueProvider({ children }) {
  const [match, setMatch]       = useState({ ...initialMatch })
  const [gates, setGates]       = useState(initialGates.map(g => ({ ...g })))
  const [waitTimes, setWaitTimes] = useState(cloneWaitTimes(initialWaitTimes))
  const [dashStats, setDashStats] = useState({ ...initialDashStats })
  const [alerts, setAlerts]     = useState(initialAlerts.map(a => ({ ...a })))
  const [orders, setOrders]     = useState(initialOrders.map(o => ({ ...o })))
  const [staff, setStaff]       = useState(initialStaff.map(s => ({ ...s })))
  const [lastUpdated, setLastUpdated] = useState(Date.now())

  const [isBackendConnected, setIsBackendConnected] = useState(false)
  const { showToast } = useToast()

  // Keep a ref to previous wait-time values for trend calculation
  const prevWaitRef = useRef(cloneWaitTimes(initialWaitTimes))

  const [isInitialized, setIsInitialized] = useState(false)

  // ── Initialization & Sockets ───────────────────────────────────────────

  useEffect(() => {
    let mounted = true
    
    // Setup socket connection listeners
    socket.on('connect', () => {
      if (mounted && !isBackendConnected) {
        setIsBackendConnected(true)
        // Wait for initial fetch to finish before showing toast to avoid first load toast
      }
    })
    socket.on('disconnect', () => {
      if (mounted) {
        setIsBackendConnected(false)
        showToast('Live updates paused — reconnecting...', 'error')
      }
    })
    socket.on('reconnect', () => {
      if (mounted) {
        setIsBackendConnected(true)
        showToast('Live updates restored', 'success')
      }
    })

    async function init() {
      try {
        const status = await venueApi.getStatus()
        const apiOrders = await venueApi.getOrders()
        const apiStaff = await venueApi.getStaff()
        const apiAlerts = await venueApi.getAlerts()

        if (mounted) {
          setMatch(status.match)
          setGates(status.gates)
          setWaitTimes(status.waitTimes)
          setDashStats(status.dashStats)
          setOrders(apiOrders)
          setStaff(apiStaff)
          setAlerts(apiAlerts)
          setLastUpdated(status.lastUpdated || Date.now())
          
          if (!isBackendConnected) {
            setIsBackendConnected(true)
          }

          socket.on('gates:update',     data => { setGates(data); setLastUpdated(Date.now()); })
          socket.on('waitTimes:update', data => { setWaitTimes(data); setLastUpdated(Date.now()); })
          socket.on('stats:update',     data => { setDashStats(data); setLastUpdated(Date.now()); })
          socket.on('match:update',     data => setMatch(data))
          socket.on('alerts:update',    data => setAlerts(data))
          socket.on('orders:update',    data => setOrders(data))
          socket.on('staff:update',     data => setStaff(data))
          
          setIsInitialized(true)
        }
      } catch (err) {
        console.warn('Backend unavailable — using mock data')
        if (mounted) setIsInitialized(true)
      }
    }

    init()

    return () => {
      mounted = false
      socket.disconnect()
    }
  }, [showToast])

  // ── Live-simulation intervals (Fallback only) ──────────────────────────

  useEffect(() => {
    if (isBackendConnected) return;

    // Match minute — every 60 s
    const id1 = setInterval(() => {
      setMatch(prev => ({ ...prev, minute: Math.min(90, prev.minute + 1) }))
    }, 60_000)

    // Gate wait times — every 12 s
    const id2 = setInterval(() => {
      setGates(prev =>
        prev.map(g => {
          const newWait = nudge(g.wait, 1, 15)
          return { ...g, wait: newWait, crowd: waitToCrowd(newWait) }
        })
      )
      setLastUpdated(Date.now())
    }, 12_000)

    // Restroom / food / parking wait times — every 15 s
    const id3 = setInterval(() => {
      setWaitTimes(prev => {
        const oldRef = prevWaitRef.current
        const next = {
          restrooms:  prev.restrooms.map((item, i) => {
            const nw = nudge(item.wait, 1, 10)
            return { ...item, wait: nw, trend: computeTrend(oldRef.restrooms[i].wait, nw) }
          }),
          foodCourts: prev.foodCourts.map((item, i) => {
            const nw = nudge(item.wait, 2, 15)
            return { ...item, wait: nw, trend: computeTrend(oldRef.foodCourts[i].wait, nw) }
          }),
          parking:    prev.parking.map((item, i) => {
            const nw = nudge(item.wait, 3, 20)
            return { ...item, wait: nw, trend: computeTrend(oldRef.parking[i].wait, nw) }
          }),
        }
        prevWaitRef.current = {
          restrooms:  next.restrooms.map(i => ({ ...i })),
          foodCourts: next.foodCourts.map(i => ({ ...i })),
          parking:    next.parking.map(i => ({ ...i })),
        }
        return next
      })
      setLastUpdated(Date.now())
    }, 15_000)

    // Dashboard stats — every 10 s
    const id4 = setInterval(() => {
      setDashStats(prev => ({
        ...prev,
        checkedIn:    clamp(prev.checkedIn + Math.floor(Math.random() * 31) + 10, 0, prev.capacity),
        avgWait:      parseFloat(clamp(prev.avgWait + (Math.random() < 0.5 ? -0.1 : 0.1), 2.0, 12.0).toFixed(1)),
        activeOrders: clamp(prev.activeOrders + (Math.random() < 0.5 ? -2 : 2), 100, 200),
        crowdIndex:   clamp(prev.crowdIndex   + (Math.random() < 0.5 ? -1 : 1),  50,  95),
      }))
      setLastUpdated(Date.now())
    }, 10_000)

    return () => {
      clearInterval(id1)
      clearInterval(id2)
      clearInterval(id3)
      clearInterval(id4)
    }
  }, [isBackendConnected])

  // ── Manual refresh (WaitTimes page refresh button) ────────────────────

  const manualRefresh = useCallback(() => {
    setGates(prev =>
      prev.map(g => {
        const nw = nudge(g.wait, 1, 15)
        return { ...g, wait: nw, crowd: waitToCrowd(nw) }
      })
    )
    setWaitTimes(prev => {
      const oldRef = prevWaitRef.current
      const next = {
        restrooms:  prev.restrooms.map((item, i) => {
          const nw = nudge(item.wait, 1, 10)
          return { ...item, wait: nw, trend: computeTrend(oldRef.restrooms[i].wait, nw) }
        }),
        foodCourts: prev.foodCourts.map((item, i) => {
          const nw = nudge(item.wait, 2, 15)
          return { ...item, wait: nw, trend: computeTrend(oldRef.foodCourts[i].wait, nw) }
        }),
        parking:    prev.parking.map((item, i) => {
          const nw = nudge(item.wait, 3, 20)
          return { ...item, wait: nw, trend: computeTrend(oldRef.parking[i].wait, nw) }
        }),
      }
      prevWaitRef.current = {
        restrooms:  next.restrooms.map(i => ({ ...i })),
        foodCourts: next.foodCourts.map(i => ({ ...i })),
        parking:    next.parking.map(i => ({ ...i })),
      }
      return next
    })
    setLastUpdated(Date.now())
  }, [])

  // ── Fallback Mutations ──────────────────────────────────────────────────

  const addOrder = useCallback((orderObj) => {
    setOrders(prev => [orderObj, ...prev])
  }, [])

  const updateOrderStatus = useCallback((id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
  }, [])

  const toggleAlertResolved = useCallback((id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: !a.resolved } : a))
  }, [])

  const addAlert = useCallback((alertObj) => {
    setAlerts(prev => [alertObj, ...prev])
  }, [])

  const updateStaffStatus = useCallback((id, status) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, status } : s))
  }, [])

  // ── Context value ──────────────────────────────────────────────────────

  const value = {
    match,
    seat,
    gates,
    waitTimes,
    dashStats,
    alerts,
    orders,
    staff,
    lastUpdated,
    isBackendConnected,
    isInitialized,
    addOrder,
    updateOrderStatus,
    toggleAlertResolved,
    addAlert,
    updateStaffStatus,
    manualRefresh,
  }

  return (
    <VenueContext.Provider value={value}>
      {children}
    </VenueContext.Provider>
  )
}
