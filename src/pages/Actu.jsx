import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout.jsx'
import { supabase } from '../lib/supabase.js'
import config from '../config.js'
import { mapActuRow, formatActuDate, actuReadingMinutes, buildActuExcerpt } from '../lib/actu.js'

export default function Actu() {
  const [posts, setPosts]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('actu')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false })
      setPosts((data || []).map(mapActuRow))
      setLoading(false)
    }
    fetch()
  }, [])

  const [featured, ...rest] = posts

  return (
    <PageLayout
      title="Actualités informatiques Sarthe"
      description={`Conseils, astuces et actualités dépannage informatique par ${config.brand} — Le Mans et Sarthe. Articles hebdomadaires pour vous tenir informé.`}
    >
      <div className="container actu-page" style={{ paddingBottom: 80 }}>

        <header className="actu-hero">
          <div className="stag">Actualités</div>
          <h2>Les <span className="c">Actus</span></h2>
          <div className="div-line" />
          <p className="sub">
            Chaque semaine, un conseil ou une actualité informatique pour Le Mans et la Sarthe.
          </p>
        </header>

        {loading ? (
          <div className="actu-empty">⏳ Chargement des actualités…</div>
        ) : posts.length === 0 ? (
          <div className="actu-empty">
            <p style={{ fontSize: '3rem', marginBottom: 16 }}>📰</p>
            <p>Les premières actualités arrivent bientôt.</p>
            <p style={{ marginTop: 12, fontSize: '.85rem' }}>
              En attendant, découvrez nos{' '}
              <Link to="/#services" style={{ color: 'var(--c)' }}>services</Link> ou appelez-nous.
            </p>
          </div>
        ) : (
          <>
            {featured && (
              <Link to={`/actu/${featured.slug}`} className="actu-featured">
                <div className="actu-featured-badge">Dernière actu</div>
                <time dateTime={featured.publishedAt}>{formatActuDate(featured.publishedAt)}</time>
                <h3>{featured.title}</h3>
                <p>{featured.excerpt || buildActuExcerpt(featured.body, 220)}</p>
                <div className="actu-featured-meta">
                  <span>{actuReadingMinutes(featured.body)} min de lecture</span>
                  <span className="actu-read-more">Lire l'article →</span>
                </div>
              </Link>
            )}

            {rest.length > 0 && (
              <section className="actu-archive" aria-label="Archives des actualités">
                <h3 className="actu-archive-title">Articles précédents</h3>
                <div className="actu-grid">
                  {rest.map(post => (
                    <article key={post.id} className="actu-card">
                      <time dateTime={post.publishedAt} className="actu-card-date">
                        {formatActuDate(post.publishedAt)}
                      </time>
                      <h4>
                        <Link to={`/actu/${post.slug}`}>{post.title}</Link>
                      </h4>
                      <p>{post.excerpt || buildActuExcerpt(post.body)}</p>
                      <div className="actu-card-footer">
                        <span>{actuReadingMinutes(post.body)} min</span>
                        <Link to={`/actu/${post.slug}`} className="actu-card-link">
                          Lire →
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        <div style={{ textAlign: 'center', marginTop: 64 }}>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={`tel:${config.telBrut}`} className="bm bp">📞 {config.telephone}</a>
            <Link to="/#contact" className="bm bo">Demander un devis →</Link>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
