import { useState, useRef, useEffect } from 'react';
import { useGame, getPetEmoji } from '../store';
import { homeworkDiagnose, generateReview } from '../api';
import { ocrImage, isValidText } from '../utils/ocr';
import QuizGame from '../games/QuizGame';
import PetCompanion from '../components/PetCompanion';
import RewardModal from '../components/RewardModal';
import { logActivity } from '../utils/activityLog';

// 错误类型配置
const ERROR_TYPE_CONFIG = {
  careless: { label: '计算粗心', icon: '🔢', color: '#FF9EAA', strategy: '估算防御 — 先估后算，检查进位退位' },
  keyword: { label: '关键词遗漏', icon: '🔑', color: '#A8D8EA', strategy: '关键词捕捉 — 圈出数量关系词再列式' },
  logic: { label: '多步逻辑', icon: '📐', color: '#C9B1FF', strategy: '线段图辅助 — 画图理清多步逻辑关系' },
  geometry: { label: '几何观察', icon: '🔍', color: '#AAE1C6', strategy: '有序搜索 — 从小到大有序计数' },
};

const HABIT_CHALLENGES = {
  'reverse-check': { title: '反向验算', icon: '✅', description: '请用加法检查你刚才那道减法题的答案' },
  'neat-draft': { title: '规范草稿', icon: '📝', description: '请把竖式重新写在草稿区，确保个位、十位完全对齐' },
  'common-sense': { title: '常识校验', icon: '🤔', description: '算出的结果比题目给的数据还大/小？这合理吗？' },
};

// 科目列表
const SUBJECTS = [
  { id: 'math', label: '数学', icon: '🔢', color: '#FF9EAA' },
  { id: 'chinese', label: '汉字', icon: '✍️', color: '#A8D8EA' },
  { id: 'cantonese', label: '粤语', icon: '🗣️', color: '#C9B1FF' },
  { id: 'english', label: '英文', icon: '🔤', color: '#AAE1C6' },
  { id: 'gs', label: '常识', icon: '🌍', color: '#FFDAA3' },
];

