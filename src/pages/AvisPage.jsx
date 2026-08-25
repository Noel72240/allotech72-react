import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout.jsx'
import { AvisSources } from '../components/Avis.jsx'
import { supabase } from '../lib/supabase.js'
import config from '../config.js'

export default function AvisPage() {
  const [supabaseAvis, setSupabaseAvis] = useState([])
  const allAvis = [...supabaseAvis, ...config.avis]

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('avis').select('*').order('created_at', { ascending: false })
      if (data) setSupabaseAvis(data)
    }
    fetch()
  }, [])

  return (
    <PageLayout
      title="Avis clients | Allotech72"
      description={`${allAvis.length}+ avis clients 5 étoiles pour ${config.brand} (Google, AlloVoisin, Facebook, Pages Jaunes) — dépannage informatique sur Le Mans et la Sarthe.`}
    >
      <div className="container" style={{ paddingBottom: 80 }}>

        <div style={{ textAlign: 'center', marginBottom: 52, paddingTop: 20 }}>
          <div className="stag">Avis regroupés</div>
          <h2>Avis <span className="c">Clients</span></h2>
          <div className="div-line" />
          <p className="sub avis-sources-lead">
            Google · AlloVoisin · Facebook · Pages Jaunes
          </p>
          <AvisSources />
        </div>

        <div className="rb" style={{ marginBottom: 56 }}>
          <div className="rsbig">⭐⭐⭐⭐⭐</div>
          <div className="rscore">5/5</div>
          <div className="ri">
            <p style={{ color:'#fff', fontWeight:700, fontFamily:"'Orbitron',sans-serif", fontSize:'1rem' }}>Note parfaite</p>
            <p style={{ color:'var(--dim)', fontSize:'.88rem', marginTop:4 }}>{allAvis.length}+ avis · 100% de satisfaction</p>
            <p className="avis-rb-sources">Sur Google, AlloVoisin, Facebook &amp; Pages Jaunes</p>
          </div>
        </div>

        <div style={{ columns:'auto 300px', columnGap:20 }}>
          {allAvis.map((a, i) => (
            <div key={i} className="avis-card" style={{ width:'100%', marginBottom:20, breakInside:'avoid', display:'inline-block' }}>
              <div className="avis-head">
                <div className="avis-av">{a.initiales}</div>
                <div>
                  <h4>{a.nom}</h4>
                  <div className="avis-stars">★★★★★</div>
                  <div className="avis-type">{a.type}</div>
                </div>
              </div>
              <p className="avis-txt">"{a.texte}"</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign:'center', marginTop:64 }}>
          <p style={{ color:'var(--dim)', marginBottom:8, fontSize:'.95rem' }}>Vous aussi, faites confiance à {config.brand}</p>
          <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap', marginTop:20 }}>
            <Link to="/avis/laisser" className="bm bp">Laisser un avis →</Link>
            <a href={`tel:${config.telBrut}`} className="bm bo">📞 {config.telephone}</a>
          </div>
        </div>

      </div>
    </PageLayout>
  )
}
