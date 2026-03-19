import { useEffect, useState } from 'react'
import { fetchDecisions } from '../api/decisions'
import DecisionCard from '../components/DecisionCard'

export default function Dashboard() {
  const [decisions, setDecisions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        const rows = await fetchDecisions()
        if (!cancelled) setDecisions(rows)
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Failed to load decisions')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="dj-container">
      <div className="dj-header">
        <h1 className="dj-h1">Dashboard</h1>
        <p className="dj-subtitle">
          Your decision history, ready for review.
        </p>
      </div>

      {error ? (
        <div className="dj-alert dj-alert-error" role="alert">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="dj-alert dj-alert-info" aria-live="polite">
          Loading decisions...
        </div>
      ) : null}

      {!loading && !error ? (
        <div className="dj-grid" aria-label="Decisions">
          {decisions.length === 0 ? (
            <div className="dj-empty">
              <div className="dj-empty-title">No decisions yet</div>
              <div className="dj-empty-body">
                Add your first decision to start tracking outcomes.
              </div>
            </div>
          ) : (
            decisions.map((d) => <DecisionCard key={d.id} decision={d} />)
          )}
        </div>
      ) : null}
    </div>
  )
}

