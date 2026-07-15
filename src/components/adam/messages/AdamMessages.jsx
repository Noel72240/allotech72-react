import AdamMessage from './AdamMessage.jsx'
import AdamTypingIndicator from './AdamTypingIndicator.jsx'
import AdamQuickPrompts from '../prompts/AdamQuickPrompts.jsx'

export default function AdamMessages({ messages, loading, onQuickPrompt }) {
  const showQuickPrompts = messages.some(m => m.isWelcome) && messages.length <= 1 && !loading

  let lastAssistantIndex = -1
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    if (messages[i].role === 'assistant') {
      lastAssistantIndex = i
      break
    }
  }

  return (
    <div className="adam-messages" role="log" aria-live="polite" aria-relevant="additions">
      <AdamQuickPrompts
        visible={showQuickPrompts}
        onSelect={onQuickPrompt}
        disabled={loading}
      />
      {messages.map((msg, i) => (
        <AdamMessage
          key={msg.createdAt || i}
          message={msg}
          animateAvatar={!loading && i === lastAssistantIndex}
        />
      ))}
      {loading && <AdamTypingIndicator />}
    </div>
  )
}
