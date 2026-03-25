// ══════════════════════════════════════════════
// Modals légales : Mentions légales + RGPD/CNIL
// Conformes au droit français & Règlement UE
// ══════════════════════════════════════════════
import { useEffect } from 'react'
import { useCookies } from '../hooks/useCookies.jsx'
import config from '../config.js'

const closeModal = (id) => {
  document.getElementById(id)?.classList.remove('open')
  document.body.style.overflow = ''
}

export default function Modals() {
  const { reset } = useCookies()
  const year = new Date().getFullYear()

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') document.querySelectorAll('.modal-ov.open').forEach(m => closeModal(m.id))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      {/* ════ MENTIONS LÉGALES ════ */}
      <div className="modal-ov" id="m-legal" onClick={e => { if (e.target === e.currentTarget) closeModal('m-legal') }}>
        <div className="modal-box">
          <button className="modal-x" onClick={() => closeModal('m-legal')}>✕</button>
          <h2>📋 Mentions Légales</h2>

          <h3>1. Éditeur du site</h3>
          <p>
            <strong>Nom :</strong> {config.prenom} {config.nom}<br />
            <strong>Activité :</strong> {config.brand} — Dépannage informatique et création de sites internet à domicile<br />
            <strong>Statut juridique :</strong> {config.statut}<br />
            <strong>SIRET :</strong> {config.siret}<br />
            <strong>Adresse :</strong> {config.adresse}, {config.codePostal} {config.ville}, France<br />
            <strong>Téléphone :</strong> {config.telephone}<br />
            <strong>Email :</strong> contact@{config.siteUrl.replace('https://','')}<br />
            <strong>TVA :</strong> Non assujetti — Article 293B du Code Général des Impôts
          </p>

          <h3>2. Directeur de la publication</h3>
          <p>{config.prenom} {config.nom}</p>

          <h3>3. Hébergement</h3>
          <p>
            {config.hebergeur?.nom
              ? <><strong>Hébergeur :</strong> {config.hebergeur.nom}<br /><strong>Adresse :</strong> {config.hebergeur.adresse}<br /><strong>Site :</strong> <a href={config.hebergeur.url} target="_blank" rel="noopener">{config.hebergeur.url}</a></>
              : 'Informations hébergeur à compléter.'}
          </p>

          <h3>4. Propriété intellectuelle</h3>
          <p>
            L'ensemble du contenu de ce site (textes, logos, graphismes, code, images) est la propriété exclusive de {config.prenom} {config.nom} – {config.brand}, sauf mentions contraires.
            Toute reproduction, représentation ou diffusion, totale ou partielle, sans autorisation écrite préalable est interdite et constitue une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la Propriété Intellectuelle.
          </p>

          <h3>5. Responsabilité</h3>
          <p>
            Les informations contenues sur ce site sont données à titre indicatif et sont susceptibles d'évoluer. {config.brand} ne saurait être tenu responsable des dommages directs ou indirects résultant de l'utilisation de ce site.
          </p>

          <h3>6. Liens hypertextes</h3>
          <p>
            Ce site peut contenir des liens vers des sites tiers. {config.brand} n'exerce aucun contrôle sur ces sites et n'assume aucune responsabilité quant à leur contenu, conformément à la Loi pour la Confiance dans l'Économie Numérique (LCEN) du 21 juin 2004.
          </p>

          <h3>7. Droit applicable — Médiation</h3>
          <p>
            Ce site est soumis au droit français. Tout litige relatif à son utilisation sera soumis aux tribunaux compétents du ressort de la Sarthe.
            En cas de litige avec un consommateur, vous pouvez recourir à la médiation via la plateforme européenne de règlement en ligne des litiges : <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener">https://ec.europa.eu/consumers/odr</a>
          </p>

          <p style={{ fontSize: '.78rem', color: 'var(--dim)', marginTop: 20, borderTop: '1px solid rgba(0,207,255,0.1)', paddingTop: 16 }}>
            Dernière mise à jour : {year} — {config.brand}
          </p>
        </div>
      </div>

      {/* ════ POLITIQUE DE CONFIDENTIALITÉ (RGPD / CNIL) ════ */}
      <div className="modal-ov" id="m-conf" onClick={e => { if (e.target === e.currentTarget) closeModal('m-conf') }}>
        <div className="modal-box">
          <button className="modal-x" onClick={() => closeModal('m-conf')}>✕</button>
          <h2>🔒 Politique de Confidentialité & Cookies</h2>
          <p style={{ color: 'var(--g)', fontSize: '.8rem', background: 'rgba(43,255,154,0.07)', border: '1px solid rgba(43,255,154,0.2)', borderRadius: 8, padding: '8px 14px', marginBottom: 8 }}>
            Conforme au RGPD (Règlement UE 2016/679) et aux recommandations de la CNIL
          </p>

          <h3>1. Responsable du traitement</h3>
          <p>
            {config.prenom} {config.nom} – {config.brand}<br />
            {config.adresse}, {config.codePostal} {config.ville}<br />
            Téléphone : {config.telephone} — Email : contact@{config.siteUrl.replace('https://','')}<br />
            SIRET : {config.siret}
          </p>

          <h3>2. Données collectées et base légale</h3>
          <p>Via le formulaire de contact, les données suivantes sont collectées :</p>
          <ul>
            <li><strong>Données :</strong> nom, prénom, adresse e-mail, numéro de téléphone, message</li>
            <li><strong>Base légale :</strong> consentement explicite de la personne concernée (art. 6.1.a RGPD)</li>
            <li><strong>Caractère obligatoire :</strong> nom, email et message sont obligatoires pour traiter votre demande</li>
          </ul>

          <h3>3. Finalités du traitement</h3>
          <p>
            Les données collectées ont pour unique finalité de vous recontacter dans le cadre de votre demande de dépannage ou de devis. Aucune autre utilisation commerciale ou de prospection ne sera effectuée.
          </p>

          <h3>4. Durée de conservation</h3>
          <p>
            Vos données personnelles sont conservées pendant la durée strictement nécessaire à la gestion de votre demande, et au maximum <strong>3 ans</strong> à compter de notre dernier contact, conformément aux recommandations de la CNIL.
          </p>

          <h3>5. Destinataires des données</h3>
          <p>
            Vos données sont destinées exclusivement à {config.prenom} {config.nom} – {config.brand}.
            Elles sont transmises via le service Formspree (formspree.io) pour l'acheminement des emails, dans le respect du RGPD.
            Elles ne sont jamais vendues, louées ou cédées à des tiers.
          </p>

          <h3>6. Vos droits</h3>
          <p>Conformément au RGPD et à la Loi Informatique et Libertés modifiée, vous disposez des droits suivants :</p>
          <ul>
            <li>✅ <strong>Droit d'accès</strong> (art. 15 RGPD) — obtenir une copie de vos données</li>
            <li>✅ <strong>Droit de rectification</strong> (art. 16 RGPD) — corriger des données inexactes</li>
            <li>✅ <strong>Droit à l'effacement</strong> (art. 17 RGPD) — "droit à l'oubli"</li>
            <li>✅ <strong>Droit à la limitation</strong> (art. 18 RGPD) — limiter le traitement</li>
            <li>✅ <strong>Droit d'opposition</strong> (art. 21 RGPD) — vous opposer au traitement</li>
            <li>✅ <strong>Droit à la portabilité</strong> (art. 20 RGPD) — récupérer vos données</li>
            <li>✅ <strong>Droit de retirer votre consentement</strong> à tout moment</li>
          </ul>
          <p>
            Pour exercer ces droits : {config.telephone} ou par courrier à l'adresse ci-dessus.
            Réponse sous 30 jours maximum. En cas de litige, vous pouvez saisir la{' '}
            <a href="https://www.cnil.fr/fr/adresser-une-plainte" target="_blank" rel="noopener"><strong>CNIL</strong></a>.
          </p>

          <h3>7. Cookies et traceurs</h3>
          <p>
            Ce site utilise uniquement des cookies <strong>strictement nécessaires</strong> au fonctionnement (mémorisation de vos préférences cookies).
            <strong> Aucun cookie publicitaire, de tracking ou d'analyse d'audience n'est déposé</strong> sans votre consentement explicite, conformément aux recommandations de la CNIL (délibération n°2020-091 du 17 septembre 2020).
          </p>
          <p>
            Vous pouvez à tout moment modifier vos préférences cookies :
            <button onClick={() => { closeModal('m-conf'); reset() }} style={{ background: 'none', border: '1px solid rgba(0,207,255,0.3)', color: 'var(--c)', padding: '4px 12px', borderRadius: 6, cursor: 'pointer', marginLeft: 10, fontSize: '.8rem' }}>
              Gérer mes cookies
            </button>
          </p>

          <h3>8. Sécurité</h3>
          <p>
            Des mesures techniques et organisationnelles appropriées sont mises en place pour protéger vos données contre tout accès non autorisé, modification, divulgation ou destruction, conformément à l'article 32 du RGPD.
          </p>

          <h3>9. Transferts hors UE</h3>
          <p>
            Vos données sont traitées au sein de l'Union Européenne. Le service Formspree est soumis aux clauses contractuelles types de la Commission Européenne garantissant un niveau de protection adéquat.
          </p>

          <p style={{ fontSize: '.78rem', color: 'var(--dim)', marginTop: 20, borderTop: '1px solid rgba(0,207,255,0.1)', paddingTop: 16 }}>
            Dernière mise à jour : {year} — Politique conforme RGPD & CNIL — {config.brand}
          </p>
        </div>
      </div>
    </>
  )
}
