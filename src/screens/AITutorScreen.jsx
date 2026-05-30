import { useState, useRef, useEffect } from 'react';
import { useGame, getPetEmoji } from '../store';
import { homeworkDiagnose, generateReview } from '../api';
import { ocrImage, isValidText } from '../utils/ocr';
import QuizGame from '../games/QuizGame';
import PetCompanion from '../components/PetCompanion';
import RewardModal from '../components/RewardModal';
import { logActivity } from '../utils/activityLog';

// 上传类型
const UPLOAD_TYPES = [
  { id: 'homework', label: '作业', icon: '📝', desc: '日常练习或课后作业', prompt: '分析这道作业的对错，找出做错的地方并引导我改正' },
  { id: 'exam', label: '试卷', icon: '📋', desc: '测验或考试卷', prompt: '分析试卷成绩，找出知识薄弱点，给出改进建议' },
  { id: 'textbook', label: '教材', icon: '📖', desc: '课本内页或讲义', prompt: '根据教材内容出复习题，涵盖重点知识' },
  { id: 'mistakes', label: '错题', icon: '❌', desc: '收集的错题本', prompt: '分析错题规律，针对薄弱知识点出加强练习' },
];

// 科目
const SUBJECTS = [
  { id: 'math', label: '数学', icon: '🔢', color: '#FF9EAA' },
  { id: 'chinese', label: '中文', icon: '✍️', color: '#A8D8EA' },
  { id: 'english', label: '英文', icon: '🔤', color: '#FFB5C2' },
  { id: 'gs', label: '常识', icon: '🌍', color: '#C9B1FF' },
  { id: 'cantonese', label: '粤语', icon: '🗣️', color: '#FFDAA3' },
];

// 错误类型
const ERROR_TYPE_CONFIG = {
  careless: { label: '计算粗心', icon: '🔢', color: '#FF9EAA', strategy: '先估后算，检查进位退位' },
  keyword: { label: '关键词遗漏', icon: '🔑', color: '#A8D8EA', strategy: '圈出数量关系词再列式' },
  logic: { label: '多步逻辑', icon: '📐', color: '#C9B1FF', strategy: '画图理清多步逻辑关系' },
  geometry: { label: '几何观察', icon: '🔍', color: '#AAE1C6', strategy: '从小到大有序计数' },
};

const HABIT_CHALLENGES = {
  'reverse-check': { title: '反向验算', icon: '✅', description: '请用加法检查你刚才那道减法题的答案' },
  'neat-draft': { title: '规范草稿', icon: '📝', description: '请把竖式重新写在草稿区，确保个位、十位完全对齐' },
  'common-sense': { title: '常识校验', icon: '🤔', description: '算出的结果比题目给的数据还大/小？这合理吗？' },
};

