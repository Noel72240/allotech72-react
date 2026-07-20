import config, { fullName } from '../config.js'

const initiales = config.prenom[0] + config.nom[0]

export default function About() {
  return (
    <section id="qui" className="sp">
      <div className="container">
        <div className="rev" style={{ textAlign: 'center', marginBottom: 60 }}>
          <div className="stag">Votre technicien</div>
          <h2>Qui suis-<span className="c">je ?</span></h2>
          <div className="div-line" />
        </div>

        <div className="ag">
          <div className="ac rev">
            <div className="pr">
              <div className="av-avatar">{initiales}</div>
              <div>
                <h3>{fullName()}</h3>
                <p>Technicien informatique indépendant</p>
                <p style={{ color: 'var(--g)', fontSize: '.78rem', marginTop: 2 }}>📍 {config.ville}, {config.departement}</p>
              </div>
            </div>
            <p className="about-txt">
              Basé à <strong>{config.ville}</strong>, je propose avec <strong>{config.brand}</strong> (ouvert depuis <strong>août 2025</strong>) un service de{' '}
              <strong>dépannage et d&apos;assistance informatique</strong> pour les <strong>particuliers</strong> du secteur de {config.ville}, Allonnes et alentours.
              <br /><br />
              <strong>15 ans de passion</strong> pour les nouvelles technologies et déjà <strong>plus de 100 clients satisfaits</strong> :
              j&apos;interviens sur <strong>ordinateurs, téléphones, tablettes, sites internet et applications mobiles</strong>,
              avec une approche simple, claire et personnalisée.
            </p>
            <div className="aln">
              {config.facebook && (
                <a href={config.facebook} target="_blank" rel="noopener" className="bm bo" style={{ fontSize: '.8rem', padding: '10px 20px' }}>📘 Facebook</a>
              )}
              <a href="#contact" className="bm bp" style={{ fontSize: '.8rem', padding: '10px 20px' }}>Devis gratuit</a>
            </div>
          </div>

          <div className="ast rev">
            <div className="sb">
              <div className="sbn">{config.avisTotal}+</div>
              <div><h4>Avis clients ★★★★★</h4><p>Google, AlloVoisin, Facebook &amp; Pages Jaunes — 100% d&apos;avis 5 étoiles.</p></div>
            </div>
            <div className="sb">
              <div className="sbn">{config.communes.length}+</div>
              <div><h4>Communes couvertes</h4><p>Toute la Sarthe — de {config.ville} à Le Mans et les {config.communes.length} communes.</p></div>
            </div>
            <div className="sb">
              <div className="sbn">{config.services.length}+</div>
              <div><h4>Types de services</h4><p>PC, Mac, téléphones, tablettes, sites internet, apps mobiles.</p></div>
            </div>
            <div style={{ padding: 20, background: 'rgba(43,255,154,.05)', border: '1px solid rgba(43,255,154,.18)', borderRadius: 14 }}>
              <p style={{ color: 'var(--g)', fontSize: '.85rem', fontWeight: 700, marginBottom: 6 }}>
                ✓ {config.garantie?.titre || 'Garantie Proximité'}
              </p>
              <p style={{ color: 'var(--dim)', fontSize: '.85rem' }}>
                {config.garantie?.resume || 'Si la même panne revient, je reviens.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
