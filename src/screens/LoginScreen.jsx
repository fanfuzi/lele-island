import { useState } from 'react';
import { login, register } from '../api/auth';
import { getAllGrades } from '../store';

const GREETINGS = ['🌟 欢迎来到乐乐小岛！', '🌈 和团子一起学习吧！', '🎠 在这里快乐成长！', '🦋 每一天都是新的冒险！'];

export default function LoginScreen({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [grade, setGrade] = useState('p3');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [greeting] = useState(() => GREETINGS[Math.floor(Math.random() * GREETINGS.length)]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let user;
      if (mode === 'login') {
        user = await login(username, password);
      } else {
        user = await register(username, password, displayName || username, grade);
      }
      onLogin(user);
    } catch (err) {
      setError(err.message || '哎呀，出错了，再试试吧！');
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
  }

  const grades = getAllGrades();

  return (
    <div className="login-screen">
      {/* 漂浮装饰 */}
      <div className="login-floating-decor">
        <span className="float-item float-1">🌸</span>
        <span className="float-item float-2">⭐</span>
        <span className="float-item float-3">🦋</span>
        <span className="float-item float-4">🌈</span>
        <span className="float-item float-5">🎈</span>
        <span className="float-item float-6">🍀</span>
      </div>

      <div className="login-card">
        {/* 宠物和欢迎语 */}
        <div className="login-welcome">
          <div className="login-pet">
            <span className="login-pet-body">🐱</span>
            <span className="login-pet-hand left">🤚</span>
            <span className="login-pet-hand right">🤚</span>
          </div>
          <h1 className="login-title-text">乐乐小岛</h1>
          <p className="login-greeting">{greeting}</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <h2 className="login-form-title">
            {mode === 'login' ? '👋 欢迎回来！' : '🎉 加入我们！'}
          </h2>

          {error && <div className="login-error">😅 {error}</div>}

          {/* 用户名 */}
          <div className="login-field">
            <label>📝 给自己取个名字吧</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder={mode === 'register' ? '起一个酷酷的昵称（2-20个字）' : '输入你的用户名'}
              maxLength={20}
              required
              autoFocus
            />
          </div>

          {/* 昵称（注册时显示） */}
          {mode === 'register' && (
            <div className="login-field">
              <label>🏷️ 给宠物起个名字（可选）</label>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="比如：团子、小咪…"
                maxLength={10}
              />
            </div>
          )}

          {/* 密码 */}
          <div className="login-field">
            <label>🔒 设置一个密码</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={mode === 'register' ? '至少4个字符，要记牢哦！' : '输入你的密码'}
              minLength={4}
              required
            />
          </div>

          {/* 年级选择（注册时显示） */}
          {mode === 'register' && (
            <div className="login-field">
              <label>📚 你读几年级啦？</label>
              <div className="login-grade-grid">
                {grades.map(g => (
                  <button
                    key={g.id}
                    type="button"
                    className={`login-grade-btn ${grade === g.id ? 'active' : ''}`}
                    onClick={() => setGrade(g.id)}
                  >
                    {g.id.startsWith('p') ? '🎒' : '📖'} {g.label}
                  </button>
                ))}
              </div>
              <p className="login-field-hint">选好年级，学习内容就会自动匹配哦！</p>
            </div>
          )}

          <button
            type="submit"
            className="login-btn"
            disabled={loading || !username || !password}
          >
            {loading ? (
              <span className="login-loading">⏳ 等一下下…</span>
            ) : mode === 'login' ? (
              '🚀 出发！'
            ) : (
              '🎊 创建我的小岛！'
            )}
          </button>

          <div className="login-switch">
            {mode === 'login' ? (
              <span>还没有小岛？<button type="button" className="link-btn" onClick={switchMode}>✨ 马上注册</button></span>
            ) : (
              <span>已经有小岛了？<button type="button" className="link-btn" onClick={switchMode}>🏝️ 去登录</button></span>
            )}
          </div>
        </form>

        <div className="login-footer">
          <p>💖 你的学习进度会自动保存在云端哦！</p>
          <button
            type="button"
            className="link-btn"
            style={{ marginTop: 8, fontSize: 13, opacity: 0.6 }}
            onClick={() => onLogin({ username: 'local', displayName: '乐乐', tier: 'free' })}
          >🏝️ 离线模式（不登录直接使用）</button>
        </div>
      </div>
    </div>
  );
}
