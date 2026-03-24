import config from '../config.js'

export default function Zone() {
  return (
    <section id="zone" className="sp">
      <div className="container">
        <div className="rev" style={{ textAlign: 'center', marginBottom: 60 }}>
          <div className="stag">Déplacement</div>
          <h2>Zone d'<span className="c">intervention</span></h2>
          <div className="div-line" />
        </div>

        <div className="zw">
          <div className="zl rev">
            <h3>Je me déplace chez vous</h3>
            <p>Pas besoin de vous déplacer. {config.prenom} intervient directement à votre domicile sur l'ensemble des communes listées, ainsi que leurs environs.</p>
            <p>Une commune non listée ? Contactez-moi, on trouvera une solution.</p>
            <a href={`tel:${config.telBrut}`} className="pcard">📞 {config.telephone}</a>
          </div>

          <div className="cg rev">
            {config.communes.map((c, i) => (
              <div key={i} className="chip">{c}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
