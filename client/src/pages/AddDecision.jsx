import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createDecision, validateNonEmpty } from '../api/decisions'

export default function AddDecision() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '',
    context: '',
    options_considered: '',
    chosen_option: '',
    reasoning: '',
    revisit_date: '',
  })

  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const errors = useMemo(() => {
    return {
      title: validateNonEmpty('Title', form.title),
      context: validateNonEmpty('Context', form.context),
      options_considered: validateNonEmpty('Options considered', form.options_considered),
      chosen_option: validateNonEmpty('What I chose', form.chosen_option),
      reasoning: validateNonEmpty('Reasoning', form.reasoning),
    }
  }, [form])

  const hasErrors = Object.values(errors).some(Boolean)

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)

    if (hasErrors) {
      setError('Please fill in all required fields.')
      return
    }

    try {
      setSubmitting(true)
      const created = await createDecision({
        title: form.title,
        context: form.context,
        options_considered: form.options_considered,
        chosen_option: form.chosen_option,
        reasoning: form.reasoning,
        revisit_date: form.revisit_date || null,
      })

      navigate(`/decisions/${created.id}`)
    } catch (err) {
      setError(err?.message || 'Failed to create decision')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="dj-container">
      <div className="dj-header">
        <h1 className="dj-h1">Add Decision</h1>
        <p className="dj-subtitle">
          Capture the decision, the alternatives you considered, and your reasoning.
        </p>
      </div>

      {error ? (
        <div className="dj-alert dj-alert-error" role="alert">
          {error}
        </div>
      ) : null}

      <form className="dj-form" onSubmit={onSubmit} aria-busy={submitting}>
        <div className="dj-form-row">
          <label className="dj-label" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            className="dj-input"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
            placeholder="e.g., Choose a job offer"
          />
          {errors.title ? <div className="dj-field-error">{errors.title}</div> : null}
        </div>

        <div className="dj-form-row">
          <label className="dj-label" htmlFor="context">
            Context
          </label>
          <textarea
            id="context"
            className="dj-textarea"
            value={form.context}
            onChange={(e) => setForm((f) => ({ ...f, context: e.target.value }))}
            required
            rows={4}
            placeholder="What was happening? What constraints did you have?"
          />
          {errors.context ? <div className="dj-field-error">{errors.context}</div> : null}
        </div>

        <div className="dj-form-row">
          <label className="dj-label" htmlFor="options_considered">
            Options considered
          </label>
          <textarea
            id="options_considered"
            className="dj-textarea"
            value={form.options_considered}
            onChange={(e) =>
              setForm((f) => ({ ...f, options_considered: e.target.value }))
            }
            required
            rows={4}
            placeholder="List alternatives (one per line, or a short paragraph)."
          />
          {errors.options_considered ? (
            <div className="dj-field-error">{errors.options_considered}</div>
          ) : null}
        </div>

        <div className="dj-form-row">
          <label className="dj-label" htmlFor="chosen_option">
            What I chose
          </label>
          <input
            id="chosen_option"
            className="dj-input"
            value={form.chosen_option}
            onChange={(e) => setForm((f) => ({ ...f, chosen_option: e.target.value }))}
            required
            placeholder="The final option you selected"
          />
          {errors.chosen_option ? (
            <div className="dj-field-error">{errors.chosen_option}</div>
          ) : null}
        </div>

        <div className="dj-form-row">
          <label className="dj-label" htmlFor="reasoning">
            My reasoning
          </label>
          <textarea
            id="reasoning"
            className="dj-textarea"
            value={form.reasoning}
            onChange={(e) => setForm((f) => ({ ...f, reasoning: e.target.value }))}
            required
            rows={4}
            placeholder="Why did you choose this? What assumptions did you make?"
          />
          {errors.reasoning ? <div className="dj-field-error">{errors.reasoning}</div> : null}
        </div>

        <div className="dj-form-row">
          <label className="dj-label" htmlFor="revisit_date">
            Revisit date
          </label>
          <input
            id="revisit_date"
            className="dj-input"
            type="date"
            value={form.revisit_date}
            onChange={(e) => setForm((f) => ({ ...f, revisit_date: e.target.value }))}
          />
          <div className="dj-help">
            Optional. If you set a revisit date, record the outcome when you come back.
          </div>
        </div>

        <div className="dj-form-actions">
          <button className="dj-btn dj-btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Decision'}
          </button>
        </div>
      </form>
    </div>
  )
}

