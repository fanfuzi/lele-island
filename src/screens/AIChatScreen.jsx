import { useState, useRef, useEffect } from 'react';
import { useGame, getPetEmoji } from '../store';
import { chatCantonese, checkAIStatus } from '../api';
import { logActivity } from '../utils/activityLog';

const SCENARIO_TEMPLATES = [
  { id: 'greet', label: '打招呼', icon: '👋', prompt: '一个香港小学三年级的小朋友和你第一次见面，她在和你打招呼说"你好"。请用粤语回应，并配合普通话翻译。' },
  { id: 'friend', label: '交朋友', icon: '🤝', prompt: '你是香港一个小学三年级的学生，你想和这个新来的同学交朋友。用粤语问她问题，比如她叫什么名字、喜欢什么。每个粤语句子后面加上普通话翻译。' },
  { id: 'snack', label: '去小卖部', icon: '🍜', prompt: '你和同学一起去学校小卖部。用粤语和她对话，帮她点东西。每个粤语句子后面加上普通话翻译。' },
  { id: 'play', label: '一起玩', icon: '🎮', prompt: '下课了，你想邀请新同学一起玩。用粤语和她聊天，问问她喜欢玩什么。每个粤语句子后面加上普通话翻译。' },
];

// 本地兜底回复
const FALLBACK_REPLIES = [
  { text: '你好！你叫咩名呀？', translation: '你好！你叫什么名字？' },
  { text: '我鍾意畫畫，你呢？', translation: '我喜欢画画，你呢？' },
  { text: '一齊去小賣部啦！', translation: '一起去小卖部吧！' },
  { text: '你住喺邊度㗎？', translation: '你住在哪里呀？' },
  { text: '我哋一齊玩好唔好？', translation: '我们一起玩好不好？' },
  { text: '你鍾意食咩嘢？', translation: '你喜欢吃什么？' },
  { text: '你今日有咩堂？', translation: '你今天有什么课？' },
  { text: '慢慢嚟，唔使急！', translation: '慢慢来，不用急！' },
  { text: '你好叻啊！', translation: '你好厉害啊！' },
];

export default function AIChatScreen({ onBack }) {
  const { state, dispatch } = useGame();
  const [scenario, setScenario] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiAvailable, setAiAvailable] = useState(true);
  const [coins, setCoins] = useState(0);
  const chatEndRef = useRef(null);

  // 检查AI状态
  useEffect(() => {
    checkAIStatus().then(available => {
      setAiAvailable(available);
    });
  }, []);

  // 自动滚动
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 初始化场景
  function startScenario(s) {
    setScenario(s);
    const initialMsg = {
      role: 'assistant',
      text: s.icon + ' ' + s.label + '时间！\n和团子一起练习粤语对话吧！',
      translation: '',
    };
    setMessages([initialMsg]);
    setCoins(0);
  }

  // 发送消息
  async function sendMessage(userText) {
    if (!userText.trim() || isLoading) return;

    const newMsg = { role: 'user', text: userText, translation: '' };
    const updated = [...messages, newMsg];
    setMessages(updated);
    setInput('');
    setIsLoading(true);

    // 获取AI回复
    let reply;
    if (aiAvailable) {
      const chatMessages = updated.map(m => ({
        role: m.role,
        content: m.role === 'system' ? m.text : `[${m.role === 'user' ? '学生' : 'AI'}] ${m.text}${m.translation ? ' (' + m.translation + ')' : ''}`
      }));
      reply = await chatCantonese(chatMessages, state.cantoneseUnlocked);
    }

    if (reply) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: reply.split('(')[0].trim(),
        translation: reply.includes('(') ? reply.match(/\(([^)]+)\)/)?.[1] || '' : '',
      }]);
    } else {
      // 本地兜底
      const fallback = FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)];
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'assistant',
          text: fallback.text,
          translation: fallback.translation,
        }]);
      }, 800);
    }

    setIsLoading(false);

    // 记录对话活动
    logActivity({ type: 'chat', subject: 'cantonese', gameType: 'chat', metadata: { messages: messages.length + 1 } });

    // 对话奖励
    setCoins(c => c + 1);
  }

  // 快速回复建议
  const quickReplies = [
    '你好！', '我係新嚟嘅同學。', '好呀！', '我鍾意畫畫。',
    '唔該晒！', '一齊玩啦！', '我明啦！', '好開心！',
  ];

  return (
    <div className="screen">
      <div className="screen-header">
        <button className="btn-back" onClick={onBack}>← 主页</button>
        <h2>🤖 AI粤语聊天</h2>
        <div className="header-coin">⭐ +{coins}</div>
      </div>

      {!scenario ? (
        <div className="scenario-select">
          <div className="section-desc">
            <p>选一个场景，和AI朋友用粤语聊天吧！</p>
            {!aiAvailable && (
              <p className="ai-offline">⚠️ AI服务未连接，使用本地模式</p>
            )}
          </div>
          {SCENARIO_TEMPLATES.map(s => (
            <button
              key={s.id}
              className="scenario-card"
              onClick={() => startScenario(s)}
            >
              <span className="scenario-icon">{s.icon}</span>
              <div className="scenario-info">
                <span className="scenario-label">{s.label}</span>
                <span className="scenario-desc">和AI练习粤语对话</span>
              </div>
              <span className="scenario-arrow">→</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="chat-container">
          <div className="chat-header">
            <span>{scenario.icon} {scenario.label}</span>
            <button className="btn btn-small btn-secondary" onClick={() => setScenario(null)}>
              换场景
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.role}`}>
                <div className="chat-msg-avatar">
                  {msg.role === 'assistant' ? '🤖' : '👧'}
                </div>
                <div className="chat-msg-bubble">
                  <div className="chat-msg-text">{msg.text}</div>
                  {msg.translation && (
                    <div className="chat-msg-translation">{msg.translation}</div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="chat-msg assistant">
                <div className="chat-msg-avatar">🤖</div>
                <div className="chat-msg-bubble thinking">思考中...</div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* 快速回复 */}
          <div className="quick-replies">
            {quickReplies.map((qr, i) => (
              <button
                key={i}
                className="quick-reply-btn"
                onClick={() => sendMessage(qr)}
                disabled={isLoading}
              >
                {qr}
              </button>
            ))}
          </div>

          {/* 输入框 */}
          <div className="chat-input-area">
            <input
              type="text"
              className="chat-input"
              placeholder="输入你想说的话..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
              disabled={isLoading}
            />
            <button
              className="btn btn-primary chat-send"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
            >
              发送
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
