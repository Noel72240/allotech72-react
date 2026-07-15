export default function AdamMessage({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`adam-message ${isUser ? 'adam-message--user' : 'adam-message--assistant'}`}>
      {!isUser && <div className="adam-message__avatar" aria-hidden="true">A</div>}
      <div className="adam-message__bubble">
        <p className="adam-message__text">{message.content}</p>
        {message.suggestedActions?.length > 0 && (
          <div className="adam-message__actions">
            {message.suggestedActions.map((action, i) => (
              <a
                key={i}
                href={action.value}
                className="adam-action-btn"
                {...(action.type === 'phone' ? {} : { target: '_self' })}
              >
                {action.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
