import AdamAvatar from '../avatar/AdamAvatar.jsx'
import AdamStatusBadge from '../chrome/AdamStatusBadge.jsx'
import { IconClose, IconReset } from '../icons/AdamIcons.jsx'
import { ADAM_AVATAR_STATES } from '../../../config/adamAvatar.js'

export default function AdamHeader({ name, tagline, onReset, onClose }) {
  return (
    <header className="adam-panel__header">
      <div className="adam-panel__title">
        <AdamAvatar
          expression={ADAM_AVATAR_STATES.SMILE}
          size="xl"
          showHalo
          alive
          className="adam-panel__header-avatar"
          alt=""
        />
        <div className="adam-panel__title-text">
          <div className="adam-panel__title-row">
            <strong>{name}</strong>
            <AdamStatusBadge />
          </div>
          <span className="adam-panel__subtitle">{tagline}</span>
        </div>
      </div>
      <div className="adam-panel__header-actions">
        <button
          type="button"
          className="adam-panel__icon-btn"
          onClick={onReset}
          title="Nouvelle conversation"
          aria-label="Nouvelle conversation"
        >
          <IconReset />
        </button>
        <button
          type="button"
          className="adam-panel__icon-btn"
          onClick={onClose}
          aria-label="Fermer"
        >
          <IconClose />
        </button>
      </div>
    </header>
  )
}
