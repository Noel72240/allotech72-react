import config from '../config.js'

const avantages = [
  { ico: '💰', titre: 'Économique',           desc: 'Coût bien inférieur au remplacement. Tarifs justes et transparents.' },
  { ico: '🌱', titre: 'Écologique',            desc: 'Prolonger la vie de vos appareils évite le gaspillage électronique.' },
  { ico: '💾', titre: 'Données préservées',    desc: 'Vos photos et fichiers importants sont précieux — intervention soigneuse.' },
  { ico: '🏠', titre: 'Domicile',              desc: `Pas besoin de vous déplacer — ${config.prenom} vient chez vous en Sarthe.` },
]

export default function Avantages() {
  return (
    <section id="avantages" className="sp">
      <div className="container">
        <div className="aw">
          <div>
            <div className="rev" style={{ marginBottom: 36 }}>
              <div className="stag">Pourquoi {config.brand}</div>
              <h2>Réparer plutôt<br />que <span className="c">remplacer</span></h2>
              <div className="div-line" style={{ marginLeft: 0 }} />
            </div>
            <div className="al">
              {avantages.map((a, i) => (
                <div key={i} className="av-item rev">
                  <div className="aico">{a.ico}</div>
                  <div className="av-txt">
                    <h4>{a.titre}</h4>
                    <p>{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="qc rev">
            <div className="qm">"</div>
            <p className="qt">
              Bénéficiez d'un service informatique local, fiable et accessible : diagnostic précis, conseils personnalisés, interventions efficaces, solutions durables — avec un excellent rapport qualité-prix.
            </p>
            <div className="eco">
              <span>♻️</span>
              <p>Faire réparer, c'est faire le choix d'une solution économique ET écologique.</p>
            </div>
            <div style={{ marginTop: 28 }}>
              <a href={`tel:${config.telBrut}`} className="bm bp" style={{ fontSize: '.85rem', padding: '12px 28px' }}>
                📞 {config.telephone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
