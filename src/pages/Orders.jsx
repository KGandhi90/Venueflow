import { useState } from 'react'
import { menuItems } from '../data/mockData'
import FoodItem from '../components/FoodItem'

const CATEGORIES = [
  { key: 'snacks',       label: 'Snacks',       isMerch: false },
  { key: 'mains',        label: 'Mains',        isMerch: false },
  { key: 'drinks',       label: 'Drinks',       isMerch: false },
  { key: 'merchandise',  label: 'Merchandise',  isMerch: true  },
]

export default function Orders() {
  const [activeTab, setActiveTab] = useState('snacks')
  const [cart, setCart] = useState([])

  const activeCategory = CATEGORIES.find(c => c.key === activeTab)
  const items = menuItems[activeTab] || []

  const cartTotal = cart.reduce((sum, i) => sum + i.price, 0)

  const addToCart = item => setCart(prev => [...prev, item])

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Tab strip */}
      <div
        className="no-scrollbar"
        style={{
          display: 'flex',
          gap: 0,
          overflowX: 'auto',
          padding: '16px 20px 0',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            id={`tab-${cat.key}`}
            onClick={() => setActiveTab(cat.key)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '10px 18px',
              fontSize: 14,
              fontWeight: activeTab === cat.key ? 600 : 400,
              color: activeTab === cat.key ? '#F0F0F0' : '#6B6B7A',
              position: 'relative',
              whiteSpace: 'nowrap',
              transition: 'color 0.15s ease',
              flexShrink: 0,
            }}
          >
            {cat.label}
            {activeTab === cat.key && (
              <span
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '70%',
                  height: 2,
                  background: '#C8F135',
                  borderRadius: 9999,
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Items grid */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 20px',
          paddingBottom: cart.length > 0 ? 160 : 110,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
          }}
        >
          {items.map(item => (
            <FoodItem
              key={item.id}
              item={item}
              isMerch={activeCategory?.isMerch}
              onAdd={() => addToCart(item)}
            />
          ))}
        </div>
      </div>

      {/* Cart preview bar */}
      {cart.length > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: 90,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 40px)',
            maxWidth: 480,
            background: '#1A1A24',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            padding: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 150,
            backdropFilter: 'blur(12px)',
          }}
        >
          <span style={{ fontSize: 14, color: '#F0F0F0', fontWeight: 500 }}>
            {cart.length} {cart.length === 1 ? 'item' : 'items'} ·{' '}
            <span style={{ color: '#C8F135', fontFamily: 'Syne, sans-serif' }}>₹{cartTotal}</span>
          </span>
          <button
            id="view-cart-btn"
            style={{
              background: '#C8F135',
              color: '#0A0A0F',
              border: 'none',
              borderRadius: 9999,
              padding: '8px 16px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            View Cart →
          </button>
        </div>
      )}
    </div>
  )
}
