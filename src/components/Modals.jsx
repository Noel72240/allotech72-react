// ══════════════════════════════════════════════
// Modals légales : Mentions légales + RGPD/CNIL
// Conformes au droit français & Règlement UE
// ══════════════════════════════════════════════
import { useEffect } from 'react'
import { useCookies } from '../hooks/useCookies.jsx'
import { ANALYTICS_ENABLED } from '../lib/analytics.js'
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
          </p>
          {config.mediateur?.nom ? (
            <p>
              Conformément à l’article L612-1 du Code de la consommation, le consommateur peut recourir gratuitement au médiateur :{' '}
              <strong>{config.mediateur.nom}</strong>
              {config.mediateur.url && (
                <> — <a href={config.mediateur.url} target="_blank" rel="noopener noreferrer">{config.mediateur.url}</a></>
              )}
              {config.mediateur.adresse && <> — {config.mediateur.adresse}</>}.
            </p>
          ) : (
            <p>
              En cas de litige avec un consommateur, vous pouvez recourir à la plateforme européenne de règlement en ligne des litiges :{' '}
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener">https://ec.europa.eu/consumers/odr</a>
            </p>
          )}

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
            Selon la finalité, vos données sont traitées sur la base du <strong>consentement</strong> (formulaire de contact, cookies analytiques),
            de l’<strong>exécution du contrat</strong> (commande boutique) ou de nos <strong>obligations légales</strong> (conservation comptable).
          </p>
          <p>Via le formulaire de contact, les données suivantes sont collectées :</p>
          <ul>
            <li><strong>Données :</strong> nom, prénom, adresse e-mail, numéro de téléphone, message</li>
            <li><strong>Base légale :</strong> consentement explicite de la personne concernée (art. 6.1.a RGPD)</li>
            <li><strong>Caractère obligatoire :</strong> nom, email et message sont obligatoires pour traiter votre demande</li>
          </ul>
          <p><strong>Boutique en ligne (commande) :</strong></p>
          <ul>
            <li><strong>Données :</strong> nom, email, téléphone, adresse postale, mode de livraison, point relais Mondial Relay le cas échéant, détail de la commande</li>
            <li><strong>Base légale :</strong> exécution du contrat de vente (art. 6.1.b RGPD) et consentement pour le traitement des données personnelles (art. 6.1.a RGPD)</li>
            <li><strong>Finalité :</strong> traitement de la commande, livraison ou retrait, facturation, contact client</li>
          </ul>

          <h3>3. Finalités du traitement</h3>
          <p>
            Les données collectées servent à vous recontacter (devis, dépannage), à traiter vos commandes boutique (paiement, livraison, retrait) et à respecter nos obligations légales. Aucune revente de données à des tiers à des fins commerciales.
          </p>

          <h3>4. Durée de conservation</h3>
          <p>
            Les données de contact sont conservées pendant une durée maximale de <strong>12 mois</strong> à compter de leur collecte ou de notre dernier échange. Les données de commande boutique sont conservées <strong>10 ans</strong> pour obligations comptables et fiscales (facturation), sauf durée légale plus longue.
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
          <p>
            <strong>Paiement en ligne (SumUp) :</strong> les paiements boutique sont traités par <strong>SumUp Payments Limited</strong> (sumup.com). Les données bancaires ne transitent pas par nos serveurs : vous êtes redirigé vers la page sécurisée SumUp. SumUp agit en tant que sous-traitant ou responsable conjoint selon sa politique de confidentialité.
          </p>
          <p>
            <strong>Livraison Mondial Relay :</strong> si vous choisissez cette option, les coordonnées nécessaires à l’expédition (nom, adresse, point relais) peuvent être transmises à <strong>Mondial Relay</strong> ou à l’organisme de transport pour la remise du colis.
          </p>
          <p>
            <strong>Commandes boutique (email) :</strong> notification de commande via <strong>Formspree</strong> vers contact@{siteDomainForEmail()}.
          </p>
          {ANALYTICS_ENABLED && (
            <p>
              <strong>Mesure d’audience (Google Analytics 4) :</strong> si vous acceptez les cookies analytiques, des données de navigation agrégées (pages vues, type d’appareil, origine du trafic) sont traitées par <strong>Google</strong> (Google Ireland Limited / Google LLC) pour produire des statistiques de fréquentation. Voir section « Cookies et traceurs ».
            </p>
          )}

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
            Le bandeau cookies vous permet d’<strong>accepter ou refuser</strong> les cookies de mesure d’audience.
            Les cookies <strong>strictement nécessaires</strong> (mémorisation de votre choix cookies) sont toujours utilisés.
          </p>
          {ANALYTICS_ENABLED ? (
            <>
              <p><strong>Mesure d’audience (sur consentement uniquement) :</strong></p>
              <ul>
                <li><strong>Outil :</strong> Google Analytics 4 (Google Ireland Limited / Google LLC)</li>
                <li><strong>Finalité :</strong> statistiques de fréquentation (pages visitées, origine du trafic), de manière agrégée</li>
                <li><strong>Base légale :</strong> consentement (art. 6.1.a RGPD)</li>
                <li><strong>Durée :</strong> selon la politique Google (cookies _ga, _ga_* — typiquement 13 mois max.)</li>
                <li><strong>Désactivation :</strong> refuser via le bandeau, ou{' '}
                  <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener">module de désactivation Google</a>
                </li>
              </ul>
              <p style={{ fontSize: '.82rem', color: 'var(--dim)' }}>
                Aucun cookie publicitaire ou de retargeting n’est utilisé. L’adresse IP peut être anonymisée (paramètre activé).
              </p>
            </>
          ) : (
            <p>
              Aucun cookie de mesure d’audience n’est déposé actuellement (publicité, réseaux sociaux, etc.).
            </p>
          )}
          <p style={{ fontSize: '.82rem', color: 'var(--dim)' }}>
            Conformément aux recommandations CNIL (délibération n°2020-091), aucun traceur non essentiel n’est déposé sans votre consentement explicite.
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

      {/* ════ CGV — BOUTIQUE EN LIGNE ════ */}
      <div className="modal-ov" id="m-cgv" onClick={e => { if (e.target === e.currentTarget) closeModal('m-cgv') }}>
        <div className="modal-box">
          <button className="modal-x" onClick={() => closeModal('m-cgv')}>✕</button>
          <h2>🛒 Conditions Générales de Vente</h2>
          <p style={{ color: 'var(--dim)', fontSize: '.85rem', marginBottom: 16 }}>
            Applicables aux achats sur la boutique en ligne {config.siteUrl}/boutique — {fullName()} – {config.brand}
          </p>

          <h3>1. Vendeur</h3>
          <p>
            {fullName()} – {config.brand}<br />
            {config.adresse}, {config.codePostal} {config.ville}<br />
            SIRET : {config.siret} — {config.statut}<br />
            Email : contact@{siteDomainForEmail()} — Tél. : {config.telephone}<br />
            TVA non applicable, art. 293B du CGI
          </p>

          <h3>2. Produits et prix</h3>
          <p>
            Les produits proposés (neuf ou occasion) sont décrits avec le maximum de précision. Les photographies ne sont pas contractuelles. Les prix sont indiqués en euros TTC (TVA non applicable). {config.brand} se réserve le droit de modifier les prix ; le prix facturé est celui affiché au moment de la commande.
          </p>

          <h3>3. Commande et paiement</h3>
          <p>
            La commande est validée après paiement en ligne via <strong>SumUp</strong> (carte bancaire). Vous êtes redirigé vers une page de paiement sécurisée. Aucune donnée bancaire n’est stockée sur nos serveurs. La vente n’est définitive qu’après confirmation du paiement.
          </p>

          <h3>4. Livraison et retrait</h3>
          <ul>
            <li><strong>Retrait sur place :</strong> gratuit à {config.adresse}, {config.codePostal} {config.ville}, sur rendez-vous après confirmation de commande.</li>
            <li><strong>Mondial Relay :</strong> envoi en point relais sélectionné. Les frais de port sont indiqués avant paiement. Les délais dépendent du transporteur.</li>
          </ul>
          <p>
            {config.brand} s’efforce d’expédier ou de préparer le retrait dans un délai raisonnable (généralement sous 5 jours ouvrés après paiement, sauf indication contraire sur la fiche produit).
          </p>

          <h3>5. Droit de rétractation</h3>
          <p>
            Conformément aux articles L221-18 et suivants du Code de la consommation, le consommateur dispose d’un délai de <strong>14 jours</strong> à compter de la réception du bien pour exercer son droit de rétractation, sans avoir à motiver sa décision.
          </p>
          <p>
            Pour l’exercer : contact@{siteDomainForEmail()} ou {config.telephone}, en indiquant votre nom, référence de commande et souhait de rétractation. Le produit doit être retourné dans son état d’origine, non utilisé et complet. Les frais de retour sont à la charge du client, sauf produit non conforme ou défectueux.
          </p>
          <p style={{ fontSize: '.85rem', color: 'var(--dim)' }}>
            Exceptions possibles (art. L221-28) : produits descellés ne pouvant être renvoyés pour des raisons d’hygiène ou de protection de la santé, contenus numériques fournis sur un support immatériel dont l’exécution a commencé avec accord préalable, produits personnalisés.
          </p>

          <h4 style={{ marginTop: 20, marginBottom: 10, color: 'var(--tx)' }}>Modèle de formulaire de rétractation</h4>
          <p style={{ fontSize: '.85rem' }}>
            Vous pouvez utiliser le modèle ci-dessous (art. L221-5) — à envoyer par email à contact@{siteDomainForEmail()} ou par courrier :
          </p>
          <pre style={{
            background: 'rgba(0,207,255,0.04)', border: '1px solid rgba(0,207,255,0.15)',
            borderRadius: 10, padding: '14px 16px', fontSize: '.78rem', lineHeight: 1.65,
            color: 'var(--dim)', whiteSpace: 'pre-wrap', overflowX: 'auto',
          }}>{`À l'attention de ${fullName()} – ${config.brand}
${config.adresse}, ${config.codePostal} ${config.ville}
contact@${siteDomainForEmail()}

Je vous notifie par la présente ma rétractation du contrat portant sur la vente du bien ci-dessous :

Commande n° : [votre référence]
Commandé le : [date]
Reçu le : [date de réception]

Nom du consommateur : [votre nom]
Adresse du consommateur : [votre adresse]
Signature (en cas de notification papier) : [signature]
Date : [date]`}</pre>

          <h3>6. Garanties légales</h3>
          <p>
            Les produits neufs bénéficient de la garantie légale de conformité (articles L217-4 et suivants du Code de la consommation) et de la garantie contre les vices cachés (articles 1641 et suivants du Code civil). Les produits d’occasion sont vendus dans l’état décrit sur la fiche produit.
          </p>

          <h3>7. Données personnelles</h3>
          <p>
            Les données collectées lors de la commande sont traitées conformément à notre{' '}
            <a href="#" onClick={e => { e.preventDefault(); closeModal('m-cgv'); document.getElementById('m-conf')?.classList.add('open') }}>
              politique de confidentialité
            </a>.
          </p>

          <h3>8. Médiation et litiges</h3>
          <p>
            En cas de litige, contactez-nous en priorité ({config.telephone}, contact@{siteDomainForEmail()}).
          </p>
          {config.mediateur?.nom ? (
            <p>
              Conformément à l’article L612-1 du Code de la consommation, vous pouvez recourir gratuitement au médiateur :{' '}
              <strong>{config.mediateur.nom}</strong>
              {config.mediateur.url && (
                <> — <a href={config.mediateur.url} target="_blank" rel="noopener noreferrer">{config.mediateur.url}</a></>
              )}
              {config.mediateur.adresse && <> — {config.mediateur.adresse}</>}.
            </p>
          ) : (
            <p>
              Plateforme européenne de règlement en ligne des litiges :{' '}
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr</a>.
            </p>
          )}
          <p>
            Droit applicable : droit français. Tribunaux compétents du ressort de la Sarthe.
          </p>

          <p style={{ fontSize: '.78rem', color: 'var(--dim)', marginTop: 20, borderTop: '1px solid rgba(0,207,255,0.1)', paddingTop: 16 }}>
            Dernière mise à jour : {year} — {config.brand}
          </p>
        </div>
      </div>
    </>
  )
}
