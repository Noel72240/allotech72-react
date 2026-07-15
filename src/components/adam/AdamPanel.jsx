import { useEffect, useRef } from 'react'
import { adamConfig } from '../../config/adam.js'
import AdamMessages from './AdamMessages.jsx'
import AdamInput from './AdamInput.jsx'

export default function AdamPanel({ open, onClose, messages, loading, error, onSend, onReset }) {
  const panelRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const fn = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [open, onClose])

  useEffect(() => {
    if (open && panelRef.current) {
      const scroll = panelRef.current.querySelector('.adam-messages')
      if (scroll) scroll.scrollTop = scroll.scrollHeight
    }
  }, [open, messages, loading])

  if (!open) return null

  return (
    <div className="adam-panel" role="dialog" aria-label="Chat avec Adam" aria-modal="true">
      <div className="adam-panel__backdrop" onClick={onClose} aria-hidden="true" />
      <div className="adam-panel__container" ref={panelRef}>
        <header className="adam-panel__header">
          <div className="adam-panel__title">
            <span className="adam-panel__icon" aria-hidden="true">🤖</span>
            <div>
              <strong>{adamConfig.name}</strong>
              <span className="adam-panel__subtitle">{adamConfig.tagline}</span>
            </div>
          </div>
          <div className="adam-panel__header-actions">
            <button type="button" className="adam-panel__icon-btn" onClick={onReset} title="Nouvelle conversation" aria-label="Nouvelle conversation">
              ↺
            </button>
            <button type="button" className="adam-panel__icon-btn" onClick={onClose} aria-label="Fermer">
              ✕
            </button>
          </div>
        </header>

        <AdamMessages messages={messages} loading={loading} />

        {error && <p className="adam-panel__error" role="alert">{error}</p>}

        <footer className="adam-panel__footer">
          <AdamInput onSend={onSend} loading={loading} disabled={false} />
          <p className="adam-panel__disclaimer">{adamConfig.disclaimer}</p>
        </footer>
      </div>
    </div>
  )
}
