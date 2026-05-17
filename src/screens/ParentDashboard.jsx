import { useState, useEffect } from 'react';
import { getChildren, getChildActivity, getChildAnalysis, getChildMastery, bindChild } from '../api/auth';

const SUBJECT_NAMES = {
  math: '🔢 数学',
  chinese: '✍️ 汉字',
  cantonese: '🗣️ 粤语',
  english: '🔤 英文',
  gs: '🌍 常识',
};

const ACTIVITY_LABELS = {
  visit: '访问',
  game: '游戏',
  practice: '练习',
  chat: 'AI对话',
  shop: '商店',
  pet: '宠物屋',
  diagnosis: '诊断',
  review: '复习',
};

const ERROR_TYPE_LABELS = {
  careless: '计算粗心',
  keyword: '关键词遗漏',
  logic: '多步逻辑',
  geometry: '几何观察',
};

const ERROR_TYPE_COLORS = {
  careless: '#FF9EAA',
  keyword: '#A8D8EA',
  logic: '#C9B1FF',
  geometry: '#AAE1C6',
};

const HABIT_LABELS = {
  'reverse-check': { label: '反向验算', icon: '✅' },
  'neat-draft': { label: '规范草稿', icon: '📝' },
  'common-sense': { label: '常识校验', icon: '🤔' },
};

