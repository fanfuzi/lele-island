// 活动日志上报工具 — 无感埋点，失败不影响主流程

const API_BASE = '/api';

export async function logActivity({
  type,       // visit|game|practice|chat|shop|pet
  subject,    // math|chinese|cantonese|english|gs|null
  gameType,   // quiz|match|writing|speed|fill|order|grid|sort|step|chat|null
  score,      // 0-100 或 undefined
  total,      // 总题数
  correct,    // 正确数
  duration,   // 停留秒数（页面进入到离开）
  metadata,   // 可选扩展 JSON
}) {
  try {
    const token = localStorage.getItem('lele-token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    fetch(`${API_BASE}/activity/log`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        activityType: type,
        subject,
        gameType,
        score,
        totalCount: total,
        correctCount: correct,
        durationSeconds: duration,
        metadata: metadata ? JSON.stringify(metadata) : undefined,
      }),
    }).catch(() => {}); // 静默失败
  } catch {
    // 完全无感
  }
}

// 页面进入时记录一次 visit，返回 stop 函数（离开时记录时长）
export function trackPage(subject, extra = {}) {
  const startTime = Date.now();
  // 立即记录访问
  logActivity({ type: 'visit', subject, ...extra });

  // 返回 stop 函数，调用时记录时长
  return (completion = {}) => {
    const duration = Math.round((Date.now() - startTime) / 1000);
    logActivity({ type: 'visit', subject, duration, ...extra, ...completion });
  };
}
