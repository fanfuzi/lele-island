import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * 听力题游戏组件 (基于Web Speech API)
 * Props:
 *   questions: [{id, question, audioText, answer, options}]
 *     audioText: 要朗读的文本
 *     answer: 正确答案
 *     options: 选项数组
 *   onComplete: (score, total) => void
 *   onAnswer: (correct, question) => void
 *   title: string
 *   icon: string
 *   lang: string (默认 'zh-HK')
 *   rate: number (朗读速度, 默认 0.85)
 */
export default function AudioGame({ questions, onComplete, onAnswer, title, icon = '👂', lang = 'zh-HK', rate = 0.85 }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [voiceReady, setVoiceReady] = useState(false);
  const [playCount, setPlayCount] = useState(0);

  const question = questions[current];
  const voiceRef = useRef(null);

  // 初始化语音
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const checkVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        voiceRef.current = voices.find(v => v.lang === lang) ||
                           voices.find(v => v.lang.startsWith(lang)) ||
                           voices.find(v => v.lang.startsWith('zh')) ||
                           voices[0];
        setVoiceReady(true);
      }
    };
    checkVoices();
    window.speechSynthesis.onvoiceschanged = checkVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, [lang]);

  // 切换题目时重置
  useEffect(() => {
    setSelected(null);
    setPlayCount(0);
    window.speechSynthesis?.cancel();
  }, [current]);

  function playAudio() {
    if (!question?.audioText || playing) return;
    try {
      window.speechSynthesis?.cancel();
      const utterance = new SpeechSynthesisUtterance(question.audioText);
      utterance.lang = lang;
      utterance.rate = rate;
      utterance.pitch = 1.1;
      if (voiceRef.current) utterance.voice = voiceRef.current;
      utterance.onstart = () => setPlaying(true);
      utterance.onend = () => { setPlaying(false); setPlayCount(c => c + 1); };
      utterance.onerror = () => setPlaying(false);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setPlaying(false);
    }
  }

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

  function handleSelect(opt) {
    if (selected !== null) return;
    setSelected(opt);

    const isCorrect = opt === question.answer;
    if (isCorrect) setScore(s => s + 1);
    onAnswer?.(isCorrect, question);
    playSound(isCorrect);

    setTimeout(() => {
      if (current < questions.length - 1) {
        setCurrent(c => c + 1);
      } else {
        setFinished(true);
        onComplete?.(score + (isCorrect ? 1 : 0), questions.length);
      }
    }, 1200);
  }

  if (finished) {
    const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const stars = pct >= 90 ? '🌟🌟🌟' : pct >= 70 ? '🌟🌟' : '🌟';
    const msg = pct >= 80 ? '听力达人！🎉' : pct >= 50 ? '继续加油！💪' : '多听几次就熟了！😊';
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
    <div className="audio-game">
      {title && <h3 className="game-title">{icon} {title}</h3>}

      <div className="audio-counter">
        第 {current + 1} / {questions.length} 题
      </div>

      <div className="audio-question">{question.question}</div>

      {/* 播放按钮 */}
      <div className="audio-player">
        <button
          className={`audio-play-btn ${playing ? 'audio-playing' : ''}`}
          onClick={playAudio}
          disabled={!voiceReady || playing}
        >
          <span className="audio-play-icon">{playing ? '🔊' : '🔈'}</span>
          <span className="audio-play-label">
            {!voiceReady ? '加载语音…' : playing ? '播放中…' : `点击播放 ${playCount > 0 ? `(再听一次)` : ''}`}
          </span>
        </button>
      </div>

      {/* 选项 */}
      <div className="audio-options">
        {question.options.map((opt, i) => {
          let btnClass = 'audio-option';
          if (selected === opt) {
            btnClass += opt === question.answer ? ' correct' : ' wrong';
          } else if (selected !== null && opt === question.answer) {
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
                <span className="option-icon">{opt === question.answer ? '✓' : '✗'}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