export default function ParentDashboard({ onBack }) {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [activities, setActivities] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [masteryData, setMasteryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [days, setDays] = useState(7);
  const [bindMode, setBindMode] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [bindMsg, setBindMsg] = useState('');

  useEffect(() => {
    loadChildren();
  }, []);

  useEffect(() => {
    if (selectedChild) {
      loadActivity(selectedChild);
      loadAnalysis(selectedChild);
      loadMastery(selectedChild);
    }
  }, [selectedChild, days]);

  async function loadChildren() {
    setLoading(true);
    setError('');
    try {
      const result = await getChildren();
      setChildren(result.children || []);
      if (result.children?.length > 0) {
        setSelectedChild(result.children[0].username);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadActivity(childUsername) {
    try {
      const result = await getChildActivity(childUsername, days);
      setActivities(result.activities || []);
    } catch (e) {
      console.warn('Failed to load activity:', e.message);
    }
  }

  async function loadAnalysis(childUsername) {
    try {
      const result = await getChildAnalysis(childUsername);
      setAnalysis(result);
    } catch (e) {
      console.warn('Failed to load analysis:', e.message);
    }
  }

  async function loadMastery(childUsername) {
    try {
      const result = await getChildMastery(childUsername);
      setMasteryData(result);
    } catch (e) {
      console.warn('Failed to load mastery:', e.message);
    }
  }

  async function handleBind() {
    if (!inviteCode.trim()) return;
    setBindMsg('');
    try {
      const result = await bindChild(inviteCode.trim());
      if (result.ok) {
        setBindMsg(`✅ 成功绑定 ${result.child?.displayName || result.child?.username}`);
        setInviteCode('');
        loadChildren();
      }
    } catch (e) {
      setBindMsg(`❌ ${e.message}`);
    }
  }

  function formatDuration(seconds) {
    if (!seconds) return '0分钟';
    const mins = Math.round(seconds / 60);
    if (mins < 60) return `${mins}分钟`;
    return `${Math.floor(mins / 60)}小时${mins % 60}分钟`;
  }

  function getActivityIcon(a) {
    if (a.subject) return SUBJECT_NAMES[a.subject]?.split(' ')[0] || '📝';
    return a.activity_type === 'visit' ? '👀' : '📝';
  }

  function getActivitySummary(a) {
    const type = ACTIVITY_LABELS[a.activity_type] || a.activity_type;
    const sub = a.subject ? SUBJECT_NAMES[a.subject] || a.subject : '';
    const game = a.game_type ? `(${a.game_type})` : '';
    let detail = `${type} ${sub} ${game}`;
    if (a.score != null) detail += ` · 得分 ${a.score}`;
    if (a.total_count) detail += ` · ${a.correct_count || 0}/${a.total_count}`;
    if (a.duration_seconds && a.duration_seconds > 60) detail += ` · ${formatDuration(a.duration_seconds)}`;
    return detail;
  }

  // SVG 柱状图 — 每日活跃
  function renderDayChart() {
    if (!analysis?.byDay || analysis.byDay.length === 0) return null;
    const days = [...analysis.byDay].reverse();
    const maxDuration = Math.max(...days.map(d => d.total_duration), 1);

    return (
      <div className="parent-chart-section">
        <div className="parent-chart-title">📅 每日学习时长</div>
        <div className="parent-bar-chart">
          {days.map((d, i) => {
            const pct = Math.max(3, (d.total_duration / maxDuration) * 100);
            const dayLabel = d.day?.slice(5) || `Day ${i + 1}`;
            return (
              <div key={d.day || i} className="parent-bar-item">
                <div className="parent-bar-label">{dayLabel}</div>
                <div className="parent-bar-track">
                  <div className="parent-bar-fill" style={{ height: `${pct}%` }} />
                </div>
                <div className="parent-bar-value">{formatDuration(d.total_duration)}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 科目分布（横向条形图）
  function renderSubjectChart() {
    if (!analysis?.bySubject || analysis.bySubject.length === 0) return null;
    const subjects = analysis.bySubject;
    const maxDuration = Math.max(...subjects.map(s => s.total_duration), 1);

    return (
      <div className="parent-chart-section">
        <div className="parent-chart-title">📊 科目分布（近14天）</div>
        <div className="parent-hbar-chart">
          {subjects.map(s => {
            const pct = (s.total_duration / maxDuration) * 100;
            const name = SUBJECT_NAMES[s.subject] || s.subject || '其他';
            const interest = s.count * 10 + (s.total_duration / 60) * 2;
            const interestLevel = interest > 50 ? '❤️ 很喜欢' : interest > 20 ? '💛 一般' : '🤍 较少';
            return (
              <div key={s.subject || 'other'} className="parent-hbar-item">
                <div className="parent-hbar-label">
                  <span>{name}</span>
                  <span className="parent-hbar-stat">
                    {formatDuration(s.total_duration)} · {s.count}次 · {interestLevel}
                  </span>
                </div>
                <div className="parent-hbar-track">
                  <div className="parent-hbar-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 诊断概览
  function renderDiagnosisOverview() {
    if (!analysis?.diagnosisLogs || analysis.diagnosisLogs.length === 0) return null;

    const logs = analysis.diagnosisLogs;
    const totalDiagnoses = logs.length;
    const errorTypeCounts = {};
    logs.forEach(log => {
      try {
        const meta = typeof log.metadata === 'string' ? JSON.parse(log.metadata) : (log.metadata || {});
        (meta.errorTypes || '').split(',').filter(Boolean).forEach(t => {
          errorTypeCounts[t] = (errorTypeCounts[t] || 0) + 1;
        });
      } catch { /* skip */ }
    });

    return (
      <div className="parent-chart-section">
        <div className="parent-chart-title">🔍 诊断概览（近30天）</div>
        <div className="parent-ov-diagnosis-cards">
          <div className="parent-ov-card-small">
            <span className="parent-ov-num">{totalDiagnoses}</span>
            <span className="parent-ov-label">诊断次数</span>
          </div>
          {logs[0]?.created_at && (
            <div className="parent-ov-card-small">
              <span className="parent-ov-num" style={{ fontSize: 14 }}>{logs[0].created_at?.slice(0, 10)}</span>
              <span className="parent-ov-label">最近诊断</span>
            </div>
          )}
          {logs.filter(l => {
            try {
              const m = typeof l.metadata === 'string' ? JSON.parse(l.metadata) : (l.metadata || {});
              return m.errorCount === 0;
            } catch { return false; }
          }).length > 0 && (
            <div className="parent-ov-card-small">
              <span className="parent-ov-num" style={{ color: '#AAE1C6' }}>
                {logs.filter(l => {
                  try {
                    const m = typeof l.metadata === 'string' ? JSON.parse(l.metadata) : (l.metadata || {});
                    return m.errorCount === 0;
                  } catch { return false; }
                }).length}
              </span>
              <span className="parent-ov-label">全对次数</span>
            </div>
          )}
        </div>

        {Object.keys(errorTypeCounts).length > 0 && (
          <div className="parent-error-type-bars">
            <div className="parent-sub-section-title">错误类型分布</div>
            {Object.entries(errorTypeCounts).map(([type, count]) => (
              <div key={type} className="parent-error-type-item">
                <span className="parent-error-type-label">{ERROR_TYPE_LABELS[type] || type}</span>
                <div className="parent-error-type-track">
                  <div className="parent-error-type-fill" style={{
                    width: `${(count / totalDiagnoses) * 100}%`,
                    background: ERROR_TYPE_COLORS[type] || '#ddd',
                  }} />
                </div>
                <span className="parent-error-type-count">{count}次</span>
              </div>
            ))}
          </div>
        )}

        {logs.slice(0, 5).map((log, i) => {
          let meta;
          try { meta = typeof log.metadata === 'string' ? JSON.parse(log.metadata) : (log.metadata || {}); } catch { meta = {}; }
          const hasErrors = meta.errorCount > 0;
          return (
            <div key={i} className="parent-timeline-item" style={{ fontSize: '0.85em', padding: '2px 0' }}>
              <span className="parent-timeline-time">{log.created_at?.slice(5, 16) || ''}</span>
              <span className="parent-timeline-text">
                {hasErrors
                  ? `🔍 发现 ${meta.errorCount} 处问题 (${meta.errorTypes || '未知'})`
                  : '🎉 作业全对'}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  // 习惯养成
  function renderHabitProgress() {
    if (!analysis?.habitLogs || analysis.habitLogs.length === 0) return null;

    const logs = analysis.habitLogs;
    const habitTypeCounts = {};
    logs.forEach(log => {
      try {
        const meta = typeof log.metadata === 'string' ? JSON.parse(log.metadata) : (log.metadata || {});
        const ht = meta.habitType || 'unknown';
        habitTypeCounts[ht] = (habitTypeCounts[ht] || 0) + 1;
      } catch { /* skip */ }
    });

    const totalHabits = logs.length;

    return (
      <div className="parent-chart-section">
        <div className="parent-chart-title">🎯 习惯养成进度（近30天）</div>
        <div className="parent-habit-summary">
          {Object.entries(habitTypeCounts).map(([type, count]) => {
            const info = HABIT_LABELS[type] || { label: type, icon: '🎯' };
            return (
              <div key={type} className="parent-habit-item">
                <span className="parent-habit-icon">{info.icon}</span>
                <span className="parent-habit-label">{info.label}</span>
                <span className="parent-habit-count">{count}次</span>
              </div>
            );
          })}
        </div>
        <div className="parent-habit-total">
          共完成 <strong>{totalHabits}</strong> 个习惯挑战
        </div>
        {logs.slice(0, 5).map((log, i) => (
          <div key={i} className="parent-timeline-item" style={{ fontSize: '0.85em', padding: '2px 0' }}>
            <span className="parent-timeline-time">{log.created_at?.slice(5, 16) || ''}</span>
            <span className="parent-timeline-text">🎯 完成好习惯挑战</span>
          </div>
        ))}
      </div>
    );
  }

  // 掌握度一览
  function renderMasteryOverview() {
    if (!masteryData?.mastery) return null;

    const { mastery } = masteryData;
    const subjects = Object.keys(mastery).filter(s => Object.keys(mastery[s]).length > 0);
    if (subjects.length === 0) return null;

    return (
      <div className="parent-chart-section">
        <div className="parent-chart-title">📊 掌握度一览</div>
        {subjects.map(sub => {
          const topics = Object.entries(mastery[sub]).sort((a, b) => a[1].level - b[1].level);
          return (
            <div key={sub} className="parent-mastery-subject">
              <div className="parent-mastery-subject-name">{SUBJECT_NAMES[sub] || sub}</div>
              {topics.map(([topic, data]) => {
                const pct = Math.round((data.level || 0) * 100);
                const color = pct >= 80 ? '#AAE1C6' : pct >= 50 ? '#FFDAA3' : '#FF9EAA';
                return (
                  <div key={topic} className="parent-mastery-item">
                    <span className="parent-mastery-topic">{topic}</span>
                    <div className="parent-mastery-track">
                      <div className="parent-mastery-fill" style={{ width: `${pct}%`, background: color }} />
                    </div>
                    <span className="parent-mastery-pct">{pct}%</span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }

  // 游戏偏好
  function renderGameChart() {
    if (!analysis?.byGame || analysis.byGame.length === 0) return null;
    const games = analysis.byGame.slice(0, 8);

    return (
      <div className="parent-chart-section">
        <div className="parent-chart-title">🎮 游戏偏好</div>
        <div className="parent-game-list">
          {games.map((g, i) => {
            const typeLabel = ACTIVITY_LABELS[g.activity_type] || g.activity_type;
            const sub = g.game_type ? `(${g.game_type})` : '';
            return (
              <div key={i} className="parent-game-item">
                <span className="parent-game-name">{typeLabel} {sub}</span>
                <span className="parent-game-count">{g.count}次</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 最近活动时间线
  function renderActivityTimeline() {
    if (activities.length === 0) {
      return <div className="parent-empty">暂无活动记录</div>;
    }

    const grouped = {};
    activities.slice(0, 50).forEach(a => {
      const day = a.created_at?.slice(0, 10) || '未知';
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(a);
    });

    return (
      <div className="parent-chart-section">
        <div className="parent-chart-title">🕐 最近活动</div>
        <div className="parent-timeline">
          {Object.entries(grouped).slice(0, 5).map(([day, items]) => (
            <div key={day} className="parent-timeline-day">
              <div className="parent-timeline-date">{day}</div>
              {items.slice(0, 10).map((a, i) => (
                <div key={i} className="parent-timeline-item">
                  <span className="parent-timeline-icon">{getActivityIcon(a)}</span>
                  <span className="parent-timeline-time">{a.created_at?.slice(11, 16) || ''}</span>
                  <span className="parent-timeline-text">{getActivitySummary(a)}</span>
                </div>
              ))}
              {items.length > 10 && (
                <div className="parent-timeline-more">还有 {items.length - 10} 条记录...</div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={onBack}>← 返回</button>
          <h2>👨‍👩‍👧 家长中心</h2>
          <div />
        </div>
        <div className="parent-loading">加载中...</div>
      </div>
    );
  }

  return (
    <div className="screen parent-dashboard">
      <div className="screen-header">
        <button className="btn-back" onClick={onBack}>← 返回</button>
        <h2>👨‍👩‍👧 家长中心</h2>
        <div />
      </div>

      {error && (
        <div className="parent-error">
          {error}
          <button className="btn btn-small btn-secondary" onClick={loadChildren} style={{ marginLeft: 8 }}>重试</button>
        </div>
      )}

      {/* 孩子切换/绑定 */}
      <div className="parent-header-actions">
        <div className="parent-child-selector">
          {children.length > 0 ? (
            children.map(c => (
              <button
                key={c.username}
                className={`parent-child-btn ${selectedChild === c.username ? 'active' : ''}`}
                onClick={() => setSelectedChild(c.username)}
              >
                👤 {c.displayName || c.username}
              </button>
            ))
          ) : (
            <span className="parent-no-child">还没有绑定孩子 👇</span>
          )}
        </div>
        <button className="btn btn-small btn-secondary" onClick={() => setBindMode(!bindMode)}>
          {bindMode ? '✕ 关闭' : '➕ 绑定'}
        </button>
      </div>

      {/* 绑定弹框 */}
      {bindMode && (
        <div className="parent-bind-box">
          <p className="parent-bind-hint">让孩子在"设置"中查看用户名，输入到这里即可绑定</p>
          <div className="parent-bind-input-row">
            <input
              type="text"
              value={inviteCode}
              onChange={e => setInviteCode(e.target.value)}
              placeholder="输入孩子的用户名（邀请码）"
              className="parent-bind-input"
              onKeyDown={e => e.key === 'Enter' && handleBind()}
            />
            <button className="btn btn-primary btn-small" onClick={handleBind}>绑定</button>
          </div>
          {bindMsg && <p className="parent-bind-msg">{bindMsg}</p>}
        </div>
      )}

      {/* 时间筛选 */}
      {selectedChild && (
        <div className="parent-days-filter">
          {[1, 3, 7, 14].map(d => (
            <button
              key={d}
              className={`parent-day-btn ${days === d ? 'active' : ''}`}
              onClick={() => setDays(d)}
            >{d === 1 ? '今天' : `${d}天`}</button>
          ))}
        </div>
      )}

      {/* 今日概览 */}
      {selectedChild && activities.length > 0 && (
        <div className="parent-overview-cards">
          <div className="parent-overview-card">
            <span className="parent-ov-num">{activities.filter(a => a.activity_type !== 'visit').length}</span>
            <span className="parent-ov-label">活动次数</span>
          </div>
          <div className="parent-overview-card">
            <span className="parent-ov-num">
              {new Set(activities.map(a => a.subject).filter(Boolean)).size}
            </span>
            <span className="parent-ov-label">科目数</span>
          </div>
          <div className="parent-overview-card">
            <span className="parent-ov-num">
              {formatDuration(activities.reduce((s, a) => s + (a.duration_seconds || 0), 0))}
            </span>
            <span className="parent-ov-label">总时长</span>
          </div>
        </div>
      )}

      {/* AI 相关数据 */}
      {selectedChild && analysis && (
        <>
          {renderDiagnosisOverview()}
          {renderHabitProgress()}
        </>
      )}

      {/* 掌握度 */}
      {selectedChild && masteryData && (
        <>
          {renderMasteryOverview()}
        </>
      )}

      {/* 图表区域 */}
      {selectedChild && analysis && (
        <>
          {renderDayChart()}
          {renderSubjectChart()}
          {renderGameChart()}
          {renderActivityTimeline()}
        </>
      )}

      {selectedChild && !analysis && activities.length === 0 && (
        <div className="parent-empty">
          <p>还没有学习记录</p>
          <p className="parent-empty-hint">让孩子先开始学习，这里就会出现统计数据了</p>
        </div>
      )}
    </div>
  );
}
