import { useState, useMemo } from 'react';
import { useGame, getGradeMaxLevel } from '../store';
import { mathCategories, problems } from '../data/mathProblems';
import { generateMathProblems } from '../api';
import QuizGame from '../games/QuizGame';
import SpeedChallenge from '../games/SpeedChallenge';
import FillInGame from '../games/FillInGame';
import OrderGame from '../games/OrderGame';
import GridGame from '../games/GridGame';
import SortGame from '../games/SortGame';
import StepSolverGame from '../games/StepSolverGame';
import RewardModal from '../components/RewardModal';
import PetCompanion from '../components/PetCompanion';
import MistakeAnalysis from '../components/MistakeAnalysis';
import { logActivity } from '../utils/activityLog';
import { getBalancedQuestions, toQuizQuestion, getTemplateGeneratedProblems } from '../data/queryEngine';
import { getCurriculumLevel, GRADE_MAP } from '../data/curriculum/curriculumMap';

const GAMES = [
  { id: 'speed', label: '口算快抢', icon: '⚡' },
  { id: 'quiz', label: '数学闯关', icon: '🎯' },
  { id: 'fill', label: '填空计算', icon: '✏️' },
  { id: 'generated', label: '无限练习', icon: '♾️' },
  { id: 'order', label: '数字排序', icon: '🔢' },
  { id: 'grid', label: '记忆配对', icon: '🎴' },
  { id: 'sort', label: '数字分类', icon: '📂' },
  { id: 'step', label: '分步解题', icon: '🧩' },
  { id: 'ai', label: 'AI智能出题', icon: '🤖', ai: true },
  { id: 'comprehensive', label: '综合练习', icon: '📝' },
];

