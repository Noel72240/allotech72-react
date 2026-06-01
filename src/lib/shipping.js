/** Modes de livraison boutique */
export const SHIPPING_PICKUP = 'pickup'
export const SHIPPING_MONDIAL_RELAY = 'mondial_relay'

export function computeOrderTotals(subtotal, shippingMode, settings) {
  const fee =
    shippingMode === SHIPPING_MONDIAL_RELAY
      ? Number(settings?.mondialRelayFee) || 0
      : 0
  const sub = Number(subtotal) || 0
  return {
    subtotal: sub,
    shippingFee: fee,
    total: Math.round((sub + fee) * 100) / 100,
  }
}

export function padMondialRelayBrand(code) {
  const raw = String(code || '').trim()
  if (!raw) return ''
  return raw.padEnd(8, ' ')
}
