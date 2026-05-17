import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_PATH = path.join(DATA_DIR, 'lele-island.db');

let db;

export function getDb() {
  if (!db) {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initTables();
    console.log(`📦 数据库已初始化: ${DB_PATH}`);
  }
  return db;
}

function initTables() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      display_name TEXT DEFAULT '',
      subscription_tier TEXT DEFAULT 'free',
      subscription_expires TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      last_login TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS user_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      game_data TEXT DEFAULT '{}',
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
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
  `);
}

// ===== 密码工具 =====
import crypto from 'crypto';

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const verify = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return hash === verify;
}

// ===== 用户操作 =====
export function createUser(username, password, displayName, initialGameData = null) {
  const d = getDb();
  const passwordHash = hashPassword(password);

  try {
    const stmt = d.prepare('INSERT INTO users (username, password_hash, display_name) VALUES (?, ?, ?)');
    const result = stmt.run(username, passwordHash, displayName || username);

    // 创建 user_data，如果有初始数据则保存
    const gameData = initialGameData ? JSON.stringify(initialGameData) : '{}';
    const userDataStmt = d.prepare('INSERT INTO user_data (user_id, game_data) VALUES (?, ?)');
    userDataStmt.run(result.lastInsertRowid, gameData);

    return { id: result.lastInsertRowid, username };
  } catch (e) {
    if (e.message.includes('UNIQUE')) return null;
    throw e;
  }
}

export function getUserByUsername(username) {
  const d = getDb();
  return d.prepare('SELECT * FROM users WHERE username = ?').get(username);
}

export function getUserById(id) {
  const d = getDb();
  return d.prepare('SELECT id, username, display_name, subscription_tier, subscription_expires, created_at, last_login FROM users WHERE id = ?').get(id);
}

export function authenticateUser(username, password) {
  const user = getUserByUsername(username);
  if (!user) return null;
  if (!verifyPassword(password, user.password_hash)) return null;
  return { id: user.id, username: user.username, subscription_tier: user.subscription_tier };
}

// ===== 游戏数据操作 =====
export function saveUserData(userId, gameData) {
  const d = getDb();
  const stmt = d.prepare(
    'INSERT INTO user_data (user_id, game_data, updated_at) VALUES (?, ?, datetime(\'now\')) ON CONFLICT(user_id) DO UPDATE SET game_data = ?, updated_at = datetime(\'now\')'
  );
  const jsonData = typeof gameData === 'string' ? gameData : JSON.stringify(gameData);
  stmt.run(userId, jsonData, jsonData);
}

export function loadUserData(userId) {
  const d = getDb();
  const row = d.prepare('SELECT game_data FROM user_data WHERE user_id = ?').get(userId);
  if (!row) return null;
  try {
    return JSON.parse(row.game_data);
  } catch {
    return null;
  }
}

// ===== 订阅管理 =====
export function setSubscription(userId, tier, days) {
  const d = getDb();
  const expires = new Date();
  expires.setDate(expires.getDate() + days);
  const expiresStr = expires.toISOString();

  d.prepare(
    'UPDATE users SET subscription_tier = ?, subscription_expires = ? WHERE id = ?'
  ).run(tier, expiresStr, userId);
}

export function checkSubscription(userId) {
  const d = getDb();
  const user = d.prepare('SELECT subscription_tier, subscription_expires FROM users WHERE id = ?').get(userId);
  if (!user) return { valid: false, tier: 'free' };

  if (user.subscription_tier === 'free') {
    return { valid: true, tier: 'free' };
  }

  if (user.subscription_expires && new Date(user.subscription_expires) > new Date()) {
    return { valid: true, tier: user.subscription_tier };
  }

  // 过期了，降级到 free
  if (user.subscription_tier !== 'free') {
    d.prepare('UPDATE users SET subscription_tier = ? WHERE id = ?').run('free', userId);
  }

  return { valid: false, tier: 'free', expired: true };
}
