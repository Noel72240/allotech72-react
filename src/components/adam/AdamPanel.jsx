import { useEffect, useRef } from 'react'
import { adamConfig } from '../../config/adam.js'
import AdamMessages from './messages/AdamMessages.jsx'
import AdamHeader from './panel/AdamHeader.jsx'
import AdamComposer from './panel/AdamComposer.jsx'

const PARTICLES = Array.from({ length: 18 }, (_, i) => i)

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
          <span className="adam-panel__mesh" />
          <span className="adam-panel__beam" />
          <span className="adam-panel__ring" />
          <span className="adam-panel__particles">
            {PARTICLES.map((i) => (
              <span
                key={i}
                className="adam-panel__dot"
                style={{
                  '--x': `${8 + ((i * 17) % 84)}%`,
                  '--delay': `${(i % 9) * 0.7}s`,
                  '--dur': `${7 + (i % 6)}s`,
                  '--size': `${2 + (i % 3)}px`,
                  '--hue': i % 2 === 0 ? '0, 207, 255' : '0, 255, 148',
                }}
              />
            ))}
          </span>
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
