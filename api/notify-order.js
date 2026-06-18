/**
 * Emails commande boutique via Formspree (Vercel).
 *
 * FORMSPREE_ID          → notification vendeur (vous)
 * FORMSPREE_CUSTOMER_ID → formulaire dédié avec réponse auto activée (email client)
 *   Formspree → Settings → Autoresponse → Custom :
 *   « Bonjour,\n\n{{ message }}\n\nCordialement,\nAllotech72 »
 *   Désactiver la notification vendeur sur CE formulaire (réponse auto uniquement).
 */
import config, { fullName, siteDomainForEmail } from '../src/config.js'

const CONTACT_EMAIL = `contact@${siteDomainForEmail()}`

function buildOrderBlocks(order) {
  const customer = order.customer || {}
  const shipping = order.shipping || {}
  const amounts = order.amounts || {}
  const items = order.itemsDetail || order.items || []

  const postalAddress = [
    customer.address,
    [customer.postCode, customer.city].filter(Boolean).join(' '),
  ]
    .filter(Boolean)
    .join('\n')

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
    shippingBlock = `Retrait sur place (gratuit) — ${config.adresse}, ${config.codePostal} ${config.ville}`
  }

  return { customer, amounts, lines, postalAddress, shippingBlock }
}

function buildMerchantBody(order) {
  const { customer, amounts, lines, postalAddress, shippingBlock } = buildOrderBlocks(order)
  const ref = order.checkoutReference

  return [
    `Nouvelle commande boutique — ${ref}`,
    customer.email ? `→ Répondre au client : ${customer.email}` : '',
    '',
    '--- Client ---',
    `Nom : ${customer.name || '—'}`,
    `Email : ${customer.email || '—'}`,
    `Téléphone : ${customer.phone || '—'}`,
    postalAddress ? `Adresse postale :\n${postalAddress}` : '',
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
    `Réf. SumUp : ${ref}`,
  ]
    .filter(Boolean)
    .join('\n')
}

function buildCustomerBody(order) {
  const { customer, amounts, lines, postalAddress, shippingBlock } = buildOrderBlocks(order)
  const ref = order.checkoutReference

  return [
    `Merci pour votre commande sur ${config.brand} !`,
    '',
    `Référence commande : ${ref}`,
    `Date : ${new Date().toLocaleDateString('fr-FR')}`,
    '',
    '--- Vendeur ---',
    `${fullName()} – ${config.brand}`,
    `${config.adresse}, ${config.codePostal} ${config.ville}`,
    `SIRET : ${config.siret} — TVA non applicable, art. 293B du CGI`,
    `Tél. : ${config.telephone} — ${CONTACT_EMAIL}`,
    '',
    '--- Votre commande ---',
    lines || '—',
    '',
    '--- Montants ---',
    `Sous-total : ${amounts.subtotal ?? '—'} €`,
    `Frais de port : ${amounts.shippingFee ?? 0} €`,
    `Total payé : ${amounts.total ?? '—'} €`,
    '',
    '--- Livraison ---',
    shippingBlock,
    postalAddress ? `\nAdresse indiquée :\n${postalAddress}` : '',
    '',
    '--- Droit de rétractation ---',
    'Conformément au Code de la consommation, vous disposez d’un délai de 14 jours à compter de la réception du bien pour vous rétracter, sans motif.',
    `Pour exercer ce droit : ${CONTACT_EMAIL} ou ${config.telephone} (indiquez votre référence ${ref}).`,
    `Conditions complètes : ${config.siteUrl} (footer → CGV boutique).`,
    '',
    '--- Garanties ---',
    'Produits neufs : garantie légale de conformité. Produits occasion : vendus dans l’état décrit sur la fiche produit.',
    '',
    'Une question ? Répondez à cet email ou appelez-nous.',
  ]
    .filter(Boolean)
    .join('\n')
}

async function postFormspree(formId, payload) {
  const res = await fetch(`https://formspree.io/f/${formId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Formspree ${res.status}`)
  }

  return { ok: true }
}

/** Notification vendeur */
export async function notifyOrderByEmail(order) {
  const formId = process.env.FORMSPREE_ID?.trim() || process.env.FORMSPREE_SHOP_ID?.trim()
  if (!formId) {
    console.warn('FORMSPREE_ID manquant — email commande non envoyé')
    return { ok: false, skipped: true }
  }

  const customer = order.customer || {}
  const body = buildMerchantBody(order)

  await postFormspree(formId, {
    _subject: `[Boutique] Commande ${order.checkoutReference} — ${customer.name || 'client'}`,
    name: customer.name || 'Client boutique',
    email: customer.email || CONTACT_EMAIL,
    phone: customer.phone || '',
    message: body,
    checkout_reference: order.checkoutReference,
  })

  return { ok: true }
}

/** Confirmation client (Formspree autoresponse sur formulaire dédié) */
export async function notifyCustomerConfirmation(order) {
  const formId = process.env.FORMSPREE_CUSTOMER_ID?.trim()
  const customer = order.customer || {}
  const email = String(customer.email || '').trim()

  if (!formId) {
    console.warn('FORMSPREE_CUSTOMER_ID manquant — email client non envoyé (configurer sur Vercel)')
    return { ok: false, skipped: true }
  }
  if (!email) {
    return { ok: false, skipped: true, reason: 'no_email' }
  }

  const body = buildCustomerBody(order)

  await postFormspree(formId, {
    _subject: `Confirmation commande ${order.checkoutReference} — ${config.brand}`,
    name: customer.name || 'Client',
    email,
    message: body,
    checkout_reference: order.checkoutReference,
  })

  return { ok: true }
}

/** Vendeur + client en une fois */
export async function notifyOrderEmails(order) {
  const merchant = await notifyOrderByEmail(order).catch(e => {
    console.error('Email vendeur:', e?.message || e)
    return { ok: false, error: e?.message }
  })

  const customer = await notifyCustomerConfirmation(order).catch(e => {
    console.error('Email client:', e?.message || e)
    return { ok: false, error: e?.message }
  })

  return {
    merchantSent: !!merchant.ok,
    customerSent: !!customer.ok,
    customerSkipped: !!customer.skipped,
  }
}
