import { useForm, ValidationError } from '@formspree/react'
import config from '../config.js'

export default function Contact({
  variant = 'default',
  subtitle,
} = {}) {
  const [state, handleSubmit] = useForm(config.formspreeId)
  const isRdv = variant === 'rdv'
  const lead = subtitle || (isRdv
    ? 'Indiquez un horaire — je vous confirme rapidement.'
    : 'Décrivez votre problème, je vous réponds rapidement.')
  const subject = isRdv ? `Demande de RDV – ${config.brand}` : `Nouveau contact – ${config.brand}`

  return (
    <section id="contact" className="sp">
      <div className="container">
        <div className="rev" style={{ textAlign: 'center', marginBottom: 60 }}>
          <div className="stag">{isRdv ? 'Rendez-vous' : 'Contactez-moi'}</div>
          {isRdv ? (
            <h2>Réserver un <span className="c">créneau</span></h2>
          ) : (
            <h2>Devis <span className="c">gratuit</span></h2>
          )}
          <div className="div-line" />
          <p className="sub">{lead}</p>
        </div>

        <div className="cog">

          {/* ── INFOS CONTACT ── */}
          <div className="cin rev">
            <div className="cbl">
              <div className="cico">📞</div>
              <div>
                <h4>Téléphone</h4>
                <a href={`tel:${config.telBrut}`}>{config.telephone}</a>
                <p style={{ fontSize: '.78rem', color: 'var(--dim)', marginTop: 3 }}>Appel ou SMS — rappel rapide</p>
              </div>
            </div>
            <div className="cbl">
              <div className="cico">📍</div>
              <div>
                <h4>Adresse</h4>
                <p>{config.adresse}<br />{config.codePostal} {config.ville}</p>
              </div>
            </div>
            <div className="cbl">
              <div className="cico">⏰</div>
              <div>
                <h4>Disponibilité</h4>
                <p>{config.horaires}</p>
                <p style={{ fontSize: '.78rem', color: 'var(--dim)', marginTop: 3 }}>{config.delai}</p>
              </div>
            </div>
            {config.portalRegister && (
              <div className="cbl">
                <div className="cico">🔐</div>
                <div>
                  <h4>Espace client + Adam</h4>
                  <a
                    href={config.portalRegister}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Créer mon compte / portail
                  </a>
                  <p style={{ fontSize: '.78rem', color: 'var(--dim)', marginTop: 3 }}>
                    Suivi interventions &amp; assistant Adam intégré
                  </p>
                </div>
              </div>
            )}
            {config.facebook && (
              <div className="cbl">
                <div className="cico">📘</div>
                <div>
                  <h4>Réseaux sociaux</h4>
                  <a href={config.facebook} target="_blank" rel="noopener">
                    Suivez {config.brand} sur Facebook
                  </a>
                </div>
              </div>
            )}
            <div className="tva">
              <p>💳 TVA non applicable</p>
              <p>Article 293B du CGI — {config.statut}</p>
            </div>
          </div>

          {/* ── FORMULAIRE FORMSPREE ── */}
          <div className="fc rev">
            <h3>📨 Votre demande</h3>

            {state.succeeded ? (
              /* ✅ SUCCÈS */
              <div className="form-ok">
                <p style={{ fontSize: '1.4rem' }}>✅ Message envoyé !</p>
                <p style={{ color: 'var(--dim)', marginTop: 10 }}>
                  {config.prenom} vous recontactera très rapidement à l'adresse indiquée.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>

                {/* Sujet du mail reçu */}
                <input type="hidden" name="_subject" value={subject} />

                <div className="f-row">
                  <div className="fg">
                    <label>Nom *</label>
                    <input type="text" name="nom" placeholder="Votre nom" required />
                    <ValidationError prefix="Nom" field="nom" errors={state.errors} />
                  </div>
                  <div className="fg">
                    <label>Prénom *</label>
                    <input type="text" name="prenom" placeholder="Votre prénom" required />
                    <ValidationError prefix="Prénom" field="prenom" errors={state.errors} />
                  </div>
                </div>

                <div className="fg">
                  <label>Email *</label>
                  <input type="email" name="email" placeholder="votre@email.fr" required />
                  <ValidationError prefix="Email" field="email" errors={state.errors} />
                </div>

                <div className="fg">
                  <label>Téléphone{isRdv ? ' *' : ''}</label>
                  <input type="tel" name="telephone" placeholder="06 XX XX XX XX" required={isRdv} />
                </div>

                <div className="fg">
                  <label>Commune</label>
                  <input type="text" name="commune" placeholder="Le Mans, Lombron…" />
                </div>

                <div className="fg">
                  <label>Type de problème</label>
                  <select name="type">
                    <option value="">Choisir...</option>
                    {config.formOptions.map((o, i) => (
                      <option key={i} value={o}>{o}</option>
                    ))}
                  </select>
                </div>

                <div className="f-row">
                  <div className="fg">
                    <label>Date souhaitée</label>
                    <input type="date" name="date_souhaitee" />
                  </div>
                  <div className="fg">
                    <label>Créneau</label>
                    <select name="creneau">
                      <option value="">Indifférent</option>
                      <option value="Matin">Matin</option>
                      <option value="Après-midi">Après-midi</option>
                      <option value="Soir">Soir</option>
                    </select>
                  </div>
                </div>

                <div className="fg">
                  <label>Urgence</label>
                  <select name="urgence" defaultValue="Normal">
                    <option value="Normal">Normal</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Critique">Critique</option>
                  </select>
                </div>

                <div className="fg">
                  <label>Votre message *</label>
                  <textarea name="message" placeholder="Décrivez votre problème..." required />
                  <ValidationError prefix="Message" field="message" errors={state.errors} />
                </div>

                <div className="fck">
                  <input type="checkbox" id="rgpd" name="rgpd" required />
                  <label htmlFor="rgpd">
                    J'accepte que mes données soient utilisées pour me recontacter dans le cadre de ma demande. Aucun autre traitement.{' '}
                    <a href="#" onClick={(e) => {
                      e.preventDefault()
                      document.getElementById('m-conf').classList.add('open')
                      document.body.style.overflow = 'hidden'
                    }}>
                      Politique de confidentialité
                    </a>
                  </label>
                </div>

                {/* Erreur globale */}
                {state.errors?.length > 0 && (
                  <p style={{ color: '#ff6b6b', fontSize: '.82rem', marginBottom: 12 }}>
                    ⚠️ Une erreur s'est produite, vérifiez les champs ou réessayez.
                  </p>
                )}

                <button type="submit" className="bsend" disabled={state.submitting}>
                  {state.submitting ? '⏳ Envoi en cours...' : 'Envoyer ma demande ⟶'}
                </button>

                <p style={{ fontSize: '.78rem', color: 'var(--dim)', marginTop: 18, lineHeight: 1.55, marginBottom: 0 }}>
                  Les informations collectées via ce formulaire sont utilisées uniquement pour répondre à votre demande. Elles ne sont jamais revendues.
                </p>

              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
