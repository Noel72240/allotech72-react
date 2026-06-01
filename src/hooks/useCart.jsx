import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { useShopCatalog } from './useShopCatalog.jsx'

const STORAGE_KEY = 'allotech72_cart_v1'
const CartContext = createContext(null)

function loadStoredCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveCart(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    /* quota / private mode */
  }
}

export function CartProvider({ children }) {
  const { getProductById } = useShopCatalog()
  const [items, setItems] = useState(() => loadStoredCart())

  useEffect(() => {
    saveCart(items)
  }, [items])

  const addItem = useCallback((productId, qty = 1) => {
    const product = getProductById(productId)
    if (!product) return { ok: false, msg: 'Produit introuvable.' }
    if (product.availability === 'vendu') return { ok: false, msg: 'Produit indisponible.' }
    if (product.price == null) return { ok: false, msg: 'Ce produit est sur devis (contactez-nous).' }

    setItems(prev => {
      const i = prev.findIndex(x => x.productId === productId)
      if (i >= 0) {
        const next = [...prev]
        next[i] = { ...next[i], qty: next[i].qty + qty }
        return next
      }
      return [...prev, { productId, qty }]
    })
    return { ok: true }
  }, [getProductById])

  const setQty = useCallback((productId, qty) => {
    const q = Math.max(0, Math.floor(qty))
    setItems(prev => {
      if (q === 0) return prev.filter(x => x.productId !== productId)
      return prev.map(x => (x.productId === productId ? { ...x, qty: q } : x))
    })
  }, [])

  const removeItem = useCallback(productId => {
    setItems(prev => prev.filter(x => x.productId !== productId))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const lines = useMemo(
    () =>
      items
        .map(line => {
          const product = getProductById(line.productId)
          if (!product || product.price == null) return null
          return {
            ...line,
            product,
            lineTotal: product.price * line.qty,
          }
        })
        .filter(Boolean),
    [items, getProductById]
  )

  const total = useMemo(
    () => lines.reduce((sum, l) => sum + l.lineTotal, 0),
    [lines]
  )

  const count = useMemo(
    () => items.reduce((sum, l) => sum + l.qty, 0),
    [items]
  )

  return (
    <CartContext.Provider
      value={{
        items,
        lines,
        total,
        count,
        addItem,
        setQty,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart doit être utilisé dans <CartProvider>')
  return ctx
}
