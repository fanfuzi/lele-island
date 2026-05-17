-- 乐乐小岛 D1 数据库 Schema

CREATE TABLE IF NOT EXISTS users (
  username TEXT PRIMARY KEY,
  password_hash TEXT NOT NULL,
  display_name TEXT DEFAULT '',
  grade TEXT DEFAULT 'p3',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS game_data (
  username TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS family_bindings (
  parent_username TEXT NOT NULL,
  child_username TEXT NOT NULL,
  relationship TEXT DEFAULT 'parent',
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(parent_username, child_username)
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  subject TEXT,
  game_type TEXT,
  score INTEGER,
  total_count INTEGER,
  correct_count INTEGER,
  duration_seconds INTEGER,
  metadata TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_activity_username ON activity_logs(username);
CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_logs(created_at);

-- 清理过期 session（30天前）
DELETE FROM sessions WHERE created_at < datetime('now', '-30 days');
