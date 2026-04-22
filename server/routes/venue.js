import { Router } from 'express'
import { store }  from '../store/inMemoryStore.js'

const router = Router()

// GET /api/venue/status
router.get('/status', (_req, res) => {
  res.json({
    match:       store.match,
    gates:       store.gates,
    waitTimes:   store.waitTimes,
    dashStats:   store.dashStats,
    lastUpdated: Date.now(),
  })
})

export default router
