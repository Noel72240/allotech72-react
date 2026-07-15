import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAdam } from '../../hooks/useAdam.jsx'
import AdamPanel from './AdamPanel.jsx'

export default function AdamWidget() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { messages, loading, error, available, initialized, send, reset } = useAdam()

  const hiddenPaths = ['/admin', '/panier/paiement']
  const hidden = hiddenPaths.some(p => location.pathname.startsWith(p))

  if (!available || !initialized || hidden) return null

  return (
    <>
      <button
        type="button"
        className={`adam-fab ${open ? 'adam-fab--open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Fermer Adam' : 'Ouvrir Adam, assistant Allotech72'}
        aria-expanded={open}
      >
        <span className="adam-fab__icon" aria-hidden="true">{open ? '✕' : '🤖'}</span>
        <span className="adam-fab__label">Adam</span>
      </button>

      <AdamPanel
        open={open}
        onClose={() => setOpen(false)}
        messages={messages}
        loading={loading}
        error={error}
        onSend={send}
        onReset={reset}
      />
    </>
  )
}
