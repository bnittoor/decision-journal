import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  fetchDecision,
  formatIsoDate,
  formatYyyyMmDd,
  recordDecisionOutcome,
  validateNonEmpty,
} from '../api/decisions'
import StatusBadge from '../components/StatusBadge'

export default function DecisionDetail() {
  const { id } = useParams()

  const [decision, setDecision] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [outcome, setOutcome] = useState('')
  const [recordError, setRecordError] = useState(null)
  const [recording, setRecording] = useState(false)

  const outcomeError = useMemo(() => validateNonEmpty('Outcome', outcome), [outcome])
  const showRecordSection = decision?.status === 'open'

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        setError(null)
        const row = await fetchDecision(id)
        if (!cancelled) {
          setDecision(row)
          setOutcome('')
          setRecordError(null)
        }
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Failed to load decision')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [id])

  async function onRecordOutcome(e) {
    e.preventDefault()
    setRecordError(null)

    if (!decision) return
    if (outcomeError) {
      setRecordError(outcomeError)
      return
    }

    try {
      setRecording(true)
      const updated = await recordDecisionOutcome(decision.id, {
        outcome: outcome.trim(),
        status: 'resolved',
      })

      setDecision(updated)
      setOutcome('')
    } catch (err) {
      setRecordError(err?.message || 'Failed to record outcome')
    } finally {
      setRecording(false)
    }
  }

  return (
    <div className="dj-container">
      <div className="dj-detail-top">
        <div className="dj-detail-actions">
          <Link to="/" className="dj-link">
            ← Back to Dashboard
          </Link>
        </div>

        {loading ? null : decision ? (
          <div className="dj-detail-header">
            <div className="dj-detail-title-row">
              <h1 className="dj-h1 dj-h1-detail">{decision.title}</h1>
              <StatusBadge status={decision.status} />
            </div>
            <div className="dj-detail-meta">
              <span className="dj-meta-pill">
                Created: {formatIsoDate(decision.created_at)}
              </span>
              {decision.revisit_date ? (
                <span className="dj-meta-pill">
                  Revisit: {formatYyyyMmDd(decision.revisit_date)}
                </span>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      {error ? (
        <div className="dj-alert dj-alert-error" role="alert">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="dj-alert dj-alert-info" aria-live="polite">
          Loading decision...
        </div>
      ) : null}

      {!loading && decision ? (
        <div className="dj-detail-grid">
          <section className="dj-card">
            <h2 className="dj-h2">Decision</h2>

            <div className="dj-kv">
              <div className="dj-kv-row">
                <div className="dj-kv-label">Context</div>
                <div className="dj-kv-value dj-pre">{decision.context}</div>
              </div>

              <div className="dj-kv-row">
                <div className="dj-kv-label">Options considered</div>
                <div className="dj-kv-value dj-pre">{decision.options_considered}</div>
              </div>

              <div className="dj-kv-row">
                <div className="dj-kv-label">What I chose</div>
                <div className="dj-kv-value dj-pre">{decision.chosen_option}</div>
              </div>

              <div className="dj-kv-row">
                <div className="dj-kv-label">My reasoning</div>
                <div className="dj-kv-value dj-pre">{decision.reasoning}</div>
              </div>

              {decision.status === 'resolved' && decision.outcome ? (
                <div className="dj-kv-row">
                  <div className="dj-kv-label">Outcome</div>
                  <div className="dj-kv-value dj-pre">{decision.outcome}</div>
                </div>
              ) : null}
            </div>
          </section>

          {showRecordSection ? (
            <section className="dj-card dj-card-record">
              <h2 className="dj-h2">Record Outcome</h2>

              <p className="dj-help">
                When you revisit this decision, record what happened and mark it as resolved.
              </p>

              {recordError ? (
                <div className="dj-alert dj-alert-error" role="alert">
                  {recordError}
                </div>
              ) : null}

              <form onSubmit={onRecordOutcome}>
                <div className="dj-form-row">
                  <label className="dj-label" htmlFor="outcome">
                    Outcome
                  </label>
                  <textarea
                    id="outcome"
                    className="dj-textarea"
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value)}
                    rows={5}
                    placeholder="What happened after you made this decision?"
                    required
                  />
                  {outcomeError ? <div className="dj-field-error">{outcomeError}</div> : null}
                </div>

                <div className="dj-form-actions">
                  <button className="dj-btn dj-btn-primary" type="submit" disabled={recording}>
                    {recording ? 'Saving...' : 'Record & Mark Resolved'}
                  </button>
                </div>
              </form>
            </section>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

