/**
 * Crée un checkout SumUp (Hosted Checkout) — clé API côté serveur uniquement.
 * Variables Vercel : SUMUP_API_KEY, SUMUP_MERCHANT_CODE (optionnel si envoyé dans le body)
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.SUMUP_API_KEY?.trim()
  if (!apiKey) {
    return res.status(503).json({
      error: 'SumUp non configuré',
      hint: 'Ajoutez SUMUP_API_KEY dans les variables d’environnement Vercel.',
    })
  }

  let body
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  } catch {
    return res.status(400).json({ error: 'Corps JSON invalide' })
  }

  const amount = Number(body.amount)
  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Montant invalide' })
  }

  const merchantCode =
    body.merchant_code?.trim() ||
    process.env.SUMUP_MERCHANT_CODE?.trim()

  if (!merchantCode) {
    return res.status(400).json({
      error: 'Code marchand SumUp manquant',
      hint: 'Définissez SUMUP_MERCHANT_CODE sur Vercel ou activez-le dans l’admin boutique.',
    })
  }

  const currency = (body.currency || 'EUR').toUpperCase()
  const checkoutReference =
    body.checkout_reference ||
    `at72-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

  const payload = {
    amount: Math.round(amount * 100) / 100,
    currency,
    merchant_code: merchantCode,
    checkout_reference: checkoutReference,
    description: (body.description || 'Commande Allotech72').slice(0, 140),
    hosted_checkout: { enabled: true },
  }

  if (body.redirect_url) payload.redirect_url = body.redirect_url

  try {
    const sumupRes = await fetch('https://api.sumup.com/v0.1/checkouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    })

    const data = await sumupRes.json().catch(() => ({}))

    if (!sumupRes.ok) {
      return res.status(sumupRes.status).json({
        error: data?.message || data?.error || 'Erreur SumUp',
        details: data,
      })
    }

    const url = data.hosted_checkout_url || data.hosted_checkout?.url
    if (!url) {
      return res.status(502).json({ error: 'URL de paiement SumUp absente', details: data })
    }

    return res.status(200).json({
      url,
      checkoutId: data.id,
      checkoutReference,
    })
  } catch (e) {
    return res.status(500).json({ error: e?.message || 'Erreur serveur' })
  }
}
