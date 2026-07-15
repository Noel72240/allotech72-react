import { adamConfig } from '../../../config/adam.js'

export default function AdamQuickPrompts({ visible, onSelect, disabled }) {
  if (!visible || !adamConfig.quickPrompts?.length) return null

  return (
    <div className="adam-quick-prompts" role="group" aria-label="Suggestions rapides">
      {adamConfig.quickPrompts.map((prompt) => (
        <button
          key={prompt.id}
          type="button"
          className="adam-quick-prompts__chip"
          disabled={disabled}
          onClick={() => onSelect(prompt.text)}
        >
          {prompt.label}
        </button>
      ))}
    </div>
  )
}
