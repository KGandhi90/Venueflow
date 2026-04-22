import React from 'react'
import { AlertTriangle } from 'lucide-react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0A0A0F', textAlign: 'center', padding: 40 }}>
          <AlertTriangle size={48} color="#FFB547" />
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, color: '#F0F0F0', marginTop: 24 }}>
            Something went wrong
          </h1>
          <p style={{ color: '#6B6B7A', fontSize: 14, marginTop: 8 }}>
            Try refreshing the page
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: 24, background: '#C8F135', color: '#0A0A0F', border: 'none', borderRadius: 9999, padding: '12px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            Refresh
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
