import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { fetchShopProducts, fetchShopSettings } from '../lib/shop.js'

const ShopCatalogContext = createContext(null)

export function ShopCatalogProvider({ children }) {
  const [products, setProducts] = useState([])
  const [settings, setSettings] = useState({
    sumupMerchantCode: '',
    sumupEnabled: false,
    shopEnabled: false,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [prods, sett] = await Promise.all([
        fetchShopProducts(),
        fetchShopSettings(),
      ])
      setProducts(prods)
      setSettings(sett)
    } catch (e) {
      setError(e?.message || 'Erreur chargement boutique')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const getProducts = useCallback(
    ({ section, categoryId } = {}) =>
      products
        .filter(p => (section ? p.section === section : true))
        .filter(p => (categoryId ? p.categoryId === categoryId : true)),
    [products]
  )

  const getProductById = useCallback(
    id => products.find(p => p.id === id || p.slug === id),
    [products]
  )

  return (
    <ShopCatalogContext.Provider
      value={{
        products,
        settings,
        loading,
        error,
        refresh,
        getProducts,
        getProductById,
      }}
    >
      {children}
    </ShopCatalogContext.Provider>
  )
}

export function useShopCatalog() {
  const ctx = useContext(ShopCatalogContext)
  if (!ctx) throw new Error('useShopCatalog doit être utilisé dans <ShopCatalogProvider>')
  return ctx
}

/** true si la boutique doit apparaître (nav, hero, etc.) */
export function useShopVisible() {
  const { settings, loading } = useShopCatalog()
  return { shopVisible: settings.shopEnabled === true, loading }
}
