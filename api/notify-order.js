/**
 * Envoie un email de notification commande via Formspree (côté serveur Vercel).
 * Variable : FORMSPREE_ID (même formulaire que le contact ou dédié commandes)
 */
export async function notifyOrderByEmail(order) {
  const formId = process.env.FORMSPREE_ID?.trim() || process.env.FORMSPREE_SHOP_ID?.trim()
  if (!formId) {
    console.warn('FORMSPREE_ID manquant — email commande non envoyé')
    return { ok: false, skipped: true }
  }

  const customer = order.customer || {}
  const shipping = order.shipping || {}
  const amounts = order.amounts || {}
  const items = order.itemsDetail || order.items || []

  const lines = items
    .map(i => `- ${i.qty}× ${i.title}${i.price != null ? ` (${i.price} €)` : ''}`)
    .join('\n')

  let shippingBlock = ''
  if (shipping.mode === 'mondial_relay') {
    shippingBlock = [
      'Livraison : Mondial Relay',
      shipping.relay?.name ? `Point : ${shipping.relay.name}` : '',
      shipping.relay?.id ? `ID relais : ${shipping.relay.id}` : '',
      shipping.relay?.address ? `Adresse : ${shipping.relay.address}` : '',
      shipping.relay?.postCode || shipping.relay?.city
        ? `${shipping.relay?.postCode || ''} ${shipping.relay?.city || ''}`.trim()
        : '',
      shipping.relayManual ? `Saisie manuelle : ${shipping.relayManual}` : '',
      `Frais de port : ${amounts.shippingFee ?? '—'} €`,
    ]
      .filter(Boolean)
      .join('\n')
  } else {
    shippingBlock = 'Livraison : Retrait sur place (gratuit)'
  }

  const body = [
    `Nouvelle commande boutique — ${order.checkoutReference}`,
    '',
    '--- Client ---',
    `Nom : ${customer.name || '—'}`,
    `Email : ${customer.email || '—'}`,
    `Téléphone : ${customer.phone || '—'}`,
    customer.postCode ? `Code postal : ${customer.postCode}` : '',
    '',
    '--- Livraison ---',
    shippingBlock,
    '',
    '--- Articles ---',
    lines || '—',
    '',
    '--- Montants ---',
    `Sous-total : ${amounts.subtotal ?? '—'} €`,
    `Frais de port : ${amounts.shippingFee ?? 0} €`,
    `Total payé : ${amounts.total ?? '—'} €`,
    '',
    `Réf. SumUp : ${order.checkoutReference}`,
  ]
    .filter(Boolean)
    .join('\n')

  const res = await fetch(`https://formspree.io/f/${formId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      _subject: `[Boutique] Commande ${order.checkoutReference} — ${customer.name || 'client'}`,
      name: customer.name || 'Client boutique',
      email: customer.email || 'noreply@allotech72.fr',
      phone: customer.phone || '',
      message: body,
      checkout_reference: order.checkoutReference,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Formspree ${res.status}`)
  }

  return { ok: true }
}
