import { useEffect, useRef } from 'react'
import { adamConfig } from '../../config/adam.js'
import AdamMessages from './messages/AdamMessages.jsx'
import AdamHeader from './panel/AdamHeader.jsx'
import AdamComposer from './panel/AdamComposer.jsx'

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
    <div className="adam-panel" role="dialog" aria-label="Chat avec Adam" aria-modal="true" aria-busy={loading}>
      <div className="adam-panel__backdrop" onClick={onClose} aria-hidden="true" />
      <div className="adam-panel__container" ref={panelRef}>
        <div className="adam-panel__aura" aria-hidden="true">
          <span className="adam-panel__orb adam-panel__orb--1" />
          <span className="adam-panel__orb adam-panel__orb--2" />
          <span className="adam-panel__orb adam-panel__orb--3" />
          <span className="adam-panel__grid" />
        </div>

        <AdamHeader
          name={adamConfig.name}
          tagline={adamConfig.tagline}
          onReset={onReset}
          onClose={onClose}
        />

        <AdamMessages messages={messages} loading={loading} onQuickPrompt={onSend} />

        {error && (
          <p className="adam-panel__error" role="alert">
            {error}
          </p>
        )}

        <footer className="adam-panel__footer">
          <AdamComposer onSend={onSend} loading={loading} disabled={false} />
        </footer>
      </div>
    </div>
  )
}