export default function AITutorScreen({ onBack, preset }) {
  const { state, dispatch } = useGame();
  const cameraRef = useRef(null);
  const galleryRef = useRef(null);

  // === 状态 ===
  const [step, setStep] = useState('start');       // start → subject → upload → analyzing → result → guidance → quiz
  const [subject, setSubject] = useState('math');
  const [uploadType, setUploadType] = useState(null);
  const [petMood, setPetMood] = useState('normal');
  const [petStatus, setPetStatus] = useState('');

  // 图片/文本
  const [imageData, setImageData] = useState(null);
  const [imageMimeType, setImageMimeType] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [inputText, setInputText] = useState('');
  const [ocrText, setOcrText] = useState('');
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);

  // 分析结果
  const [diagnosis, setDiagnosis] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null); // { weakPoints, difficulty, suggestions }
  const [guidanceIndex, setGuidanceIndex] = useState(0);
  const [habitChallenge, setHabitChallenge] = useState(null);
  const [habitDone, setHabitDone] = useState(false);

  // 复习
  const [reviewQuestions, setReviewQuestions] = useState(null);

  // 通用
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showReward, setShowReward] = useState(false);
  const [rewardCoins, setRewardCoins] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [playerTotal, setPlayerTotal] = useState(0);

  const subjectInfo = SUBJECTS.find(s => s.id === subject) || SUBJECTS[0];
  const grade = state.userGrade || 'p3';
  const presetDone = useRef(false);

  // 预设处理（从首页日历进入）
  useEffect(() => {
    if (preset?.subject && preset?.topic && !presetDone.current) {
      presetDone.current = true;
      const s = preset.subject;
      const info = SUBJECTS.find(x => x.id === s);
      if (!info) return;
      setSubject(s);
      setUploadType(UPLOAD_TYPES[2]); // textbook
      const prompt = `【${info.label} · ${grade}】${preset.topic}\n\n${preset.desc || '鞏固練習'}\n\n請根據以上內容出複習題，題型包括選擇題和應用題。`;
      setInputText(prompt);
      setStep('analyzing');
      setTimeout(() => handleAnalyze(prompt, s, 'textbook'), 300);
    }
  }, [preset]);

  // === 图片处理 ===
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleImageUpload(file) {
    if (!file) return;
    setError('');
    try {
      const dataUrl = await fileToBase64(file);
      setImageData(dataUrl.split(',')[1]);
      setImageMimeType(file.type || 'image/png');
      setImagePreview(dataUrl);
    } catch (e) {
      setError('图片加载失败');
    }
    // OCR 兜底
    setOcrLoading(true);
    setOcrProgress(0);
    try {
      const text = await ocrImage(file, (pct) => setOcrProgress(pct));
      if (text && isValidText(text)) {
        setOcrText(text);
        setInputText(text);
      }
    } catch { /* OCR 失败不影响 AI 直传 */ }
    setOcrLoading(false);
  }

  // === 核心：AI 分析 ===
  async function handleAnalyze(overrideText, overrideSubject, overrideType) {
    const content = (overrideText || inputText).trim();
    const subj = overrideSubject || subject;
    const type = overrideType || uploadType?.id || 'homework';

    if (!content && !imageData) { setError('请拍照或输入内容'); return; }

    setLoading(true);
    setError('');
    setStep('analyzing');

    const wrongTopics = [...new Set((state.wrongRecords[subj] || []).map(r => r.category).filter(Boolean))];
    const masteryData = Object.entries(state.mastery[subj] || {}).map(([topic, data]) => ({
      topic, level: data.level, total: data.total,
    }));

    try {
      if (type === 'textbook' || type === 'mistakes') {
        // 教材/错题 → 生成复习题
        const result = await generateReview({
          subject: subj, grade,
          textbookContent: content,
          imageData: imageData || undefined,
          mimeType: imageMimeType || undefined,
          wrongTopics, masteryData, count: 5,
        });
        if (result?.questions?.length > 0) {
          setReviewQuestions(result.questions);
          setAnalysisResult({
            type: 'review',
            title: type === 'textbook' ? '📖 根据教材生成的练习' : '❌ 针对错题的加强练习',
            questionCount: result.questions.length,
            weakTopics: wrongTopics.slice(0, 5),
          });
          setStep('result');
        } else {
          setError('AI 出题失败，请重试');
          setStep('upload');
        }
      } else {
        // 作业/试卷 → 诊断分析
        const result = await homeworkDiagnose({
          textContent: content,
          imageData: imageData || undefined,
          mimeType: imageMimeType || undefined,
          subject: subj, grade, wrongRecords: state.wrongRecords[subj] || [], masteryData,
        });
        if (result) {
          setDiagnosis(result);
          // 从结果中提取薄弱分析
          setAnalysisResult({
            type: 'diagnosis',
            title: type === 'exam' ? '📋 试卷分析报告' : '📝 作业诊断报告',
            errorCount: result.errorCount || 0,
            errorTypes: result.errorTypes || [],
            weakTopics: wrongTopics.slice(0, 5),
            firstMessage: result.firstMessage,
            difficulty: result.errorCount > 3 ? '偏难' : result.errorCount > 1 ? '适中' : '掌握良好',
          });
          setStep('result');
          if (result.errorCount > 0) {
            dispatch({
              type: 'RECORD_DIAGNOSIS',
              payload: { subject: subj, errorCount: result.errorCount, errorTypes: result.errorTypes, resolved: false },
            });
          }
          logActivity({
            type: 'diagnosis', subject: subj, gameType: `ai-${type}`,
            score: result.errorCount === 0 ? 100 : 0, total: result.errorCount || 0, correct: 0,
          });
        } else {
          setError('AI 分析失败，请重试');
          setStep('upload');
        }
      }
    } catch (e) {
      setError('分析出错: ' + e.message);
      setStep('upload');
    }
    setLoading(false);
  }

  // === 引导下一步 ===
  function handleNextAction() {
    if (!analysisResult) return;
    if (analysisResult.type === 'review') {
      setStep('quiz');
    } else if (diagnosis?.errorCount > 0 && diagnosis?.guidanceSteps?.length > 0) {
      setStep('guidance');
    } else {
      resetToStart();
    }
  }

  function handleGuidanceNext() {
    const steps = diagnosis?.guidanceSteps || [];
    if (guidanceIndex < steps.length - 1) {
      setGuidanceIndex(guidanceIndex + 1);
    } else if (diagnosis?.habitChallenge) {
      setHabitChallenge(diagnosis.habitChallenge);
      setStep('habit');
    } else {
      resetToStart();
    }
  }

  function handleHabitComplete() {
    setHabitDone(true);
    dispatch({ type: 'RECORD_HABIT', payload: { subject, habitType: habitChallenge.type, completed: true } });
    dispatch({ type: 'ADD_COINS', payload: 3 });
  }

  function handleReviewComplete(score, total) {
    setPlayerScore(score);
    setPlayerTotal(total);
    const coins = Math.round((score / total) * 10) + 2;
    setRewardCoins(coins);
    setShowReward(true);
    dispatch({ type: 'COMPLETE_QUEST', payload: { subject, score: coins, questionsDone: total } });
    if (reviewQuestions) {
      const catStats = {};
      reviewQuestions.forEach(q => {
        if (!catStats[q.category]) catStats[q.category] = { correct: 0, total: 0 };
        catStats[q.category].total++;
      });
      Object.entries(catStats).forEach(([cat, stats]) => {
        dispatch({ type: 'UPDATE_MASTERY', payload: { subject, category: cat, correct: Math.round((score / total) * stats.total), total: stats.total } });
      });
    }
    logActivity({ type: 'review', subject, gameType: 'ai-review', score: Math.round((score / total) * 100), total, correct: score });
  }

  function handleReviewAnswer(correct, question) {
    if (correct) {
      setPetMood('happy'); setPetStatus('答对了！继续加油！🌟');
      setTimeout(() => { setPetMood('normal'); setPetStatus(''); }, 1500);
    } else {
      setPetMood('sad'); setPetStatus('再想想看，你可以的！💪');
      setTimeout(() => { setPetMood('normal'); setPetStatus(''); }, 2000);
      if (question?.category) {
        dispatch({ type: 'RECORD_WRONG_ANSWER', payload: { subject, category: question.category, questionId: question.id } });
        dispatch({ type: 'UPDATE_MASTERY', payload: { subject, category: question.category, correct: 0, total: 1 } });
      }
    }
  }

  function handleRewardClose() {
    setShowReward(false);
    resetToStart();
  }

  function resetToStart() {
    setStep('start');
    setDiagnosis(null);
    setAnalysisResult(null);
    setReviewQuestions(null);
    setGuidanceIndex(0);
    setHabitChallenge(null);
    setHabitDone(false);
    setInputText('');
    setOcrText('');
    setImageData(null);
    setImagePreview(null);
    setError('');
    setUploadType(null);
  }

  // ═══════════════════════════════════════════
  //  渲染：起始页 — 选择科目
  // ═══════════════════════════════════════════
  if (step === 'start') {
    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={onBack}>← 返回</button>
          <h2>🧑‍🏫 AI 助教</h2>
          <div />
        </div>
        <div className="tutor-hero">
          <PetCompanion size="small" mood="happy" statusText="拍照上传，我帮你分析！" interactive gazeTracking />
        </div>
        <div className="section-desc"><p>选择要学习的科目</p></div>
        <div className="tutor-subject-grid">
          {SUBJECTS.map(s => (
            <button key={s.id} className="tutor-subject-card" style={{ '--card-color': s.color }}
              onClick={() => { setSubject(s.id); setStep('upload-type'); }}>
              <span className="tutor-subject-icon">{s.icon}</span>
              <span className="tutor-subject-label">{s.label}</span>
            </button>
          ))}
        </div>
        {/* 薄弱知识点总览 */}
        {Object.entries(state.mastery).some(([, m]) => Object.keys(m).length > 0) && (
          <div className="tutor-weakness-overview">
            <div className="tutor-weakness-title">📊 你的薄弱知识点</div>
            <div className="tutor-weakness-list">
              {Object.entries(state.mastery).map(([subj, topics]) => {
                const weak = Object.entries(topics).filter(([, d]) => d.level < 0.5 && d.total >= 2);
                if (weak.length === 0) return null;
                const sInfo = SUBJECTS.find(s => s.id === subj);
                return weak.slice(0, 3).map(([topic, data]) => (
                  <span key={`${subj}-${topic}`} className="tutor-weakness-chip" style={{ borderColor: sInfo?.color }}>
                    {sInfo?.icon} {topic} ({Math.round(data.level * 100)}%)
                  </span>
                ));
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ═══════════════════════════════════════════
  //  渲染：选择上传类型
  // ═══════════════════════════════════════════
  if (step === 'upload-type') {
    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={() => setStep('start')}>← 返回</button>
          <h2>{subjectInfo.icon} {subjectInfo.label} · AI 助教</h2>
          <div />
        </div>
        <div className="section-desc"><p>你要上传什么？</p></div>
        <div className="tutor-upload-types">
          {UPLOAD_TYPES.map(t => (
            <button key={t.id} className="tutor-upload-type-card"
              onClick={() => { setUploadType(t); setStep('upload'); }}>
              <span className="tutor-upload-type-icon">{t.icon}</span>
              <div className="tutor-upload-type-info">
                <span className="tutor-upload-type-label">{t.label}</span>
                <span className="tutor-upload-type-desc">{t.desc}</span>
              </div>
              <span className="tutor-upload-type-arrow">→</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  //  渲染：上传/输入页
  // ═══════════════════════════════════════════
  if (step === 'upload') {
    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={() => setStep('upload-type')}>← 返回</button>
          <h2>{uploadType?.icon} 上传{uploadType?.label}</h2>
          <div />
        </div>
        <PetCompanion size="small" mood={petMood} statusText={petStatus || '拍张照片，我来帮你分析！'} interactive gazeTracking />
        <div className="tutor-content">
          {/* 双按钮：拍照 + 从相册选择 */}
          <div className="upload-actions">
            <button className="upload-action-btn upload-camera" onClick={() => cameraRef.current?.click()}>
              <span className="upload-action-icon">📷</span>
              <span className="upload-action-label">拍照</span>
            </button>
            <button className="upload-action-btn upload-gallery" onClick={() => galleryRef.current?.click()}>
              <span className="upload-action-icon">🖼️</span>
              <span className="upload-action-label">从相册选择</span>
            </button>
            <input ref={cameraRef} type="file" accept="image/*" capture="environment"
              style={{ display: 'none' }}
              onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); e.target.value = ''; }} />
            <input ref={galleryRef} type="file" accept="image/*"
              style={{ display: 'none' }}
              onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); e.target.value = ''; }} />
          </div>

          {/* 图片预览 */}
          {imagePreview && (
            <div className="upload-preview">
              <img src={imagePreview} alt="已上传" className="upload-preview-img" />
              <button className="btn btn-small btn-secondary upload-preview-clear"
                onClick={() => { setImageData(null); setImagePreview(null); setOcrText(''); }}>
                重新上传
              </button>
            </div>
          )}

          {/* OCR 进度 */}
          {ocrLoading && (
            <div className="upload-ocr-status">
              <div className="upload-ocr-bar">
                <div className="upload-ocr-fill" style={{ width: `${ocrProgress}%` }} />
              </div>
              <span>识别中 {ocrProgress}%...</span>
            </div>
          )}

          {/* 文本输入 */}
          <div className="tutor-divider"><span>{imagePreview ? '或直接编辑/补充内容' : '或直接粘贴内容'}</span></div>
          <textarea className="review-textarea"
            placeholder={uploadType?.id === 'textbook'
              ? `粘贴${subjectInfo.label}课本内容...\n例如：分数加减法，同分母分数相加...`
              : `粘贴${subjectInfo.label}题目或内容...\n例如：43×5=135，500−228=372...`}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            rows={5} />

          {/* 薄弱知识点提示 */}
          {(state.wrongRecords[subject] || []).length > 0 && (
            <div className="upload-weakness">
              <span className="upload-weakness-label">🎯 该科薄弱点：</span>
              {[...new Set((state.wrongRecords[subject] || []).map(r => r.category).filter(Boolean))].slice(0, 5).map(cat => {
                const level = state.mastery[subject]?.[cat]?.level ?? 0;
                const cls = level < 0.3 ? 'weak-high' : level < 0.6 ? 'weak-mid' : 'weak-low';
                return <span key={cat} className={`upload-weakness-tag ${cls}`}>{cat}</span>;
              })}
            </div>
          )}

          {error && <div className="tutor-error">{error}</div>}

          <button className="btn btn-primary tutor-submit-btn"
            onClick={() => handleAnalyze()}
            disabled={loading || (!inputText.trim() && !imageData)}>
            {loading ? '🔍 分析中...' : `🔍 开始AI分析`}
          </button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  //  渲染：分析中
  // ═══════════════════════════════════════════
  if (step === 'analyzing') {
    return (
      <div className="screen">
        <div className="screen-header">
          <h2>🔍 AI 分析中</h2>
          <div />
        </div>
        <div className="analyzing-screen">
          <div className="analyzing-animation">
            <PetCompanion size="medium" mood="happy" statusText="正在仔细分析..." interactive />
          </div>
          <div className="analyzing-steps">
            <div className="analyzing-step active">📖 读取内容...</div>
            <div className="analyzing-step">🔍 分析知识点...</div>
            <div className="analyzing-step">📊 评估难度...</div>
            <div className="analyzing-step">📝 生成建议...</div>
          </div>
          <p className="analyzing-hint">AI 正在根据你的{uploadType?.label}进行深度分析，请稍候...</p>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  //  渲染：分析结果
  // ═══════════════════════════════════════════
  if (step === 'result' && analysisResult) {
    const isDiag = analysisResult.type === 'diagnosis';
    const hasErrors = isDiag && analysisResult.errorCount > 0;
    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={resetToStart}>← 返回</button>
          <h2>{analysisResult.title}</h2>
          <div />
        </div>
        <div className="tutor-content">
          <div className="result-card">
            {isDiag ? (
              <>
                {hasErrors ? (
                  <>
                    <div className="result-big-number">{analysisResult.errorCount}</div>
                    <div className="result-big-label">处可以做得更好</div>
                    {analysisResult.firstMessage && <p className="result-message">{analysisResult.firstMessage}</p>}
                    {/* 错误类型 */}
                    {analysisResult.errorTypes?.length > 0 && (
                      <div className="result-error-types">
                        {analysisResult.errorTypes.map(t => {
                          const cfg = ERROR_TYPE_CONFIG[t];
                          return cfg ? (
                            <div key={t} className="result-error-chip" style={{ background: cfg.color + '22', borderColor: cfg.color }}>
                              <span>{cfg.icon}</span>
                              <span>{cfg.label}</span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    )}
                    {/* 难度评估 */}
                    <div className="result-difficulty">
                      <span className="result-diff-label">难度评估：</span>
                      <span className={`result-diff-value ${analysisResult.difficulty === '偏难' ? 'diff-hard' : analysisResult.difficulty === '适中' ? 'diff-mid' : 'diff-easy'}`}>
                        {analysisResult.difficulty}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="result-big-icon">🎉</div>
                    <div className="result-big-label">全部正确！太棒了！</div>
                    <p className="result-message">{analysisResult.firstMessage || '继续保持，你做得很好！'}</p>
                  </>
                )}
              </>
            ) : (
              <>
                <div className="result-big-icon">{uploadType?.icon || '📖'}</div>
                <div className="result-big-label">{analysisResult.title}</div>
                <p className="result-message">已生成 {analysisResult.questionCount} 道针对性练习题</p>
              </>
            )}

            {/* 薄弱知识点 */}
            {analysisResult.weakTopics?.length > 0 && (
              <div className="result-weak-topics">
                <span className="result-weak-label">🎯 薄弱知识点：</span>
                <div className="result-weak-tags">
                  {analysisResult.weakTopics.map(t => <span key={t} className="result-weak-tag">{t}</span>)}
                </div>
              </div>
            )}

            {/* 建议 */}
            <div className="result-suggestion">
              💡 <b>AI建议：</b>
              {isDiag && hasErrors
                ? '跟着引导一步步改正，养成检查好习惯！'
                : '做几道练习题巩固一下吧！'}
            </div>
          </div>

          <div className="result-actions">
            {isDiag && hasErrors && diagnosis?.guidanceSteps?.length > 0 && (
              <button className="btn btn-primary" onClick={handleNextAction}>🎯 开始引导纠错</button>
            )}
            {analysisResult.type === 'review' && (
              <button className="btn btn-primary" onClick={handleNextAction}>📝 开始练习</button>
            )}
            {isDiag && !hasErrors && (
              <button className="btn btn-primary" onClick={resetToStart}>返回</button>
            )}
            <button className="btn btn-secondary" onClick={resetToStart}>
              {isDiag && hasErrors ? '先不改了' : '重新上传'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  //  渲染：引导纠错
  // ═══════════════════════════════════════════
  if (step === 'guidance' && diagnosis?.guidanceSteps) {
    const steps = diagnosis.guidanceSteps;
    const current = steps[guidanceIndex];
    const cfg = ERROR_TYPE_CONFIG[current?.type] || {};
    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={() => setStep('result')}>← 返回</button>
          <h2>🎯 引导纠错</h2>
          <div className="guidance-progress">{guidanceIndex + 1}/{steps.length}</div>
        </div>
        <div className="tutor-content">
          <div className="guidance-card" style={{ borderColor: cfg.color || '#ddd' }}>
            <div className="guidance-card-header">
              <span className="guidance-card-icon">{cfg.icon || '💡'}</span>
              <span className="guidance-card-type">{cfg.label || current.type}</span>
            </div>
            <div className="guidance-card-hint">{current.detectiveHint}</div>
            <div className="guidance-card-strategy">
              <span className="guidance-strategy-label">策略：</span>
              <span>{cfg.strategy || current.strategy}</span>
            </div>
            <button className="btn btn-primary" onClick={handleGuidanceNext}>
              {guidanceIndex < steps.length - 1 ? '👉 下一个' : '✅ 完成，开始习惯挑战'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  //  渲染：习惯挑战
  // ═══════════════════════════════════════════
  if (step === 'habit' && habitChallenge) {
    const challenge = HABIT_CHALLENGES[habitChallenge.type] || habitChallenge;
    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={() => setStep('guidance')}>← 返回</button>
          <h2>🎯 好习惯挑战</h2>
          <div />
        </div>
        <div className="tutor-content">
          <div className="habit-challenge">
            <div className="habit-challenge-icon">{challenge.icon || '🎯'}</div>
            <div className="habit-challenge-title">{challenge.title || habitChallenge.title}</div>
            <div className="habit-challenge-desc">{challenge.description || habitChallenge.description}</div>
            {!habitDone ? (
              <button className="btn btn-primary" onClick={handleHabitComplete}>✅ 完成挑战</button>
            ) : (
              <div className="habit-challenge-done">
                <span>🎉 挑战完成！+3 🪙</span>
                <button className="btn btn-primary" onClick={resetToStart}>返回</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  //  渲染：复习答题
  // ═══════════════════════════════════════════
  if (step === 'quiz' && reviewQuestions) {
    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={() => setStep('result')}>← 返回</button>
          <h2>📝 AI 练习</h2>
          <div />
        </div>
        <PetCompanion size="small" mood={petMood} celebrating={petMood === 'happy'} statusText={petStatus} interactive gazeTracking />
        <QuizGame questions={reviewQuestions} onComplete={handleReviewComplete} onAnswer={handleReviewAnswer}
          title={`${subjectInfo.icon} 练习`} showStory />
        <RewardModal show={showReward} coins={rewardCoins} score={playerScore} total={playerTotal}
          message="练习完成！" onClose={handleRewardClose} />
      </div>
    );
  }

  // 兜底
  return (
    <div className="screen">
      <div className="screen-header">
        <button className="btn-back" onClick={onBack}>← 返回</button>
        <h2>🧑‍🏫 AI 助教</h2><div />
      </div>
      <p className="tutor-error">页面状态异常</p>
      <button className="btn btn-primary" onClick={resetToStart}>重新开始</button>
    </div>
  );
}
