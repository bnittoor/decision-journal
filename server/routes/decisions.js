const express = require('express');
const db = require('../database');

const router = express.Router();

// ---------------------------------------------------------------------------
// GET /api/decisions
// Returns all decisions, newest first.
// ---------------------------------------------------------------------------
router.get('/', (req, res) => {
  const rows = db
    .prepare('SELECT * FROM decisions ORDER BY created_at DESC')
    .all();
  res.json(rows);
});

// ---------------------------------------------------------------------------
// GET /api/decisions/:id
// Returns a single decision by id.
// ---------------------------------------------------------------------------
router.get('/:id', (req, res) => {
  const row = db
    .prepare('SELECT * FROM decisions WHERE id = ?')
    .get(req.params.id);

  if (!row) return res.status(404).json({ error: 'Decision not found' });
  res.json(row);
});

// ---------------------------------------------------------------------------
// POST /api/decisions
// Creates a new decision entry.
//
// Required body fields:
//   title, context, options_considered, chosen_option, reasoning
// Optional body fields:
//   revisit_date (YYYY-MM-DD)
// ---------------------------------------------------------------------------
router.post('/', (req, res) => {
  const {
    title,
    context,
    options_considered,
    chosen_option,
    reasoning,
    revisit_date,
  } = req.body;

  // Basic validation — all required fields must be non-empty strings
  const missing = ['title', 'context', 'options_considered', 'chosen_option', 'reasoning']
    .filter((field) => !req.body[field]?.toString().trim());

  if (missing.length > 0) {
    return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
  }

  const stmt = db.prepare(`
    INSERT INTO decisions (title, context, options_considered, chosen_option, reasoning, revisit_date)
    VALUES (@title, @context, @options_considered, @chosen_option, @reasoning, @revisit_date)
  `);

  const result = stmt.run({
    title: title.trim(),
    context: context.trim(),
    options_considered: options_considered.trim(),
    chosen_option: chosen_option.trim(),
    reasoning: reasoning.trim(),
    revisit_date: revisit_date || null,
  });

  // Return the newly created row
  const created = db.prepare('SELECT * FROM decisions WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(created);
});

// ---------------------------------------------------------------------------
// PATCH /api/decisions/:id
// Updates a decision — intended for recording the outcome and/or changing
// the status to 'resolved' when you revisit it.
//
// Accepted body fields (all optional, at least one required):
//   outcome  (text)
//   status   ('open' | 'resolved')
// ---------------------------------------------------------------------------
router.patch('/:id', (req, res) => {
  const existing = db
    .prepare('SELECT * FROM decisions WHERE id = ?')
    .get(req.params.id);

  if (!existing) return res.status(404).json({ error: 'Decision not found' });

  const { outcome, status } = req.body;

  // Validate status if provided
  if (status !== undefined && !['open', 'resolved'].includes(status)) {
    return res.status(400).json({ error: "status must be 'open' or 'resolved'" });
  }

  // Build the update dynamically so we only touch provided fields
  const updates = [];
  const params = {};

  if (outcome !== undefined) {
    updates.push('outcome = @outcome');
    params.outcome = outcome;
  }
  if (status !== undefined) {
    updates.push('status = @status');
    params.status = status;
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No updatable fields provided' });
  }

  params.id = req.params.id;
  db.prepare(`UPDATE decisions SET ${updates.join(', ')} WHERE id = @id`).run(params);

  const updated = db.prepare('SELECT * FROM decisions WHERE id = ?').get(req.params.id);
  res.json(updated);
});

module.exports = router;
