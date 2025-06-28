// 샘플 유저/멘토 데이터 삽입 (MBTI별 3명씩, 모든 필수 컬럼)
const db = require('./db');
const bcrypt = require('bcryptjs');

async function seed() {
  const hash = await bcrypt.hash('test1234', 10);
  const now = new Date().toISOString();
  const mentors = [
    { username: 'mentor_entj', name: 'ENTJ 멘토', mbti: 'ENTJ', email: 'entj.mentor@test.com' },
    { username: 'mentor_intp', name: 'INTP 멘토', mbti: 'INTP', email: 'intp.mentor@test.com' },
    { username: 'mentor_isfj', name: 'ISFJ 멘토', mbti: 'ISFJ', email: 'isfj.mentor@test.com' },
  ];
  const mentees = [
    { username: 'mentee_entj', name: 'ENTJ 멘티', mbti: 'ENTJ', email: 'entj.mentee@test.com' },
    { username: 'mentee_intp', name: 'INTP 멘티', mbti: 'INTP', email: 'intp.mentee@test.com' },
    { username: 'mentee_isfj', name: 'ISFJ 멘티', mbti: 'ISFJ', email: 'isfj.mentee@test.com' },
  ];
  db.serialize(() => {
    mentors.forEach(m => {
      db.run(`INSERT INTO User (
        username, password, name, role, profile_image, bio, tech_stack, mentoring_type, company, gender, mbti, email, phone, location, available_time, social_links, is_active, last_login, tags, created_at, updated_at
      ) VALUES (?, ?, ?, 'mentor', NULL, '백엔드/프론트엔드 전문가', 'Node.js,React', 'both', '네이버', 'male', ?, ?, NULL, '서울', NULL, NULL, 1, NULL, NULL, ?, ?)`,
        [m.username, hash, m.name, m.mbti, m.email, now, now]);
    });
    mentees.forEach(m => {
      db.run(`INSERT INTO User (
        username, password, name, role, profile_image, bio, tech_stack, mentoring_type, company, gender, mbti, email, phone, location, available_time, social_links, is_active, last_login, tags, created_at, updated_at
      ) VALUES (?, ?, ?, 'mentee', NULL, '프론트엔드 배우고 싶어요', 'React', 'online', '삼성', 'female', ?, ?, NULL, '부산', NULL, NULL, 1, NULL, NULL, ?, ?)`,
        [m.username, hash, m.name, m.mbti, m.email, now, now]);
    });
  });
  db.close();
  console.log('MBTI별 멘토/멘티 3명씩 샘플 데이터 삽입 완료! (비번: test1234)');
}
seed();
