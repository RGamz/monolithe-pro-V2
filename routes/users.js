/**
 * Users Routes (routes/users.js)
 * --------------------------------
 * GET  /api/users/artisans  - Get all artisans (Admin directory)
 * POST /api/users/profile   - Update user profile (onboarding)
 */

const express = require('express');
const router = express.Router();

// GET /api/users/artisans
router.get('/artisans', (req, res) => {
  const artisans = req.db.getAll(`
    SELECT id, name, email, role, is_onboarded, company_name, specialty, 
           address, lat, lng, documents_status
    FROM users 
    WHERE role = 'ARTISAN'
    ORDER BY name
  `);

  res.json(artisans);
});

// POST /api/users/profile
router.post('/profile', (req, res) => {
  const { userId, company_name, address, specialty } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  // Update only provided fields, set onboarded to true
  req.db.run(`
    UPDATE users 
    SET company_name = COALESCE(?, company_name),
        address = COALESCE(?, address),
        specialty = COALESCE(?, specialty),
        is_onboarded = 1
    WHERE id = ?
  `, [company_name || null, address || null, specialty || null, userId]);

  req.db.save();

  const updated = req.db.getOne(`
    SELECT id, name, email, role, is_onboarded, company_name, specialty, 
           address, lat, lng, documents_status
    FROM users WHERE id = ?
  `, [userId]);

  if (!updated) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(updated);
});

module.exports = router;
