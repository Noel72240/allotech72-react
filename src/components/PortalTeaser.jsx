import { Link } from 'react-router-dom'
import config from '../config.js'

/** Bandeau — Adam, outils gratuits, espace client */
export default function PortalTeaser() {
  const register = config.portalRegister || config.portalUrl
  const login = config.portalUrl
  if (!register && !login) return null

  return (
    <section id="espace-client" className="sp portal-teaser">
      <div className="container">
        <div className="rev" style={{ textAlign: 'center', marginBottom: 36 }}>
          <div className="stag">Aide en ligne</div>
          <h2>
            Adam, outils &amp; <span className="c">espace client</span>
          </h2>
          <div className="div-line" />
          <p className="sub">
            Pas besoin d’attendre sur place pour tout : diagnostic guidé, outils recommandés, suivi de vos interventions.
          </p>
        </div>

        <div className="outils-teaser__grid">
          <article className="outils-teaser__card rev">
            <h3>Adam</h3>
            <p>Assistant Allotech72 : décrivez la panne, il oriente le diagnostic 24&nbsp;h/24 — local, sans jargon.</p>
            <p className="outils-teaser__hint">Bouton Adam en bas à droite de l’écran.</p>
          </article>
          <article className="outils-teaser__card rev">
            <h3>Outils gratuits</h3>
            <p>AnyDesk, diagnostics, nettoyage : les logiciels que Noël utilise, à télécharger.</p>
            <Link to="/outils" className="bm bo">Voir les outils →</Link>
          </article>
          <article className="outils-teaser__card rev">
            <h3>Espace client</h3>
            <p>Compte sécurisé : suivi des interventions et Adam intégré au portail.</p>
            <div className="outils-teaser__acts">
              {register && (
                <a href={register} className="bm bp" target="_blank" rel="noopener noreferrer">
                  Créer mon compte
                </a>
              )}
              {login && (
                <a href={login} className="bm bo" target="_blank" rel="noopener noreferrer">
                  Connexion
                </a>
              )}
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
