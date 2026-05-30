import { useState, useMemo } from 'react';
import { useGame, getGradeMaxLevel } from '../store';
import QuizGame from '../games/QuizGame';
import FillInGame from '../games/FillInGame';
import OrderGame from '../games/OrderGame';
import RewardModal from '../components/RewardModal';
import PetCompanion from '../components/PetCompanion';
import { logActivity } from '../utils/activityLog';
import { getTemplateGeneratedProblems } from '../data/queryEngine';
import { getCurriculumLevel, GRADE_MAP } from '../data/curriculum/curriculumMap';

const GAMES = [
  { id: 'quiz', label: '英文闯关', icon: '🎯' },
  { id: 'fill', label: '拼写练习', icon: '✏️' },
  { id: 'order', label: '句子排序', icon: '🔤' },
  { id: 'generated', label: '无限练习', icon: '♾️' },
];

export default function EnglishScreen({ onBack }) {
  const { state, dispatch } = useGame();
  const [gameMode, setGameMode] = useState(null);
  const [showReward, setShowReward] = useState(false);
  const [rewardCoins, setRewardCoins] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [playerTotal, setPlayerTotal] = useState(0);
  const [petMood, setPetMood] = useState('normal');
  const [petCelebrating, setPetCelebrating] = useState(false);
  const [petStatus, setPetStatus] = useState('');

  const cl = getCurriculumLevel(state.userGrade);
  const grade = GRADE_MAP.find(g => g.curriculumLevel === cl)?.id || 'p3';

  // 模板生成题目
  const quizProblems = useMemo(() => {
    return getTemplateGeneratedProblems({ subject: 'english', grade, count: 8, genre: 'computation' })
      .map(p => ({ id: p.id, question: p.question, answer: p.answer, options: p.options, category: 'grammar' }));
  }, [grade]);

  // 无限练习 — useMemo + 去重，防止每次渲染重新生成且出现重复题
  const generatedProblems = useMemo(() => {
    const raw = getTemplateGeneratedProblems({ subject: 'english', grade, count: 10, genre: 'computation' });
    const seen = new Set();
    return raw
      .filter(p => {
        if (seen.has(p.id)) return false;
        seen.add(p.id);
        return true;
      })
      .map(p => ({ id: p.id, question: p.question, answer: p.answer, options: p.options, category: 'grammar' }));
  }, [grade]);

  function handleComplete(score, total) {
    setPlayerScore(score);
    setPlayerTotal(total);
    const coins = Math.round((score / total) * 10) + 2;
    setRewardCoins(coins);
    setShowReward(true);
    dispatch({ type: 'COMPLETE_QUEST', payload: { subject: 'english', score: coins, questionsDone: total } });
    logActivity({ type: 'game', subject: 'english', gameType: gameMode, score: Math.round((score / total) * 100), total, correct: score });
  }

  function handleRewardClose() {
    setShowReward(false);
    setGameMode(null);
  }

  function handleAnswer(correct, question) {
    if (correct) {
      setPetMood('happy');
      setPetCelebrating(true);
      setPetStatus('Good job! 🌟');
      setTimeout(() => setPetCelebrating(false), 1500);
    } else {
      setPetMood('sad');
      setPetStatus('Try again! 💪');
      setTimeout(() => { setPetMood('normal'); setPetStatus(''); }, 2000);
    }
  }

  if (gameMode === 'quiz' || gameMode === 'generated') {
    const problems = gameMode === 'generated' ? generatedProblems : quizProblems;
    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={() => setGameMode(null)}>← 返回</button>
          <h2>{gameMode === 'generated' ? '♾️ 无限练习' : '🎯 英文闯关'}</h2>
          <div />
        </div>
        <PetCompanion mood={petMood} celebrating={petCelebrating} statusText={petStatus} interactive gazeTracking />
        {problems.length > 0 ? (
          <QuizGame questions={problems} onComplete={handleComplete} onAnswer={handleAnswer} title="English Quiz" />
        ) : (
          <div className="empty-state">暂无题目，请先学习基础课程</div>
        )}
        <RewardModal show={showReward} coins={rewardCoins} score={playerScore} total={playerTotal} message="英文练习完成！" onClose={handleRewardClose} />
      </div>
    );
  }

  if (gameMode === 'fill') {
    const words = getTemplateGeneratedProblems({ subject: 'english', grade, count: 8, genre: 'computation' }).map(p => ({
      id: `fill-${p.id}`, question: p.question.replace('_____', '______'), answer: p.answer, mode: 'text', hint: '填写正确的单词',
    }));
    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={() => setGameMode(null)}>← 返回</button>
          <h2>✏️ 拼写练习</h2>
          <div />
        </div>
        <PetCompanion mood={petMood} celebrating={petCelebrating} statusText={petStatus} interactive gazeTracking />
        <FillInGame questions={words} onComplete={handleComplete} onAnswer={handleAnswer} title="Fill in the blank!" icon="✏️" />
        <RewardModal show={showReward} coins={rewardCoins} score={playerScore} total={playerTotal} message="拼写完成！" onClose={handleRewardClose} />
      </div>
    );
  }

  if (gameMode === 'order') {
    const sentences = [
      { id: 'ord-1', question: '将单词排成正确的句子', items: ['I', 'like', 'apples'], correctOrder: [0, 1, 2] },
      { id: 'ord-2', question: '将单词排成正确的句子', items: ['She', 'is', 'a', 'teacher'], correctOrder: [0, 1, 2, 3] },
      { id: 'ord-3', question: '将单词排成正确的句子', items: ['We', 'go', 'to', 'school', 'every day'], correctOrder: [0, 1, 2, 3, 4] },
      { id: 'ord-4', question: '将单词排成正确的句子', items: ['He', 'can', 'swim', 'very', 'fast'], correctOrder: [0, 1, 2, 3, 4] },
      { id: 'ord-5', question: '将单词排成正确的句子', items: ['The', 'cat', 'is', 'under', 'the', 'table'], correctOrder: [0, 1, 2, 3, 4, 5] },
    ];
    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={() => setGameMode(null)}>← 返回</button>
          <h2>🔤 句子排序</h2>
          <div />
        </div>
        <PetCompanion mood={petMood} celebrating={petCelebrating} statusText={petStatus} interactive gazeTracking />
        <OrderGame questions={sentences} onComplete={handleComplete} onAnswer={handleAnswer} title="排成正確句子！" icon="🔤" />
        <RewardModal show={showReward} coins={rewardCoins} score={playerScore} total={playerTotal} message="句子排序完成！" onClose={handleRewardClose} />
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="screen-header">
        <button className="btn-back" onClick={onBack}>← 主页</button>
        <h2>🔤 英文岛</h2>
        <div />
      </div>
      <div className="section-desc">
        <p>Learn English with fun! 和团子一起学英文！</p>
        <p className="level-info">年级 {grade.toUpperCase()} | 语法/词汇/阅读</p>
      </div>
      <div className="game-select-list">
        {GAMES.map(g => (
          <button key={g.id} className="game-select-card" onClick={() => setGameMode(g.id)}>
            <span className="game-select-icon">{g.icon}</span>
            <span className="game-select-label">{g.label}</span>
            <span className="game-select-arrow">→</span>
          </button>
        ))}
      </div>
    </div>
  );
}
