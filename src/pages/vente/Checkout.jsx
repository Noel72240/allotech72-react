import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PageLayout from '../../components/PageLayout.jsx'
import config from '../../config.js'
import { useCart } from '../../hooks/useCart.jsx'
import { useShopCatalog } from '../../hooks/useShopCatalog.jsx'
import { formatPrice } from '../../lib/shop.js'

export default function Checkout() {
  const { lines, total } = useCart()
  const { settings } = useShopCatalog()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' })

  if (lines.length === 0) {
    return (
      <PageLayout title="Paiement" description="Paiement Allotech72">
        <section className="sp">
          <div className="container">
            <div className="shop-empty">
              Panier vide. <Link to="/boutique">Retour boutique</Link>
            </div>
          </div>
        </section>
      </PageLayout>
    )
  }

  const startSumUp = async () => {
    if (!settings.sumupEnabled) {
      setError('Le paiement SumUp n’est pas activé. Contactez le magasin.')
      return
    }

    setLoading(true)
    setError('')

    const description = lines
      .map(l => `${l.qty}× ${l.product.title}`)
      .join(' · ')
      .slice(0, 140)

    const checkoutReference = `at72-${Date.now()}`
    const redirectUrl = `${config.siteUrl.replace(/\/$/, '')}/panier/confirmation?ref=${encodeURIComponent(checkoutReference)}`

    try {
      const res = await fetch('/api/sumup-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          currency: 'EUR',
          description,
          checkout_reference: checkoutReference,
          merchant_code: settings.sumupMerchantCode || undefined,
          redirect_url: redirectUrl,
          customer,
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        const hint = data.hint ? ` ${data.hint}` : ''
        throw new Error((data.error || 'Impossible de créer le paiement') + hint)
      }

      if (data.url) {
        sessionStorage.setItem('allotech72_pending_checkout', checkoutReference)
        sessionStorage.setItem(
          'allotech72_pending_order',
          JSON.stringify({
            checkoutReference,
            checkoutId: data.checkoutId,
            items: lines.map(({ product, qty }) => ({
              productId: product.id,
              qty,
            })),
          }),
        )
        window.location.href = data.url
        return
      }

      throw new Error('URL de paiement manquante')
    } catch (e) {
      setError(e?.message || 'Erreur paiement')
      setLoading(false)
    }
  }

  return (
    <PageLayout title="Paiement" description="Finaliser votre commande Allotech72 via SumUp.">
      <section className="sp">
        <div className="container cart-page">
          <div className="shop-topbar">
            <div>
              <span className="stag">Paiement</span>
              <h2 style={{ marginTop: 8 }}>SumUp</h2>
              <p className="sub" style={{ marginLeft: 0, marginRight: 0 }}>
                Total à régler : <strong style={{ color: 'var(--c)' }}>{formatPrice(total)}</strong>
              </p>
            </div>
            <Link className="shop-backlink" to="/panier">← Retour panier</Link>
          </div>

          <div className="checkout-grid">
            <div className="checkout-form-card">
              <h3 style={{ marginBottom: 16, fontFamily: "'Orbitron',sans-serif", color: '#fff', fontSize: '1rem' }}>
                Coordonnées (optionnel)
              </h3>
              <div className="fg" style={{ marginBottom: 12 }}>
                <label>Nom</label>
                <input
                  type="text"
                  value={customer.name}
                  onChange={e => setCustomer(c => ({ ...c, name: e.target.value }))}
                  placeholder="Votre nom"
                />
              </div>
              <div className="fg" style={{ marginBottom: 12 }}>
                <label>Email</label>
                <input
                  type="email"
                  value={customer.email}
                  onChange={e => setCustomer(c => ({ ...c, email: e.target.value }))}
                  placeholder="email@exemple.fr"
                />
              </div>
              <div className="fg" style={{ marginBottom: 20 }}>
                <label>Téléphone</label>
                <input
                  type="tel"
                  value={customer.phone}
                  onChange={e => setCustomer(c => ({ ...c, phone: e.target.value }))}
                  placeholder="06 …"
                />
              </div>

              {error && <div className="checkout-error">{error}</div>}

              <button
                type="button"
                className="shop-btn primary"
                style={{ width: '100%' }}
                disabled={loading}
                onClick={startSumUp}
              >
                {loading ? 'Redirection SumUp…' : `Payer ${formatPrice(total)} avec SumUp`}
              </button>

              <p className="cart-sumup-hint" style={{ marginTop: 14 }}>
                Paiement sécurisé sur la page SumUp. En local (`npm run dev`), utilisez{' '}
                <code style={{ fontSize: '.8rem' }}>npx vercel dev</code> pour tester l’API.
              </p>
            </div>

            <div className="checkout-recap">
              <h3 style={{ marginBottom: 14, fontFamily: "'Orbitron',sans-serif", color: '#fff', fontSize: '1rem' }}>
                Récapitulatif
              </h3>
              <ul className="checkout-recap-list">
                {lines.map(({ product, qty, lineTotal }) => (
                  <li key={product.id}>
                    <span>{qty}× {product.title}</span>
                    <span>{formatPrice(lineTotal)}</span>
                  </li>
                ))}
              </ul>
              <div className="cart-summary-row" style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(0,207,255,0.15)' }}>
                <span>Total</span>
                <strong>{formatPrice(total)}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}

export function CheckoutSuccess() {
  const { clearCart } = useCart()
  const { refresh } = useShopCatalog()
  const [searchParams] = useSearchParams()
  const [fulfillState, setFulfillState] = useState('loading')

  useEffect(() => {
    let cancelled = false

    async function confirmPayment() {
      const ref = searchParams.get('ref')?.trim()
      const raw = sessionStorage.getItem('allotech72_pending_order')

      if (!ref || !raw) {
        if (!cancelled) setFulfillState('unknown')
        return
      }

      let pending
      try {
        pending = JSON.parse(raw)
      } catch {
        if (!cancelled) setFulfillState('error')
        return
      }

      try {
        const res = await fetch('/api/sumup-complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            checkout_reference: ref,
            checkout_id: pending.checkoutId,
            items: pending.items,
          }),
        })
        const data = await res.json().catch(() => ({}))

        if (cancelled) return

        if (res.ok && data.ok) {
          clearCart()
          sessionStorage.removeItem('allotech72_pending_order')
          sessionStorage.removeItem('allotech72_pending_checkout')
          await refresh()
          setFulfillState('ok')
          return
        }

        if (res.status === 402) {
          setFulfillState('pending')
          return
        }

        setFulfillState('error')
      } catch {
        if (!cancelled) setFulfillState('error')
      }
    }

    confirmPayment()
    return () => { cancelled = true }
  }, [searchParams, clearCart, refresh])

  const onClear = () => {
    clearCart()
    sessionStorage.removeItem('allotech72_pending_order')
    sessionStorage.removeItem('allotech72_pending_checkout')
  }

  const message =
    fulfillState === 'loading'
      ? 'Vérification du paiement SumUp en cours…'
      : fulfillState === 'ok'
        ? 'Paiement confirmé. Les articles en stock unique ont été retirés de la boutique. Je vous recontacte pour la remise ou l’envoi.'
        : fulfillState === 'pending'
          ? 'Paiement en attente de confirmation. Si vous avez payé, actualisez cette page dans quelques instants ou contactez-moi.'
          : fulfillState === 'unknown'
            ? 'Merci pour votre commande. Si le paiement est validé, je vous recontacte rapidement.'
            : 'Le paiement n’a pas pu être confirmé automatiquement. Contactez-moi avec votre référence de commande.'

  return (
    <PageLayout title="Commande enregistrée" description="Merci pour votre commande Allotech72.">
      <section className="sp">
        <div className="container cart-page">
          <div className="shop-empty" style={{ textAlign: 'center', maxWidth: 520, margin: '0 auto' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>
              {fulfillState === 'loading' ? '⏳' : fulfillState === 'ok' ? '✅' : 'ℹ️'}
            </div>
            <h2 style={{ marginBottom: 12 }}>Merci !</h2>
            <p style={{ marginBottom: 20, lineHeight: 1.7 }}>{message}</p>
            <p style={{ marginBottom: 20, fontSize: '.88rem', color: 'var(--dim)' }}>
              Besoin d’aide ? {config.telephone}
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/boutique" className="shop-btn" onClick={onClear}>Boutique</Link>
              <a href={`tel:${config.telBrut}`} className="shop-btn primary" onClick={onClear}>
                📞 Appeler
              </a>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
