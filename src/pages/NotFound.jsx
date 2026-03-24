import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout.jsx'

export default function NotFound() {
  return (
    <PageLayout title="Page introuvable">
      <div style={{
        minHeight: '70vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', flexDirection: 'column', gap: 24,
        textAlign: 'center', padding: '40px 20px',
      }}>
        <div style={{
          fontFamily: "'Orbitron',sans-serif", fontSize: 'clamp(5rem,15vw,10rem)',
          fontWeight: 900, color: 'var(--c)', opacity: .15, lineHeight: 1,
          textShadow: '0 0 60px rgba(0,207,255,0.3)',
        }}>404</div>
        <div style={{ marginTop: -60 }}>
          <h1 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 'clamp(1.4rem,3vw,2rem)', color: '#fff', marginBottom: 16 }}>
            Page introuvable
          </h1>
          <p style={{ color: 'var(--dim)', fontSize: '1rem', maxWidth: 400, marginBottom: 32 }}>
            La page que vous cherchez n'existe pas ou a été déplacée.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" className="bm bp">← Retour à l'accueil</Link>
            <Link to="/galerie" className="bm bo">Voir la galerie</Link>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
