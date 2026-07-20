import config from '../config.js'

/** Bandeau pro — accès espace client (portail) */
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
              Votre portail <span className="c">Allotech72</span>
            </h2>
            <div className="div-line" style={{ marginLeft: 0 }} />
            <p>
              Créez votre compte pour suivre vos interventions, retrouver vos infos et rester
              connecté avec {config.prenom} — simple, sécurisé, 100&nbsp;% local.
            </p>
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
