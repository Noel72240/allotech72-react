import { Link } from 'react-router-dom'
import config from '../../config.js'
import { SEO_LOCAL_CITIES } from '../../data/seoPages.js'
import { getSeoBoost } from '../../data/seoBoostContent.js'

/**
 * Bloc SEO enrichi : preuves, article, étapes, FAQ (+ schema), zone, maillage, avis, CTA.
 * À placer en bas des pages guides (sans retirer le contenu existant).
 */
export default function SeoBoost({ pageKey, showAvis = true }) {
  const data = getSeoBoost(pageKey)
  if (!data) return null

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: (data.faq || []).map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.r },
    })),
  }

  const proofs = [
    '15 ans de passion',
    `${config.clientsSatisfaits || 100}+ clients`,
    `${config.avisTotal || 52}+ avis`,
    '5★',
    'Diagnostic gratuit',
    config.garantie ? `Garantie ${config.garantie.jours}j` : '24–48h',
  ]

  return (
    <div className="seo-boost">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <ul className="seo-boost__proofs" aria-label="Engagements">
        {proofs.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>

      {(data.paragraphs?.length > 0) && (
        <section className="seo-boost__article">
          <div className="stag">{data.stag || 'En détail'}</div>
          <h2>
            {data.topic} — <span className="c">guide local</span>
          </h2>
          <div className="div-line" style={{ marginLeft: 0 }} />
          {data.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>
      )}

      {data.steps?.length > 0 && (
        <section className="seo-boost__steps">
          <div className="stag">Déroulement</div>
          <h2>
            Comment <span className="c">ça marche</span>
          </h2>
          <div className="div-line" />
          <ol className="seo-boost__steps-list">
            {data.steps.map((s, i) => (
              <li key={s.t}>
                <span className="seo-boost__step-n">{i + 1}</span>
                <div>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {data.faq?.length > 0 && (
        <section className="seo-boost__faq">
          <div className="stag">Questions fréquentes</div>
          <h2>
            FAQ — <span className="c">{data.topic}</span>
          </h2>
          <div className="div-line" />
          <div className="seo-boost__faq-list">
            {data.faq.map((f) => (
              <details key={f.q} className="seo-boost__faq-item">
                <summary>{f.q}</summary>
                <p>{f.r}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <section className="seo-boost__zone">
        <div className="stag">Zone</div>
        <h2>
          Intervention à domicile — <span className="c">{data.city || 'Sarthe'}</span>
        </h2>
        <div className="div-line" />
        <p>
          {config.brand} se déplace sur Le Mans, {config.ville} et toute la Sarthe
          ({config.communes?.length || 352} communes), notamment :{' '}
          {SEO_LOCAL_CITIES.join(', ')}.
        </p>
        <Link to="/#zone" className="seo-boost__zone-link">
          Voir toutes les communes →
        </Link>
      </section>

      {data.related?.length > 0 && (
        <section className="seo-boost__related">
          <div className="stag">Maillage</div>
          <h2>
            Autres <span className="c">guides</span>
          </h2>
          <div className="div-line" />
          <ul>
            {data.related.map((l) => (
              <li key={l.to}>
                <Link to={l.to}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {showAvis && (
        <section className="seo-boost__avis">
          <div className="stag">Avis regroupés</div>
          <h2>
            Clients <span className="c">satisfaits</span>
          </h2>
          <div className="div-line" />
          <div className="seo-boost__avis-grid">
            {config.avis.slice(0, 3).map((a) => (
              <article key={a.nom} className="avis-card">
                <div className="avis-head">
                  <div className="avis-av">{a.initiales}</div>
                  <div>
                    <h4>{a.nom}</h4>
                    <div className="avis-stars">★★★★★</div>
                    <div className="avis-type">{a.type}</div>
                  </div>
                </div>
                <p className="avis-txt">&ldquo;{a.texte}&rdquo;</p>
              </article>
            ))}
          </div>
          <div className="seo-boost__avis-more">
            <Link to="/avis" className="bm bo">
              Voir tous les avis →
            </Link>
          </div>
        </section>
      )}

      <section className="seo-boost__cta">
        <h2>
          {data.cta || 'Besoin d’aide ?'}{' '}
          <span className="c">Appelez.</span>
        </h2>
        <p>
          Diagnostic clair, devis avant réparation — {config.prenom} au{' '}
          {config.telephone}.
        </p>
        <div className="seo-boost__cta-acts">
          <a href={`tel:${config.telBrut}`} className="bm bp">
            📞 {config.telephone}
          </a>
          <Link to="/#contact" className="bm bo">
            Devis gratuit →
          </Link>
        </div>
      </section>
    </div>
  )
}
