const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

// 회원가입
router.post('/register', async (req, res) => {
  const { username, password, name, role, email } = req.body;
  if (!username || !password || !name || !role) {
    return res.status(400).json({ message: '필수 항목 누락' });
  }
  db.get('SELECT * FROM User WHERE username = ?', [username], async (err, user) => {
    if (user) return res.status(409).json({ message: '이미 존재하는 사용자명' });
    const hash = await bcrypt.hash(password, 10);
    db.run(
      'INSERT INTO User (username, password, name, role, email) VALUES (?, ?, ?, ?, ?)',
      [username, hash, name, role, email],
      function (err) {
        if (err) return res.status(500).json({ message: 'DB 오류' });
        res.status(201).json({ id: this.lastID, username, name, role, email });
      }
    );
  });
});

// 로그인
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM User WHERE username = ?', [username], async (err, user) => {
    if (!user) return res.status(401).json({ message: '사용자 없음' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: '비밀번호 불일치' });
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: 'mentor-mentee-app',
      sub: String(user.id),
      aud: 'mentor-mentee-client',
      exp: now + 60 * 60, // 1시간
      nbf: now,
      iat: now,
      jti: require('crypto').randomBytes(8).toString('hex'),
      name: user.name,
      email: user.email,
      role: user.role,
      id: user.id
    };
    const token = jwt.sign(payload, JWT_SECRET);
    res.json({ token, user: { id: user.id, username: user.username, name: user.name, role: user.role, email: user.email } });
  });
});

// JWT 인증 미들웨어
function auth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: '토큰 없음' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: '토큰 오류' });
    req.user = user;
    next();
  });
}

module.exports = { router, authenticateToken: auth };
