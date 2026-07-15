import { useState, useEffect, useCallback } from 'react'
import {
  fetchAdamStats,
  fetchAdamConversations,
  fetchAdamMessages,
  fetchAdamDiagnostic,
  fetchAdamMemories,
  archiveAdamConversation,
  formatAdamDate,
  truncateSessionToken,
} from '../../lib/adamAdmin.js'

const card = { background:'rgba(5,14,28,0.85)', border:'1px solid rgba(0,207,255,0.15)', borderRadius:20, padding:32, backdropFilter:'blur(20px)' }
const btnP = { background:'linear-gradient(135deg,#00CFFF,#00AEEF)', border:'none', color:'#040B14', padding:'8px 18px', borderRadius:8, fontFamily:"'Orbitron',sans-serif", fontWeight:700, fontSize:'.75rem', cursor:'pointer' }
const btnS = { background:'rgba(0,207,255,0.08)', border:'1px solid rgba(0,207,255,0.2)', color:'var(--c)', padding:'4px 12px', borderRadius:6, cursor:'pointer', fontSize:'.72rem' }

const Msg = ({ msg }) => msg ? (
  <div style={{ padding:'10px 14px', borderRadius:8, marginBottom:16, fontSize:'.82rem', fontWeight:600,
    background: msg.ok ? 'rgba(43,255,154,0.1)' : 'rgba(255,80,80,0.1)',
    border:`1px solid ${msg.ok ? 'rgba(43,255,154,0.3)':'rgba(255,80,80,0.3)'}`,
    color: msg.ok ? 'var(--g)' : '#ff6b6b',
  }}>{msg.txt}</div>
) : null

function escalationColor(level) {
  if (level === 'urgent') return '#ff6b6b'
  if (level === 'on_site') return '#FFB800'
  if (level === 'remote') return 'var(--c)'
  return 'var(--g)'
}

