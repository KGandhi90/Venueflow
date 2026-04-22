import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { VenueProvider } from './context/VenueContext'
import { ToastProvider } from './hooks/useToast'
import { ErrorBoundary } from './components/ErrorBoundary'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <ToastProvider>
        <VenueProvider>
          <App />
        </VenueProvider>
      </ToastProvider>
    </ErrorBoundary>
  </StrictMode>,
)
