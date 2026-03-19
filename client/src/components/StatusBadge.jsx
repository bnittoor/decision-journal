export default function StatusBadge({ status }) {
  const normalized = status === 'resolved' ? 'resolved' : 'open'
  const label = normalized === 'resolved' ? 'Resolved' : 'Open'

  return (
    <span className={`dj-badge dj-badge-${normalized}`}>{label}</span>
  )
}

