import { useState, useCallback, useEffect, useRef, useMemo } from 'react';

// Fisher-Yates 洗牌算法
function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// 规范化答案比较：支持文本值和索引值两种格式
function answerMatches(selected, question) {
  if (!selected || !question) return false;

  // 1. 直接匹配（AI 返回正确答案的文本）
  if (selected === question.answer) return true;

  const options = question.options || [];

  // 2. 纯数字索引匹配（AI 有时返回数字如 0,1,2 作为答案）
  const numIdx = Number(question.answer);
  if (!isNaN(numIdx) && numIdx >= 0 && numIdx < options.length && options[numIdx] === selected) return true;

  // 3. 字母索引匹配（AI 返回 "A"/"B"/"C"/"D" 表示第几个选项正确）
  if (/^[A-Da-d]$/.test(question.answer)) {
    const letterIdx = question.answer.toUpperCase().charCodeAt(0) - 65;
    if (letterIdx >= 0 && letterIdx < options.length && options[letterIdx] === selected) return true;
  }

  // 4. 去除选项前缀比较（AI 有时写 "A. 43" 或 "A、43" 等）
  const stripPrefix = (s) => ('' + s).replace(/^[A-Da-d][.、)\s]*/, '').trim();
  const cleanSelected = stripPrefix(selected);
  const cleanAnswer = stripPrefix(question.answer);

  // 4a. 去前缀后直接匹配
  if (cleanSelected === cleanAnswer) return true;

  // 4b. 去前缀后匹配选项对应的位置
  for (let i = 0; i < options.length; i++) {
    if (stripPrefix(options[i]) === cleanSelected && stripPrefix(options[i]) === cleanAnswer) {
      return true;
    }
    // AI 答案 = 字母，找到该字母对应的选项内容再比较
    const optLetter = String.fromCharCode(65 + i);
    if (question.answer.toUpperCase() === optLetter && stripPrefix(options[i]) === cleanSelected) {
      return true;
    }
  }

  return false;
}

/**
 * 选择题游戏组件
 * Props:
 *   questions: [{id, question, answer, options, story?}]
 *   onComplete: (score, total) => void
 *   title: string
 *   showStory: boolean (是否显示故事上下文)
 *   onAnswer: (correct) => void (每题即时回调)
 */
export default function QuizGame({ questions, onComplete, title, showStory = true, onAnswer, examImage }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showStoryText, setShowStoryText] = useState(true);
  const [showImage, setShowImage] = useState(!!examImage);
  const feedbackTimer = useRef(null);

  const question = questions[current];

  // 每次切换题目时打乱选项顺序
  const shuffledOptions = useMemo(() => {
    if (!question?.options) return [];
    return shuffleArray(question.options);
  }, [question]);

  const handleSelect = useCallback((option) => {
    if (selected !== null) return;
    setSelected(option);

    const isCorrect = answerMatches(option, question);
    if (isCorrect) setScore(s => s + 1);
    onAnswer?.(isCorrect, question);

    // 音效反馈
    playSound(isCorrect);

    setTimeout(() => {
      if (current < questions.length - 1) {
        setCurrent(c => c + 1);
        setSelected(null);
        setShowResult(false);
        setShowStoryText(true);
      } else {
        setFinished(true);
        onComplete?.(score + (isCorrect ? 1 : 0), questions.length);
      }
    }, 1200);
  }, [selected, question, current, questions.length, onComplete, score, onAnswer]);

  function playSound(correct) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);

      if (correct) {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523, ctx.currentTime);
        osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.4);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.setValueAtTime(150, ctx.currentTime + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {}
  }

  // 清理timer
  useEffect(() => {
    return () => {
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    };
  }, []);

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    const stars = pct >= 90 ? '🌟🌟🌟' : pct >= 70 ? '🌟🌟' : '🌟';
    const msgs = {
      high: '太厉害了！你是小天才！🎉',
      mid: '很不错哦！继续加油！💪',
      low: '没关系，多练几次就会了！🤗',
    };
    const msg = pct >= 80 ? msgs.high : pct >= 50 ? msgs.mid : msgs.low;

    return (
      <div className="quiz-result">
        <div className="quiz-result-stars">{stars}</div>
        <div className="quiz-result-score">{score} / {questions.length}</div>
        <div className="quiz-result-msg">{msg}</div>
      </div>
    );
  }

  if (!question) return <div className="quiz-empty">暂无题目</div>;

  return (
    <div className="quiz-game">
      {title && <h3 className="game-title">{title}</h3>}

      <div className="quiz-counter">
        第 {current + 1} / {questions.length} 题
      </div>

      {showStory && question.story && (
        <div className="quiz-story" onClick={() => setShowStoryText(false)}>
          {showStoryText && <span className="story-hint">📖 点击看故事</span>}
          {!showStoryText && <span className="story-text">{question.story}</span>}
        </div>
      )}

      {/* 题目配图（AI 看过的原图，让小孩也能看到） */}
      {examImage && (
        <div className="quiz-image-wrap" onClick={() => setShowImage(!showImage)}>
          <img src={examImage} alt="题目配图" className={`quiz-exam-image ${showImage ? '' : 'quiz-image-collapsed'}`} />
          <span className="quiz-image-toggle">{showImage ? '👆 收起图片' : '👆 点击查看原图'}</span>
        </div>
      )}

      <div className="quiz-question">{question.question}</div>

      {question.estimationTip && (
        <div className="quiz-estimation-tip">{question.estimationTip}</div>
      )}

      {question.commonMistake && (
        <div className="quiz-common-mistake">{question.commonMistake}</div>
      )}

      <div className="quiz-options">
        {shuffledOptions.map((opt, i) => {
          let btnClass = 'quiz-option';
          if (selected === opt) {
            btnClass += answerMatches(opt, question) ? ' correct' : ' wrong';
          } else if (selected !== null && answerMatches(opt, question)) {
            btnClass += ' correct';
          }
          return (
            <button
              key={i}
              className={btnClass}
              onClick={() => handleSelect(opt)}
              disabled={selected !== null}
            >
              <span className="option-label">{String.fromCharCode(65 + i)}</span>
              <span className="option-text">{opt}</span>
              {selected === opt && (
                <span className="option-icon">{answerMatches(opt, question) ? '✓' : '✗'}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
