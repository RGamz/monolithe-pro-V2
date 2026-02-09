/**
 * Server Entry Point (server.js)
 * --------------------------------
 * Express server that:
 * 1. Initializes the SQLite database (via sql.js helper)
 * 2. Serves static HTML/CSS/JS files from /public
 * 3. Mounts API routes for auth, projects, invoices, users, alerts
 */

const express = require('express');
const path = require('path');
require('dotenv').config();

const dbHelper = require('./db/helper');

const app = express();
const PORT = process.env.PORT || 3000;

// ------------------------------------------------------------------
// MIDDLEWARE
// ------------------------------------------------------------------
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Make the db helper accessible to all routes
app.use((req, res, next) => {
  req.db = dbHelper;
  next();
});

// ------------------------------------------------------------------
// API ROUTES
// ------------------------------------------------------------------
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/invoices', require('./routes/invoices'));
app.use('/api/users', require('./routes/users'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/documents', require('./routes/documents'));

// ------------------------------------------------------------------
// FALLBACK: Serve index.html for any non-API, non-file route
// ------------------------------------------------------------------
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ------------------------------------------------------------------
// START SERVER (async because db init is async)
// ------------------------------------------------------------------
async function start() {
  const dbPath = path.resolve(process.env.DB_PATH || './db/database.sqlite');
  await dbHelper.initDatabase(dbPath);

  app.listen(PORT, () => {
    console.log(`\n🚀 ArtisanPortal server running at http://localhost:${PORT}`);
    console.log(`📂 Serving static files from /public\n`);
  });
}

start().catch(err => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  dbHelper.close();
  process.exit(0);
});
