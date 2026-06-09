import { useState, useEffect } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import PageLayout from '../components/PageLayout.jsx'
import { supabase } from '../lib/supabase.js'
import config from '../config.js'
import { mapActuRow, formatActuDate, actuReadingMinutes, buildActuExcerpt } from '../lib/actu.js'

export default function ActuArticle() {
  const { slug } = useParams()
  const [post, setPost]       = useState(null)
  const [others, setOthers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('actu')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle()

      if (!data) {
        setMissing(true)
        setLoading(false)
        return
      }

      const mapped = mapActuRow(data)
      setPost(mapped)

      const { data: more } = await supabase
        .from('actu')
        .select('*')
        .eq('published', true)
        .neq('id', data.id)
        .order('published_at', { ascending: false })
        .limit(3)

      setOthers((more || []).map(mapActuRow))
      setLoading(false)
    }
    fetch()
  }, [slug])

  if (loading) {
    return (
      <PageLayout title="Actualité" description={config.seoDesc}>
        <div className="actu-empty" style={{ paddingTop: 120 }}>⏳ Chargement…</div>
      </PageLayout>
    )
  }

  if (missing) return <Navigate to="/actu" replace />

  const desc = post.excerpt || buildActuExcerpt(post.body, 160)
  const base = config.siteUrl.replace(/\/$/, '')
  const canonical = `${base}/actu/${post.slug}`
  const pageTitle = `${post.title} — Actualités`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    description: desc,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: { '@type': 'Person', name: config.brand },
    publisher: {
      '@type': 'Organization',
      name: config.brand,
      logo: { '@type': 'ImageObject', url: `${base}/logoat72.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
  }

  return (
    <PageLayout title={pageTitle} description={desc}>
      <Helmet>
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.publishedAt} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="container actu-article-wrap" style={{ paddingBottom: 80 }}>
        <nav className="actu-breadcrumb" aria-label="Fil d'Ariane">
          <Link to="/">Accueil</Link>
          <span aria-hidden>›</span>
          <Link to="/actu">Actu</Link>
          <span aria-hidden>›</span>
          <span>{post.title}</span>
        </nav>

        <article className="actu-article">
          <header className="actu-article-header">
            <div className="stag">Actualité</div>
            <h1>{post.title}</h1>
            <div className="actu-article-meta">
              <time dateTime={post.publishedAt}>{formatActuDate(post.publishedAt)}</time>
              <span aria-hidden>·</span>
              <span>{actuReadingMinutes(post.body)} min de lecture</span>
            </div>
          </header>

          <div className="actu-article-body">
            {post.body.split(/\n{2,}/).map((para, i) => (
              <p key={i}>{para.trim()}</p>
            ))}
          </div>

          <footer className="actu-article-cta">
            <p>Besoin d'aide informatique sur Le Mans ou la Sarthe ?</p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
              <a href={`tel:${config.telBrut}`} className="bm bp">📞 {config.telephone}</a>
              <Link to="/#contact" className="bm bo">Me contacter →</Link>
            </div>
          </footer>
        </article>

        {others.length > 0 && (
          <aside className="actu-related">
            <h3>Autres actualités</h3>
            <ul>
              {others.map(o => (
                <li key={o.id}>
                  <Link to={`/actu/${o.slug}`}>
                    <time dateTime={o.publishedAt}>
                      {new Date(o.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </time>
                    <span>{o.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link to="/actu" className="actu-back-link">← Toutes les actus</Link>
          </aside>
        )}
      </div>
    </PageLayout>
  )
}
