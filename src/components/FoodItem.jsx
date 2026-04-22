import { UtensilsCrossed, ShoppingBag } from 'lucide-react'

const tagColor = {
  Popular:    { bg: 'rgba(124,106,250,0.15)', color: '#7C6AFA' },
  Spicy:      { bg: 'rgba(255,77,109,0.12)',  color: '#FF4D6D' },
  Veg:        { bg: 'rgba(0,214,143,0.12)',   color: '#00D68F' },
  Bestseller: { bg: 'rgba(255,181,71,0.12)',  color: '#FFB547' },
  New:        { bg: 'rgba(200,241,53,0.12)',  color: '#C8F135' },
}

export default function FoodItem({ item, isMerch = false, onAdd, qty = 0 }) {
  const tag = item.tag ? tagColor[item.tag] : null

  return (
    <div
      className="pressable"
      style={{
        background: '#111118',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        position: 'relative',
      }}
    >
      {/* Placeholder image */}
      <div
        style={{
          background: '#1A1A24',
          borderRadius: 12,
          height: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isMerch
          ? <ShoppingBag size={28} color="#6B6B7A" strokeWidth={1.5} />
          : <UtensilsCrossed size={28} color="#6B6B7A" strokeWidth={1.5} />
        }
      </div>

      {/* Tag */}
      {tag && (
        <span
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            background: tag.bg,
            color: tag.color,
            fontSize: 9,
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: 9999,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {item.tag}
        </span>
      )}

      {/* Name */}
      <p style={{ fontSize: 13, color: '#F0F0F0', fontWeight: 500, lineHeight: 1.4 }}>
        {item.name}
      </p>

      {/* Price + Add button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 16,
            fontWeight: 600,
            color: '#C8F135',
          }}
        >
          ₹{item.price}
        </span>
        <button
          id={`add-item-${item.id}`}
          onClick={onAdd}
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: '#C8F135',
            color: '#0A0A0F',
            border: 'none',
            fontSize: qty > 0 ? 13 : 18,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
            flexShrink: 0,
            transition: 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
            position: 'relative',
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(1.2)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <span key={qty} className={qty > 0 ? 'animate-bounceScale' : ''}>
            {qty > 0 ? qty : '+'}
          </span>
        </button>
      </div>
    </div>
  )
}
