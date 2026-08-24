export default function QreateurPromo({ variant = 'default' }) {
  const featured = variant === 'featured' || variant === 'home'
  const home = variant === 'home'

  return (
    <a
      href="/qreateur/"
      className={`qreateur-promo${featured ? ' qreateur-promo--featured' : ''}${home ? ' qreateur-promo--home' : ''}`}
    >
      <div className="qreateur-promo-copy">
        <div className="qreateur-promo-badges">
          <span className="qreateur-promo-badge">Nouveau</span>
          <span className="qreateur-promo-kicker">Logiciel Windows · Licence à vie</span>
        </div>
        <div className="qreateur-promo-title-row">
          <img
            className="qreateur-promo-logo"
            src="/qreateur/qreateur-logo.png"
            alt=""
            width={52}
            height={45}
          />
          <strong className="qreateur-promo-title">Qréateur Pro</strong>
        </div>
        <p className="qreateur-promo-price">
          <span className="qreateur-promo-amount">9,90&nbsp;€</span>
          <span className="qreateur-promo-once">paiement unique · à vie</span>
        </p>
        <p className="qreateur-promo-desc">
          Générateur QR code hors ligne : Wi-Fi, Google Avis, Instagram, PDF print —
          sans filigrane. Édité par ALLOTECH72.
        </p>
        <ul className="qreateur-promo-points">
          <li>Sans filigrane</li>
          <li>100&nbsp;% hors ligne</li>
          <li>Exports PNG · SVG · PDF</li>
        </ul>
        <span className="qreateur-promo-cta">
          {home ? 'Découvrir & acheter →' : 'Voir & acheter →'}
        </span>
      </div>
      <div className="qreateur-promo-gallery" aria-hidden="true">
        <figure className="qreateur-shot-wrap qreateur-shot-wrap-main">
          <img src="/qreateur/shots/apercu-2.png" alt="" loading="lazy" />
        </figure>
        <div className="qreateur-shot-stack">
          <figure className="qreateur-shot-wrap">
            <img src="/qreateur/shots/apercu-1.png" alt="" loading="lazy" />
          </figure>
          <figure className="qreateur-shot-wrap">
            <img src="/qreateur/shots/apercu-3.png" alt="" loading="lazy" />
          </figure>
        </div>
      </div>
    </a>
  )
}