export default function AITutorScreen({ onBack, preset }) {
  const { state, dispatch } = useGame();
  const fileInputRef = useRef(null);

  // 核心状态
  const [mode, setMode] = useState(null); // 'diagnosis' | 'review'
  const [step, setStep] = useState('subject-select');
  const [subject, setSubject] = useState('math');
  const [petMood, setPetMood] = useState('normal');
  const [petStatus, setPetStatus] = useState('');

  // 诊断模式状态
  const [inputText, setInputText] = useState('');
  const [ocrText, setOcrText] = useState('');
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);
  const [currentGuidanceIndex, setCurrentGuidanceIndex] = useState(0);
  const [habitChallenge, setHabitChallenge] = useState(null);
  const [habitDone, setHabitDone] = useState(false);
  const [diagnosisError, setDiagnosisError] = useState('');

  // 复习模式状态
  const [reviewContent, setReviewContent] = useState('');
  const [reviewQuestions, setReviewQuestions] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');

  // 通用
  const [loading, setLoading] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [rewardCoins, setRewardCoins] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [playerTotal, setPlayerTotal] = useState(0);

  const subjectInfo = SUBJECTS.find(s => s.id === subject) || SUBJECTS[0];
  const grade = state.userGrade || 'p3';
  const presetDone = useRef(false);

  // 处理教学日历预设（从首页"今日复习"点击进入）
  useEffect(() => {
    if (preset?.subject && preset?.topic && !presetDone.current) {
      presetDone.current = true;
      const s = preset.subject;
      const info = SUBJECTS.find(x => x.id === s);
      if (!info) return;
      setSubject(s);
      setMode('review');
      // 构造类似课本内容的描述，让 AI 据此出题
      const prompt = [
        `【${info.label} · 三年級】${preset.topic}`,
        '',
        preset.desc || '鞏固練習',
        '',
        '請根據以上內容出複習題，題型包括選擇題和應用題，適合三年級學生。',
      ].join('\n');
      setReviewContent(prompt);
      setStep('review:input');
      // 自动触发出题（传 subject 避免闭包捕获旧值）
      setTimeout(() => handleGenerateReview(prompt, s), 300);
    }
  }, [preset]);

  // ===== 图片上传 + OCR =====
  async function handleImageUpload(file) {
    if (!file) return;
    setOcrLoading(true);
    setOcrProgress(0);
    setOcrText('');

    try {
      const text = await ocrImage(file, (pct) => setOcrProgress(pct));
      if (text && isValidText(text)) {
        setOcrText(text);
        setInputText(text);
      } else {
        setOcrText('');
        setDiagnosisError('未能识别出有效文字，请手动粘贴内容');
      }
    } catch (e) {
      setDiagnosisError('图片识别失败: ' + e.message);
    }
    setOcrLoading(false);
  }

  // ===== 提交作业诊断 =====
  async function handleDiagnose() {
    const content = inputText.trim();
    if (!content || content.length < 10) {
      setDiagnosisError('请输入或上传至少 10 个字的作业内容');
      return;
    }

    setLoading(true);
    setDiagnosisError('');
    setDiagnosis(null);

    try {
      const wrongTopics = [...new Set((state.wrongRecords[subject] || []).map(r => r.category).filter(Boolean))];
      const masteryData = Object.entries(state.mastery[subject] || {}).map(([topic, data]) => ({
        topic, level: data.level, total: data.total,
      }));

      const result = await homeworkDiagnose({
        textContent: content,
        subject,
        grade,
        wrongRecords: state.wrongRecords[subject] || [],
        masteryData,
      });

      if (result && result.errorCount > 0) {
        setDiagnosis(result);
        setStep('diagnosis:report');
        dispatch({
          type: 'RECORD_DIAGNOSIS',
          payload: { subject, errorCount: result.errorCount, errorTypes: result.errorTypes, resolved: false },
        });
        logActivity({
          type: 'diagnosis', subject, gameType: 'homework-diagnose',
          score: 0, total: result.errorCount, correct: 0,
          metadata: { errorTypes: result.errorTypes?.join(','), errorCount: result.errorCount },
        });
      } else if (result && result.errorCount === 0) {
        // 全对的情况
        setDiagnosis({ ...result, errorCount: 0, firstMessage: '🎉 太棒了！你的作业全做对了！继续加油！' });
        setStep('diagnosis:report');
        logActivity({ type: 'diagnosis', subject, gameType: 'homework-diagnose', score: 100, total: 0, correct: 0, metadata: { errorTypes: '', errorCount: 0 } });
      } else {
        setDiagnosisError('AI 诊断失败，请稍后重试');
      }
    } catch (e) {
      setDiagnosisError('诊断出错: ' + e.message);
    }
    setLoading(false);
  }

  // ===== 提交复习出题 =====
  async function handleGenerateReview(overrideContent, overrideSubject) {
    const content = (overrideContent || reviewContent).trim();
    if (!content || content.length < 10) {
      setReviewError('请输入至少 10 个字的课本内容');
      return;
    }
    if (!overrideContent) setReviewContent(content);

    // 用传入的 subject 避免闭包捕获旧值
    const subj = overrideSubject || subject;

    setReviewLoading(true);
    setReviewError('');

    try {
      const wrongTopics = [...new Set((state.wrongRecords[subj] || []).map(r => r.category).filter(Boolean))];
      const masteryData = Object.entries(state.mastery[subj] || {}).map(([topic, data]) => ({
        topic, level: data.level, total: data.total,
      }));

      const result = await generateReview({
        subject: subj,
        grade,
        textbookContent: content,
        wrongTopics,
        masteryData,
        count: 5,
      });

      if (result && result.questions && result.questions.length > 0) {
        setReviewQuestions(result.questions);
        setStep('review:quiz');
      } else {
        setReviewError('AI 出题失败，请稍后重试');
      }
    } catch (e) {
      setReviewError('出题出错: ' + e.message);
    }
    setReviewLoading(false);
  }

  // ===== 复习答题完成 =====
  function handleReviewComplete(score, total) {
    setPlayerScore(score);
    setPlayerTotal(total);
    const coins = Math.round((score / total) * 10) + 2;
    setRewardCoins(coins);
    setShowReward(true);

    dispatch({
      type: 'COMPLETE_QUEST',
      payload: { subject, score: coins, questionsDone: total },
    });

    // 更新掌握度
    if (reviewQuestions) {
      const catStats = {};
      reviewQuestions.forEach(q => {
        if (!catStats[q.category]) catStats[q.category] = { correct: 0, total: 0 };
        catStats[q.category].total++;
      });
      // 假设答对的题均匀分布（实际需要 QuizGame 回调每道题的结果）
      Object.entries(catStats).forEach(([cat, stats]) => {
        const catCorrect = Math.round((score / total) * stats.total);
        dispatch({
          type: 'UPDATE_MASTERY',
          payload: { subject, category: cat, correct: catCorrect, total: stats.total },
        });
      });
    }

    logActivity({
      type: 'review', subject, gameType: 'ai-review',
      score: Math.round((score / total) * 100), total, correct: score,
    });
  }

  // ===== 复习逐题回调（更精确的掌握度更新） =====
  function handleReviewAnswer(correct, question) {
    if (correct) {
      setPetMood('happy');
      setPetStatus('答对了！继续加油！🌟');
      setTimeout(() => { setPetMood('normal'); setPetStatus(''); }, 1500);
    } else {
      setPetMood('sad');
      setPetStatus('再想想看，你可以的！💪');
      setTimeout(() => { setPetMood('normal'); setPetStatus(''); }, 2000);
      if (question?.category) {
        dispatch({
          type: 'RECORD_WRONG_ANSWER',
          payload: { subject, category: question.category, questionId: question.id },
        });
        // 实时更新掌握度
        dispatch({
          type: 'UPDATE_MASTERY',
          payload: { subject, category: question.category, correct: 0, total: 1 },
        });
      }
    }
  }

  // ===== 处理引导步骤 =====
  function handleGuidanceNext() {
    if (!diagnosis || !diagnosis.guidanceSteps) return;
    if (currentGuidanceIndex < diagnosis.guidanceSteps.length - 1) {
      setCurrentGuidanceIndex(i => i + 1);
    } else {
      // 所有引导完成 → 进入习惯挑战
      if (diagnosis.habitChallenge) {
        setHabitChallenge(diagnosis.habitChallenge);
        setStep('diagnosis:challenge');
      } else {
        finishDiagnosis();
      }
    }
  }

  function handleHabitComplete() {
    setHabitDone(true);
    dispatch({
      type: 'RECORD_HABIT',
      payload: { subject, habitType: habitChallenge.type, completed: true },
    });
    // 给一点奖励
    dispatch({ type: 'ADD_COINS', payload: 3 });
    logActivity({ type: 'practice', subject, gameType: 'habit', metadata: { habitType: habitChallenge.type } });
  }

  function finishDiagnosis() {
    setStep('mode-select');
    setDiagnosis(null);
    setCurrentGuidanceIndex(0);
    setHabitChallenge(null);
    setHabitDone(false);
    setInputText('');
    setOcrText('');
    setDiagnosisError('');
  }

  // ===== 奖励关闭 =====
  function handleRewardClose() {
    setShowReward(false);
    setStep('mode-select');
    setReviewQuestions(null);
    setReviewContent('');
  }

  // ===== 渲染：科目选择 =====
  if (step === 'subject-select') {
    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={onBack}>← 返回</button>
          <h2>🧑‍🏫 AI 助教</h2>
          <div />
        </div>
        <div className="section-desc">
          <p>选择科目开始学习</p>
        </div>
        <div className="tutor-subject-grid">
          {SUBJECTS.map(s => (
            <button
              key={s.id}
              className="tutor-subject-card"
              style={{ '--card-color': s.color }}
              onClick={() => {
                setSubject(s.id);
                setStep('mode-select');
              }}
            >
              <span className="tutor-subject-icon">{s.icon}</span>
              <span className="tutor-subject-label">{s.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ===== 渲染：模式选择 =====
  if (step === 'mode-select') {
    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={() => setStep('subject-select')}>← 返回</button>
          <h2>{subjectInfo.icon} {subjectInfo.label}</h2>
          <div />
        </div>
        <div className="section-desc">
          <p>选择学习模式</p>
        </div>
        <div className="tutor-mode-select">
          <button className="tutor-mode-card mode-diagnosis" onClick={() => { setMode('diagnosis'); setStep('diagnosis:input'); }}>
            <span className="tutor-mode-icon">📝</span>
            <span className="tutor-mode-title">作业诊断</span>
            <span className="tutor-mode-desc">拍照或粘贴作业，AI 帮你发现薄弱环节</span>
            <span className="tutor-mode-tag">引导式纠错</span>
          </button>
          <button className="tutor-mode-card mode-review" onClick={() => { setMode('review'); setStep('review:input'); }}>
            <span className="tutor-mode-icon">📖</span>
            <span className="tutor-mode-title">AI 复习</span>
            <span className="tutor-mode-desc">粘贴课本内容，AI 生成专属复习题</span>
            <span className="tutor-mode-tag">自适应出题</span>
          </button>
        </div>
      </div>
    );
  }

  // ===== 渲染：诊断输入 =====
  if (step === 'diagnosis:input') {
    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={() => setStep('mode-select')}>← 返回</button>
          <h2>📝 作业诊断</h2>
          <div />
        </div>
        <PetCompanion mood={petMood} statusText={petStatus} interactive gazeTracking />
        <div className="tutor-content">
          <div className="tutor-diagnosis-input">
            {/* 图片上传 */}
            <div className="review-upload-area" onClick={() => fileInputRef.current?.click()}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                style={{ display: 'none' }}
                onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }}
              />
              {ocrLoading ? (
                <div className="review-ocr-loading">
                  <div className="review-ocr-spinner">📷</div>
                  <p>识别中... {ocrProgress}%</p>
                  <div className="review-ocr-progress-bar">
                    <div className="review-ocr-progress-fill" style={{ width: `${ocrProgress}%` }} />
                  </div>
                </div>
              ) : (
                <div className="review-upload-hint">
                  <span className="review-upload-icon">📷</span>
                  <span>拍照上传作业</span>
                  <span className="review-upload-sub">或点击选择图片</span>
                </div>
              )}
            </div>

            {ocrText && (
              <div className="review-ocr-preview">
                <div className="review-ocr-preview-header">
                  <span>📝 识别结果（可编辑）</span>
                  <button className="btn btn-small btn-secondary" onClick={() => { setOcrText(''); setInputText(''); }}>清除</button>
                </div>
                <textarea className="review-ocr-text" value={ocrText} onChange={e => setInputText(e.target.value)} rows={4} />
              </div>
            )}

            {/* 或手动输入 */}
            <div className="tutor-divider">
              <span>或直接粘贴作业内容</span>
            </div>
            <textarea
              className="review-textarea"
              placeholder={`粘贴${subjectInfo.label}作业内容或题目...\n例如：43×5=135，500−228=372，小明有...`}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              rows={6}
            />

            {/* 薄弱环节提示 */}
            {(state.wrongRecords[subject] || []).length > 0 && (
              <div className="review-weakness-section">
                <div className="review-weakness-title">📊 该科目薄弱知识点</div>
                <div className="review-weakness-tags">
                  {[...new Set((state.wrongRecords[subject] || []).map(r => r.category).filter(Boolean))].slice(0, 8).map(cat => {
                    const mastery = state.mastery[subject]?.[cat];
                    const level = mastery?.level ?? 0;
                    const cls = level < 0.3 ? 'review-weakness-high' : level < 0.6 ? 'review-weakness-mid' : 'review-weakness-low';
                    return <span key={cat} className={`review-weakness-tag ${cls}`}>{cat}</span>;
                  })}
                </div>
              </div>
            )}

            {diagnosisError && <div className="tutor-error">{diagnosisError}</div>}

            <button
              className="btn btn-primary tutor-submit-btn"
              onClick={handleDiagnose}
              disabled={loading || inputText.trim().length < 10}
            >
              {loading ? '🔍 AI 诊断中...' : '🔍 开始诊断'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===== 渲染：诊断报告 =====
  if (step === 'diagnosis:report' && diagnosis) {
    const hasErrors = diagnosis.errorCount > 0;
    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={() => setStep('diagnosis:input')}>← 返回</button>
          <h2>📋 诊断报告</h2>
          <div />
        </div>
        <div className="tutor-content">
          {hasErrors ? (
            <div className="diagnosis-report">
              <div className="diagnosis-error-count">{diagnosis.errorCount}</div>
              <div className="diagnosis-error-label">处可以做得更好的地方</div>
              <p className="diagnosis-message">{diagnosis.firstMessage}</p>

              {diagnosis.errorTypes?.length > 0 && (
                <div className="diagnosis-error-types">
                  {diagnosis.errorTypes.map(t => {
                    const cfg = ERROR_TYPE_CONFIG[t];
                    return cfg ? (
                      <div key={t} className="diagnosis-error-type" style={{ borderColor: cfg.color }}>
                        <span className="diagnosis-type-icon">{cfg.icon}</span>
                        <span className="diagnosis-type-label">{cfg.label}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              )}

              <div className="diagnosis-actions">
                <button className="btn btn-primary" onClick={() => setStep('diagnosis:guidance')}>
                  🎯 开始引导纠错
                </button>
                <button className="btn btn-secondary" onClick={() => setStep('diagnosis:input')}>
                  重新上传
                </button>
              </div>
            </div>
          ) : (
            <div className="diagnosis-report diagnosis-all-correct">
              <div className="diagnosis-all-correct-icon">🎉</div>
              <p className="diagnosis-message">{diagnosis.firstMessage || '全部正确！'}</p>
              <button className="btn btn-primary" onClick={() => setStep('mode-select')}>返回</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ===== 渲染：引导纠错 =====
  if (step === 'diagnosis:guidance' && diagnosis?.guidanceSteps) {
    const steps = diagnosis.guidanceSteps;
    const current = steps[currentGuidanceIndex];
    const cfg = ERROR_TYPE_CONFIG[current?.type] || {};

    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={() => setStep('diagnosis:report')}>← 返回</button>
          <h2>🎯 引导纠错</h2>
          <div className="guidance-progress">{currentGuidanceIndex + 1}/{steps.length}</div>
        </div>
        <div className="tutor-content">
          <div className="guidance-card" style={{ borderColor: cfg.color || '#ddd' }}>
            <div className="guidance-card-header">
              <span className="guidance-card-icon">{cfg.icon || '💡'}</span>
              <span className="guidance-card-type">{cfg.label || current.type}</span>
            </div>
            <div className="guidance-card-hint">
              {current.detectiveHint}
            </div>
            <div className="guidance-card-strategy">
              <span className="guidance-strategy-label">策略：</span>
              <span>{cfg.strategy || current.strategy}</span>
            </div>
            <div className="guidance-card-actions">
              <button className="btn btn-primary" onClick={handleGuidanceNext}>
                {currentGuidanceIndex < steps.length - 1 ? '👉 下一个提示' : '✅ 开始习惯挑战'}
              </button>
            </div>
          </div>

          {/* 详细错误描述 */}
          {diagnosis.errorDetails?.[current?.type] && (
            <div className="guidance-detail">
              <p>{diagnosis.errorDetails[current.type]}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ===== 渲染：习惯挑战 =====
  if (step === 'diagnosis:challenge' && habitChallenge) {
    const challenge = HABIT_CHALLENGES[habitChallenge.type] || habitChallenge;
    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={() => setStep('diagnosis:guidance')}>← 返回</button>
          <h2>🎯 好习惯挑战</h2>
          <div />
        </div>
        <div className="tutor-content">
          <div className="habit-challenge">
            <div className="habit-challenge-icon">{challenge.icon || '🎯'}</div>
            <div className="habit-challenge-title">{challenge.title || habitChallenge.title}</div>
            <div className="habit-challenge-desc">{challenge.description || habitChallenge.description}</div>
            {!habitDone ? (
              <button className="btn btn-primary habit-challenge-btn" onClick={handleHabitComplete}>
                ✅ 完成挑战
              </button>
            ) : (
              <div className="habit-challenge-done">
                <span>🎉 挑战完成！+3 ⭐</span>
                <button className="btn btn-primary" onClick={finishDiagnosis}>
                  返回
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ===== 渲染：复习输入 =====
  if (step === 'review:input') {
    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={() => setStep('mode-select')}>← 返回</button>
          <h2>📖 AI 复习</h2>
          <div />
        </div>
        <PetCompanion mood={petMood} statusText={petStatus} interactive gazeTracking />
        <div className="tutor-content">
          <textarea
            className="review-textarea"
            placeholder={`粘贴${subjectInfo.label}课本内容或知识点...\n例如：分数加减法，同分母分数相加，分母不变，分子相加...`}
            value={reviewContent}
            onChange={e => setReviewContent(e.target.value)}
            rows={8}
          />

          {/* 薄弱环节提示 */}
          {(state.wrongRecords[subject] || []).length > 0 && (
            <div className="review-weakness-section">
              <div className="review-weakness-title">📊 薄弱知识点</div>
              <div className="review-weakness-tags">
                {[...new Set((state.wrongRecords[subject] || []).map(r => r.category).filter(Boolean))].slice(0, 8).map(cat => {
                  const mastery = state.mastery[subject]?.[cat];
                  const level = mastery?.level ?? 0;
                  const cls = level < 0.3 ? 'review-weakness-high' : level < 0.6 ? 'review-weakness-mid' : 'review-weakness-low';
                  return <span key={cat} className={`review-weakness-tag ${cls}`}>{cat}</span>;
                })}
              </div>
              <p className="review-weakness-hint">AI 会优先出这些知识点的题目</p>
            </div>
          )}

          {reviewError && <div className="tutor-error">{reviewError}</div>}

          <button
            className="btn btn-primary tutor-submit-btn"
            onClick={handleGenerateReview}
            disabled={reviewLoading || reviewContent.trim().length < 10}
          >
            {reviewLoading ? '🤖 AI 正在出题...' : '📝 开始复习'}
          </button>
        </div>
      </div>
    );
  }

  // ===== 渲染：复习答题 =====
  if (step === 'review:quiz' && reviewQuestions) {
    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={() => { setReviewQuestions(null); setStep('review:input'); }}>← 返回</button>
          <h2>📖 AI 复习</h2>
          <div />
        </div>
        <PetCompanion mood={petMood} celebrating={petMood === 'happy'} statusText={petStatus} interactive gazeTracking />
        <QuizGame
          questions={reviewQuestions}
          onComplete={handleReviewComplete}
          onAnswer={handleReviewAnswer}
          title={`${subjectInfo.icon} AI 复习`}
          showStory
        />
        <RewardModal
          show={showReward}
          coins={rewardCoins}
          score={playerScore}
          total={playerTotal}
          message="复习完成！"
          onClose={handleRewardClose}
        />
      </div>
    );
  }

  // 兜底
  return (
    <div className="screen">
      <div className="screen-header">
        <button className="btn-back" onClick={onBack}>← 返回</button>
        <h2>🧑‍🏫 AI 助教</h2>
        <div />
      </div>
      <p className="tutor-error">页面状态异常，请重新选择</p>
      <button className="btn btn-primary" onClick={() => setStep('subject-select')}>重新开始</button>
    </div>
  );
}
