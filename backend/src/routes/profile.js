const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('./auth');
const multer = require('multer');
const path = require('path');

// 업로드 폴더 및 파일명 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, req.user.id + '-' + unique + ext);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 }, // 1MB 제한
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') cb(null, true);
    else cb(new Error('jpg, png 파일만 허용'));
  }
});

// 프로필 조회
router.get('/me', authenticateToken, (req, res) => {
  const userId = req.user.id;
  db.get('SELECT * FROM User WHERE id = ?', [userId], (err, row) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (!row) return res.status(404).json({ error: 'User not found' });
    delete row.password;
    res.json(row);
  });
});

// 프로필 수정
router.put('/me', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const fields = [
    'name', 'profile_image', 'bio', 'tech_stack', 'mentoring_type', 'company',
    'gender', 'mbti', 'email', 'phone', 'location', 'available_time',
    'social_links', 'is_active', 'tags'
  ];
  const updates = [];
  const values = [];
  fields.forEach(field => {
    if (req.body[field] !== undefined) {
      updates.push(`${field} = ?`);
      values.push(req.body[field]);
    }
  });
  if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });
  values.push(userId);
  db.run(
    `UPDATE User SET ${updates.join(', ')}, updated_at = datetime('now') WHERE id = ?`,
    values,
    function (err) {
      if (err) return res.status(500).json({ error: 'DB error' });
      res.json({ success: true });
    }
  );
});

// 프로필 이미지 업로드
router.post('/me/image', authenticateToken, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: '파일이 업로드되지 않았습니다.' });
  // 실제 서비스라면 DB에 파일명 저장 필요
  const url = `/uploads/${req.file.filename}`;
  res.json({ url });
});

module.exports = router;
