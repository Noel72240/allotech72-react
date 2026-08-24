import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import config from '../config.js'
import { getCityPathByName } from '../data/seoCities.js'

export default function Zone() {
  const [q, setQ] = useState('')
  const communes = config.communes || []

  const filtered = useMemo(() => {
    const needle = q.trim().toLocaleLowerCase('fr')
    if (!needle) return communes
    return communes.filter((c) => c.toLocaleLowerCase('fr').includes(needle))
  }, [communes, q])

  return (
    <section id="zone" className="sp">
      <div className="container">
        <div className="rev" style={{ textAlign: 'center', marginBottom: 60 }}>
          <div className="stag">Déplacement</div>
          <h2>Zone d'<span className="c">intervention</span></h2>
          <div className="div-line" />
          <p className="sub">Toute la Sarthe — {communes.length} communes.</p>
        </div>

        <div className="zw">
          <div className="zl rev">
            <h3>Je me déplace chez vous</h3>
            <p>
              Pas besoin de vous déplacer. {config.prenom} intervient directement à votre domicile
              sur l&apos;ensemble des communes de la Sarthe.
            </p>
            <p>Recherchez votre ville ci-contre, ou appelez pour confirmer le déplacement.</p>
            <a href={`tel:${config.telBrut}`} className="pcard">📞 {config.telephone}</a>
          </div>

          <div className="zone-list rev">
            <label className="zone-search">
              <span className="sr-only">Rechercher une commune</span>
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Rechercher une commune…"
                autoComplete="off"
              />
              <span className="zone-count">
                {filtered.length} / {communes.length}
              </span>
            </label>

            <div className="cg" role="list">
              {filtered.map((c) => {
                const to = getCityPathByName(c)
                return to ? (
                  <Link key={c} to={to} className="chip chip--link" role="listitem">{c}</Link>
                ) : (
                  <div key={c} className="chip" role="listitem">{c}</div>
                )
              })}
              {filtered.length === 0 && (
                <p className="zone-empty">Aucune commune trouvée — appelez-moi, on trouve une solution.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
