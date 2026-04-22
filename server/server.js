import express    from 'express'
import cors       from 'cors'
import dotenv     from 'dotenv'
import http       from 'http'
import { Server } from 'socket.io'

import { store, startLiveSimulation } from './store/inMemoryStore.js'
import venueRoutes  from './routes/venue.js'
import orderRoutes  from './routes/orders.js'
import chatRoutes   from './routes/chat.js'
import staffRoutes  from './routes/staff.js'
import alertRoutes  from './routes/alerts.js'

dotenv.config()

const app    = express()
const server = http.createServer(app)
const io     = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PATCH'] },
})

// ── Middleware ────────────────────────────────────────────────────────────
app.use(cors())
app.use(express.json())

// Attach io to every request so routes can emit events
app.use((req, _res, next) => {
  req.io = io
  next()
})

// ── Routes ────────────────────────────────────────────────────────────────
app.use('/api/venue',  venueRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/chat',   chatRoutes)
app.use('/api/staff',  staffRoutes)
app.use('/api/alerts', alertRoutes)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() })
})

// ── Socket.IO ─────────────────────────────────────────────────────────────
io.on('connection', socket => {
  console.log(`[socket] client connected: ${socket.id}`)

  // Send current full state immediately on connect
  socket.emit('gates:update',     store.gates)
  socket.emit('waitTimes:update', store.waitTimes)
  socket.emit('stats:update',     store.dashStats)
  socket.emit('match:update',     store.match)
  socket.emit('alerts:update',    store.alerts)
  socket.emit('orders:update',    store.orders)
  socket.emit('staff:update',     store.staff)

  socket.on('disconnect', () => {
    console.log(`[socket] client disconnected: ${socket.id}`)
  })
})

// ── Start ─────────────────────────────────────────────────────────────────
startLiveSimulation(io)

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`✅  VenueFlow backend running on http://localhost:${PORT}`)
})
