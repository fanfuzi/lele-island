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

-- 清理过期 session（30天前）
DELETE FROM sessions WHERE created_at < datetime('now', '-30 days');
