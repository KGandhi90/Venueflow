import { Router } from 'express'
import { store }  from '../store/inMemoryStore.js'

const router = Router()

// GET /api/alerts
router.get('/', (_req, res) => {
  res.json(store.alerts)
})

// PATCH /api/alerts/:id/resolve
router.patch('/:id/resolve', (req, res) => {
  const id    = parseInt(req.params.id, 10)
  const alert = store.alerts.find(a => a.id === id)

  if (!alert) {
    return res.status(404).json({ error: 'Alert not found' })
  }

  alert.resolved = true
  store.dashStats.openTickets = Math.max(0, store.dashStats.openTickets - 1)

  req.io.emit('alerts:update', store.alerts)
  req.io.emit('stats:update',  store.dashStats)
  res.json(alert)
})

// POST /api/alerts/broadcast
router.post('/broadcast', (req, res) => {
  const { message, zone } = req.body

  if (!message?.trim()) {
    return res.status(400).json({ error: 'message is required' })
  }

  const newAlert = {
    id:       Date.now(),
    time:     `${store.match.minute}:00`,
    zone:     zone?.trim() || 'All Zones',
    type:     'broadcast',
    msg:      message.trim(),
    resolved: false,
  }

  store.alerts.unshift(newAlert)

  req.io.emit('alerts:update', store.alerts)
  res.status(201).json(newAlert)
})

export default router
