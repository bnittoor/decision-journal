const Database = require('better-sqlite3');
const path = require('path');

// Store the database file in the server directory.
// Override the path via DB_PATH in your .env if needed.
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'decisions.db');

const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');

// Create the decisions table if it doesn't exist yet
db.exec(`
  CREATE TABLE IF NOT EXISTS decisions (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    title            TEXT    NOT NULL,
    context          TEXT    NOT NULL,  -- the situation / background
    options_considered TEXT  NOT NULL,  -- free-text or JSON list of alternatives
    chosen_option    TEXT    NOT NULL,
    reasoning        TEXT    NOT NULL,  -- why this option was chosen
    revisit_date     TEXT,              -- ISO date string (YYYY-MM-DD), optional
    outcome          TEXT,              -- filled in later when reviewing
    status           TEXT    NOT NULL DEFAULT 'open' CHECK(status IN ('open', 'resolved')),
    created_at       TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  )
`);

module.exports = db;
