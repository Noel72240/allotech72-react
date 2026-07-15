import AdamMessage from './AdamMessage.jsx'

export default function AdamMessages({ messages, loading }) {
  return (
    <div className="adam-messages" role="log" aria-live="polite" aria-relevant="additions">
      {messages.map((msg, i) => (
        <AdamMessage key={msg.createdAt || i} message={msg} />
      ))}
      {loading && (
        <div className="adam-message adam-message--assistant adam-message--typing">
          <div className="adam-message__avatar" aria-hidden="true">A</div>
          <div className="adam-message__bubble">
            <span className="adam-typing">
              <span /><span /><span />
            </span>
            Adam analyse votre demande…
          </div>
        </div>
      )}
    </div>
  )
}
