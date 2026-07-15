import AdamMessage from './AdamMessage.jsx'
import AdamTypingIndicator from './AdamTypingIndicator.jsx'
import AdamQuickPrompts from '../prompts/AdamQuickPrompts.jsx'

export default function AdamMessages({ messages, loading, onQuickPrompt }) {
  const showQuickPrompts = messages.some(m => m.isWelcome) && messages.length <= 1 && !loading

  return (
    <div className="adam-messages" role="log" aria-live="polite" aria-relevant="additions">
      <AdamQuickPrompts
        visible={showQuickPrompts}
        onSelect={onQuickPrompt}
        disabled={loading}
      />
      {messages.map((msg, i) => (
        <AdamMessage key={msg.createdAt || i} message={msg} />
      ))}
      {loading && <AdamTypingIndicator />}
    </div>
  )
}
