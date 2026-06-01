// ══════════════════════════════════════════════
// Modals légales : Mentions légales + RGPD/CNIL
// Conformes au droit français & Règlement UE
// ══════════════════════════════════════════════
import { useEffect } from 'react'
import { useCookies } from '../hooks/useCookies.jsx'
import config, { siteDomainForEmail, fullName } from '../config.js'

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
            <strong>Nom :</strong> {fullName()}<br />
            <strong>Activité :</strong> {config.brand} — Dépannage informatique et création de sites internet à domicile<br />
            <strong>Statut juridique :</strong> {config.statut}<br />
            <strong>SIRET :</strong> {config.siret}<br />
            <strong>Adresse :</strong> {config.adresse}, {config.codePostal} {config.ville}, France<br />
            <strong>Référence géographique :</strong> Lombron (72450), Sarthe, France<br />
            <strong>Téléphone :</strong> {config.telephone}<br />
            <strong>Email :</strong> contact@{siteDomainForEmail()}<br />
            <strong>TVA :</strong> Non assujetti — Article 293B du Code Général des Impôts
          </p>

          <h3>2. Directeur de la publication</h3>
          <p>
            <strong>Directeur de la publication :</strong> {fullName()}
            <br />
            <strong>Localisation :</strong> Lombron (72450), Sarthe, France
          </p>

          <h3>3. Hébergement</h3>
          <p>
            Conformément à l’article 6-I-2° de la loi n°2004-575 du 21 juin 2004 pour la confiance dans l’économie numérique (LCEN), les informations relatives à l’hébergeur du site sont les suivantes :
          </p>
          <p>
            <strong>Hébergeur :</strong> {config.hebergeur.nom}<br />
            {config.hebergeur.forme && <><strong>Forme :</strong> {config.hebergeur.forme}<br /></>}
            <strong>Siège / adresse :</strong> {config.hebergeur.adresse}<br />
            <strong>Site web :</strong>{' '}
            <a href={config.hebergeur.url} target="_blank" rel="noopener noreferrer">{config.hebergeur.url}</a>
            {config.hebergeur.privacyUrl && (
              <>
                <br />
                <strong>Politique de confidentialité de l’hébergeur :</strong>{' '}
                <a href={config.hebergeur.privacyUrl} target="_blank" rel="noopener noreferrer">{config.hebergeur.privacyUrl}</a>
              </>
            )}
          </p>
          <p style={{ fontSize: '.85rem', color: 'var(--dim)' }}>
            L’éditeur du site reste seul responsable du contenu éditorial publié. L’hébergeur n’est pas responsable du contenu des sites qu’il héberge en application de l’article 6-I-2° et 6-I-3° de la LCEN, sauf si, après notification légale, il ne retire pas promptement un contenu manifestement illicite.
          </p>

          <h3>4. Propriété intellectuelle</h3>
          <p>
            L'ensemble du contenu de ce site (textes, logos, graphismes, code, images) est la propriété exclusive de {fullName()} – {config.brand}, sauf mentions contraires.
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
            {fullName()} – {config.brand}<br />
            {config.adresse}, {config.codePostal} {config.ville}<br />
            Téléphone : {config.telephone} — Email : contact@{siteDomainForEmail()}<br />
            SIRET : {config.siret}
          </p>

          <h3>2. Données collectées et base légale</h3>
          <p>
            Les données sont collectées sur la base du <strong>consentement</strong> de l’utilisateur (article 6.1.a du RGPD), donné notamment via la case à cocher du formulaire de contact.
          </p>
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
            Les données sont conservées pendant une durée maximale de <strong>12 mois</strong> à compter de leur collecte ou de notre dernier échange, sauf obligation légale de conservation plus longue.
          </p>

          <h3>5. Destinataires et sous-traitants</h3>
          <p>
            <strong>Responsable du traitement :</strong> {fullName()} – {config.brand}. Vos données ne sont jamais vendues, louées ou cédées à des tiers à des fins commerciales.
          </p>
          <p>
            <strong>Formulaire de contact :</strong> les messages sont transmis via le prestataire <strong>Formspree</strong> (formspree.io), sous-traitant agissant sur instruction et dans le respect du RGPD (données nécessaires à l’envoi de l’email).
          </p>
          <p>
            <strong>Hébergement du site :</strong> le site statique est déployé chez <strong>{config.hebergeur.nom}</strong>. Des données techniques (notamment journaux techniques, adresse IP) peuvent être traitées sur des infrastructures situées hors de l’Union européenne, dans le cadre décrit à la section « Transferts » ci-dessous.
          </p>
          <p>
            <strong>Contenus affichés (avis clients, galerie) :</strong> le stockage et la diffusion de ces contenus publics passent par la plateforme <strong>Supabase</strong> (supabase.com), sous-traitant, selon la configuration du projet (région possible : UE ou autre). Les données concernées sont celles affichées volontairement sur le site (pseudo, texte d’avis, images de réalisations).
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
          <p>
            Conformément au RGPD, vous disposez d’un droit d’accès, de modification et de suppression de vos données personnelles. Vous pouvez exercer ces droits en contactant :{' '}
            <a href="mailto:contact@allotech72.fr"><strong>contact@allotech72.fr</strong></a>
          </p>

          <h3>7. Cookies et traceurs</h3>
          <p>
            <strong>Ce site n’utilise pas de cookies de suivi actuellement</strong> (publicité, mesure d’audience type Google Analytics, réseaux sociaux, etc.).
          </p>
          <p>
            Sont utilisés uniquement des cookies <strong>strictement nécessaires</strong> au fonctionnement (mémorisation de vos préférences cookies via le bandeau).
            <strong> Aucun cookie publicitaire, de tracking ou d’analyse d’audience n’est déposé</strong> sans votre consentement explicite, conformément aux recommandations de la CNIL (délibération n°2020-091 du 17 septembre 2020).
          </p>
          <p style={{ fontSize: '.82rem', color: 'var(--dim)' }}>
            Évolution possible : si un outil d’analyse d’audience est ajouté (ex. Google Analytics), le bandeau de cookies sera adapté pour recueillir votre consentement avant tout dépôt de cookies non nécessaires, et la présente politique sera mise à jour.
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

          <h3>9. Transferts de données hors Union européenne</h3>
          <p>
            Certains sous-traitants peuvent être établis ou utiliser des infrastructures situées aux <strong>États-Unis</strong> ou dans d’autres pays tiers. Dans ce cas, les transferts sont encadrés conformément au chapitre V du RGPD, notamment par :
          </p>
          <ul>
            <li>les <strong>clauses contractuelles types</strong> (CCT / SCC) approuvées par la Commission européenne ; et/ou</li>
            <li>le cadre <strong>EU-US Data Privacy Framework</strong> (Décision d’adéquation de la Commission du 10 juillet 2023, pour les organisations certifiées), lorsque applicable ; et/ou</li>
            <li>les <strong>garanties appropriées</strong> prévues à l’article 46 du RGPD.</li>
          </ul>
          <p>
            Vous pouvez obtenir une copie des garanties pertinentes sur demande auprès du responsable du traitement aux coordonnées indiquées ci-dessus, ou consulter les politiques des prestataires concernés (notamment Formspree, Vercel, Supabase).
          </p>

          <p style={{ fontSize: '.78rem', color: 'var(--dim)', marginTop: 20, borderTop: '1px solid rgba(0,207,255,0.1)', paddingTop: 16 }}>
            Dernière mise à jour : {year} — Politique conforme RGPD & CNIL — {config.brand}
          </p>
        </div>
      </div>
    </>
  )
}
