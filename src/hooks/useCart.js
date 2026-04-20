import { useState, useCallback } from 'react'

export function useCart() {
  const [cartItems, setCartItems] = useState([])  // [{ item, quantity }]
  const [isCartOpen, setIsCartOpen] = useState(false)

  const addToCart = useCallback((item) => {
    setCartItems(prev => {
      const existing = prev.find(ci => ci.item.id === item.id)
      if (existing) {
        return prev.map(ci =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        )
      }
      return [...prev, { item, quantity: 1 }]
    })
  }, [])

  const removeFromCart = useCallback((itemId) => {
    setCartItems(prev => {
      const existing = prev.find(ci => ci.item.id === itemId)
      if (!existing) return prev
      if (existing.quantity === 1) return prev.filter(ci => ci.item.id !== itemId)
      return prev.map(ci =>
        ci.item.id === itemId ? { ...ci, quantity: ci.quantity - 1 } : ci
      )
    })
  }, [])

  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  const openCart  = useCallback(() => setIsCartOpen(true),  [])
  const closeCart = useCallback(() => setIsCartOpen(false), [])

  const cartCount = cartItems.reduce((sum, ci) => sum + ci.quantity, 0)
  const cartTotal = cartItems.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0)

  return {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    cartCount,
    cartTotal,
    isCartOpen,
    openCart,
    closeCart,
  }
}
