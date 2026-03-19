require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const decisionsRouter = require('./routes/decisions');

const app = express();
const PORT = process.env.PORT || 3001;
const isProd = process.env.NODE_ENV === 'production';

// --- Middleware ---
// In production the Express server itself serves the frontend, so CORS is
// only needed in development (separate Vite dev server on a different port).
if (!isProd) {
  app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
}
app.use(express.json());

// --- API Routes ---
app.use('/api/decisions', decisionsRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// --- Static frontend (production only) ---
if (isProd) {
  const distPath = path.join(__dirname, '../client/dist');

  // Serve static assets (JS, CSS, images, etc.)
  app.use(express.static(distPath));

  // For any non-API route, send back index.html so client-side routing works
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// --- Start server ---
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} [${isProd ? 'production' : 'development'}]`);
});
