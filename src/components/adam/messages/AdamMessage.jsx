import AdamAvatar from '../avatar/AdamAvatar.jsx'
import AdamSuggestedActions from './AdamSuggestedActions.jsx'
import { ADAM_AVATAR_STATES } from '../../../config/adamAvatar.js'

export default function AdamMessage({ message }) {
  const isUser = message.role === 'user'
  const expression = message.isWelcome ? ADAM_AVATAR_STATES.SMILE : ADAM_AVATAR_STATES.NEUTRAL

  return (
    <div className={`adam-message ${isUser ? 'adam-message--user' : 'adam-message--assistant'}`}>
      {!isUser && (
        <AdamAvatar
          expression={expression}
          size="lg"
          showHalo
          alive
          className="adam-message__avatar-wrap"
          alt=""
        />
      )}
      <div className="adam-message__bubble">
        <p className="adam-message__text">{message.content}</p>
        {!isUser && <AdamSuggestedActions actions={message.suggestedActions} />}
      </div>
    </div>
  )
}
