import { Router } from 'express'
import { store }  from '../store/inMemoryStore.js'

const router = Router()

// GET /api/orders — latest first
router.get('/', (_req, res) => {
  res.json(store.orders)
})

// POST /api/orders — create a new order
router.post('/', (req, res) => {
  const { seat, items, total, deliveryType } = req.body

  const secs = String(Math.floor(Math.random() * 59)).padStart(2, '0')
  const newOrder = {
    id:           'ORD-' + String(Math.floor(Math.random() * 900) + 100),
    seat:         seat || 'Unknown',
    items:        Array.isArray(items) ? items : [],
    time:         `${store.match.minute}:${secs}`,
    status:       'pending',
    total:        total || 0,
    deliveryType: deliveryType || 'seat',
  }

  store.orders.unshift(newOrder)
  store.dashStats.activeOrders = Math.min(200, store.dashStats.activeOrders + 1)

  req.io.emit('orders:update', store.orders)
  req.io.emit('stats:update',  store.dashStats)

  res.status(201).json(newOrder)
})

// PATCH /api/orders/:id — update order status
router.patch('/:id', (req, res) => {
  const { status } = req.body
  const order = store.orders.find(o => o.id === req.params.id)

  if (!order) {
    return res.status(404).json({ error: 'Order not found' })
  }

  const prev = order.status
  order.status = status

  // Decrement active orders when delivered
  if (status === 'delivered' && prev !== 'delivered') {
    store.dashStats.activeOrders = Math.max(0, store.dashStats.activeOrders - 1)
    req.io.emit('stats:update', store.dashStats)
  }

  req.io.emit('orders:update', store.orders)
  res.json(order)
})

export default router
