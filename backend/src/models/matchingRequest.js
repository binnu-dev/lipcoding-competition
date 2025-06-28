const db = require('../db');

// 매칭 요청 생성
const createMatchingRequest = async (menteeId, mentorId, message) => {
  const sql = `INSERT INTO matching_requests (mentee_id, mentor_id, message, status, created_at) VALUES (?, ?, ?, 'pending', datetime('now'))`;
  const result = await db.run(sql, [menteeId, mentorId, message]);
  return result.lastID;
};

// 내가 보낸 매칭 요청 1건 조회
const getMyMatchingRequest = async (menteeId) => {
  const sql = `SELECT * FROM matching_requests WHERE mentee_id = ? ORDER BY created_at DESC LIMIT 1`;
  const row = await db.get(sql, [menteeId]);
  return row;
};

module.exports = { createMatchingRequest, getMyMatchingRequest };
