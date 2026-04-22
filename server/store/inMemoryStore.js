export const store = {

  match: {
    home:      'City FC',
    away:      'United FC',
    homeScore: 2,
    awayScore: 1,
    minute:    67,
    status:    'LIVE',
    venue:     'Horizon Arena',
    matchday:  'Matchday 22',
  },

  gates: [
    { id: 'A', wait: 2,  crowd: 'low',    open: true },
    { id: 'B', wait: 8,  crowd: 'high',   open: true },
    { id: 'C', wait: 5,  crowd: 'medium', open: true },
    { id: 'D', wait: 3,  crowd: 'low',    open: true },
    { id: 'E', wait: 11, crowd: 'high',   open: true },
    { id: 'F', wait: 6,  crowd: 'medium', open: true },
  ],

  waitTimes: {
    restrooms: [
      { id: 1, name: 'Block R1 — Near Gate A',  wait: 2,  trend: 'down'   },
      { id: 2, name: 'Block R4 — Lower Stand',  wait: 7,  trend: 'up'     },
      { id: 3, name: 'Block R7 — Food Court 2', wait: 4,  trend: 'stable' },
      { id: 4, name: 'Block R11 — Upper Tier',  wait: 1,  trend: 'down'   },
    ],
    foodCourts: [
      { id: 1, name: 'Food Court 1 — Gate A side', wait: 9,  trend: 'up'     },
      { id: 2, name: 'Food Court 2 — Central',     wait: 4,  trend: 'stable' },
      { id: 3, name: 'Food Court 3 — Gate E side', wait: 12, trend: 'up'     },
      { id: 4, name: 'Food Court 4 — Upper Level', wait: 2,  trend: 'down'   },
    ],
    parking: [
      { id: 1, name: 'Lot A — North Entry', wait: 15, trend: 'up'     },
      { id: 2, name: 'Lot B — East Entry',  wait: 6,  trend: 'stable' },
      { id: 3, name: 'Lot C — South Entry', wait: 3,  trend: 'down'   },
    ],
  },

  dashStats: {
    checkedIn:    38247,
    capacity:     50000,
    avgWait:      5.4,
    activeOrders: 143,
    openTickets:  7,
    crowdIndex:   74,
  },

  orders: [
    { id: 'ORD-001', seat: 'F12-34', items: ['Classic Burger', 'Cola'],
      time: '67:02', status: 'preparing', total: 470 },
    { id: 'ORD-002', seat: 'B04-12', items: ['Nachos with Cheese'],
      time: '66:44', status: 'ready',     total: 220 },
    { id: 'ORD-003', seat: 'C08-07', items: ['Paneer Wrap', 'Lime Soda'],
      time: '66:21', status: 'delivered', total: 420 },
    { id: 'ORD-004', seat: 'A01-01', items: ['Team Cap', 'Scarf'],
      time: '65:58', status: 'pending',   total: 750 },
  ],

  staff: [
    { id: 1, name: 'Riya Sharma',  role: 'Gate Marshal',    zone: 'Gate A',      status: 'on-duty' },
    { id: 2, name: 'Arun Menon',   role: 'Food Supervisor', zone: 'Court 2',     status: 'on-duty' },
    { id: 3, name: 'Priya Nair',   role: 'Medic',           zone: 'Gate C',      status: 'on-duty' },
    { id: 4, name: 'Dev Kapoor',   role: 'Security',        zone: 'Gate E',      status: 'break'   },
    { id: 5, name: 'Sneha Iyer',   role: 'Crowd Control',   zone: 'Lower Stand', status: 'on-duty' },
  ],

  alerts: [
    { id: 1, time: '67:14', zone: 'Gate B',       type: 'congestion',
      msg: 'Queue exceeded 8 min threshold — staff alert sent',  resolved: false },
    { id: 2, time: '65:30', zone: 'Food Court 3', type: 'stock',
      msg: 'Burger patties running low — restock requested',      resolved: false },
    { id: 3, time: '63:00', zone: 'Gate E',       type: 'congestion',
      msg: 'Queue normalised after redirecting crowd to Gate F',  resolved: true  },
  ],

}

// ── Live simulation (server-side) ──────────────────────────────────────────

export function startLiveSimulation(io) {

  // Gate waits — every 12 s
  setInterval(() => {
    store.gates = store.gates.map(gate => {
      const nudge = Math.random() > 0.5 ? 1 : -1
      const wait  = Math.min(15, Math.max(1, gate.wait + nudge))
      const crowd = wait <= 3 ? 'low' : wait <= 7 ? 'medium' : 'high'
      return { ...gate, wait, crowd }
    })
    io.emit('gates:update', store.gates)
  }, 12_000)

  // Wait times — every 15 s
  setInterval(() => {
    const nudge = arr => arr.map(item => {
      const prev  = item.wait
      const next  = Math.min(20, Math.max(1, prev + (Math.random() > 0.5 ? 1 : -1)))
      const trend = next > prev ? 'up' : next < prev ? 'down' : 'stable'
      return { ...item, wait: next, trend }
    })
    store.waitTimes.restrooms  = nudge(store.waitTimes.restrooms)
    store.waitTimes.foodCourts = nudge(store.waitTimes.foodCourts)
    store.waitTimes.parking    = nudge(store.waitTimes.parking)
    io.emit('waitTimes:update', store.waitTimes)
  }, 15_000)

  // Dashboard stats — every 10 s
  setInterval(() => {
    store.dashStats.checkedIn    = Math.min(
      store.dashStats.capacity,
      store.dashStats.checkedIn + Math.floor(Math.random() * 30) + 10
    )
    store.dashStats.avgWait = parseFloat(
      Math.min(12, Math.max(2,
        store.dashStats.avgWait + (Math.random() > 0.5 ? 0.1 : -0.1)
      )).toFixed(1)
    )
    store.dashStats.activeOrders = Math.min(200, Math.max(100,
      store.dashStats.activeOrders + (Math.random() > 0.5 ? 1 : -1)
    ))
    store.dashStats.crowdIndex = Math.min(95, Math.max(50,
      store.dashStats.crowdIndex + (Math.random() > 0.5 ? 1 : -1)
    ))
    io.emit('stats:update', store.dashStats)
  }, 10_000)

  // Match minute — every 60 s
  setInterval(() => {
    if (store.match.minute < 90) store.match.minute += 1
    io.emit('match:update', store.match)
  }, 60_000)

  // Auto-alert if gate wait > 10 min — every 15 s
  setInterval(() => {
    store.gates.forEach(gate => {
      if (gate.wait > 10) {
        const exists = store.alerts.some(
          a => a.zone === `Gate ${gate.id}` && !a.resolved
        )
        if (!exists) {
          const alert = {
            id:       Date.now(),
            time:     `${store.match.minute}:${String(Math.floor(Math.random() * 59)).padStart(2, '0')}`,
            zone:     `Gate ${gate.id}`,
            type:     'congestion',
            msg:      `Queue at Gate ${gate.id} exceeded 10 min — auto-alert triggered`,
            resolved: false,
          }
          store.alerts.unshift(alert)
          io.emit('alerts:update', store.alerts)
        }
      }
    })
  }, 15_000)
}
