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
import { getStoredUser, getToken, verifyToken, loadGameDataFromServer, saveGameDataToServer, logout as authLogout } from './api/auth';
import './App.css';

function AppContent() {
  const { state, dispatch } = useGame();
  const [screen, setScreen] = useState('home');
  const [showPetChoose, setShowPetChoose] = useState(state.showTutorial);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [initializing, setInitializing] = useState(false);

  // 启动时检查登录状态
  useEffect(() => {
    async function checkAuth() {
      // 先检测后端是否可用
      try {
        const healthRes = await fetch('/api/health', { method: 'GET', signal: AbortSignal.timeout(3000) });
        if (!healthRes.ok) throw new Error('Backend unavailable');
      } catch {
        // 后端不可用 → 离线模式（仅localStorage，无需登录）
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
    // 先彻底清除本地旧数据
    localStorage.removeItem('lele-island-data');
    dispatch({ type: 'INIT', payload: null });

    loadGameDataFromServer().then(cloudData => {
      if (cloudData && Object.keys(cloudData).length > 1) {
        dispatch({ type: 'INIT', payload: cloudData });
      }
      // 给 store 一点时间写入 localStorage
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
                  setShowPetChoose(false);
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
        {screen === 'home' && <HomeScreen onNavigate={setScreen} />}
        {screen === 'cantonese' && <CantoneseScreen onBack={() => setScreen('home')} onNavigate={setScreen} />}
        {screen === 'chinese' && <ChineseScreen onBack={() => setScreen('home')} onNavigate={setScreen} />}
        {screen === 'math' && <MathScreen onBack={() => setScreen('home')} onNavigate={setScreen} />}
        {screen === 'english' && <EnglishScreen onBack={() => setScreen('home')} />}
        {screen === 'gs' && <GSScreen onBack={() => setScreen('home')} />}
        {screen === 'pet-room' && <PetRoom onBack={() => setScreen('home')} />}
        {screen === 'shop' && <ShopScreen onBack={() => setScreen('home')} />}
        {screen === 'stats' && <StatsScreen onBack={() => setScreen('home')} />}
        {screen === 'ai-chat' && <AIChatScreen onBack={() => setScreen('home')} />}
      </main>
      <nav className="bottom-nav bottom-nav-scroll">
        {[
          { key: 'home', icon: '🏠', label: '小岛' },
          { key: 'cantonese', icon: '🗣️', label: '粤语' },
          { key: 'chinese', icon: '✍️', label: '汉字' },
          { key: 'math', icon: '🔢', label: '数学' },
          { key: 'english', icon: '🔤', label: '英文' },
          { key: 'gs', icon: '🌍', label: '常识' },
          { key: 'pet-room', icon: '🏠', label: '宠物' },
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
