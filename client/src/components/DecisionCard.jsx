import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import { formatIsoDate, formatYyyyMmDd } from '../api/decisions'

export default function DecisionCard({ decision }) {
  return (
    <Link to={`/decisions/${decision.id}`} className="dj-card dj-card-link">
      <div className="dj-card-top">
        <h3 className="dj-card-title">{decision.title}</h3>
        <StatusBadge status={decision.status} />
      </div>

      <div className="dj-card-meta">
        <div className="dj-meta-row">
          <span className="dj-meta-label">Date</span>
          <span className="dj-meta-value">{formatIsoDate(decision.created_at)}</span>
        </div>

        {decision.revisit_date ? (
          <div className="dj-meta-row">
            <span className="dj-meta-label">Revisit</span>
            <span className="dj-meta-value">{formatYyyyMmDd(decision.revisit_date)}</span>
          </div>
        ) : null}
      </div>
    </Link>
  )
}

