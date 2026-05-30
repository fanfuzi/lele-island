import { useState, useMemo } from 'react';
import { useGame, getGradeMaxLevel } from '../store';
import QuizGame from '../games/QuizGame';
import SortGame from '../games/SortGame';
import RewardModal from '../components/RewardModal';
import PetCompanion from '../components/PetCompanion';
import { logActivity } from '../utils/activityLog';
import { getTemplateGeneratedProblems } from '../data/queryEngine';
import { getCurriculumLevel, GRADE_MAP } from '../data/curriculum/curriculumMap';

const GAMES = [
  { id: 'quiz', label: '闯关挑战', icon: '🎯', desc: '选择题闯关' },
  { id: 'generated', label: '无限练习', icon: '♾️', desc: '题目不重复' },
];

export default function GSScreen({ onBack }) {
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

  const quizProblems = useMemo(() => {
    return getTemplateGeneratedProblems({ subject: 'gs', grade, count: 8, genre: 'word-problem' })
      .map(p => ({ id: p.id, question: p.question, answer: p.answer, options: p.options, category: p.category || 'general' }));
  }, [grade]);

  function handleComplete(score, total) {
    setPlayerScore(score);
    setPlayerTotal(total);
    const coins = Math.round((score / total) * 10) + 2;
    setRewardCoins(coins);
    setShowReward(true);
    dispatch({ type: 'COMPLETE_QUEST', payload: { subject: 'gs', score: coins, questionsDone: total } });
    logActivity({ type: 'game', subject: 'gs', gameType: gameMode, score: Math.round((score / total) * 100), total, correct: score });
  }

  function handleRewardClose() {
    setShowReward(false);
    setGameMode(null);
  }

  function handleAnswer(correct, question) {
    if (correct) {
      setPetMood('happy');
      setPetCelebrating(true);
      setPetStatus('答对了！好聪明！🌟');
      setTimeout(() => setPetCelebrating(false), 1500);
    } else {
      setPetMood('sad');
      setPetStatus('再想想看哦~');
      setTimeout(() => { setPetMood('normal'); setPetStatus(''); }, 2000);
    }
  }

  // 分类题：科学vs社会
  const sortProblems = useMemo(() => {
    const science = ['力與運動', '光與聲音', '電與磁', '人體系統', '地球與宇宙'];
    const society = ['家庭與社區', '香港的節日', '香港交通', '基本法', '世界公民'];
    const pickTwo = (arr, n) => arr.sort(() => Math.random() - 0.5).slice(0, n);
    const sciItems = pickTwo(science, 3).map((item, i) => ({ id: `sci-${i}`, label: item, category: 'science' }));
    const socItems = pickTwo(society, 3).map((item, i) => ({ id: `soc-${i}`, label: item, category: 'society' }));
    return [{
      id: 'srt-1',
      question: '将以下知识点分类',
      categories: [{ id: 'science', label: '🔬 科学' }, { id: 'society', label: '🏛️ 社会' }],
      items: [...sciItems, ...socItems],
    }];
  }, []);

  // 无限练习的题目也需要缓存，否则每次重渲染都会重新生成
  const generatedProblems = useMemo(() => {
    if (gameMode !== 'generated') return [];
    return getTemplateGeneratedProblems({ subject: 'gs', grade, count: 10, genre: 'word-problem' })
      .map(p => ({ id: p.id, question: p.question, answer: p.answer, options: p.options, category: 'general' }));
  }, [gameMode, grade]);

  if (gameMode === 'quiz' || gameMode === 'generated') {
    const problems = gameMode === 'generated' ? generatedProblems : quizProblems;
    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={() => setGameMode(null)}>← 返回</button>
          <h2>{gameMode === 'generated' ? '♾️ 无限练习' : '🎯 常识闯关'}</h2>
          <div />
        </div>
        <PetCompanion mood={petMood} celebrating={petCelebrating} statusText={petStatus} interactive gazeTracking />
        {problems.length > 0 ? (
          <QuizGame key={gameMode} questions={problems} onComplete={handleComplete} onAnswer={handleAnswer} title="常识小百科！" />
        ) : (
          <div className="empty-state">暂无题目</div>
        )}
        <RewardModal show={showReward} coins={rewardCoins} score={playerScore} total={playerTotal} message="常识练习完成！" onClose={handleRewardClose} />
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
        <SortGame questions={sortProblems} onComplete={handleComplete} onAnswer={handleAnswer} title="科学vs社会分类！" />
        <RewardModal show={showReward} coins={rewardCoins} score={playerScore} total={playerTotal} message="分类完成！" onClose={handleRewardClose} />
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="screen-header">
        <button className="btn-back" onClick={onBack}>← 主页</button>
        <h2>🌍 常识岛</h2>
        <div />
      </div>
      <div className="section-desc">
        <p>探索世界，增长见识！认识健康、科学、社会环境</p>
        <p className="level-info">年级 {grade.toUpperCase()} | 常識科</p>
      </div>
      <div className="game-select-list">
        {GAMES.map(g => (
          <button key={g.id} className="game-select-card" onClick={() => setGameMode(g.id)}>
            <span className="game-select-icon">{g.icon}</span>
            <div className="game-select-label">
              <span className="game-select-name">{g.label}</span>
              {g.desc && <span className="game-select-desc">{g.desc}</span>}
            </div>
            <span className="game-select-arrow">→</span>
          </button>
        ))}
      </div>
    </div>
  );
}
