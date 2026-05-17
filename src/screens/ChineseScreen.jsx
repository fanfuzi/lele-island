import { useState, useMemo, useCallback } from 'react';
import { useGame, getGradeMaxLevel } from '../store';
import { charGroups, characters, quizPairs } from '../data/characters';
import { getEncouragement } from '../api';
import { speakChar } from '../utils/speech';
import MatchGame from '../games/MatchGame';
import WritingCanvas from '../games/WritingCanvas';
import OrderGame from '../games/OrderGame';
import GridGame from '../games/GridGame';
import SortGame from '../games/SortGame';
import RewardModal from '../components/RewardModal';
import PetCompanion from '../components/PetCompanion';
import MistakeAnalysis from '../components/MistakeAnalysis';
import { logActivity } from '../utils/activityLog';

const GAMES = [
  { id: 'match', label: '字卡配对', icon: '🀄' },
  { id: 'write', label: '写字练习', icon: '✏️' },
  { id: 'grid', label: '记忆翻牌', icon: '🎴' },
  { id: 'order', label: '笔画排序', icon: '🔢' },
  { id: 'sort', label: '部首分类', icon: '📂' },
  { id: 'ai-practice', label: 'AI智能练字', icon: '🤖', ai: true },
];

export default function ChineseScreen({ onBack }) {
  const { state, dispatch } = useGame();
  const [gameMode, setGameMode] = useState(null);
  const [showReward, setShowReward] = useState(false);
  const [rewardCoins, setRewardCoins] = useState(0);
  const [group, setGroup] = useState('all');
  const [playerScore, setPlayerScore] = useState(0);
  const [playerTotal, setPlayerTotal] = useState(0);
  const [currentWriteChar, setCurrentWriteChar] = useState(null);
  const [petMood, setPetMood] = useState('normal');
  const [petCelebrating, setPetCelebrating] = useState(false);
  const [petStatus, setPetStatus] = useState('');
  const [writeReward, setWriteReward] = useState(null);
  const [writeMode, setWriteMode] = useState('dictation');   // 'copy' | 'dictation'
  const [writeTab, setWriteTab] = useState('saved');  // 'grid' | 'saved'

  const gradeMax = getGradeMaxLevel(state.userGrade);
  const unlockedLevel = Math.min(state.chineseUnlocked, gradeMax);

  // 当前学习的字
  const availableChars = useMemo(() => {
    let filtered = characters.filter(c => c.level <= unlockedLevel);
    if (group !== 'all') {
      filtered = filtered.filter(c => c.group === group);
    }
    return filtered;
  }, [unlockedLevel, group]);

  // 配对数据 (只选简繁不同的)
  const matchData = useMemo(() => {
    return quizPairs
      .filter(p => p.level <= unlockedLevel)
      .slice(0, 6)
      .map(p => ({
        id: p.id,
        left: p.simplified,
        right: p.traditional,
        leftLabel: '简体',
        rightLabel: '繁体',
        group: p.group,
      }));
  }, [unlockedLevel]);

  // 写字练习用的字
  const writeChars = useMemo(() => {
    return availableChars.slice(0, 10);
  }, [availableChars]);

  // 收藏的字
  const savedChars = useMemo(() => {
    return characters.filter(c => state.savedChars.includes(c.id));
  }, [state.savedChars]);

  // 记忆配对 (简繁配对)
  const gridMatchProblems = useMemo(() => {
    const groups = [];
    const pool = availableChars.filter(c => c.simplified !== c.traditional);
    for (let i = 0; i < Math.min(4, Math.floor(pool.length / 4)); i++) {
      const batch = pool.slice(i * 4, i * 4 + 4);
      if (batch.length < 4) break;
      const pairs = batch.flatMap(c => [
        { pairId: c.simplified, label: c.simplified },
        { pairId: c.simplified, label: c.traditional },
      ]);
      groups.push({
        id: `GRID-${i + 1}`,
        question: '找出简体和繁体字的配对',
        items: pairs,
        cols: 4,
      });
    }
    return groups;
  }, [availableChars]);

  // 笔顺排序
  const orderStrokeProblems = useMemo(() => {
    const pool = availableChars.filter(c => c.stroke).slice(0, 16);
    const groups = [];
    for (let i = 0; i < Math.min(3, Math.floor(pool.length / 5)); i++) {
      const batch = pool.slice(i * 5, i * 5 + 5);
      if (batch.length < 3) break;
      const withIdx = batch.map((c, idx) => ({ char: c.simplified, stroke: c.stroke, origIdx: idx }));
      const sorted = [...withIdx].sort((a, b) => a.stroke - b.stroke);
      const correctOrder = sorted.map(item => item.origIdx);
      groups.push({
        id: `ORD-${i + 1}`,
        question: '请按笔画从少到多排列',
        items: withIdx.map(c => c.char),
        correctOrder,
        hint: '先数数每个字有几画',
      });
    }
    return groups;
  }, [availableChars]);

  // 部首分类
  const sortRadicalProblems = useMemo(() => {
    const groups = {};
    availableChars.forEach(c => {
      if (!groups[c.group]) groups[c.group] = [];
      groups[c.group].push(c);
    });
    const catKeys = Object.keys(groups).filter(k => groups[k].length >= 3).slice(0, 3);
    return catKeys.map((key, i) => {
      const groupInfo = charGroups.find(g => g.id === key);
      const groupName = groupInfo?.name || key;
      const chars = groups[key].slice(0, 6);
      const otherChars = availableChars
        .filter(c => c.group !== key)
        .slice(0, 6 - chars.length);
      const items = [
        ...chars.map((c, idx) => ({ id: `s${i}-${idx}`, label: c.simplified, category: 'target' })),
        ...otherChars.map((c, idx) => ({ id: `s${i}-o-${idx}`, label: c.simplified, category: 'other' })),
      ];
      return {
        id: `SRT-${i + 1}`,
        question: `找出属于"${groupName}"的字`,
        categories: [
          { id: 'target', label: groupName },
          { id: 'other', label: '其他分类' },
        ],
        items,
      };
    });
  }, [availableChars]);

  function handleMatchComplete(score, total) {
    setPlayerScore(score);
    setPlayerTotal(total);
    const coins = Math.round((score / total) * 10) + 2;
    setRewardCoins(coins);
    setShowReward(true);

    dispatch({
      type: 'COMPLETE_QUEST',
      payload: { subject: 'chinese', score: coins, questionsDone: total },
    });

    if (score / total >= 0.7) {
      dispatch({ type: 'UNLOCK_LEVEL', payload: { subject: 'chinese', level: unlockedLevel + 1 } });
    }

    logActivity({ type: 'game', subject: 'chinese', gameType: gameMode, score: Math.round((score / total) * 100), total, correct: score });
  }

  // 防刷星：练习次数越多奖励越少
  function getFarmMultiplier(charId) {
    const count = state.writtenCharCounts[charId] || 0;
    if (count < 2) return 1.0;   // 前2次全额
    if (count < 4) return 0.5;   // 3-4次减半
    return 0;                    // 5次以上无奖励
  }

  function handleWriteComplete(charScore) {
    const charId = currentWriteChar?.id;
    if (!charId) return;

    // 记录练习次数
    dispatch({ type: 'RECORD_WRITTEN_CHAR', payload: charId });

    const multiplier = getFarmMultiplier(charId);

    // 默写模式：分数不足60自动收藏，方便针对性练习
    if (writeMode === 'dictation' && charScore < 60 && !state.savedChars.includes(charId)) {
      dispatch({ type: 'SAVE_CHAR', payload: charId });
    }

    // 分数低于 60 或防刷归零 → 不给奖励
    if (charScore < 60 || multiplier === 0) {
      const isFarmed = multiplier === 0 && charScore >= 60;
      setWriteReward({ score: charScore, coins: 0, stars: 0, charId, isFarmed });
      if (charScore < 60) {
        setPetMood('sad');
        setPetStatus(writeMode === 'dictation' ? '这个字收藏了，下次再练练！📝' : '再认真一点，慢慢写~✍️');
        setTimeout(() => { setPetMood('normal'); setPetStatus(''); }, 3000);
      } else {
        setPetMood('normal');
        setPetStatus('这个字已经练过很多次了，试下一个新字吧！📖');
        setTimeout(() => setPetStatus(''), 3000);
      }
      return;
    }

    // 基础奖励（按笔画数加权，鼓励写难字）
    const strokeBonus = Math.min(3, Math.floor((currentWriteChar.stroke || 5) / 5));
    const baseCoins = charScore >= 90 ? 6 : charScore >= 80 ? 3 : charScore >= 70 ? 1 : 0;
    const coinReward = Math.max(0, Math.round((baseCoins + strokeBonus) * multiplier));
    const stars = charScore >= 90 ? 3 : charScore >= 80 ? 2 : charScore >= 70 ? 1 : 0;

    if (coinReward > 0) {
      dispatch({ type: 'ADD_COINS', payload: coinReward });
    }

    // 尝试AI鼓励语
    if (charScore >= 50) {
      getEncouragement({ lastScore: charScore, subject: 'writing' }).then(msg => {
        if (msg) {
          setPetStatus(msg);
          setTimeout(() => setPetStatus(''), 4000);
        }
      });
    }

    // 记录练字活动
    logActivity({ type: 'practice', subject: 'chinese', gameType: 'writing', score: charScore });

    // 弹出练字奖励
    setWriteReward({ score: charScore, coins: coinReward, stars, charId, isFarmed: false });

    // 宠物庆祝
    if (coinReward > 0) {
      setPetMood('happy');
      setPetCelebrating(true);
      const starMsgs = ['继续加油！💪', '写得不错！🌟', '字写得真好看！🎉'];
      if (!petStatus) setPetStatus(starMsgs[stars - 1] || starMsgs[0]);
      setTimeout(() => {
        setPetCelebrating(false);
        setPetMood('normal');
        if (petStatus.includes('🎉') || petStatus.includes('🌟') || petStatus.includes('💪')) setPetStatus('');
      }, 3000);
    }
  }

  // 收藏/取消收藏字
  function toggleSaveChar(charId) {
    dispatch({ type: 'SAVE_CHAR', payload: charId });
  }

  // 播放字音（默写模式）
  function playCharAudio(char) {
    speakChar(char.traditional, { lang: 'zh-HK', rate: 0.7 });
  }

  function handleWriteRewardClose() {
    setWriteReward(null);
    if (writeMode === 'dictation' && availableChars.length > 0) {
      // 默写模式：自动切到下一个随机字
      const next = availableChars[Math.floor(Math.random() * availableChars.length)];
      setCurrentWriteChar(next);
      setTimeout(() => speakChar(next.traditional, { lang: 'zh-HK', rate: 0.7 }), 500);
    } else {
      setCurrentWriteChar(null);
    }
  }

  function handleMatchAnswer(correct, pair) {
    if (correct) {
      setPetMood('happy');
      setPetCelebrating(true);
      setPetStatus('答对了！好厉害！');
      setTimeout(() => { setPetCelebrating(false); }, 1500);
    } else {
      setPetMood('sad');
      setPetStatus('没关系，再想想~');
      setTimeout(() => { setPetMood('normal'); setPetStatus(''); }, 2000);
      // 记录错字
      const group = pair?.group || 'basic';
      dispatch({
        type: 'RECORD_WRONG_ANSWER',
        payload: { subject: 'chinese', category: group, questionId: pair?.id || Date.now() },
      });
    }
  }

  function handleRewardClose() {
    setShowReward(false);
    setGameMode(null);
  }

  if (gameMode === 'match') {
    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={() => setGameMode(null)}>← 返回</button>
          <h2>字卡配对</h2>
          <div />
        </div>
        <PetCompanion mood={petMood} celebrating={petCelebrating} statusText={petStatus} interactive gazeTracking />
        {matchData.length > 0 ? (
          <MatchGame
            pairs={matchData}
            leftLabel="简体"
            rightLabel="繁体"
            onComplete={handleMatchComplete}
            onAnswer={handleMatchAnswer}
          />
        ) : (
          <div className="empty-state">先完成前面的关卡解锁更多字！</div>
        )}
        <RewardModal
          show={showReward}
          coins={rewardCoins}
          score={playerScore}
          total={playerTotal}
          message="又认识了新字！"
          onClose={handleRewardClose}
        />
      </div>
    );
  }

  if (gameMode === 'write') {
    if (currentWriteChar) {
      return (
        <div className="screen">
          <div className="screen-header">
            <button className="btn-back" onClick={() => setCurrentWriteChar(null)}>
              {writeMode === 'dictation' ? '← 换一字' : '← 换一字'}
            </button>
            <h2>{writeMode === 'dictation' ? '🔊 默写' : '✍️ 临摹'}</h2>
            <button
              className="btn btn-small btn-outline"
              onClick={() => {
                const newMode = writeMode === 'dictation' ? 'copy' : 'dictation';
                setWriteMode(newMode);
                if (newMode === 'dictation') {
                  speakChar(currentWriteChar.traditional, { lang: 'zh-HK', rate: 0.7 });
                }
              }}
              style={{ fontSize: 11, padding: '4px 8px' }}
            >
              {writeMode === 'dictation' ? '✍️ 临摹' : '🔊 默写'}
            </button>
          </div>
          <PetCompanion mood={petMood} celebrating={petCelebrating} statusText={petStatus} interactive gazeTracking />
          <WritingCanvas
            character={currentWriteChar.traditional}
            mode={writeMode}
            onPlayAudio={() => playCharAudio(currentWriteChar)}
            onComplete={handleWriteComplete}
          />
          <div className="char-info">
            <p>笔画：{currentWriteChar.stroke}画 | 组词：{currentWriteChar.words}</p>
          </div>
          {/* 收藏按钮 */}
          <div className="char-save-bar">
            <button
              className={`btn btn-small ${state.savedChars.includes(currentWriteChar.id) ? 'btn-saved' : 'btn-outline'}`}
              onClick={() => toggleSaveChar(currentWriteChar.id)}
            >
              {state.savedChars.includes(currentWriteChar.id) ? '⭐ 已收藏' : '☆ 收藏练习'}
            </button>
          </div>
          {/* 练字完成奖励 */}
          <RewardModal
            show={!!writeReward}
            coins={writeReward?.coins || 0}
            message={writeReward?.isFarmed
              ? '这个字已练过多次啦，试试下一个吧📖'
              : writeReward?.score < 60
                ? '要再认真一点哦～已自动收藏📝'
                : writeReward?.score >= 90
                  ? '字写得真漂亮！🌟🌟🌟'
                  : writeReward?.score >= 80
                    ? '不错哦！继续练~🌟🌟'
                    : '还行，再多练几次！🌟'}
            onClose={handleWriteRewardClose}
          />
        </div>
      );
    }

    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={() => setGameMode(null)}>← 返回</button>
          <h2>{writeTab === 'saved' ? '⭐ 收藏练习' : '✏️ 写字练习'}</h2>
          <div />
        </div>

        {/* 模式切换：选字练习 / 收藏字 */}
        <div className="write-mode-tabs">
          <button
            className={`tab-btn ${writeTab === 'grid' ? 'active' : ''}`}
            onClick={() => { setWriteTab('grid'); setWriteMode('copy'); }}
          >📋 选字临摹</button>
          <button
            className={`tab-btn ${writeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setWriteTab('saved')}
          >⭐ 收藏{state.savedChars.length > 0 ? `(${state.savedChars.length})` : ''}</button>
        </div>

        <div className="section-desc">
          {writeTab === 'saved' ? (
            <p>收藏的字，反复练习直到熟练！</p>
          ) : (
            <p>照着写繁体字，注意笔画顺序 ✍️</p>
          )}
          <p className="level-info">
            {writeTab === 'saved'
              ? `已收藏 ${state.savedChars.length} 个字`
              : '写完有星星奖励 ⭐'}
          </p>
        </div>

        {/* 默写入口横幅 */}
        {writeTab !== 'saved' && (
          <div className="dictation-banner" style={{ margin: '8px 16px', padding: '10px 14px', background: 'linear-gradient(135deg, #FFF0F5, #FFE4E1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>🔊 <strong>默写模式</strong> — 随机出题，测试真掌握了没</span>
            <button className="btn btn-primary btn-small" onClick={() => {
              if (availableChars.length > 0) {
                const randomChar = availableChars[Math.floor(Math.random() * availableChars.length)];
                setCurrentWriteChar(randomChar);
                setTimeout(() => speakChar(randomChar.traditional, { lang: 'zh-HK', rate: 0.7 }), 500);
              }
            }} style={{ fontSize: 12 }}>开始默写</button>
          </div>
        )}

        <div className="char-grid">
          {(writeTab === 'saved' ? savedChars : writeChars).map(c => {
            const isSaved = state.savedChars.includes(c.id);
            const writeCount = state.writtenCharCounts[c.id] || 0;
            const isFarmed = writeCount >= 4;
            return (
              <div key={c.id} className="char-card-wrapper">
                <button
                  className={`char-card ${isFarmed ? 'char-farmed' : ''}`}
                  onClick={() => {
                    setCurrentWriteChar(c);
                    if (writeMode === 'dictation') {
                      setTimeout(() => playCharAudio(c), 300);
                    }
                  }}
                >
                  <span className="char-simp">{c.simplified}</span>
                  <span className="char-trad">{c.traditional}</span>
                  <span className="char-stroke">{c.stroke}画</span>
                  {isFarmed && <span className="char-done-badge">✓</span>}
                </button>
                <div className="char-card-actions">
                  <button
                    className={`char-icon-btn ${isSaved ? 'saved' : ''}`}
                    onClick={(e) => { e.stopPropagation(); toggleSaveChar(c.id); }}
                    title={isSaved ? '取消收藏' : '收藏练习'}
                  >
                    {isSaved ? '⭐' : '☆'}
                  </button>
                  {writeMode === 'dictation' && (
                    <button
                      className="char-icon-btn"
                      onClick={(e) => { e.stopPropagation(); playCharAudio(c); }}
                      title="听发音"
                    >🔊</button>
                  )}
                </div>
              </div>
            );
          })}
          {writeTab === 'saved' && savedChars.length === 0 && (
            <div className="empty-state" style={{ gridColumn: '1/-1' }}>
              还没有收藏的字。<br/>写字时遇到不会的可以收藏起来练习哦！⭐
            </div>
          )}
        </div>
      </div>
    );
  }

  if (gameMode === 'grid') {
    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={() => setGameMode(null)}>← 返回</button>
          <h2>🎴 记忆翻牌</h2>
          <div />
        </div>
        <PetCompanion mood={petMood} celebrating={petCelebrating} statusText={petStatus} interactive gazeTracking />
        {gridMatchProblems.length > 0 ? (
          <GridGame
            questions={gridMatchProblems}
            onComplete={handleMatchComplete}
            onAnswer={handleMatchAnswer}
            title="找出简繁配对！"
          />
        ) : (
          <div className="empty-state">先完成前面的关卡解锁更多字！</div>
        )}
        <RewardModal
          show={showReward}
          coins={rewardCoins}
          score={playerScore}
          total={playerTotal}
          message="配对完成！"
          onClose={handleRewardClose}
        />
      </div>
    );
  }

  if (gameMode === 'order') {
    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={() => setGameMode(null)}>← 返回</button>
          <h2>🔢 笔画排序</h2>
          <div />
        </div>
        <PetCompanion mood={petMood} celebrating={petCelebrating} statusText={petStatus} interactive gazeTracking />
        {orderStrokeProblems.length > 0 ? (
          <OrderGame
            questions={orderStrokeProblems}
            onComplete={handleMatchComplete}
            onAnswer={handleMatchAnswer}
            title="笔画排排队！"
          />
        ) : (
          <div className="empty-state">先完成前面的关卡解锁更多字！</div>
        )}
        <RewardModal
          show={showReward}
          coins={rewardCoins}
          score={playerScore}
          total={playerTotal}
          message="排序完成！"
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
          <h2>📂 部首分类</h2>
          <div />
        </div>
        <PetCompanion mood={petMood} celebrating={petCelebrating} statusText={petStatus} interactive gazeTracking />
        {sortRadicalProblems.length > 0 ? (
          <SortGame
            questions={sortRadicalProblems}
            onComplete={handleMatchComplete}
            onAnswer={handleMatchAnswer}
            title="找出相同部首的字！"
          />
        ) : (
          <div className="empty-state">先完成前面的关卡解锁更多字！</div>
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

  return (
    <div className="screen">
      <div className="screen-header">
        <button className="btn-back" onClick={onBack}>← 主页</button>
        <h2>✍️ 汉字区</h2>
        <div />
      </div>

      <div className="section-desc">
        <p>认识繁体字，和小伙伴们写信交流！</p>
        <p>已解锁 {availableChars.length} 个字 | 年级 Lv.{unlockedLevel}</p>
      </div>

      {/* 分类 */}
      <div className="category-filter">
        <button className={`cat-btn ${group === 'all' ? 'active' : ''}`} onClick={() => setGroup('all')}>全部</button>
        {charGroups.map(g => (
          <button
            key={g.id}
            className={`cat-btn ${group === g.id ? 'active' : ''}`}
            onClick={() => setGroup(g.id)}
          >{g.icon} {g.name}</button>
        ))}
      </div>

      {/* 游戏选择 */}
      <div className="game-select-list">
        {GAMES.map(g => (
          <button
            key={g.id}
            className={`game-select-card ${g.ai ? 'game-ai' : ''}`}
            onClick={() => {
              if (g.id === 'write') {
                setGameMode('write');
                if (writeMode === 'dictation' && availableChars.length > 0) {
                  const randomChar = availableChars[Math.floor(Math.random() * availableChars.length)];
                  setCurrentWriteChar(randomChar);
                  setTimeout(() => speakChar(randomChar.traditional, { lang: 'zh-HK', rate: 0.7 }), 500);
                }
              } else if (g.ai) {
                setGameMode('write');
                setPetMood('excited');
                setPetStatus('AI模式已开启！写完后AI给你鼓励！🤖');
                setTimeout(() => { setPetMood('normal'); setPetStatus(''); }, 3000);
              } else {
                setGameMode(g.id);
              }
            }}
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
        subject="chinese"
        wrongRecords={state.wrongRecords.chinese}
        categories={charGroups}
        onPractice={(catId) => {
          if (catId) setGroup(catId);
          setGameMode('match');
        }}
      />

      {/* 字库预览 */}
      <div className="char-preview">
        <h3>📚 字库 ({availableChars.length})</h3>
        <div className="char-preview-grid">
          {availableChars.map(c => (
            <div key={c.id} className="char-preview-item">
              <span className="char-preview-simp">{c.simplified}</span>
              <span className="char-preview-trad">{c.traditional}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
