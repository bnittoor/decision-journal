async function parseJsonSafe(res) {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

export async function fetchDecisions() {
  const res = await fetch('/api/decisions')
  if (!res.ok) {
    const body = await parseJsonSafe(res)
    throw new Error(body?.error || `Failed to load decisions (${res.status})`)
  }
  return res.json()
}

export async function fetchDecision(id) {
  const res = await fetch(`/api/decisions/${encodeURIComponent(id)}`)
  if (!res.ok) {
    const body = await parseJsonSafe(res)
    throw new Error(body?.error || `Failed to load decision (${res.status})`)
  }
  return res.json()
}

export async function createDecision(payload) {
  const res = await fetch('/api/decisions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const body = await parseJsonSafe(res)
    throw new Error(body?.error || `Failed to create decision (${res.status})`)
  }

  return res.json()
}

export async function recordDecisionOutcome(id, { outcome, status }) {
  const res = await fetch(`/api/decisions/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ outcome, status }),
  })

  if (!res.ok) {
    const body = await parseJsonSafe(res)
    throw new Error(body?.error || `Failed to record outcome (${res.status})`)
  }

  return res.json()
}

export function formatIsoDate(isoLike) {
  if (!isoLike) return ''
  const d = new Date(isoLike)
  if (Number.isNaN(d.getTime())) return isoLike
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
}

export function formatYyyyMmDd(dateStr) {
  if (!dateStr) return ''
  // Backend stores YYYY-MM-DD; ensure it displays nicely across locales.
  const d = new Date(`${dateStr}T00:00:00`)
  if (Number.isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
}

export function validateNonEmpty(label, value) {
  if (!value || !value.toString().trim()) return `${label} is required`
  return null
}

