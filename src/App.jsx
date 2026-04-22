import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom'
import TopBar from './components/TopBar'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Map from './pages/Map'
import WaitTimes from './pages/WaitTimes'
import Orders from './pages/Orders'
import Chat from './pages/Chat'
import EntryGuide from './pages/EntryGuide'
import Dashboard from './pages/Dashboard'
import PageTransition from './components/PageTransition'
import ConnectionBanner from './components/ConnectionBanner'
import Toast from './components/Toast'
import { useToast } from './hooks/useToast'

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
      <ConnectionBanner />
      <TopBar />
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        <PageTransition>
          <Outlet />
        </PageTransition>
      </div>
      <BottomNav />
    </div>
  )
}

function MainApp() {
  const { toasts, removeToast } = useToast()
  return (
    <>
      <Toast toasts={toasts} removeToast={removeToast} />
      <Routes>
        <Route element={<AttendeeLayout />}>
          <Route path="/"          element={<Home />}       />
          <Route path="/map"       element={<Map />}        />
          <Route path="/waittimes" element={<WaitTimes />}  />
          <Route path="/orders"    element={<Orders />}     />
          <Route path="/chat"      element={<Chat />}       />
          <Route path="/entry"     element={<EntryGuide />} />
        </Route>
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  )
}
