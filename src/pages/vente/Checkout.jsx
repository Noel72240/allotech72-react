import { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PageLayout from '../../components/PageLayout.jsx'
import MondialRelayPicker from '../../components/shop/MondialRelayPicker.jsx'
import config from '../../config.js'
import { useCart } from '../../hooks/useCart.jsx'
import { useShopCatalog } from '../../hooks/useShopCatalog.jsx'
import { formatPrice } from '../../lib/shop.js'
import {
  SHIPPING_PICKUP,
  SHIPPING_MONDIAL_RELAY,
  computeOrderTotals,
} from '../../lib/shipping.js'

function validateCheckout(customer, shippingMode, relay, relayManual, settings, legal) {
  if (!customer.name?.trim()) return 'Indiquez votre nom.'
  if (!customer.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) {
    return 'Indiquez un email valide.'
  }
  if (!customer.phone?.trim()) return 'Indiquez votre téléphone.'
  if (!customer.address?.trim()) return 'Indiquez votre adresse postale.'
  if (!customer.postCode?.trim()) return 'Indiquez votre code postal.'
  if (!customer.city?.trim()) return 'Indiquez votre ville.'

  if (shippingMode === SHIPPING_MONDIAL_RELAY) {
    const hasRelay = relay?.id || relay?.name
    const hasManual = relayManual?.trim()
    if (!hasRelay && !hasManual) {
      return 'Choisissez un point Mondial Relay ou décrivez-le dans le champ manuel.'
    }
  }

  if (shippingMode === SHIPPING_PICKUP && settings.pickupEnabled === false) {
    return 'Le retrait sur place n’est pas disponible.'
  }

  if (!legal?.rgpd) {
    return 'Veuillez accepter le traitement de vos données personnelles.'
  }
  if (!legal?.cgv) {
    return 'Veuillez accepter les Conditions Générales de Vente.'
  }

  return ''
}

function openLegalModal(id) {
  document.getElementById(id)?.classList.add('open')
  document.body.style.overflow = 'hidden'
}

export default function Checkout() {
  const { lines, total: cartSubtotal } = useCart()
  const { settings } = useShopCatalog()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    postCode: '',
    city: '',
  })
  const [shippingMode, setShippingMode] = useState(
    settings.pickupEnabled !== false ? SHIPPING_PICKUP : SHIPPING_MONDIAL_RELAY,
  )
  const [relay, setRelay] = useState(null)
  const [relayManual, setRelayManual] = useState('')
  const [acceptRgpd, setAcceptRgpd] = useState(false)
  const [acceptCgv, setAcceptCgv] = useState(false)

  useEffect(() => {
    if (settings.pickupEnabled === false) {
      setShippingMode(SHIPPING_MONDIAL_RELAY)
    }
  }, [settings.pickupEnabled])

  const amounts = useMemo(
    () => computeOrderTotals(cartSubtotal, shippingMode, settings),
    [cartSubtotal, shippingMode, settings],
  )

  const itemsDetail = useMemo(
    () =>
      lines.map(({ product, qty, lineTotal }) => ({
        productId: product.id,
        title: product.title,
        qty,
        price: product.price,
        lineTotal,
      })),
    [lines],
  )

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

  const shippingPayload =
    shippingMode === SHIPPING_MONDIAL_RELAY
      ? {
          mode: SHIPPING_MONDIAL_RELAY,
          relay: relay
            ? {
                id: relay.id,
                name: relay.name,
                address: relay.address,
                postCode: relay.postCode,
                city: relay.city,
              }
            : null,
          relayManual: relayManual.trim() || null,
        }
      : { mode: SHIPPING_PICKUP }

  const startSumUp = async () => {
    const validationError = validateCheckout(
      customer,
      shippingMode,
      relay,
      relayManual,
      settings,
      { rgpd: acceptRgpd, cgv: acceptCgv },
    )
    if (validationError) {
      setError(validationError)
      return
    }

    if (!settings.sumupEnabled) {
      setError('Le paiement SumUp n’est pas activé. Contactez le magasin.')
      return
    }

    setLoading(true)
    setError('')

    const description = lines
      .map(l => `${l.qty}× ${l.product.title}`)
      .join(' · ')
      .slice(0, 120)
    const shippingLabel =
      shippingMode === SHIPPING_MONDIAL_RELAY ? ' + port MR' : ' retrait'

    const checkoutReference = `at72-${Date.now()}`
    const redirectUrl = `${config.siteUrl.replace(/\/$/, '')}/panier/confirmation?ref=${encodeURIComponent(checkoutReference)}`

    const customerPayload = {
      name: customer.name.trim(),
      email: customer.email.trim(),
      phone: customer.phone.trim(),
      address: customer.address.trim(),
      postCode: customer.postCode.trim(),
      city: customer.city.trim(),
    }

    try {
      const res = await fetch('/api/sumup-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amounts.total,
          currency: 'EUR',
          description: `${description}${shippingLabel}`.slice(0, 140),
          checkout_reference: checkoutReference,
          merchant_code: settings.sumupMerchantCode || undefined,
          redirect_url: redirectUrl,
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
            customer: customerPayload,
            shipping: shippingPayload,
            amounts,
            itemsDetail,
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

  const relayFee = Number(settings.mondialRelayFee) || 0

  return (
    <PageLayout title="Paiement" description="Finaliser votre commande Allotech72 via SumUp.">
      <section className="sp">
        <div className="container cart-page">
          <div className="shop-topbar">
            <div>
              <span className="stag">Paiement</span>
              <h2 style={{ marginTop: 8 }}>Finaliser la commande</h2>
              <p className="sub" style={{ marginLeft: 0, marginRight: 0 }}>
                Total à régler : <strong style={{ color: 'var(--c)' }}>{formatPrice(amounts.total)}</strong>
              </p>
            </div>
            <Link className="shop-backlink" to="/panier">← Retour panier</Link>
          </div>

          <div className="checkout-grid">
            <div className="checkout-form-card">
              <h3 className="checkout-section-title">Vos coordonnées</h3>
              <div className="fg" style={{ marginBottom: 12 }}>
                <label>Nom *</label>
                <input
                  type="text"
                  required
                  value={customer.name}
                  onChange={e => setCustomer(c => ({ ...c, name: e.target.value }))}
                  placeholder="Votre nom"
                />
              </div>
              <div className="fg" style={{ marginBottom: 12 }}>
                <label>Email *</label>
                <input
                  type="email"
                  required
                  value={customer.email}
                  onChange={e => setCustomer(c => ({ ...c, email: e.target.value }))}
                  placeholder="email@exemple.fr"
                />
              </div>
              <div className="fg" style={{ marginBottom: 12 }}>
                <label>Téléphone *</label>
                <input
                  type="tel"
                  required
                  value={customer.phone}
                  onChange={e => setCustomer(c => ({ ...c, phone: e.target.value }))}
                  placeholder="06 …"
                />
              </div>

              <h3 className="checkout-section-title" style={{ marginTop: 8 }}>Adresse postale</h3>
              <div className="fg" style={{ marginBottom: 12 }}>
                <label>Adresse *</label>
                <input
                  type="text"
                  required
                  value={customer.address}
                  onChange={e => setCustomer(c => ({ ...c, address: e.target.value }))}
                  placeholder="Numéro et rue, bâtiment, appartement…"
                />
              </div>
              <div className="checkout-address-row">
                <div className="fg" style={{ marginBottom: 0 }}>
                  <label>Code postal *</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={5}
                    required
                    value={customer.postCode}
                    onChange={e => {
                      setCustomer(c => ({ ...c, postCode: e.target.value }))
                      setRelay(null)
                    }}
                    placeholder="72000"
                  />
                </div>
                <div className="fg" style={{ marginBottom: 0 }}>
                  <label>Ville *</label>
                  <input
                    type="text"
                    required
                    value={customer.city}
                    onChange={e => setCustomer(c => ({ ...c, city: e.target.value }))}
                    placeholder="Le Mans"
                  />
                </div>
              </div>

              <h3 className="checkout-section-title" style={{ marginTop: 0 }}>Livraison</h3>
              <div className="shipping-options">
                {settings.pickupEnabled !== false && (
                  <label className={`shipping-option${shippingMode === SHIPPING_PICKUP ? ' active' : ''}`}>
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMode === SHIPPING_PICKUP}
                      onChange={() => {
                        setShippingMode(SHIPPING_PICKUP)
                        setRelay(null)
                      }}
                    />
                    <span>
                      <strong>Retrait sur place</strong>
                      <small>Gratuit — {config.adresse}, {config.codePostal} {config.ville}</small>
                    </span>
                  </label>
                )}
                <label className={`shipping-option${shippingMode === SHIPPING_MONDIAL_RELAY ? ' active' : ''}`}>
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMode === SHIPPING_MONDIAL_RELAY}
                    onChange={() => setShippingMode(SHIPPING_MONDIAL_RELAY)}
                  />
                  <span>
                    <strong>Mondial Relay</strong>
                    <small>+ {formatPrice(relayFee)} — point relais au choix</small>
                  </span>
                </label>
              </div>

              {shippingMode === SHIPPING_MONDIAL_RELAY && (
                <div className="mr-shipping-block">
                  <p className="cart-sumup-hint" style={{ marginBottom: 12 }}>
                    Recherche de relais près du code postal <strong>{customer.postCode || '—'}</strong> (modifiable ci-dessus).
                  </p>

                  <MondialRelayPicker
                    brand={settings.mondialRelayBrand}
                    postCode={customer.postCode}
                    onSelect={setRelay}
                  />

                  {relay && (
                    <div className="mr-selected-relay">
                      <strong>Point sélectionné</strong>
                      <p>{relay.name}</p>
                      <p>{relay.address}</p>
                      <p>{relay.postCode} {relay.city}</p>
                    </div>
                  )}

                  <div className="fg" style={{ marginTop: 12 }}>
                    <label>Point relais (saisie manuelle si besoin)</label>
                    <input
                      type="text"
                      value={relayManual}
                      onChange={e => setRelayManual(e.target.value)}
                      placeholder="Nom et adresse du relais"
                    />
                  </div>
                </div>
              )}

              {error && <div className="checkout-error">{error}</div>}

              <div className="checkout-legal" style={{ marginTop: 20 }}>
                <label className="fck" style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12 }}>
                  <input
                    type="checkbox"
                    checked={acceptRgpd}
                    onChange={e => setAcceptRgpd(e.target.checked)}
                    style={{ marginTop: 4, flexShrink: 0 }}
                  />
                  <span style={{ fontSize: '.82rem', color: 'var(--dim)', lineHeight: 1.55 }}>
                    J&apos;accepte que mes données (nom, email, téléphone, adresse, livraison) soient utilisées pour traiter ma commande.{' '}
                    <button type="button" onClick={() => openLegalModal('m-conf')} style={{ background: 'none', border: 'none', color: 'var(--c)', cursor: 'pointer', padding: 0, textDecoration: 'underline', fontSize: 'inherit' }}>
                      Politique de confidentialité
                    </button>
                  </span>
                </label>
                <label className="fck" style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <input
                    type="checkbox"
                    checked={acceptCgv}
                    onChange={e => setAcceptCgv(e.target.checked)}
                    style={{ marginTop: 4, flexShrink: 0 }}
                  />
                  <span style={{ fontSize: '.82rem', color: 'var(--dim)', lineHeight: 1.55 }}>
                    J&apos;accepte les{' '}
                    <button type="button" onClick={() => openLegalModal('m-cgv')} style={{ background: 'none', border: 'none', color: 'var(--c)', cursor: 'pointer', padding: 0, textDecoration: 'underline', fontSize: 'inherit' }}>
                      Conditions Générales de Vente
                    </button>
                    {' '}(droit de rétractation 14 jours, livraison, garanties).
                  </span>
                </label>
              </div>

              <button
                type="button"
                className="shop-btn primary"
                style={{ width: '100%', marginTop: 20 }}
                disabled={loading}
                onClick={startSumUp}
              >
                {loading ? 'Redirection SumUp…' : `Payer ${formatPrice(amounts.total)} avec SumUp`}
              </button>

              <p className="cart-sumup-hint" style={{ marginTop: 14 }}>
                Paiement sécurisé sur la page SumUp. Vous recevrez une confirmation par email.
              </p>
            </div>

            <div className="checkout-recap">
              <h3 className="checkout-section-title">Récapitulatif</h3>
              <ul className="checkout-recap-list">
                {lines.map(({ product, qty, lineTotal }) => (
                  <li key={product.id}>
                    <span>{qty}× {product.title}</span>
                    <span>{formatPrice(lineTotal)}</span>
                  </li>
                ))}
              </ul>
              <div className="cart-summary-row" style={{ marginTop: 12 }}>
                <span>Sous-total</span>
                <span>{formatPrice(amounts.subtotal)}</span>
              </div>
              <div className="cart-summary-row">
                <span>
                  {shippingMode === SHIPPING_MONDIAL_RELAY ? 'Frais Mondial Relay' : 'Retrait sur place'}
                </span>
                <span>{shippingMode === SHIPPING_MONDIAL_RELAY ? formatPrice(amounts.shippingFee) : 'Gratuit'}</span>
              </div>
              <div className="cart-summary-row" style={{ marginTop: 12, paddingTop: 16, borderTop: '1px solid rgba(0,207,255,0.15)' }}>
                <span>Total</span>
                <strong>{formatPrice(amounts.total)}</strong>
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
            customer: pending.customer,
            shipping: pending.shipping,
            amounts: pending.amounts,
            items_detail: pending.itemsDetail,
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
        ? 'Paiement confirmé. Vous recevrez un email de confirmation et je prépare votre commande (retrait ou envoi Mondial Relay).'
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
