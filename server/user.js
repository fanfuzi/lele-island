import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './auth.js';
import { saveUserData, loadUserData, checkSubscription, setSubscription } from './db.js';

const router = Router();

// JWT 认证中间件
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未登录' });
  }

  try {
    const decoded = jwt.verify(auth.slice(7), JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: '登录已过期，请重新登录' });
  }
}

// ===== 保存游戏数据 =====
router.post('/save', authMiddleware, (req, res) => {
  const { gameData } = req.body;
  if (!gameData) {
    return res.status(400).json({ error: '数据不能为空' });
  }

  saveUserData(req.user.id, gameData);
  res.json({ success: true });
});

// ===== 加载游戏数据 =====
router.get('/load', authMiddleware, (req, res) => {
  const data = loadUserData(req.user.id);
  res.json({ gameData: data || {} });
});

// ===== 检查订阅状态 =====
router.get('/subscription', authMiddleware, (req, res) => {
  const sub = checkSubscription(req.user.id);
  res.json(sub);
});

// ===== 激活订阅（示例接口，实际支付接入后扩展）=====
router.post('/subscription/activate', authMiddleware, (req, res) => {
  const { tier, days } = req.body;
  if (!['premium', 'family'].includes(tier)) {
    return res.status(400).json({ error: '无效的订阅类型' });
  }

  setSubscription(req.user.id, tier, days || 30);
  res.json({ success: true, tier, days: days || 30 });
});

export { router as userRouter, authMiddleware };
