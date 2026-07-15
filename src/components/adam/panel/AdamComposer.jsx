import { useState } from 'react'
import { adamConfig } from '../../../config/adam.js'
import { IconSend } from '../icons/AdamIcons.jsx'

export default function AdamComposer({ onSend, loading, disabled }) {
  const [text, setText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim() || loading || disabled) return
    onSend(text)
    setText('')
  }

  return (
    <div className="adam-composer">
      <form className="adam-input" onSubmit={handleSubmit}>
        <div className="adam-input__shell">
          <textarea
            className="adam-input__field"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={adamConfig.placeholder}
            maxLength={adamConfig.maxMessageLength}
            rows={1}
            disabled={loading || disabled}
            aria-label="Votre message à Adam"
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
          />
          <button
            type="submit"
            className="adam-input__send"
            disabled={!text.trim() || loading || disabled}
            aria-label="Envoyer"
          >
            {loading ? (
              <span className="adam-input__send-loading" aria-hidden="true">…</span>
            ) : (
              <IconSend size={17} />
            )}
          </button>
        </div>
      </form>
      <p className="adam-panel__disclaimer">{adamConfig.disclaimer}</p>
    </div>
  )
}
