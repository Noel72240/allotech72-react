import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout.jsx'
import config, { fullName } from '../config.js'

export default function Tarifs() {
  const rows = config.tarifs || []

  return (
    <PageLayout
      title="Tarifs dépannage informatique Le Mans & Sarthe"
      description={`Grille tarifaire Allotech72 : diagnostic gratuit, virus dès 25 €, entretien PC 40 €. Devis avant réparation. ${config.telephone}`}
    >
      <div className="container tarifs-page">
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="stag">Grille officielle</div>
          <h2>
            Tarifs <span className="c">Allotech72</span>
          </h2>
          <div className="div-line" />
          <p className="sub">{config.tarifsNote}</p>
        </div>

        <div className="tarifs-table wrap">
          <table>
            <thead>
              <tr>
                <th>Prestation</th>
                <th>Main-d’œuvre</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label}>
                  <td>
                    {row.to ? <Link to={row.to}>{row.label}</Link> : row.label}
                    {row.note ? <small>{row.note}</small> : null}
                  </td>
                  <td>{row.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="tarifs-legal">
          <p>
            {fullName()} — {config.brand} · SIRET {config.siret} · {config.statut} · TVA non applicable art. 293B du CGI
          </p>
          <p>{config.garantie?.titre} : {config.garantie?.resume}</p>
        </div>

        <div className="tarifs-preview__acts">
          <a href={`tel:${config.telBrut}`} className="bm bp">
            📞 {config.telephone}
          </a>
          <Link to="/prendre-rdv" className="bm bo">
            Prendre RDV →
          </Link>
        </div>
      </div>
    </PageLayout>
  )
}
