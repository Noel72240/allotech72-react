import PageLayout from '../components/PageLayout.jsx'
import config, { siteDomainForEmail } from '../config.js'

const PATH = '/confidentialite-at72-ultimate'
const EMAIL = `contact@${siteDomainForEmail()}`

export default function ConfidentialiteAt72Ultimate() {
  const base = config.siteUrl.replace(/\/$/, '')

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Politique de confidentialité — AT72 ULTIMATE',
    url: `${base}${PATH}`,
    dateModified: '2026-10-09',
    publisher: {
      '@type': 'Organization',
      name: 'ALLOTECH72',
      url: base,
      email: EMAIL,
    },
    about: {
      '@type': 'SoftwareApplication',
      name: 'AT72 ULTIMATE',
      applicationCategory: 'BrowserExtension',
      operatingSystem: 'Chrome',
    },
  }

  return (
    <PageLayout
      title="Politique de confidentialité — AT72 ULTIMATE | ALLOTECH72"
      description="Politique de confidentialité de l’extension Chrome AT72 ULTIMATE : données utilisées localement, sans compte, sans IA, sans publicité ni télémétrie."
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <article className="container legal-doc">
        <div className="stag">Confidentialité</div>
        <h1>
          Politique de confidentialité — <span className="c">AT72 ULTIMATE</span>
        </h1>
        <div className="div-line" style={{ marginLeft: 0 }} />

        <p className="legal-doc__meta">
          <strong>Mise à jour :</strong> 9 octobre 2026
          <br />
          <strong>Éditeur :</strong> ALLOTECH72
          <br />
          <strong>Contact :</strong>{' '}
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </p>

        <section className="legal-doc__section">
          <h2>Présentation</h2>
          <p>
            AT72 ULTIMATE est une extension Chrome qui fournit des outils de gestion de navigation.
            Elle fonctionne <strong>sans compte</strong>, <strong>sans intelligence artificielle</strong>,{' '}
            <strong>sans publicité</strong> ni <strong>télémétrie</strong>.
          </p>
        </section>

        <section className="legal-doc__section">
          <h2>Données utilisées</h2>
          <ul>
            <li>
              <strong>Titres et URL des onglets</strong> pour gérer les onglets, identifier les doublons
              et sauvegarder les sessions.
            </li>
            <li>
              <strong>Contenu des pages</strong> pour les captures, le mode lecture et les diagnostics
              demandés par l’utilisateur.
            </li>
            <li>
              <strong>Informations des téléchargements récents</strong> pour afficher leur liste et
              retrouver les fichiers.
            </li>
            <li>
              <strong>Notes, raccourcis, préférences, sessions et domaines bloqués</strong> enregistrés
              dans le navigateur.
            </li>
            <li>
              <strong>Mots de passe générés localement</strong> et copiés uniquement à la demande de
              l’utilisateur. Le presse-papiers n’est <strong>pas</strong> lu.
            </li>
          </ul>
        </section>

        <section className="legal-doc__section">
          <h2>Finalité et non-transmission</h2>
          <p>
            Ces données servent uniquement aux fonctions de l’extension. Elles ne sont ni envoyées à
            ALLOTECH72 ou à un serveur tiers, ni vendues, ni utilisées pour la publicité ou
            l’évaluation de solvabilité.
          </p>
        </section>

        <section className="legal-doc__section">
          <h2>Conservation et exports</h2>
          <ul>
            <li>
              Les captures et rapports sont exportés sur l’ordinateur à la demande de l’utilisateur.
            </li>
            <li>
              Les données du mode lecture sont conservées temporairement dans la session du navigateur.
            </li>
            <li>
              Les notes, préférences, raccourcis et sessions sauvegardées restent dans le stockage
              local de l’extension jusqu’à leur suppression ou à la désinstallation.
            </li>
            <li>
              Les fichiers exportés restent sur l’ordinateur après désinstallation.
            </li>
          </ul>
        </section>

        <section className="legal-doc__section">
          <h2>Nettoyage</h2>
          <p>
            Le nettoyage supprime les catégories choisies après confirmation. Supprimer les cookies
            peut déconnecter des sites ; le nettoyage ciblé des cookies peut concerner le domaine et
            ses sous-domaines.
          </p>
        </section>

        <section className="legal-doc__section">
          <h2>Engagements</h2>
          <p>
            L’extension ne surveille pas les frappes au clavier et ne collecte pas de données à des
            fins sans rapport avec ses fonctions. L’utilisation des données est limitée aux
            fonctionnalités décrites, conformément à la politique de données utilisateur du Chrome
            Web Store, notamment ses exigences d’utilisation limitée.
          </p>
        </section>

        <section className="legal-doc__section">
          <h2>Contact</h2>
          <p>
            Pour toute question :{' '}
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
          </p>
        </section>
      </article>
    </PageLayout>
  )
}
