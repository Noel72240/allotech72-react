import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout.jsx'
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
      description={`${allAvis.length}+ avis clients 5 étoiles pour ${config.brand} — dépannage informatique sur Le Mans et la Sarthe.`}
    >
      <div className="container" style={{ paddingBottom: 80 }}>

        <div style={{ textAlign: 'center', marginBottom: 52, paddingTop: 20 }}>
          <div className="stag">Google Reviews</div>
          <h2>Avis <span className="c">Clients</span></h2>
          <div className="div-line" />
        </div>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:24, marginBottom:56, padding:'28px 40px', background:'rgba(43,255,154,0.04)', border:'1px solid rgba(43,255,154,0.15)', borderRadius:20, flexWrap:'wrap' }}>
          <div style={{ fontSize:'1.6rem', letterSpacing:4 }}>⭐⭐⭐⭐⭐</div>
          <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:'3rem', fontWeight:900, color:'#2BFF9A', textShadow:'0 0 30px rgba(43,255,154,0.4)' }}>5/5</div>
          <div>
            <p style={{ color:'#fff', fontWeight:700, fontFamily:"'Orbitron',sans-serif", fontSize:'1rem' }}>Note parfaite</p>
            <p style={{ color:'var(--dim)', fontSize:'.88rem', marginTop:4 }}>{allAvis.length}+ avis · 100% de satisfaction</p>
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
            <a href={`tel:${config.telBrut}`} className="bm bp">📞 {config.telephone}</a>
            <Link to="/#contact" className="bm bo">Demander un devis →</Link>
          </div>
        </div>

      </div>
    </PageLayout>
  )
}
