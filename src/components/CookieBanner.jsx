import { useState } from 'react'
import { useCookies } from '../hooks/useCookies.jsx'

export default function CookieBanner() {
  const { pending, accept, reject } = useCookies()
  const [detail, setDetail] = useState(false)

  if (!pending) return null

  const btnBase = {
    padding: '11px 24px', borderRadius: 8,
    cursor: 'pointer', fontWeight: 700, fontSize: '.82rem',
    fontFamily: "'Outfit',sans-serif",
    transition: 'all .2s',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation',
  }

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      zIndex: 99000,
      background: 'rgba(5,14,28,0.97)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(0,207,255,0.2)',
      padding: '18px 20px',
      boxShadow: '0 -8px 40px rgba(0,0,0,0.5)',
    }}>
      <div style={{ maxWidth: 1140, margin: '0 auto' }}>

        {!detail ? (
          /* ── VUE SIMPLE ── */
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:14 }}>
            <div style={{ flex:1, minWidth:260 }}>
              <p style={{ color:'#fff', fontWeight:700, marginBottom:6, fontFamily:"'Orbitron',sans-serif", fontSize:'.82rem' }}>
                🍪 Ce site utilise des cookies
              </p>
              <p style={{ color:'var(--dim)', fontSize:'.8rem', lineHeight:1.6 }}>
                Uniquement des cookies nécessaires au fonctionnement.{' '}
                <button
                  onClick={() => setDetail(true)}
                  style={{ background:'none', border:'none', color:'var(--c)', cursor:'pointer', fontSize:'.8rem', textDecoration:'underline', padding:0 }}
                >
                  En savoir plus
                </button>
              </p>
            </div>

            <div style={{ display:'flex', gap:10, flexShrink:0 }}>
              {/* Bouton REFUSER */}
              <button
                onClick={reject}
                style={{
                  ...btnBase,
                  background: 'transparent',
                  border: '1px solid rgba(0,207,255,0.35)',
                  color: 'var(--tx)',
                }}
              >
                Refuser
              </button>

              {/* Bouton ACCEPTER */}
              <button
                onClick={accept}
                style={{
                  ...btnBase,
                  background: 'linear-gradient(135deg,#00CFFF,#00AEEF)',
                  border: 'none',
                  color: '#040B14',
                  fontFamily: "'Orbitron',sans-serif",
                  fontSize: '.78rem',
                  boxShadow: '0 4px 16px rgba(0,207,255,0.35)',
                }}
              >
                Accepter
              </button>
            </div>
          </div>

        ) : (
          /* ── VUE DÉTAILLÉE ── */
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <p style={{ color:'#fff', fontWeight:700, fontFamily:"'Orbitron',sans-serif", fontSize:'.85rem' }}>
                🍪 Gestion des cookies
              </p>
              <button
                onClick={() => setDetail(false)}
                style={{ background:'none', border:'none', color:'var(--dim)', cursor:'pointer', fontSize:'1.3rem', padding:'4px 8px' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:10, marginBottom:18 }}>
              {[
                { titre:'Nécessaires', badge:'Toujours actif', badgeColor:'var(--g)', txt:'Cookies indispensables au fonctionnement (session, préférences). Ne peuvent pas être désactivés.' },
                { titre:'Analytiques',  badge:'Non actifs',     badgeColor:'var(--dim)', txt:"Aucun outil d'analyse d'audience actif sur ce site." },
                { titre:'Marketing',   badge:'Non actifs',     badgeColor:'var(--dim)', txt:'Aucun cookie publicitaire ou de retargeting utilisé.' },
              ].map(c => (
                <div key={c.titre} style={{ background:'rgba(0,207,255,0.04)', border:'1px solid rgba(0,207,255,0.14)', borderRadius:10, padding:'12px 14px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                    <span style={{ color:'#fff', fontWeight:700, fontSize:'.8rem' }}>{c.titre}</span>
                    <span style={{ color:c.badgeColor, fontSize:'.7rem', fontWeight:600 }}>{c.badge}</span>
                  </div>
                  <p style={{ color:'var(--dim)', fontSize:'.76rem', lineHeight:1.5 }}>{c.txt}</p>
                </div>
              ))}
            </div>

            <p style={{ color:'var(--dim)', fontSize:'.72rem', marginBottom:14 }}>
              Conformément au RGPD et aux recommandations de la CNIL, vous pouvez modifier vos préférences à tout moment depuis le footer.
            </p>

            <div style={{ display:'flex', gap:10, justifyContent:'flex-end', flexWrap:'wrap' }}>
              <button onClick={reject} style={{ ...btnBase, background:'transparent', border:'1px solid rgba(0,207,255,0.3)', color:'var(--tx)' }}>
                Refuser tout
              </button>
              <button onClick={accept} style={{ ...btnBase, background:'linear-gradient(135deg,#00CFFF,#00AEEF)', border:'none', color:'#040B14', fontFamily:"'Orbitron',sans-serif", fontSize:'.78rem', boxShadow:'0 4px 16px rgba(0,207,255,0.3)' }}>
                Accepter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
