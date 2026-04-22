import { Router } from 'express'
import { store }  from '../store/inMemoryStore.js'

const router = Router()

// GET /api/staff
router.get('/', (_req, res) => {
  res.json(store.staff)
})

// PATCH /api/staff/:id — update status
router.patch('/:id', (req, res) => {
  const { status } = req.body
  const id         = parseInt(req.params.id, 10)
  const member     = store.staff.find(s => s.id === id)

  if (!member) {
    return res.status(404).json({ error: 'Staff member not found' })
  }

  member.status = status

  req.io.emit('staff:update', store.staff)
  res.json(member)
})

export default router
