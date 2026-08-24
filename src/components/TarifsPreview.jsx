import { Link } from 'react-router-dom'
import config from '../config.js'

const PREVIEW = 8

export default function TarifsPreview() {
  const rows = (config.tarifs || []).slice(0, PREVIEW)
  if (!rows.length) return null

  return (
    <section id="tarifs" className="sp tarifs-preview">
      <div className="container">
        <div className="rev" style={{ textAlign: 'center', marginBottom: 36 }}>
          <div className="stag">Tarifs indicatifs</div>
          <h2>
            Des prix <span className="c">annoncés</span> avant d’agir
          </h2>
          <div className="div-line" />
          <p className="sub">{config.tarifsNote}</p>
        </div>

        <div className="tarifs-table wrap rev">
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

        <div className="tarifs-preview__acts rev">
          <Link to="/tarifs" className="bm bo">
            Voir toute la grille →
          </Link>
          <a href={`tel:${config.telBrut}`} className="bm bp">
            📞 {config.telephone}
          </a>
        </div>
      </div>
    </section>
  )
}
