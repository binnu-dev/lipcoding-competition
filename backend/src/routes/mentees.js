const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('./auth');

// 멘티 리스트 조회 (멘토만)
router.get('/', authenticateToken, (req, res) => {
  if (req.user.role !== 'mentor') return res.status(403).json({ error: '멘토만 접근 가능합니다.' });
  db.all(`SELECT id, username, name, profile_image, bio FROM User WHERE role = 'mentee'`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ mentees: rows });
  });
});

module.exports = router;
