import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import TopBar from './components/TopBar'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Map from './pages/Map'
import WaitTimes from './pages/WaitTimes'
import Orders from './pages/Orders'
import Chat from './pages/Chat'
import EntryGuide from './pages/EntryGuide'
import Dashboard from './pages/Dashboard'

// Layout wrapper for attendee pages
function AttendeeLayout() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: '#0A0A0F',
      }}
    >
      <TopBar />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Outlet />
      </div>
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Attendee routes with shared layout */}
        <Route element={<AttendeeLayout />}>
          <Route path="/"          element={<Home />}       />
          <Route path="/map"       element={<Map />}        />
          <Route path="/waittimes" element={<WaitTimes />}  />
          <Route path="/orders"    element={<Orders />}     />
          <Route path="/chat"      element={<Chat />}       />
          <Route path="/entry"     element={<EntryGuide />} />
        </Route>

        {/* Ops dashboard — standalone, no TopBar/BottomNav */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
