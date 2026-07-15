export default function AdamStatusBadge({ online = true, compact = false }) {
  if (!online) return null

  return (
    <span className={`adam-status ${compact ? 'adam-status--compact' : ''}`}>
      <span className="adam-status__dot" aria-hidden="true" />
      {!compact && <span className="adam-status__label">En ligne</span>}
    </span>
  )
}