export default function MathScreen({ onBack }) {
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
  const [aiProblems, setAiProblems] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const gradeMax = getGradeMaxLevel(state.userGrade);
  const unlockedLevel = Math.min(state.mathUnlocked, gradeMax);

  // 筛选题目
  const availableProblems = useMemo(() => {
    let filtered = problems.filter(p => p.level <= unlockedLevel);
    if (category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }
    return filtered;
  }, [unlockedLevel, category]);

  // 口算题 (加减乘除)
  const speedProblems = useMemo(() => {
    const pool = availableProblems.filter(p => ['add-sub', 'mult-div'].includes(p.category));
    return pool.slice(0, 15).map(p => ({
      id: p.id,
      question: p.question,
      answer: p.answer,
      options: p.options,
      category: p.category,
    }));
  }, [availableProblems]);

  // 闯关题
  const quizProblems = useMemo(() => {
    return availableProblems.slice(0, 8).map(p => ({
      id: p.id,
      question: p.question,
      answer: p.answer,
      options: p.options,
      story: p.story,
      category: p.category,
    }));
  }, [availableProblems]);

  // 填空题 (数值计算类，使用数字键盘)
  const fillProblems = useMemo(() => {
    return availableProblems
      .filter(p => ['add-sub', 'mult-div'].includes(p.category) && !p.story)
      .slice(0, 10).map(p => ({
        id: p.id,
        question: p.question,
        answer: p.answer,
        mode: 'number',
        hint: p.hint,
      }));
  }, [availableProblems]);

  // 记忆配对题 (乘法表配对)
  const gridProblems = useMemo(() => {
    const tables = [
      { pairs: [{ pairId: 'a', label: '2×3' }, { pairId: 'a', label: '6' }, { pairId: 'b', label: '4×5' }, { pairId: 'b', label: '20' }, { pairId: 'c', label: '3×7' }, { pairId: 'c', label: '21' }, { pairId: 'd', label: '6×4' }, { pairId: 'd', label: '24' }], question: '找出乘法算式和结果', cols: 4 },
      { pairs: [{ pairId: 'a', label: '7×8' }, { pairId: 'a', label: '56' }, { pairId: 'b', label: '9×6' }, { pairId: 'b', label: '54' }, { pairId: 'c', label: '5×9' }, { pairId: 'c', label: '45' }, { pairId: 'd', label: '8×4' }, { pairId: 'd', label: '32' }], question: '找出乘法算式和结果', cols: 4 },
      { pairs: [{ pairId: 'a', label: '3×9' }, { pairId: 'a', label: '27' }, { pairId: 'b', label: '6×7' }, { pairId: 'b', label: '42' }, { pairId: 'c', label: '8×8' }, { pairId: 'c', label: '64' }, { pairId: 'd', label: '9×9' }, { pairId: 'd', label: '81' }], question: '找出乘法算式和结果', cols: 4 },
      { pairs: [{ pairId: 'a', label: '4×6' }, { pairId: 'a', label: '24' }, { pairId: 'b', label: '7×5' }, { pairId: 'b', label: '35' }, { pairId: 'c', label: '8×3' }, { pairId: 'c', label: '24' }, { pairId: 'd', label: '9×4' }, { pairId: 'd', label: '36' }], question: '找出乘法算式和结果', cols: 4 },
    ];
    const count = unlockedLevel >= 2 ? tables.length : 2;
    return tables.slice(0, count).map((t, i) => ({
      id: `GRD-${i + 1}`,
      question: t.question,
      items: t.pairs,
      cols: t.cols,
    }));
  }, [unlockedLevel]);

  // 多步解题
  const stepProblems = useMemo(() => {
    const sets = [
      { question: '小红有 345 颗糖，小明比小红多 267 颗，他们一共有多少颗糖？', hint: '先算小明有多少颗，再算两人一共', steps: [{ prompt: '小明有多少颗糖？', answer: '612' }, { prompt: '他们一共有多少颗？', answer: '957' }] },
      { question: '书店有 568 本书，上午卖出 234 本，下午卖出 189 本，还剩多少本？', hint: '先算上午卖出后剩多少，再算下午后', steps: [{ prompt: '上午卖出后还剩多少本？', answer: '334' }, { prompt: '下午卖出后还剩多少本？', answer: '145' }] },
      { question: '一个水果店有 456 个苹果，运来 378 个，又卖出 290 个，现在有多少个？', hint: '先算运来后有多少，再算卖出后', steps: [{ prompt: '运来后有多少个苹果？', answer: '834' }, { prompt: '卖出后还剩多少个？', answer: '544' }] },
    ];
    return sets.map((s, i) => ({ id: `STEP-${i + 1}`, ...s }));
  }, []);

  // 分类题 (奇偶分类)
  const sortProblems = useMemo(() => {
    const sets = [
      { question: '将下列数字分为奇数和偶数', categories: [{ id: 'even', label: '偶数' }, { id: 'odd', label: '奇数' }], items: [{ id: 's1', label: '24', category: 'even' }, { id: 's2', label: '37', category: 'odd' }, { id: 's3', label: '50', category: 'even' }, { id: 's4', label: '13', category: 'odd' }, { id: 's5', label: '68', category: 'even' }, { id: 's6', label: '41', category: 'odd' }] },
      { question: '将下列数字分为奇数和偶数', categories: [{ id: 'even', label: '偶数' }, { id: 'odd', label: '奇数' }], items: [{ id: 's7', label: '85', category: 'odd' }, { id: 's8', label: '72', category: 'even' }, { id: 's9', label: '99', category: 'odd' }, { id: 's10', label: '100', category: 'even' }, { id: 's11', label: '57', category: 'odd' }, { id: 's12', label: '38', category: 'even' }] },
      { question: '将下列数字分为奇数和偶数', categories: [{ id: 'even', label: '偶数' }, { id: 'odd', label: '奇数' }], items: [{ id: 's13', label: '246', category: 'even' }, { id: 's14', label: '371', category: 'odd' }, { id: 's15', label: '504', category: 'even' }, { id: 's16', label: '133', category: 'odd' }, { id: 's17', label: '688', category: 'even' }, { id: 's18', label: '425', category: 'odd' }] },
    ];
    const count = unlockedLevel >= 2 ? sets.length : 2;
    return sets.slice(0, count).map((s, i) => ({ id: `SRT-${i + 1}`, ...s }));
  }, [unlockedLevel]);

  // 排序题 (数字排序)
  const orderProblems = useMemo(() => {
    const sets = [
      { numbers: [345, 567, 123, 789, 234], hint: '比较百位数的大小' },
      { numbers: [100, 300, 200, 500, 400], hint: '看看百位数字' },
      { numbers: [999, 111, 555, 333, 777], hint: '百位数字各不相同' },
      { numbers: [1234, 5678, 3456, 7890, 2345], hint: '四位数比较，先看千位' },
      { numbers: [1111, 2222, 3333, 4444, 5555], hint: '千位数字决定大小' },
      { numbers: [2468, 1357, 8642, 7531, 9876], hint: '看看每个数的千位' },
      { numbers: [505, 550, 500, 555, 511], hint: '百位相同就看十位' },
      { numbers: [12, 123, 1234, 1, 12345], hint: '数位越多数越大' },
    ];
    // 按等级选择适合的题目
    const count = unlockedLevel >= 2 ? sets.length : 4;
    return sets.slice(0, count).map((s, i) => {
      const withIndices = s.numbers.map((n, idx) => ({ value: n, origIndex: idx }));
      const sorted = [...withIndices].sort((a, b) => a.value - b.value);
      const correctOrder = sorted.map(item => item.origIndex);
      return {
        id: `ORD-${i + 1}`,
        question: '请按从小到大的顺序排列',
        items: s.numbers,
        correctOrder,
        hint: s.hint,
      };
    });
  }, [unlockedLevel]);

  // 综合练习卷 (使用统一查询引擎)
  const comprehensiveProblems = useMemo(() => {
    const result = getBalancedQuestions({
      questions: availableProblems,
      maxLevel: unlockedLevel,
      count: 10,
    });
    return result.map(p => ({
      ...toQuizQuestion(p),
      story: p.story,
      category: p.category,
    }));
  }, [availableProblems, unlockedLevel]);

  // 无限练习 — useMemo 防止每次渲染重新生成题目
  const generatedProblems = useMemo(() => {
    if (gameMode !== 'generated') return [];
    const cl = getCurriculumLevel(state.userGrade);
    const grade = GRADE_MAP.find(g => g.curriculumLevel === cl)?.id || 'p3';
    return getTemplateGeneratedProblems({ grade, count: 10, genre: 'computation' })
      .map(p => ({ id: p.id, question: p.question, answer: p.answer, options: p.options, category: p.category || 'mixed' }));
  }, [gameMode, state.userGrade]);

  const generatedGrade = useMemo(() => {
    if (gameMode !== 'generated') return 'p3';
    const cl = getCurriculumLevel(state.userGrade);
    return GRADE_MAP.find(g => g.curriculumLevel === cl)?.id || 'p3';
  }, [gameMode, state.userGrade]);

  // AI智能出题
  async function handleAiQuiz() {
    setGameMode('ai');
    setAiProblems(null);
    setAiLoading(true);
    setPetMood('excited');
    setPetStatus('让AI给你出题！🤖');
    // 提取错题的类别作为薄弱topic
    const wrongTopics = [...new Set(
      (state.wrongRecords.math || []).map(r => {
        const p = problems.find(p => p.id === r.questionId);
        return p?.category;
      }).filter(Boolean)
    )];
    try {
      const result = await generateMathProblems(unlockedLevel, 5, wrongTopics);
      if (result && result.length > 0) {
        setAiProblems(result.map(p => ({
          id: p.id,
          question: p.question,
          answer: p.answer,
          options: p.options,
          story: p.story || 'AI出的数学题！',
          category: p.category || 'mixed',
        })));
        setPetMood('happy');
        setPetStatus('AI题目来啦！加油！');
      } else {
        // AI失败，用本地题库
        setAiProblems(quizProblems.slice(0, 5));
        setPetStatus('先用本地题目吧~');
      }
    } catch {
      setAiProblems(quizProblems.slice(0, 5));
      setPetStatus('先用本地题目吧~');
    }
    setAiLoading(false);
  }

  function handleComplete(score, total) {
    setPlayerScore(score);
    setPlayerTotal(total);
    const coins = Math.round((score / total) * 10) + 2;
    setRewardCoins(coins);
    setShowReward(true);

    dispatch({
      type: 'COMPLETE_QUEST',
      payload: { subject: 'math', score: coins, questionsDone: total },
    });

    if (score / total >= 0.7) {
      dispatch({ type: 'UNLOCK_LEVEL', payload: { subject: 'math', level: unlockedLevel + 1 } });
    }

    logActivity({ type: 'game', subject: 'math', gameType: gameMode, score: Math.round((score / total) * 100), total, correct: score });
  }

  function handleRewardClose() {
    setShowReward(false);
    setGameMode(null);
  }

  function handleAnswer(correct, question) {
    if (correct) {
      setPetMood('happy');
      setPetCelebrating(true);
      setPetStatus('算对了！数学天才！🧮');
      setTimeout(() => { setPetCelebrating(false); }, 1500);
    } else {
      setPetMood('sad');
      setPetStatus('再算算看，你可以的！');
      setTimeout(() => { setPetMood('normal'); setPetStatus(''); }, 2000);
      // 记录错题
      if (question?.category) {
        dispatch({
          type: 'RECORD_WRONG_ANSWER',
          payload: { subject: 'math', category: question.category, questionId: question.id },
        });
      }
    }
  }

  if (gameMode === 'speed') {
    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={() => setGameMode(null)}>← 返回</button>
          <h2>⚡ 口算快抢</h2>
          <div />
        </div>
        <PetCompanion mood={petMood} celebrating={petCelebrating} statusText={petStatus} interactive gazeTracking />
        <SpeedChallenge
          questions={speedProblems}
          onComplete={handleComplete}
          onAnswer={handleAnswer}
          timeLimit={60}
          title="看谁算得快！"
        />
        <RewardModal
          show={showReward}
          coins={rewardCoins}
          score={playerScore}
          total={playerTotal}
          message="小数学家诞生了！"
          onClose={handleRewardClose}
        />
      </div>
    );
  }

  if (gameMode === 'fill') {
    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={() => setGameMode(null)}>← 返回</button>
          <h2>✏️ 填空计算</h2>
          <div />
        </div>
        <PetCompanion mood={petMood} celebrating={petCelebrating} statusText={petStatus} interactive gazeTracking />
        <FillInGame
          questions={fillProblems}
          onComplete={handleComplete}
          onAnswer={handleAnswer}
          title="用数字填空吧！"
        />
        <RewardModal
          show={showReward}
          coins={rewardCoins}
          score={playerScore}
          total={playerTotal}
          message="填空完成！"
          onClose={handleRewardClose}
        />
      </div>
    );
  }
  if (gameMode === 'generated') {
    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={() => setGameMode(null)}>← 返回</button>
          <h2>♾️ 无限练习</h2>
          <div />
        </div>
        <div className="section-desc" style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-light)', padding: '0 16px' }}>
          每次刷新都是新题目！基于你当前的年级（{generatedGrade}）自动生成
        </div>
        <PetCompanion mood={petMood} celebrating={petCelebrating} statusText={petStatus} interactive gazeTracking />
        {generatedProblems.length > 0 ? (
          <QuizGame
            questions={generatedProblems}
            onComplete={handleComplete}
            onAnswer={handleAnswer}
            title="♾️ 无限数学题"
          />
        ) : (
          <div className="empty-state">暂时无法生成新题目，请先学完基础课程</div>
        )}
        <RewardModal
          show={showReward}
          coins={rewardCoins}
          score={playerScore}
          total={playerTotal}
          message="练习完成！"
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
          <h2>🔢 数字排序</h2>
          <div />
        </div>
        <PetCompanion mood={petMood} celebrating={petCelebrating} statusText={petStatus} interactive gazeTracking />
        <OrderGame
          questions={orderProblems}
          onComplete={handleComplete}
          onAnswer={handleAnswer}
          title="数字排排队！"
        />
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

  if (gameMode === 'grid') {
    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={() => setGameMode(null)}>← 返回</button>
          <h2>🎴 记忆配对</h2>
          <div />
        </div>
        <PetCompanion mood={petMood} celebrating={petCelebrating} statusText={petStatus} interactive gazeTracking />
        <GridGame
          questions={gridProblems}
          onComplete={handleComplete}
          onAnswer={handleAnswer}
          title="乘法表翻翻乐！"
        />
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

  if (gameMode === 'sort') {
    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={() => setGameMode(null)}>← 返回</button>
          <h2>📂 数字分类</h2>
          <div />
        </div>
        <PetCompanion mood={petMood} celebrating={petCelebrating} statusText={petStatus} interactive gazeTracking />
        <SortGame
          questions={sortProblems}
          onComplete={handleComplete}
          onAnswer={handleAnswer}
          title="奇数和偶数分类！"
        />
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

  if (gameMode === 'step') {
    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={() => setGameMode(null)}>← 返回</button>
          <h2>🧩 分步解题</h2>
          <div />
        </div>
        <PetCompanion mood={petMood} celebrating={petCelebrating} statusText={petStatus} interactive gazeTracking />
        <StepSolverGame
          questions={stepProblems}
          onComplete={handleComplete}
          onAnswer={(correct, question, stepResults) => {
            handleAnswer(correct, question);
          }}
          title="一步一步解应用题！"
        />
        <RewardModal
          show={showReward}
          coins={rewardCoins}
          score={playerScore}
          total={playerTotal}
          message="解题完成！"
          onClose={handleRewardClose}
        />
      </div>
    );
  }

  if (gameMode === 'quiz') {
    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={() => setGameMode(null)}>← 返回</button>
          <h2>🎯 数学闯关</h2>
          <div />
        </div>
        <PetCompanion mood={petMood} celebrating={petCelebrating} statusText={petStatus} interactive gazeTracking />
        <QuizGame
          questions={quizProblems}
          onComplete={handleComplete}
          onAnswer={handleAnswer}
          title="解救团子大作战！"
          showStory
        />
        <RewardModal
          show={showReward}
          coins={rewardCoins}
          score={playerScore}
          total={playerTotal}
          message="闯关成功！"
          onClose={handleRewardClose}
        />
      </div>
    );
  }

  // 综合练习卷
  if (gameMode === 'comprehensive') {
    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={() => setGameMode(null)}>← 返回</button>
          <h2>📝 综合练习</h2>
          <div />
        </div>
        <PetCompanion mood={petMood} celebrating={petCelebrating} statusText={petStatus} interactive gazeTracking />
        {comprehensiveProblems.length > 0 ? (
          <>
            <div className="comprehensive-banner">
              📋 综合练习卷 · 共{comprehensiveProblems.length}题 · 涵盖所有分类
            </div>
            <QuizGame
              questions={comprehensiveProblems}
              onComplete={handleComplete}
              onAnswer={handleAnswer}
              title="综合练习"
              showStory
            />
          </>
        ) : (
          <div className="empty-state">暂无足够的题目，先完成前面的关卡吧！</div>
        )}
        <RewardModal
          show={showReward}
          coins={rewardCoins}
          score={playerScore}
          total={playerTotal}
          message="综合练习完成！"
          onClose={handleRewardClose}
        />
      </div>
    );
  }

  // AI智能出题
  if (gameMode === 'ai') {
    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={() => {
            setGameMode(null); setAiProblems(null);
          }}>← 返回</button>
          <h2>🤖 AI智能出题</h2>
          <div />
        </div>
        <PetCompanion mood={petMood} celebrating={petCelebrating} statusText={petStatus} interactive gazeTracking />

        {aiLoading ? (
          <div className="ai-loading">
            <div className="ai-loading-spinner">🤖</div>
            <p>AI正在为你出题…</p>
            <p className="ai-loading-hint">根据你的水平量身定制</p>
          </div>
        ) : aiProblems ? (
          <QuizGame
            questions={aiProblems}
            onComplete={handleComplete}
            onAnswer={handleAnswer}
            title="AI智能出题"
            showStory
          />
        ) : (
          <div className="empty-state">
            <p>准备AI出题…</p>
            <button className="btn btn-primary" onClick={handleAiQuiz}>开始出题</button>
          </div>
        )}

        <RewardModal
          show={showReward}
          coins={rewardCoins}
          score={playerScore}
          total={playerTotal}
          message="AI闯关成功！"
          onClose={handleRewardClose}
        />
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="screen-header">
        <button className="btn-back" onClick={onBack}>← 主页</button>
        <h2>🔢 数学岛</h2>
        <div />
      </div>

      <div className="section-desc">
        <p>用数学力量闯关救团子！</p>
        <p className="level-info">当前等级 Lv.{unlockedLevel} | {availableProblems.length} 道题</p>
      </div>

      {/* 分类 */}
      <div className="category-filter">
        <button className={`cat-btn ${category === 'all' ? 'active' : ''}`} onClick={() => setCategory('all')}>全部</button>
        {mathCategories.map(c => (
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
            onClick={() => {
              if (g.ai) handleAiQuiz();
              else setGameMode(g.id);
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
        subject="math"
        wrongRecords={state.wrongRecords.math}
        categories={mathCategories}
        onPractice={(catId) => {
          if (catId) setCategory(catId);
          setGameMode('speed');
        }}
      />

      {/* 题目预览 */}
      <div className="preview-section">
        <h3>📋 本周练习 ({availableProblems.length}题)</h3>
        <div className="preview-problems">
          {availableProblems.slice(0, 5).map(p => (
            <div key={p.id} className="preview-problem">
              <span className="preview-q">{p.question}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
