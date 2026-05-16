import { useState, useMemo, useEffect } from 'react';
import { useGame, getGradeMaxLevel } from '../store';
import { phrases, categories, scenarios, pronunciationTips } from '../data/cantonese';
import QuizGame from '../games/QuizGame';
import MatchGame from '../games/MatchGame';
import SortGame from '../games/SortGame';
import AudioGame from '../games/AudioGame';
import RewardModal from '../components/RewardModal';
import PetCompanion from '../components/PetCompanion';
import MistakeAnalysis from '../components/MistakeAnalysis';

const GAMES = [
  { id: 'match', label: '粤语小翻译', icon: '🔄' },
  { id: 'dialogue', label: '听力挑战', icon: '👂' },
  { id: 'listening', label: '听力理解', icon: '🔊' },
  { id: 'sort', label: '分类学习', icon: '📂' },
  { id: 'scenario', label: '情景对话', icon: '🎭' },
  { id: 'chat', label: 'AI自由对话', icon: '🤖', ai: true },
];

export default function CantoneseScreen({ onBack, onNavigate }) {
  const { state, dispatch } = useGame();
  const [gameMode, setGameMode] = useState(null);
  const [showReward, setShowReward] = useState(false);
  const [rewardCoins, setRewardCoins] = useState(0);
  const [category, setCategory] = useState('all');
  const [playerScore, setPlayerScore] = useState(0);
  const [playerTotal, setPlayerTotal] = useState(0);
  const [petMood, setPetMood] = useState('normal');
  const [petCelebrating, setPetCelebrating] = useState(false);
  const [petStatus, setPetStatus] = useState('');
  const [voicePlaying, setVoicePlaying] = useState(false);
  const [phrasesVisible, setPhrasesVisible] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);

  // 初始化语音引擎
  useEffect(() => {
    if (isVoiceSupported()) {
      initVoice();
      setVoiceSupported(true);
    } else {
      setVoiceSupported(false);
    }
  }, []);

  // 根据年级和已解锁进度筛选
  const gradeMax = getGradeMaxLevel(state.userGrade);
  const unlockedLevel = Math.min(state.cantoneseUnlocked, gradeMax);
  const availablePhrases = useMemo(() => {
    let filtered = phrases.filter(p => p.level <= unlockedLevel);
    if (category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }
    return filtered;
  }, [unlockedLevel, category]);

  // 生成选择题
  const quizQuestions = useMemo(() => {
    return availablePhrases.slice(0, 10).map(p => ({
      id: p.id,
      question: `"${p.mandarin}" 的粤语是？`,
      answer: p.cantonese,
      options: generateOptions(p),
      story: `团子想用粤语说"${p.mandarin}"，应该怎么说呢？`,
    }));
  }, [availablePhrases]);

  function generateOptions(correct) {
    const others = phrases
      .filter(p => p.id !== correct.id && p.category === correct.category)
      .map(p => p.cantonese);
    const shuffled = [...others].sort(() => Math.random() - 0.5).slice(0, 3);
    const all = [correct.cantonese, ...shuffled];
    return all.sort(() => Math.random() - 0.5);
  }

  // 配对游戏数据
  const matchPairs = useMemo(() => {
    return availablePhrases.slice(0, 6).map(p => ({
      id: p.id,
      left: p.mandarin,
      right: p.cantonese,
      leftLabel: '普通话',
      rightLabel: '粤语',
    }));
  }, [availablePhrases]);

  // 分类学习 (按主题分类粤语)
  const sortProblems = useMemo(() => {
    const catGroups = {};
    availablePhrases.forEach(p => {
      if (!catGroups[p.category]) catGroups[p.category] = [];
      catGroups[p.category].push(p);
    });
    const catKeys = Object.keys(catGroups).filter(k => catGroups[k].length >= 4).slice(0, 3);
    return catKeys.map((key, i) => {
      const pool = catGroups[key].slice(0, 6);
      const otherPool = availablePhrases.filter(p => p.category !== key);
      const shuffledOthers = [...otherPool].sort(() => Math.random() - 0.5).slice(0, 6 - pool.length);
      const catLabel = categories.find(c => c.id === key)?.name || key;
      const items = [
        ...pool.map((p, idx) => ({ id: `s${i}-${idx}`, label: p.cantonese, category: 'target' })),
        ...shuffledOthers.map((p, idx) => ({ id: `s${i}-o-${idx}`, label: p.cantonese, category: 'other' })),
      ];
      return {
        id: `SRT-${i + 1}`,
        question: `选出属于"${catLabel}"的粤语`,
        categories: [
          { id: 'target', label: catLabel },
          { id: 'other', label: '其他类别' },
        ],
        items,
      };
    });
  }, [availablePhrases]);

  // 听力理解题 (AudioGame)
  const audioQuestions = useMemo(() => {
    return availablePhrases.slice(0, 8).map(p => {
      const others = phrases
        .filter(x => x.id !== p.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(x => x.mandarin);
      const options = [p.mandarin, ...others].sort(() => Math.random() - 0.5);
      return {
        id: `AUD-${p.id}`,
        question: '听粤语，选正确的中文意思',
        audioText: p.cantonese,
        answer: p.mandarin,
        options,
      };
    });
  }, [availablePhrases]);

  function handleComplete(score, total) {
    setPlayerScore(score);
    setPlayerTotal(total);
    const coins = Math.round((score / total) * 10) + 2;
    setRewardCoins(coins);
    setShowReward(true);

    dispatch({
      type: 'COMPLETE_QUEST',
      payload: { subject: 'cantonese', score: coins, questionsDone: total },
    });

    // 解锁下一级
    if (score / total >= 0.7) {
      dispatch({ type: 'UNLOCK_LEVEL', payload: { subject: 'cantonese', level: unlockedLevel + 1 } });
    }
  }

  function handleRewardClose() {
    setShowReward(false);
    setGameMode(null);
  }

  function handleAnswer(correct, question) {
    if (correct) {
      setPetMood('happy');
      setPetCelebrating(true);
      setPetStatus('粤语答对了！好棒！🌟');
      setTimeout(() => { setPetCelebrating(false); }, 1500);
    } else {
      setPetMood('sad');
      setPetStatus('再想想~ 我教你读！');
      setTimeout(() => { setPetMood('normal'); setPetStatus(''); }, 2000);
      // 记录错题 — 从phrases数据查找category
      const phrase = phrases.find(p => p.id === question?.id);
      const category = phrase?.category || question?.category || 'daily';
      dispatch({
        type: 'RECORD_WRONG_ANSWER',
        payload: { subject: 'cantonese', category, questionId: question?.id || Date.now() },
      });
    }
  }

  // 朗读当前可用短语列表
  function speakPhrases() {
    if (voicePlaying) return;
    const texts = availablePhrases.slice(0, 6).map(p => p.cantonese);
    initVoice();
    setVoicePlaying(true);
    speakAll(texts, () => setVoicePlaying(false));
  }

  // 朗读单个文本（带视觉反馈）
  function speak(text) {
    if (voicePlaying) {
      window.speechSynthesis?.cancel();
      setVoicePlaying(false);
      return;
    }
    initVoice();
    speakCantonese(text);
    setVoicePlaying(true);
    // speech synthesis 结束时自动重置状态
    const checkPlaying = setInterval(() => {
      if (window.speechSynthesis && !window.speechSynthesis.speaking) {
        clearInterval(checkPlaying);
        setVoicePlaying(false);
      }
    }, 200);
    // 安全兜底：最长15秒后重置
    setTimeout(() => {
      clearInterval(checkPlaying);
      setVoicePlaying(false);
    }, 15000);
  }

  if (gameMode === 'match') {
    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={() => setGameMode(null)}>← 返回</button>
          <h2>粤语小翻译</h2>
          <div />
        </div>
        <PetCompanion mood={petMood} celebrating={petCelebrating} statusText={petStatus} interactive gazeTracking />
        <div className="voice-hint-game">
          🔊 点击卡片配对，完成后自动朗读粤语发音
        </div>
        <MatchGame
          pairs={matchPairs}
          leftLabel="普通话"
          rightLabel="粤语"
          onComplete={(score, total) => {
            handleComplete(score, total);
            // 完成后朗读所有粤语
            setTimeout(() => {
              speakAll(matchPairs.map(p => p.right));
            }, 500);
          }}
          onAnswer={handleAnswer}
        />
        <RewardModal
          show={showReward}
          coins={rewardCoins}
          score={playerScore}
          total={playerTotal}
          message="粤语又进步了！"
          onClose={handleRewardClose}
        />
      </div>
    );
  }

  if (gameMode === 'dialogue') {
    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={() => setGameMode(null)}>← 返回</button>
          <h2>听音辨义</h2>
          <div />
        </div>
        <PetCompanion mood={petMood} celebrating={petCelebrating} statusText={petStatus} interactive gazeTracking />
        <div className="voice-hint-game">
          🔊 答完每道题后自动朗读正确答案
        </div>
        <QuizGame
          questions={quizQuestions}
          onComplete={(score, total) => {
            handleComplete(score, total);
            // 完成后朗读正确答案
            setTimeout(() => {
              speakAll(quizQuestions.map(q => q.answer));
            }, 500);
          }}
          onAnswer={(correct, question) => {
            // 从phrases数据中获取category
            const phrase = phrases.find(p => p.id === question?.id);
            handleAnswer(correct, phrase || question);
            // 每道小题答完后播放正确粤语发音
            if (question?.answer) {
              initVoice();
              setTimeout(() => speakCantonese(question.answer), 300);
            }
          }}
          showStory
        />
        <RewardModal
          show={showReward}
          coins={rewardCoins}
          score={playerScore}
          total={playerTotal}
          message="粤语又进步了！"
          onClose={handleRewardClose}
        />
      </div>
    );
  }

  if (gameMode === 'sort') {
    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={() => setGameMode(null)}>← 返回</button>
          <h2>📂 分类学习</h2>
          <div />
        </div>
        <PetCompanion mood={petMood} celebrating={petCelebrating} statusText={petStatus} interactive gazeTracking />
        {sortProblems.length > 0 ? (
          <SortGame
            questions={sortProblems}
            onComplete={handleComplete}
            onAnswer={handleAnswer}
            title="粤语分类小能手！"
          />
        ) : (
          <div className="empty-state">先学习更多短语再来分类吧！</div>
        )}
        <RewardModal
          show={showReward}
          coins={rewardCoins}
          score={playerScore}
          total={playerTotal}
          message="分类完成！"
          onClose={handleRewardClose}
        />
      </div>
    );
  }

  if (gameMode === 'listening') {
    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={() => setGameMode(null)}>← 返回</button>
          <h2>🔊 听力理解</h2>
          <div />
        </div>
        <PetCompanion mood={petMood} celebrating={petCelebrating} statusText={petStatus} interactive gazeTracking />
        {audioQuestions.length > 0 ? (
          <AudioGame
            questions={audioQuestions}
            onComplete={handleComplete}
            onAnswer={handleAnswer}
            title="听粤语选答案！"
            lang="zh-HK"
          />
        ) : (
          <div className="empty-state">暂无听力题目，先学习一些短语吧！</div>
        )}
        <RewardModal
          show={showReward}
          coins={rewardCoins}
          score={playerScore}
          total={playerTotal}
          message="听力练习完成！"
          onClose={handleRewardClose}
        />
      </div>
    );
  }

  // 情景对话模式
  if (gameMode === 'scenario') {
    return <ScenarioMode scenarios={scenarios} handleComplete={handleComplete} onBack={() => setGameMode(null)} />;
  }

  return (
    <div className="screen">
      <div className="screen-header">
        <button className="btn-back" onClick={onBack}>← 主页</button>
        <h2>🗣️ 粤语区</h2>
        <div />
      </div>

      <div className="section-desc">
        <p>和团子一起学说粤语，交香港朋友！</p>
        <p className="level-info">当前等级 Lv.{unlockedLevel} | 共 {availablePhrases.length} 个常用语</p>
      </div>

      {/* 语音提示横幅 */}
      {voiceSupported ? (
        <div className="voice-hint-banner">
          <span className="voice-hint-icon">🔊</span>
          <span className="voice-hint-text">
            点击句子右边的 <span className="voice-hint-em">🔊</span> 听粤语发音，跟着读学得更快！
          </span>
          <button className="voice-test-btn" onClick={() => speak('你好，我係新嚟嘅同學。')}>
            试试听
          </button>
        </div>
      ) : (
        <div className="voice-hint-banner voice-unavailable">
          <span className="voice-hint-icon">⚠️</span>
          <span className="voice-hint-text">你的浏览器不支持语音播放，建议用 Chrome 或 Safari 浏览器打开哦</span>
        </div>
      )}

      {/* 分类筛选 */}
      <div className="category-filter">
        <button
          className={`cat-btn ${category === 'all' ? 'active' : ''}`}
          onClick={() => setCategory('all')}
        >全部</button>
        {categories.map(c => (
          <button
            key={c.id}
            className={`cat-btn ${category === c.id ? 'active' : ''}`}
            onClick={() => setCategory(c.id)}
          >{c.icon} {c.name}</button>
        ))}
      </div>

      {/* 游戏选择 */}
      <div className="game-select-list">
        {GAMES.map(g => (
          <button
            key={g.id}
            className={`game-select-card ${g.ai ? 'game-ai' : ''}`}
            onClick={() => g.ai ? onNavigate?.('ai-chat') : setGameMode(g.id)}
          >
            <span className="game-select-icon">{g.icon}</span>
            <span className="game-select-label">{g.label}</span>
            {g.ai && <span className="ai-badge">AI</span>}
            <span className="game-select-arrow">→</span>
          </button>
        ))}
      </div>

      {/* 错题分析 */}
      <MistakeAnalysis
        subject="cantonese"
        wrongRecords={state.wrongRecords.cantonese}
        categories={categories}
        onPractice={(catId) => {
          if (catId) setCategory(catId);
          setGameMode('dialogue');
        }}
      />

      {/* 常用语速查 */}
      <div className="phrase-reference">
        <div className="phrase-reference-header">
          <h3>📖 常用语参考</h3>
          <button className="phrase-speak-all" onClick={speakPhrases} disabled={voicePlaying}>
            {voicePlaying ? '🔊 朗读中…' : '🔊 全部朗读'}
          </button>
        </div>
        <div className="phrase-list">
          {availablePhrases.slice(0, 10).map(p => (
            <div key={p.id} className="phrase-item" onClick={() => speak(p.cantonese)}>
              <span className="phrase-mando">{p.mandarin}</span>
              <span className="phrase-arrow">→</span>
              <span className="phrase-canto">{p.cantonese}</span>
              <span className={`phrase-play ${voicePlaying ? 'phrase-playing' : ''}`}>
                {voicePlaying ? '🔈' : '🔊'}
              </span>
              <span className="phrase-tap-hint">{voicePlaying ? '播放中…' : '点击朗读'}</span>
            </div>
          ))}
        </div>
        {availablePhrases.length > 10 && (
          <button className="phrase-more-btn" onClick={() => setPhrasesVisible(!phrasesVisible)}>
            {phrasesVisible ? '△ 收起' : `▽ 查看全部 ${availablePhrases.length} 个常用语`}
          </button>
        )}
        {phrasesVisible && (
          <div className="phrase-list">
            {availablePhrases.slice(10).map(p => (
              <div key={p.id} className="phrase-item" onClick={() => speak(p.cantonese)}>
                <span className="phrase-mando">{p.mandarin}</span>
                <span className="phrase-arrow">→</span>
                <span className="phrase-canto">{p.cantonese}</span>
                <span className="phrase-play">🔊</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 发音小贴士 */}
      <div className="tips-section">
        <h3>💡 发音小贴士 <span className="tips-sub">点击例子听发音</span></h3>
        <div className="tips-list">
          {pronunciationTips.map(tip => (
            <div key={tip.id} className="tip-item">
              <span className="tip-title">{tip.title}</span>
              <span className="tip-desc">{tip.desc}</span>
              <span className="tip-example" onClick={() => speak(tip.example)} style={{ cursor: 'pointer' }}>
                {tip.example} 🔊
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===== 粤语语音引擎（支持Web Speech API） =====
let voiceReady = false;
let selectedVoice = null;
let voiceCallbacks = [];

// 初始化语音引擎
function initVoice() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
  if (voiceReady) return true;

  // 尝试获取粤语语音
  const tryLoadVoices = () => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      // 优先选 zh-HK，其次 zh-CN，任意中文也可以
      selectedVoice = voices.find(v => v.lang === 'zh-HK') ||
                      voices.find(v => v.lang.startsWith('zh-HK')) ||
                      voices.find(v => v.lang === 'zh-CN') ||
                      voices.find(v => v.lang.startsWith('zh'));
      voiceReady = true;
      // 执行等待中的回调
      voiceCallbacks.forEach(cb => cb(true));
      voiceCallbacks = [];
      return true;
    }
    return false;
  };

  if (tryLoadVoices()) return true;

  // 等待语音加载完成
  window.speechSynthesis.onvoiceschanged = () => {
    tryLoadVoices();
  };

  return true;
}

// 朗读单句粤语
function speakCantonese(text) {
  if (!text || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-HK';
    utterance.rate = 0.85;
    utterance.pitch = 1.1;
    utterance.volume = 1;
    if (selectedVoice) utterance.voice = selectedVoice;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('语音播放失败:', e.message);
  }
}

// 按顺序朗读多条
function speakAll(texts, onDone) {
  if (!texts?.length) { onDone?.(); return; }
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onDone?.();
    return;
  }
  try {
    window.speechSynthesis.cancel();
    let i = 0;
    function speakNext() {
      if (i >= texts.length) { onDone?.(); return; }
      const utterance = new SpeechSynthesisUtterance(texts[i]);
      utterance.lang = 'zh-HK';
      utterance.rate = 0.85;
      utterance.pitch = 1.1;
      if (selectedVoice) utterance.voice = selectedVoice;
      utterance.onend = () => {
        i++;
        setTimeout(speakNext, 300);
      };
      utterance.onerror = () => { i++; setTimeout(speakNext, 200); };
      window.speechSynthesis.speak(utterance);
    }
    speakNext();
  } catch (e) {
    console.warn('语音播放失败:', e.message);
    onDone?.();
  }
}

// 检查语音是否可用
function isVoiceSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

// 情景对话模式组件
function ScenarioMode({ scenarios, handleComplete, onBack }) {
  const [currentScene, setCurrentScene] = useState(null);
  const [sceneStep, setSceneStep] = useState(0);
  const [voicePlaying, setVoicePlaying] = useState(false);
  const [showMando, setShowMando] = useState(true);

  // 进入新一步时自动播放语音
  useEffect(() => {
    if (currentScene && currentScene.dialogues[sceneStep]) {
      initVoice();
      const text = currentScene.dialogues[sceneStep].cantonese;
      const t = setTimeout(() => {
        speakCantonese(text);
        setVoicePlaying(true);
        const checkTimer = setInterval(() => {
          if (window.speechSynthesis && !window.speechSynthesis.speaking) {
            clearInterval(checkTimer);
            setVoicePlaying(false);
          }
        }, 200);
      }, 400);
      return () => {
        clearTimeout(t);
        window.speechSynthesis?.cancel();
      };
    }
  }, [currentScene, sceneStep]);

  function speakDialogue(text) {
    initVoice();
    if (voicePlaying) {
      window.speechSynthesis?.cancel();
      setVoicePlaying(false);
      return;
    }
    speakCantonese(text);
    setVoicePlaying(true);
    const t = setInterval(() => {
      if (window.speechSynthesis && !window.speechSynthesis.speaking) {
        clearInterval(t);
        setVoicePlaying(false);
      }
    }, 200);
  }

  function speakAllDialogues() {
    initVoice();
    if (voicePlaying) {
      window.speechSynthesis?.cancel();
      setVoicePlaying(false);
      return;
    }
    const texts = currentScene.dialogues.map(d => d.cantonese);
    setVoicePlaying(true);
    speakAll(texts, () => setVoicePlaying(false));
  }

  if (!currentScene) {
    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={onBack}>← 返回</button>
          <h2>🎭 情景对话</h2>
          <div />
        </div>
        <div className="section-desc">
          <p>选一个场景，学习实用的粤语对话！</p>
          <p className="level-info">每句都有粤语发音，跟着读出来学得更快哦 🔊</p>
        </div>
        <div className="game-select-list">
          {scenarios.map(s => (
            <button
              key={s.id}
              className="game-select-card"
              onClick={() => { setCurrentScene(s); setSceneStep(0); }}
            >
              <span className="game-select-icon">{s.icon}</span>
              <span className="game-select-label">{s.title}</span>
              <span className="game-select-arrow">→</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const dialogue = currentScene.dialogues[sceneStep];
  const isLast = sceneStep >= currentScene.dialogues.length - 1;

  return (
    <div className="screen">
      <div className="screen-header">
        <button className="btn-back" onClick={() => setCurrentScene(null)}>← 换场景</button>
        <h2>{currentScene.icon} {currentScene.title}</h2>
        <div className="scenario-header-actions">
          <button
            className="scenario-speak-all-btn"
            onClick={speakAllDialogues}
            title="朗读全部对话"
          >
            {voicePlaying ? '⏹' : '🔊全部'}
          </button>
          <button className="btn btn-small btn-secondary" onClick={() => setShowMando(!showMando)}>
            {showMando ? '隐藏翻译' : '显示翻译'}
          </button>
        </div>
      </div>
      <div className="scenario-dialogues">
        {currentScene.dialogues.slice(0, sceneStep + 1).map((d, i) => (
          <div key={i} className={`scenario-line ${i === sceneStep ? 'active' : ''}`}>
            <span className="scenario-speaker">{d.speaker}</span>
            <div className="scenario-bubble" onClick={() => speakDialogue(d.cantonese)}>
              <span className="scenario-canto">{d.cantonese}</span>
              {showMando && <span className="scenario-mando">{d.mandarin}</span>}
            </div>
            <button
              className={`scenario-speaker-btn ${voicePlaying ? 'playing' : ''}`}
              onClick={() => speakDialogue(d.cantonese)}
              title="点击朗读"
            >
              {voicePlaying ? '🔈' : '🔊'}
            </button>
          </div>
        ))}
      </div>
      <div className="scenario-actions">
        <span className="scenario-progress">
          第 {sceneStep + 1} / {currentScene.dialogues.length} 句
        </span>
        {!isLast ? (
          <button className="btn btn-primary" onClick={() => setSceneStep(s => s + 1)}>
            下一句 →
          </button>
        ) : (
          <button className="btn btn-primary" onClick={() => {
            setCurrentScene(null);
            handleComplete(3, 3);
          }}>
            ✅ 完成对话
          </button>
        )}
      </div>
    </div>
  );
}
