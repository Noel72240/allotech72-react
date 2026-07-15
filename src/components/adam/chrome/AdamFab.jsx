import AdamAvatar from '../avatar/AdamAvatar.jsx'
import AdamStatusBadge from './AdamStatusBadge.jsx'
import { IconClose } from '../icons/AdamIcons.jsx'
import { ADAM_AVATAR_STATES } from '../../../config/adamAvatar.js'

export default function AdamFab({ open, onToggle, name }) {
  return (
    <button
      type="button"
      className={`adam-fab ${open ? 'adam-fab--open' : ''}`}
      onClick={onToggle}
      aria-label={open ? 'Fermer Adam' : 'Ouvrir Adam, assistant Allotech72'}
      aria-expanded={open}
    >
      {open ? (
        <span className="adam-fab__close-wrap">
          <span className="adam-fab__close-icon" aria-hidden="true">
            <IconClose size={20} />
          </span>
          <span className="adam-fab__name adam-fab__name--muted">Fermer</span>
        </span>
      ) : (
        <>
          <AdamAvatar
            expression={ADAM_AVATAR_STATES.WAVE}
            size="xl"
            showHalo
            alive
            className="adam-fab__avatar"
            alt=""
          />
          <span className="adam-fab__brand">
            <span className="adam-fab__name">{name}</span>
            <AdamStatusBadge />
          </span>
        </>
      )}
    </button>
  )
}
