import { useState, useEffect, useRef } from 'react'
import { X, CheckCircle, Minus, Plus } from 'lucide-react'
import { menuItems } from '../data/mockData'
import { useVenue } from '../context/VenueContext'
import { useCart } from '../hooks/useCart'
import FoodItem from '../components/FoodItem'
import { venueApi } from '../api/venueApi'
import { useToast } from '../hooks/useToast'
import EmptyState from '../components/EmptyState'
import { Skeleton, SkeletonMenuGrid } from '../components/Skeleton'

const CATEGORIES = [
  { key: 'snacks',      label: 'Snacks',      isMerch: false },
  { key: 'mains',       label: 'Mains',       isMerch: false },
  { key: 'drinks',      label: 'Drinks',      isMerch: false },
  { key: 'merchandise', label: 'Merchandise', isMerch: true  },
]

export default function Orders() {
  const { seat, match, addOrder, isInitialized } = useVenue()
  const {
    cartItems, addToCart, removeFromCart, clearCart,
    cartCount, cartTotal, isCartOpen, openCart, closeCart,
  } = useCart()
  const { showToast } = useToast()

  const [activeTab, setActiveTab]   = useState('snacks')
  const [delivery, setDelivery]     = useState('seat')    // 'seat' | 'pickup'
  const [cartVisible, setCartVisible] = useState(false)   // track first appearance

  const tabsRef   = useRef(null)
  const activeIdx = CATEGORIES.findIndex(c => c.key === activeTab)

  // Show cart bar with slide-up when first item added
  useEffect(() => {
    if (cartCount > 0) setCartVisible(true)
    if (cartCount === 0) setCartVisible(false) // Reset cart visibility for slide-down
  }, [cartCount])

  const items          = menuItems[activeTab] || []
  const activeCategory = CATEGORIES.find(c => c.key === activeTab)

  // Compute tab indicator translateX
  const getTabOffset = () => {
    if (!tabsRef.current) return 0
    const tabEls = tabsRef.current.querySelectorAll('[data-tab]')
    if (!tabEls[activeIdx]) return 0
    return tabEls[activeIdx].offsetLeft
  }

  const [tabOffset, setTabOffset] = useState(0)
  const [tabWidth, setTabWidth]   = useState(0)
  useEffect(() => {
    const update = () => {
      if (!tabsRef.current) return
      const tabEls = tabsRef.current.querySelectorAll('[data-tab]')
      if (tabEls[activeIdx]) {
        setTabOffset(tabEls[activeIdx].offsetLeft)
        setTabWidth(tabEls[activeIdx].offsetWidth)
      }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [activeTab, activeIdx])

  const handlePlaceOrder = async () => {
    try {
      await venueApi.createOrder({
        seat:         `${seat.section}${seat.row}-${seat.seat}`,
        items:        cartItems.map(ci => ci.item.name),
        total:        cartTotal,
        deliveryType: delivery,
      })
    } catch (err) {
      console.warn('Backend unavailable — using mock data for order')
      const secs = String(Math.floor(Math.random() * 59)).padStart(2, '0')
      const orderObj = {
        id:     'ORD-' + String(Math.floor(Math.random() * 900) + 100),
        seat:   `${seat.section}${seat.row}-${seat.seat}`,
        items:  cartItems.map(ci => ci.item.name),
        time:   `${match.minute}:${secs}`,
        status: 'pending',
        total:  cartTotal,
      }
      addOrder(orderObj)
    }
    clearCart()
    closeCart()
    setCartVisible(false)
    showToast(`Order placed! ${delivery === 'seat' ? `Delivering to seat ${seat.section}${seat.row}-${seat.seat}` : 'Ready for pickup shortly'}`, 'success', CheckCircle)
  }

  const getQty = (itemId) => {
    const ci = cartItems.find(ci => ci.item.id === itemId)
    return ci ? ci.quantity : 0
  }

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Tab strip */}
      <div
        className="no-scrollbar"
        ref={tabsRef}
        style={{
          display: 'flex',
          gap: 0,
          overflowX: 'auto',
          padding: '16px 20px 0',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          position: 'relative',
        }}
      >
        {!isInitialized ? (
          <>
            <Skeleton width="80px" height="38px" rounded="rounded-full" />
            <Skeleton width="80px" height="38px" rounded="rounded-full" />
            <Skeleton width="80px" height="38px" rounded="rounded-full" />
            <Skeleton width="80px" height="38px" rounded="rounded-full" />
          </>
        ) : (
          CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              data-tab
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
                whiteSpace: 'nowrap',
                transition: 'color 0.15s ease',
                flexShrink: 0,
              }}
            >
              {cat.label}
            </button>
          ))
        )}
        {/* Sliding underline indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            height: 2,
            background: '#C8F135',
            borderRadius: 9999,
            left: tabOffset + 18,
            width: Math.max(0, tabWidth - 36),
            transition: 'left 0.2s ease, width 0.2s ease',
          }}
        />
      </div>

      {/* Items grid */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 20px',
          paddingBottom: cartCount > 0 ? 160 : 110,
        }}
      >
        {!isInitialized ? (
          <SkeletonMenuGrid />
        ) : items.length === 0 ? (
          <EmptyState
            icon={UtensilsCrossed}
            title="Nothing here yet"
            subtitle="Try another category"
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {items.map(item => {
              const qty = getQty(item.id)
              return (
                <FoodItem
                  key={item.id}
                  item={item}
                  isMerch={activeCategory?.isMerch}
                  onAdd={() => addToCart(item)}
                  qty={qty}
                />
              )
            })}
          </div>
        )}
      </div>

      {/* Cart preview bar */}
      {cartVisible && (
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
            pointerEvents: cartCount > 0 ? 'auto' : 'none',
            animation: cartCount > 0 ? 'toastIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : 'toastOut 0.2s ease forwards',
          }}
        >
          <span style={{ fontSize: 14, color: '#F0F0F0', fontWeight: 500 }}>
            {cartCount} {cartCount === 1 ? 'item' : 'items'} ·{' '}
            <span style={{ color: '#C8F135', fontFamily: 'Syne, sans-serif' }}>₹{cartTotal}</span>
          </span>
          <button
            id="view-cart-btn"
            onClick={openCart}
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

      {/* Cart slide-in overlay */}
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={closeCart}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 300,
              animation: 'fadeUp 0.2s ease forwards',
            }}
          />

          {/* Panel */}
          <div
            className="cart-panel"
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: 'min(400px, 100vw)',
              background: '#111118',
              border: '1px solid rgba(255,255,255,0.07)',
              zIndex: 400,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Cart header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 20px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                flexShrink: 0,
              }}
            >
              <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700, color: '#F0F0F0' }}>
                Your Cart
              </span>
              <button
                onClick={closeCart}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4 }}
              >
                <X size={20} color="#6B6B7A" />
              </button>
            </div>

            {/* Cart items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }} className="no-scrollbar">
              {cartItems.length === 0 ? (
                <EmptyState
                  icon={ShoppingBag}
                  title="Your cart is empty"
                  subtitle="Add something from the menu to get started"
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {cartItems.map(({ item, quantity }) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 12,
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14, color: '#F0F0F0', fontWeight: 500, marginBottom: 2 }}>
                          {item.name}
                        </p>
                        <p style={{ fontSize: 13, color: '#C8F135', fontFamily: 'Syne, sans-serif' }}>
                          ₹{item.price * quantity}
                        </p>
                      </div>
                      {/* Qty controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          style={{
                            width: 28, height: 28, borderRadius: '50%',
                            background: '#1A1A24', border: '1px solid rgba(255,255,255,0.08)',
                            color: '#F0F0F0', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#F0F0F0', minWidth: 16, textAlign: 'center' }}>
                          {quantity}
                        </span>
                        <button
                          onClick={() => addToCart(item)}
                          style={{
                            width: 28, height: 28, borderRadius: '50%',
                            background: '#C8F135', border: 'none',
                            color: '#0A0A0F', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart footer */}
            {cartItems.length > 0 && (
              <div
                style={{
                  padding: '16px 20px 24px',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                }}
              >
                {/* Subtotal */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: '#6B6B7A' }}>Subtotal</span>
                  <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700, color: '#C8F135' }}>
                    ₹{cartTotal}
                  </span>
                </div>

                {/* Delivery toggle */}
                <div
                  style={{
                    display: 'flex',
                    background: '#1A1A24',
                    borderRadius: 9999,
                    padding: 4,
                    gap: 4,
                  }}
                >
                  {[
                    { val: 'seat',   label: 'Deliver to Seat' },
                    { val: 'pickup', label: 'Pickup'          },
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => setDelivery(opt.val)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: 9999,
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: 13,
                        fontWeight: delivery === opt.val ? 600 : 400,
                        background: delivery === opt.val ? '#C8F135' : 'transparent',
                        color: delivery === opt.val ? '#0A0A0F' : '#6B6B7A',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Place Order */}
                <button
                  id="place-order-btn"
                  onClick={handlePlaceOrder}
                  style={{
                    width: '100%',
                    background: '#C8F135',
                    color: '#0A0A0F',
                    border: 'none',
                    borderRadius: 12,
                    padding: '14px 20px',
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'Syne, sans-serif',
                  }}
                >
                  Place Order · ₹{cartTotal}
                </button>
              </div>
            )}
          </div>
        </>
      )}

    </div>
  )
}
