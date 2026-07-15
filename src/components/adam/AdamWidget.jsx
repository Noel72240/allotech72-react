import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAdam } from '../../hooks/useAdam.jsx'
import AdamPanel from './AdamPanel.jsx'
import AdamFab from './chrome/AdamFab.jsx'
import { adamConfig } from '../../config/adam.js'
import './adam.css'

export default function AdamWidget() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { messages, loading, error, available, initialized, send, reset } = useAdam()

  const hiddenPaths = ['/admin', '/panier/paiement']
  const hidden = hiddenPaths.some(p => location.pathname.startsWith(p))

  if (!available || !initialized || hidden) return null

  return (
    <>
      <AdamFab open={open} onToggle={() => setOpen(o => !o)} name={adamConfig.name} />

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
