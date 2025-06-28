-- User 테이블
CREATE TABLE IF NOT EXISTS User (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK(role IN ('mentor','mentee')) NOT NULL,
  profile_image TEXT,
  bio TEXT,
  tech_stack TEXT,
  mentoring_type TEXT CHECK(mentoring_type IN ('online','offline','both')),
  company TEXT,
  gender TEXT CHECK(gender IN ('male','female','other')),
  mbti TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  location TEXT,
  available_time TEXT,
  social_links TEXT,
  is_active BOOLEAN DEFAULT 1,
  last_login DATETIME,
  tags TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- MatchingRequest 테이블
CREATE TABLE IF NOT EXISTS MatchingRequest (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mentee_id INTEGER NOT NULL,
  mentor_id INTEGER NOT NULL,
  status TEXT CHECK(status IN ('pending','accepted','rejected','cancelled')) NOT NULL,
  message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (mentee_id) REFERENCES User(id),
  FOREIGN KEY (mentor_id) REFERENCES User(id)
);

-- MentoringSession 테이블
CREATE TABLE IF NOT EXISTS MentoringSession (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  matching_request_id INTEGER NOT NULL,
  mentor_id INTEGER NOT NULL,
  mentee_id INTEGER NOT NULL,
  schedule DATETIME,
  type TEXT CHECK(type IN ('online','offline')),
  location TEXT,
  feedback TEXT,
  status TEXT CHECK(status IN ('scheduled','in_progress','completed','cancelled')) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (matching_request_id) REFERENCES MatchingRequest(id),
  FOREIGN KEY (mentor_id) REFERENCES User(id),
  FOREIGN KEY (mentee_id) REFERENCES User(id)
);
