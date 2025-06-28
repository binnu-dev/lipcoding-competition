const express = require('express');
const router = express.Router();
const db = require('../db');

// 멘토 리스트 조회/검색/정렬
router.get('/', (req, res) => {
  const { search, sort, order = 'ASC', tech_stack } = req.query;
  let sql = `SELECT id, username, name, profile_image, bio, tech_stack, mentoring_type, company, gender, mbti, location, available_time, social_links, tags FROM User WHERE role = 'mentor'`;
  const params = [];
  if (search) {
    sql += ` AND (name LIKE ? OR tech_stack LIKE ? OR tags LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (tech_stack) {
    sql += ` AND tech_stack LIKE ?`;
    params.push(`%${tech_stack}%`);
  }
  if (sort && ['name','company','location','available_time'].includes(sort)) {
    sql += ` ORDER BY ${sort} ${order === 'DESC' ? 'DESC' : 'ASC'}`;
  } else {
    sql += ` ORDER BY id ASC`;
  }
  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(rows);
  });
});

module.exports = router;
