export default function AdamSuggestedActions({ actions }) {
  if (!actions?.length) return null

  const primary = actions.find(a => a.type === 'phone') ?? actions[0]
  const secondary = actions.filter(a => a !== primary)

  return (
    <div className="adam-message__actions">
      <a
        href={primary.value}
        className={`adam-action-btn adam-action-btn--primary adam-action-btn--${primary.type}`}
        {...(primary.type === 'phone' ? {} : { target: '_self' })}
      >
        {primary.label}
      </a>
      {secondary.map((action, i) => (
        <a
          key={i}
          href={action.value}
          className="adam-action-btn adam-action-btn--secondary"
          target={action.type === 'phone' ? undefined : '_self'}
        >
          {action.label}
        </a>
      ))}
    </div>
  )
}
