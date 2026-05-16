import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { createUser, authenticateUser, getUserById } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'lele-island-jwt-secret-2024';
const JWT_EXPIRES = '30d';

const router = Router();

function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, tier: user.subscription_tier || 'free' },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
}

// ===== 注册 =====
router.post('/register', (req, res) => {
  const { username, password, displayName, grade } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码不能为空' });
  }

  if (username.length < 2 || username.length > 20) {
    return res.status(400).json({ error: '用户名长度 2-20 个字符' });
  }

  if (password.length < 4) {
    return res.status(400).json({ error: '密码至少 4 个字符' });
  }

  // 根据年级确定初始解锁等级
  const gradeLevelMap = { p1:1, p2:1, p3:1, p4:1, p5:2, p6:2, f1:2, f2:2, f3:2 };
  const startLevel = gradeLevelMap[grade] || 1;

  // 初始化游戏数据，包含年级设置
  const initialData = {
    userGrade: grade || 'p3',
    coins: 50,
    pet: {
      type: 'cat',
      name: displayName || username,
      color: '#FFB5C2',
      accessories: [],
      hunger: 80,
      happiness: 80,
      exp: 0,
      level: 1,
    },
    inventory: [],
    dailyProgress: {
      date: '',
      cantonese: { done: false, score: 0, questionsDone: 0 },
      chinese: { done: false, score: 0, questionsDone: 0 },
      math: { done: false, score: 0, questionsDone: 0 },
    },
    streak: 0,
    achievements: [],
    cantoneseUnlocked: startLevel,
    chineseUnlocked: startLevel,
    mathUnlocked: startLevel,
    stats: {
      totalQuestions: 0,
      correctAnswers: 0,
      daysActive: 0,
    },
    showTutorial: false,
  };

  const user = createUser(username, password, displayName, initialData);
  if (!user) {
    return res.status(409).json({ error: '用户名已被注册' });
  }

  const token = generateToken(user);
  res.json({
    token,
    user: { id: user.id, username: user.username, tier: 'free', grade: initialData.userGrade },
  });
});

// ===== 登录 =====
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码不能为空' });
  }

  const user = authenticateUser(username, password);
  if (!user) {
    return res.status(401).json({ error: '用户名或密码错误' });
  }

  const token = generateToken(user);
  res.json({
    token,
    user: { id: user.id, username: user.username, tier: user.subscription_tier },
  });
});

// ===== 验证 token =====
router.get('/me', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未登录' });
  }

  try {
    const decoded = jwt.verify(auth.slice(7), JWT_SECRET);
    const user = getUserById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }
    res.json({ user });
  } catch {
    res.status(401).json({ error: '登录已过期，请重新登录' });
  }
});

export { router as authRouter, JWT_SECRET };
