export const match = {
  home: 'City FC',
  away: 'United FC',
  homeScore: 2,
  awayScore: 1,
  minute: 67,
  status: 'LIVE',
  venue: 'Horizon Arena',
  matchday: 'Matchday 22',
}

export const seat = {
  section: 'F',
  row: '12',
  seat: '34',
  gate: 'Gate D',
}

export const gates = [
  { id: 'A', wait: 2,  crowd: 'low',    open: true },
  { id: 'B', wait: 8,  crowd: 'high',   open: true },
  { id: 'C', wait: 5,  crowd: 'medium', open: true },
  { id: 'D', wait: 3,  crowd: 'low',    open: true },
  { id: 'E', wait: 11, crowd: 'high',   open: true },
  { id: 'F', wait: 6,  crowd: 'medium', open: true },
]

export const waitTimes = {
  restrooms: [
    { id: 1, name: 'Block R1 — Near Gate A',  wait: 2, trend: 'down'   },
    { id: 2, name: 'Block R4 — Lower Stand',  wait: 7, trend: 'up'     },
    { id: 3, name: 'Block R7 — Food Court 2', wait: 4, trend: 'stable' },
    { id: 4, name: 'Block R11 — Upper Tier',  wait: 1, trend: 'down'   },
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
}

export const menuItems = {
  snacks: [
    { id: 1,  name: 'Nachos with Cheese', price: 220, tag: 'Popular' },
    { id: 2,  name: 'Popcorn (Large)',    price: 150, tag: null      },
    { id: 3,  name: 'Peanuts Masala',     price: 80,  tag: 'Spicy'  },
    { id: 4,  name: 'Samosa (2 pcs)',     price: 60,  tag: null      },
  ],
  mains: [
    { id: 5,  name: 'Classic Burger',     price: 350, tag: 'Bestseller' },
    { id: 6,  name: 'Paneer Wrap',        price: 280, tag: 'Veg'        },
    { id: 7,  name: 'Chicken Tikka Roll', price: 320, tag: 'Spicy'      },
    { id: 8,  name: 'Loaded Fries',       price: 200, tag: null         },
  ],
  drinks: [
    { id: 9,  name: 'Cola (500ml)',  price: 120, tag: null },
    { id: 10, name: 'Lime Soda',     price: 80,  tag: null },
    { id: 11, name: 'Cold Coffee',   price: 160, tag: null },
    { id: 12, name: 'Water (1L)',    price: 40,  tag: null },
  ],
  merchandise: [
    { id: 13, name: 'City FC Home Jersey', price: 1200, tag: 'New' },
    { id: 14, name: 'Team Cap',            price: 450,  tag: null  },
    { id: 15, name: 'Scarf',               price: 300,  tag: null  },
    { id: 16, name: 'Keychain',            price: 120,  tag: null  },
  ],
}

export const orders = [
  { id: 'ORD-001', seat: 'F12-34', items: ['Classic Burger', 'Cola'],
    time: '67:02', status: 'preparing', total: 470 },
  { id: 'ORD-002', seat: 'B04-12', items: ['Nachos with Cheese'],
    time: '66:44', status: 'ready',     total: 220 },
  { id: 'ORD-003', seat: 'C08-07', items: ['Paneer Wrap', 'Lime Soda', 'Samosa'],
    time: '66:21', status: 'delivered', total: 420 },
  { id: 'ORD-004', seat: 'A01-01', items: ['Team Cap', 'Scarf'],
    time: '65:58', status: 'pending',   total: 750 },
]

export const staff = [
  { id: 1, name: 'Riya Sharma', role: 'Gate Marshal',   zone: 'Gate A',      status: 'on-duty' },
  { id: 2, name: 'Arun Menon',  role: 'Food Supervisor', zone: 'Court 2',    status: 'on-duty' },
  { id: 3, name: 'Priya Nair',  role: 'Medic',           zone: 'Gate C',     status: 'on-duty' },
  { id: 4, name: 'Dev Kapoor',  role: 'Security',        zone: 'Gate E',     status: 'break'   },
  { id: 5, name: 'Sneha Iyer',  role: 'Crowd Control',   zone: 'Lower Stand',status: 'on-duty' },
]

export const alerts = [
  { id: 1, time: '67:14', zone: 'Gate B',       type: 'congestion',
    msg: 'Queue exceeded 8 min threshold — staff alert sent',    resolved: false },
  { id: 2, time: '65:30', zone: 'Food Court 3', type: 'stock',
    msg: 'Burger patties running low — restock requested',       resolved: false },
  { id: 3, time: '63:00', zone: 'Gate E',       type: 'congestion',
    msg: 'Queue normalised after redirecting crowd to Gate F',   resolved: true  },
]

export const dashStats = {
  checkedIn:    38247,
  capacity:     50000,
  avgWait:      5.4,
  activeOrders: 143,
  openTickets:  7,
  crowdIndex:   74,
}
