(function () {
  const cfg = window.QREATEUR_CONFIG || {}
  const link = cfg.stripePaymentLink || '#'
  const price = cfg.priceLabel || '10 €'
  const mail = cfg.contactEmail || 'contact@allotech72.fr'

  document.querySelectorAll('.js-price').forEach((el) => {
    el.textContent = price
  })

  document.querySelectorAll('.js-buy').forEach((el) => {
    el.setAttribute('href', link)
    if (link.includes('REMPLACE_MOI') || link.includes('test_REMPLACE')) {
      el.addEventListener('click', (e) => {
        e.preventDefault()
        alert(
          'Paiement pas encore branché.\n\n1) Crée un Payment Link Stripe à 10 €\n2) Colle le lien dans site/config.js (stripePaymentLink)\n3) Re-uploade config.js sur ton site.',
        )
      })
    }
  })

  const contact = document.getElementById('contact-mail')
  if (contact) contact.setAttribute('href', `mailto:${mail}`)
})()
