const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('./auth');

// 매칭 요청 생성 (멘티)
router.post('/', authenticateToken, (req, res) => {
  const mentee_id = req.user.id;
  const { mentor_id, message } = req.body;
  if (!mentor_id) return res.status(400).json({ error: 'mentor_id required' });
  db.run(
    `INSERT INTO MatchingRequest (mentee_id, mentor_id, status, message, created_at, updated_at) VALUES (?, ?, 'pending', ?, datetime('now'), datetime('now'))`,
    [mentee_id, mentor_id, message || ''],
    function (err) {
      if (err) {
        console.error('DB error:', err);
        return res.status(500).json({ error: 'DB error', detail: err.message });
      }
      res.json({ id: this.lastID, success: true });
    }
  );
});

// 프론트엔드 호환: /request 경로도 지원
router.post('/request', authenticateToken, (req, res) => {
  const mentee_id = req.user.id;
  const { mentor_id, message } = req.body;
  if (!mentor_id) return res.status(400).json({ error: 'mentor_id required' });
  db.run(
    `INSERT INTO MatchingRequest (mentee_id, mentor_id, status, message, created_at, updated_at) VALUES (?, ?, 'pending', ?, datetime('now'), datetime('now'))`,
    [mentee_id, mentor_id, message || ''],
    function (err) {
      if (err) {
        console.error('DB error:', err);
        return res.status(500).json({ error: 'DB error', detail: err.message });
      }
      res.json({ id: this.lastID, success: true });
    }
  );
});

// 내 매칭 요청 목록 (멘티/멘토)
router.get('/', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;
  let sql, params;
  if (role === 'mentee') {
    sql = 'SELECT * FROM MatchingRequest WHERE mentee_id = ? ORDER BY created_at DESC';
    params = [userId];
  } else if (role === 'mentor') {
    sql = 'SELECT * FROM MatchingRequest WHERE mentor_id = ? ORDER BY created_at DESC';
    params = [userId];
  } else {
    return res.status(403).json({ error: 'Invalid role' });
  }
  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(rows);
  });
});

// 매칭 요청 상태 변경 (수락/거절/취소)
router.put('/:id', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;
  const { status } = req.body;
  const validStatus = ['accepted', 'rejected', 'cancelled'];
  if (!validStatus.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  // 멘토만 수락/거절, 멘티만 취소 가능
  db.get('SELECT * FROM MatchingRequest WHERE id = ?', [req.params.id], (err, row) => {
    if (err || !row) return res.status(404).json({ error: 'Request not found' });
    if (status === 'cancelled' && row.mentee_id !== userId) return res.status(403).json({ error: 'No permission' });
    if ((status === 'accepted' || status === 'rejected') && row.mentor_id !== userId) return res.status(403).json({ error: 'No permission' });
    db.run("UPDATE MatchingRequest SET status = ?, updated_at = datetime('now') WHERE id = ?", [status, req.params.id], function (err2) {
      if (err2) return res.status(500).json({ error: 'DB error' });
      res.json({ success: true });
    });
  });
});

// 내가 보낸 매칭 요청 1건 조회 (멘티)
router.get('/my-request', authenticateToken, (req, res) => {
  const menteeId = req.user.id;
  db.get(
    'SELECT * FROM MatchingRequest WHERE mentee_id = ? ORDER BY created_at DESC LIMIT 1',
    [menteeId],
    (err, row) => {
      if (err) return res.status(500).json({ error: 'DB error', detail: err.message });
      if (!row) return res.json({ request: null });
      res.json({ request: row });
    }
  );
});

// [DEBUG] 매칭 요청 전체 덤프 (보안상 운영 배포 전 반드시 삭제!)
router.get('/debug/all', (req, res) => {
  db.all('SELECT * FROM MatchingRequest ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error', detail: err.message });
    res.json({ requests: rows });
  });
});

module.exports = router;
