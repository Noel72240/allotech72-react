import AdamAvatar from '../avatar/AdamAvatar.jsx'
import { ADAM_AVATAR_STATES } from '../../../config/adamAvatar.js'
import { adamConfig } from '../../../config/adam.js'

export default function AdamTypingIndicator() {
  return (
    <div className="adam-message adam-message--assistant adam-message--typing" aria-busy="true">
      <AdamAvatar
        expression={ADAM_AVATAR_STATES.THINKING}
        size="lg"
        showHalo
        alive
        motion="thinking"
        glowingEyes
        className="adam-message__avatar-wrap adam-message__avatar-wrap--thinking"
        alt=""
      />
      <div className="adam-message__bubble adam-message__bubble--typing">
        <div className="adam-typing-row">
          <span className="adam-typing" aria-hidden="true">
            <span /><span /><span />
          </span>
          <span className="adam-typing__label">{adamConfig.thinkingLabel}</span>
        </div>
      </div>
    </div>
  )
}
