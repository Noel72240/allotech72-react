import config from '../config.js'

/** Bandeau pro — accès espace client (portail + Adam) */
export default function PortalTeaser() {
  const register = config.portalRegister || config.portalUrl
  const login = config.portalUrl
  if (!register && !login) return null

  return (
    <section id="espace-client" className="sp portal-teaser">
      <div className="container">
        <div className="portal-teaser__card rev">
          <div className="portal-teaser__copy">
            <div className="stag">Espace client</div>
            <h2>
              Portail + <span className="c">Adam</span>
            </h2>
            <div className="div-line" style={{ marginLeft: 0 }} />
            <p>
              Votre espace Allotech72 : suivi des interventions, infos client, et{' '}
              <strong>Adam</strong> — l’assistant intelligent pour vous aider 24&nbsp;h/24
              (diagnostic, conseils, orientation). Simple, sécurisé, 100&nbsp;% local.
            </p>
            <ul className="portal-teaser__perks">
              <li>Adam — assistant IA intégré</li>
              <li>Suivi de vos interventions</li>
              <li>Compte sécurisé</li>
            </ul>
          </div>
          <div className="portal-teaser__acts">
            {register && (
              <a
                href={register}
                className="bm bp"
                target="_blank"
                rel="noopener noreferrer"
              >
                Créer mon compte →
              </a>
            )}
            {login && (
              <a
                href={login}
                className="bm bo"
                target="_blank"
                rel="noopener noreferrer"
              >
                Déjà client ? Connexion
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
