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
            Toutes nos actualités et conseils informatiques pour Le Mans et la Sarthe.
          </p>
          {!loading && posts.length > 0 && (
            <p className="actu-count">{posts.length} actualité{posts.length > 1 ? 's' : ''} publiée{posts.length > 1 ? 's' : ''}</p>
          )}
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
          <section className="actu-list" aria-label="Liste des actualités">
            <div className="actu-grid">
              {posts.map((post, index) => (
                <article
                  key={post.id}
                  className={`actu-card${index === 0 ? ' actu-card--latest' : ''}${post.imageUrl ? ' actu-card--with-image' : ''}`}
                >
                  {post.imageUrl && (
                    <Link to={`/actu/${post.slug}`} className="actu-card-cover-link">
                      <img src={post.imageUrl} alt={post.title} className="actu-card-cover" loading="lazy" />
                    </Link>
                  )}
                  <div className="actu-card-content">
                  {index === 0 && <span className="actu-card-badge">Dernière</span>}
                  <time dateTime={post.publishedAt} className="actu-card-date">
                    {formatActuDate(post.publishedAt)}
                  </time>
                  <h3>
                    <Link to={`/actu/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p>{post.excerpt || buildActuExcerpt(post.body, index === 0 ? 220 : 160)}</p>
                  <div className="actu-card-footer">
                    <span>{actuReadingMinutes(post.body)} min</span>
                    <Link to={`/actu/${post.slug}`} className="actu-card-link">
                      Lire l'article →
                    </Link>
                  </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
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
