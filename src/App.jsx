import { useState, useEffect } from 'react';
import { GameProvider, useGame, getGradeLabel, getAllGrades } from './store';
import Header from './components/Header';
import HomeScreen from './screens/HomeScreen';
import CantoneseScreen from './screens/CantoneseScreen';
import ChineseScreen from './screens/ChineseScreen';
import MathScreen from './screens/MathScreen';
import EnglishScreen from './screens/EnglishScreen';
import GSScreen from './screens/GSScreen';
import PetRoom from './screens/PetRoom';
import ShopScreen from './screens/ShopScreen';
import StatsScreen from './screens/StatsScreen';
import AIChatScreen from './screens/AIChatScreen';
import LoginScreen from './screens/LoginScreen';
import ParentDashboard from './screens/ParentDashboard';
import AITutorScreen from './screens/AITutorScreen';
import { getStoredUser, getToken, verifyToken, loadGameDataFromServer, saveGameDataToServer, logout as authLogout, parentRegister } from './api/auth';
import './App.css';

function AppContent() {
  const { state, dispatch } = useGame();
  const [screen, setScreen] = useState('home');
  // derived from state — cloud data loading后自动更新
  const showPetChoose = state.showTutorial;
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [parentMode, setParentMode] = useState(false);
  const [parentUsername, setParentUsername] = useState('');
  const [parentPassword, setParentPassword] = useState('');
  const [parentLoading, setParentLoading] = useState(false);
  const [parentError, setParentError] = useState('');
  const [reviewPreset, setReviewPreset] = useState(null);

  // 导航处理（支援预设参数）
  function handleNavigate(screen, params) {
    if (screen === 'tutor' && params?.subject) {
      setReviewPreset(params);
    } else {
      setReviewPreset(null);
    }
    setScreen(screen);
  }

  // 启动时检查登录状态
  useEffect(() => {
    async function checkAuth() {
      // 先检测后端是否可用
      try {
        const healthRes = await fetch('/api/health', { method: 'GET', signal: AbortSignal.timeout(3000) });
        const health = await healthRes.json();
        // 没有 D1 数据库 → 自动降级离线
        if (!health.db) throw new Error('No database');
      } catch {
        // 后端不可用或无数据库 → 离线模式（仅localStorage，无需登录）
        setUser({ username: 'local', displayName: '乐乐', tier: 'free', grade: state.userGrade });
        setAuthLoading(false);
        return;
      }

      const token = getToken();
      if (!token) {
        setAuthLoading(false);
        return;
      }

      // 有 token 验证有效性
      const storedUser = getStoredUser();
      const verified = await verifyToken();
      if (verified) {
        setUser(verified);
        // 加载云端数据
        const cloudData = await loadGameDataFromServer();
        if (cloudData && cloudData.pet) {
          dispatch({ type: 'INIT', payload: cloudData });
        }
      }
      setAuthLoading(false);
    }
    checkAuth();
  }, [dispatch]);

  // 登录/注册成功
  function handleLogin(userData) {
    setInitializing(true);

    loadGameDataFromServer().then(cloudData => {
      if (cloudData && Object.keys(cloudData).length > 1) {
        dispatch({ type: 'INIT', payload: cloudData });
      } else {
        const saved = localStorage.getItem('lele-island-data');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed.pet?.type) {
              dispatch({ type: 'INIT', payload: parsed });
            } else {
              localStorage.removeItem('lele-island-data');
              dispatch({ type: 'INIT', payload: null });
            }
          } catch {
            localStorage.removeItem('lele-island-data');
            dispatch({ type: 'INIT', payload: null });
          }
        } else {
          dispatch({ type: 'INIT', payload: null });
        }
      }

      // 硬编码测试账号：testadmin 自动开启免限制模式
      if (userData?.username === 'testadmin') {
        dispatch({ type: 'SET_TEST_ACCOUNT', payload: true });
      }

      setTimeout(() => {
        setUser(userData);
        setInitializing(false);
      }, 100);
    });
  }

  // 退出登录
  function handleLogout() {
    // 先保存当前数据
    if (state.pet) {
      saveGameDataToServer(state);
    }
    setUser(null);
    setShowSettings(false);
    authLogout();
    // 清除本地游戏数据和 token，刷新页面
    localStorage.removeItem('lele-island-data');
    window.location.reload();
  }

  // 自动保存到云端（每30秒或关键操作时）
  useEffect(() => {
    if (!user || !state.pet) return;
    const timer = setInterval(() => {
      saveGameDataToServer(state);
    }, 30000);
    return () => clearInterval(timer);
  }, [user, state]);

  // 页面切换时保存
  useEffect(() => {
    if (user && state.pet && state.pet.type) {
      saveGameDataToServer(state);
    }
  }, [screen, user]);

  const PET_OPTIONS = [
    { type: 'cat', emoji: '🐱', name: '小猫', color: '#FFB5C2' },
    { type: 'dog', emoji: '🐶', name: '小狗', color: '#FFDAA3' },
    { type: 'rabbit', emoji: '🐰', name: '小兔', color: '#FFB5E6' },
    { type: 'hamster', emoji: '🐹', name: '仓鼠', color: '#DDA0DD' },
  ];

  // 加载中或初始化中
  if (authLoading || initializing) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <span className="loading-icon">🏝️</span>
          <p>{initializing ? '正在准备你的小岛…' : '加载中…'}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // 宠物选择引导页
  if (showPetChoose) {
    return (
      <div className="tutorial-screen">
        <div className="tutorial-content">
          <div className="tutorial-title">🎉 欢迎来到乐乐小岛！</div>
          <div className="tutorial-subtitle">选一只小宠物陪你一起学习吧！</div>
          <div className="pet-choose-grid">
            {PET_OPTIONS.map(p => (
              <button
                key={p.type}
                className="pet-choose-card"
                onClick={() => {
                  dispatch({ type: 'CHOOSE_PET', payload: { type: p.type, color: p.color } });
                  dispatch({ type: 'DISMISS_TUTORIAL' });
                  dispatch({ type: 'ADD_COINS', payload: 10 });
                }}
              >
                <span className="pet-choose-emoji">{p.emoji}</span>
                <span className="pet-choose-name">{p.name}</span>
              </button>
            ))}
          </div>
          <div className="tutorial-hint">选好后会获得 10 金币启动资金哦！⭐</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header user={user} onSettings={() => setShowSettings(true)} />
      <main className="main-content">
        {screen === 'home' && <HomeScreen onNavigate={handleNavigate} />}
        {screen === 'cantonese' && <CantoneseScreen onBack={() => setScreen('home')} onNavigate={setScreen} />}
        {screen === 'chinese' && <ChineseScreen onBack={() => setScreen('home')} onNavigate={setScreen} />}
        {screen === 'math' && <MathScreen onBack={() => setScreen('home')} />}
        {screen === 'english' && <EnglishScreen onBack={() => setScreen('home')} />}
        {screen === 'gs' && <GSScreen onBack={() => setScreen('home')} />}
        {screen === 'pet-room' && <PetRoom onBack={() => setScreen('home')} />}
        {screen === 'shop' && <ShopScreen onBack={() => setScreen('home')} />}
        {screen === 'stats' && <StatsScreen onBack={() => setScreen('home')} />}
        {screen === 'ai-chat' && <AIChatScreen onBack={() => setScreen('home')} />}
        {screen === 'parent' && <ParentDashboard onBack={() => setScreen('home')} />}
        {screen === 'tutor' && <AITutorScreen onBack={() => { setReviewPreset(null); setScreen('home'); }} preset={reviewPreset} />}
      </main>
      <nav className="bottom-nav">
        {[
          { key: 'home', icon: '🏝️', label: '小岛' },
          { key: 'pet-room', icon: '🐾', label: '宠物' },
          { key: 'tutor', icon: '🧑‍🏫', label: 'AI助教' },
          { key: 'shop', icon: '🛒', label: '商店' },
          { key: 'stats', icon: '🏆', label: '成就' },
        ].map(tab => (
          <button
            key={tab.key}
            className={`nav-btn ${screen === tab.key ? 'active' : ''}`}
            onClick={() => setScreen(tab.key)}
          >
            <span className="nav-icon">{tab.icon}</span>
            <span className="nav-label">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* 设置面板 */}
      {showSettings && (
        <div className="settings-overlay" onClick={() => setShowSettings(false)}>
          <div className="settings-panel" onClick={e => e.stopPropagation()}>
            <h3>⚙️ 设置</h3>
            <div className="settings-info">
              <p>账号：{user.username}</p>
              <p>会员：{user.tier === 'premium' ? '🌟 高级会员' : '免费用户'}</p>
            </div>

            {/* 年级选择 */}
            <div className="settings-section">
              <label className="settings-label">📚 你的年级</label>
              <div className="grade-grid">
                {getAllGrades().map(g => (
                  <button
                    key={g.id}
                    className={`grade-btn ${state.userGrade === g.id ? 'active' : ''}`}
                    onClick={() => dispatch({ type: 'SET_GRADE', payload: g.id })}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
              <p className="settings-hint">内容会根据年级自动调整难度</p>
            </div>

            <div className="settings-section">
              <label className="settings-label">💾 数据迁移</label>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button className="btn btn-small btn-secondary" onClick={() => {
                  const data = localStorage.getItem('lele-island-data');
                  if (!data) { alert('没有找到游戏数据'); return; }
                  const blob = new Blob([data], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url; a.download = `lele-island-backup-${new Date().toISOString().slice(0, 10)}.json`;
                  a.click(); URL.revokeObjectURL(url);
                }} style={{ flex: 1, fontSize: 12, padding: '6px 4px' }}>
                  📤 导出数据
                </button>
                <label className="btn btn-small btn-secondary" style={{ flex: 1, fontSize: 12, padding: '6px 4px', textAlign: 'center', cursor: 'pointer' }}>
                  📥 导入数据
                  <input type="file" accept=".json" style={{ display: 'none' }} onChange={e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      try {
                        const data = JSON.parse(ev.target.result);
                        if (!data.pet) { alert('无效的备份文件'); return; }
                        localStorage.setItem('lele-island-data', JSON.stringify(data));
                        alert('导入成功！即将刷新页面…');
                        window.location.reload();
                      } catch { alert('文件格式错误'); }
                    };
                    reader.readAsText(file);
                  }} />
                </label>
              </div>
              <p className="settings-hint">在旧域名导出 → 新域名导入，数据无缝迁移</p>
            </div>

            {/* 邀请码展示（孩子共享给家长） */}
            <div className="settings-section">
              <label className="settings-label">🔑 邀请码（共享给家长）</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <code style={{ flex: 1, padding: '8px 12px', background: '#f8f4f8', borderRadius: 'var(--radius-sm)', fontSize: 16, fontWeight: 700, color: 'var(--pink)', textAlign: 'center' }}>
                  {user?.username || 'local'}
                </code>
                <button className="btn btn-small btn-secondary" onClick={() => {
                  navigator.clipboard?.writeText(user?.username || 'local');
                  alert('已复制邀请码 📋');
                }}>复制</button>
              </div>
              <p className="settings-hint">家长在"家长中心"输入此邀请码即可查看你的学习报告</p>
            </div>

            {/* 家长控制 — 只读提示，修改请在家长中心 */}
            <div className="settings-section">
              <label className="settings-label">🔒 学习-玩耍循环</label>
              <div style={{ padding: '10px 12px', background: '#FFF8E1', borderRadius: 'var(--radius-sm)', fontSize: 13, color: '#F57F17', lineHeight: 1.5, marginTop: 4 }}>
                📚 每轮学 <b>{state.studySessionMinutes || 25}</b> 分钟
                &nbsp;→&nbsp; 🎾 玩 <b>{state.playSessionMinutes || 10}</b> 分钟
                <div style={{ marginTop: 6, fontSize: 12, opacity: 0.8 }}>👨‍👩‍👧 需要家长在「家长中心」修改</div>
              </div>
            </div>

            <div className="settings-section">
              <label className="settings-label">👨‍👩‍👧 家长中心</label>
              {!parentMode ? (
                <button className="btn btn-secondary" onClick={() => setParentMode(true)} style={{ width: '100%' }}>
                  📊 查看孩子学习报告
                </button>
              ) : (
                <div className="parent-settings-form" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <p style={{ fontSize: 13, color: 'var(--text-light)' }}>首次使用请注册家长账号，然后将孩子的用户名作为邀请码绑定</p>
                  {parentError && <p style={{ fontSize: 13, color: '#D44' }}>{parentError}</p>}
                  <input
                    type="text"
                    placeholder="家长用户名"
                    value={parentUsername}
                    onChange={e => setParentUsername(e.target.value)}
                    style={{ padding: '8px 12px', border: '2px solid var(--pink-light)', borderRadius: 'var(--radius-sm)', fontSize: 14, fontFamily: 'var(--font)' }}
                  />
                  <input
                    type="password"
                    placeholder="密码"
                    value={parentPassword}
                    onChange={e => setParentPassword(e.target.value)}
                    style={{ padding: '8px 12px', border: '2px solid var(--pink-light)', borderRadius: 'var(--radius-sm)', fontSize: 14, fontFamily: 'var(--font)' }}
                  />
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      className="btn btn-primary btn-small"
                      disabled={parentLoading || !parentUsername || !parentPassword}
                      onClick={async () => {
                        setParentLoading(true);
                        setParentError('');
                        try {
                          await parentRegister(parentUsername, parentPassword, '家长');
                          setShowSettings(false);
                          setParentMode(false);
                          setScreen('parent');
                        } catch (e) {
                          setParentError(e.message);
                        }
                        setParentLoading(false);
                      }}
                      style={{ flex: 1 }}
                    >{parentLoading ? '处理中…' : '注册家长账号'}</button>
                  </div>
                  <button
                    className="btn btn-small btn-secondary"
                    onClick={() => {
                      setParentMode(false);
                      setScreen('parent');
                      setShowSettings(false);
                    }}
                    style={{ fontSize: 12 }}
                  >
                    我已注册，直接查看 →
                  </button>
                  <button
                    className="btn btn-small"
                    onClick={() => setParentMode(false)}
                    style={{ fontSize: 12, color: 'var(--text-light)' }}
                  >
                    取消
                  </button>
                </div>
              )}
            </div>

            {state.isTestAccount && (
              <div className="settings-section">
                <label className="settings-label">🧪 测试模式</label>
                <div style={{ padding: '10px 12px', background: '#FFF8E1', borderRadius: 'var(--radius-sm)', fontSize: 13, color: '#F57F17', lineHeight: 1.5, marginTop: 4 }}>
                  ✅ 测试账号 <b>testadmin</b> 已登录，跳过所有学习/激活限制
                </div>
              </div>
            )}

            <button className="btn btn-secondary" onClick={handleLogout} style={{ width: '100%', marginTop: 12 }}>
              退出登录
            </button>
            <button className="btn btn-primary" onClick={() => setShowSettings(false)} style={{ width: '100%', marginTop: 8 }}>
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
