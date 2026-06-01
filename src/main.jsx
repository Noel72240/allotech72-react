import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider }    from './hooks/useAuth.jsx'
import { CookiesProvider } from './hooks/useCookies.jsx'
import { ShopCatalogProvider } from './hooks/useShopCatalog.jsx'
import { CartProvider } from './hooks/useCart.jsx'
import './styles/globals.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <CookiesProvider>
          <ShopCatalogProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </ShopCatalogProvider>
        </CookiesProvider>
      </AuthProvider>
    </HelmetProvider>
  </StrictMode>,
)