export default function AdminAdam() {
  const [stats, setStats] = useState({ totalConversations: 0, messagesToday: 0, activeConversations: 0 })
  const [conversations, setConversations] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [messages, setMessages] = useState([])
  const [diagnostic, setDiagnostic] = useState(null)
  const [memories, setMemories] = useState([])
  const [load, setLoad] = useState(true)
  const [detailLoad, setDetailLoad] = useState(false)
  const [msg, setMsg] = useState(null)

  const refresh = useCallback(async () => {
    setLoad(true)
    setMsg(null)
    try {
      const [s, c] = await Promise.all([fetchAdamStats(), fetchAdamConversations()])
      setStats(s)
      setConversations(c)
    } catch (e) {
      setMsg({ ok: false, txt: e.message || 'Erreur chargement Adam. Avez-vous exécuté adam-admin-rls.sql ?' })
    } finally {
      setLoad(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const openConversation = async (id) => {
    setSelectedId(id)
    setDetailLoad(true)
    try {
      const [msgs, diag, mems] = await Promise.all([
        fetchAdamMessages(id),
        fetchAdamDiagnostic(id),
        fetchAdamMemories(id),
      ])
      setMessages(msgs)
      setDiagnostic(diag)
      setMemories(mems)
    } catch (e) {
      setMsg({ ok: false, txt: e.message })
    } finally {
      setDetailLoad(false)
    }
  }

  const archive = async (id) => {
    if (!window.confirm('Archiver cette conversation ?')) return
    try {
      await archiveAdamConversation(id)
      setMsg({ ok: true, txt: 'Conversation archivée.' })
      if (selectedId === id) setSelectedId(null)
      refresh()
    } catch (e) {
      setMsg({ ok: false, txt: e.message })
    }
  }

  const selected = conversations.find(c => c.id === selectedId)

  return (
    <div>
      <Msg msg={msg} />

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:14, marginBottom:24 }}>
        {[
          { val: stats.totalConversations, lbl: 'Conversations' },
          { val: stats.activeConversations, lbl: 'Actives' },
          { val: stats.messagesToday, lbl: 'Messages aujourd\'hui' },
        ].map(s => (
          <div key={s.lbl} style={{ ...card, padding:'18px 20px' }}>
            <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:'1.6rem', fontWeight:900, color:'var(--c)' }}>{s.val}</div>
            <div style={{ color:'var(--dim)', fontSize:'.75rem', marginTop:4 }}>{s.lbl}</div>
          </div>
        ))}
      </div>

      <div className="admin-dash-two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:24, alignItems:'start' }}>
        {/* Liste conversations */}
        <div style={card}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <h3 style={{ color:'#fff', fontFamily:"'Orbitron',sans-serif", fontSize:'1rem', margin:0 }}>
              🤖 Conversations Adam
            </h3>
            <button type="button" style={btnS} onClick={refresh}>🔄</button>
          </div>

          {load ? (
            <p style={{ color:'var(--dim)', textAlign:'center', padding:30 }}>⏳ Chargement…</p>
          ) : conversations.length === 0 ? (
            <p style={{ color:'var(--dim)', textAlign:'center', padding:30 }}>
              Aucune conversation. Les échanges apparaîtront ici une fois Adam déployé.
            </p>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:8, maxHeight:520, overflowY:'auto' }}>
              {conversations.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => openConversation(c.id)}
                  style={{
                    textAlign:'left',
                    padding:'12px 14px',
                    borderRadius:12,
                    border: selectedId === c.id ? '1px solid rgba(0,207,255,0.45)' : '1px solid rgba(0,207,255,0.1)',
                    background: selectedId === c.id ? 'rgba(0,207,255,0.1)' : 'rgba(5,14,28,0.5)',
                    cursor:'pointer',
                    color:'inherit',
                  }}
                >
                  <div style={{ display:'flex', justifyContent:'space-between', gap:8, marginBottom:4 }}>
                    <span style={{ color:'#fff', fontSize:'.82rem', fontWeight:600 }}>
                      Session {truncateSessionToken(c.session_token)}
                    </span>
                    <span style={{
                      fontSize:'.65rem', fontWeight:700, padding:'2px 8px', borderRadius:4,
                      background: c.status === 'active' ? 'rgba(43,255,154,0.12)' : 'rgba(255,255,255,0.06)',
                      color: c.status === 'active' ? 'var(--g)' : 'var(--dim)',
                    }}>
                      {c.status}
                    </span>
                  </div>
                  <div style={{ color:'var(--dim)', fontSize:'.72rem' }}>
                    {formatAdamDate(c.last_active_at)}
                    {c.metadata?.pageContext?.path && ` · ${c.metadata.pageContext.path}`}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Détail conversation */}
        <div style={card}>
          {!selectedId ? (
            <p style={{ color:'var(--dim)', textAlign:'center', padding:60 }}>
              Sélectionnez une conversation pour voir les messages.
            </p>
          ) : detailLoad ? (
            <p style={{ color:'var(--dim)', textAlign:'center', padding:60 }}>⏳ Chargement…</p>
          ) : (
            <>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20, gap:12, flexWrap:'wrap' }}>
                <div>
                  <h3 style={{ color:'#fff', fontFamily:"'Orbitron',sans-serif", fontSize:'.95rem', margin:0 }}>
                    Conversation
                  </h3>
                  <p style={{ color:'var(--dim)', fontSize:'.75rem', marginTop:4 }}>
                    {formatAdamDate(selected?.last_active_at)} · {messages.length} messages
                  </p>
                </div>
                {selected?.status === 'active' && (
                  <button type="button" style={btnP} onClick={() => archive(selectedId)}>Archiver</button>
                )}
              </div>

              {diagnostic && (
                <div style={{ background:'rgba(0,207,255,0.06)', border:'1px solid rgba(0,207,255,0.15)', borderRadius:10, padding:'12px 14px', marginBottom:16, fontSize:'.78rem' }}>
                  <strong style={{ color:'var(--c)' }}>Diagnostic</strong>
                  <div style={{ color:'var(--dim)', marginTop:6, lineHeight:1.6 }}>
                    Confiance : {Math.round((diagnostic.confidence || 0) * 100)}% ·
                    Escalade : <span style={{ color: escalationColor(diagnostic.escalation_level) }}>{diagnostic.escalation_level}</span>
                    {Array.isArray(diagnostic.probable_causes) && diagnostic.probable_causes[0] && (
                      <> · Cause : {diagnostic.probable_causes[0].label}</>
                    )}
                  </div>
                </div>
              )}

              {memories.length > 0 && (
                <div style={{ marginBottom:16 }}>
                  <div style={{ color:'var(--dim)', fontSize:'.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:8 }}>Mémoires</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                    {memories.map((m, i) => (
                      <span key={i} style={{ background:'rgba(43,255,154,0.08)', border:'1px solid rgba(43,255,154,0.2)', color:'var(--g)', fontSize:'.68rem', padding:'4px 10px', borderRadius:6 }}>
                        {m.key}: {m.value}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display:'flex', flexDirection:'column', gap:10, maxHeight:400, overflowY:'auto' }}>
                {messages.map(m => (
                  <div
                    key={m.id}
                    style={{
                      alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth:'88%',
                      padding:'10px 14px',
                      borderRadius:12,
                      background: m.role === 'user' ? 'rgba(43,255,154,0.1)' : 'rgba(0,207,255,0.08)',
                      border: `1px solid ${m.role === 'user' ? 'rgba(43,255,154,0.2)' : 'rgba(0,207,255,0.15)'}`,
                    }}
                  >
                    <div style={{ fontSize:'.65rem', color:'var(--dim)', marginBottom:4, fontWeight:700 }}>
                      {m.role === 'user' ? 'Client' : 'Adam'} · {formatAdamDate(m.created_at)}
                    </div>
                    <p style={{ margin:0, fontSize:'.82rem', lineHeight:1.55, color:'var(--tx)', whiteSpace:'pre-wrap' }}>{m.content}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
